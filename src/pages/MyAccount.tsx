import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User, Package, Heart, BookOpen, Crown,
  Loader2, Edit2, Check, X, KeyRound,
  TrendingUp, ShoppingBag, BookMarked,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminEmail } from '@/components/AdminGuard';
import { useQuery } from '@tanstack/react-query';
import { useUserRentals } from '@/hooks/useRentals';
import { formatPrice } from '@/lib/currency';
import { API_URL } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '@/firebase';

const MyAccount: React.FC = () => {
  const { user, loading, getToken } = useAuth();
  const isAdmin = isAdminEmail(user?.email);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ============================
  // FETCH ORDERS (customer)
  // ============================
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user && !isAdmin,
  });

  // ============================
  // FETCH RENTALS (customer)
  // ============================
  const { data: rentals = [] } = useUserRentals();

  // ============================
  // FETCH ADMIN STATS
  // ============================
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user && isAdmin,
  });

  // ============================
  // HANDLERS
  // ============================
  const handleEditName = () => {
    setNewName(user?.displayName || '');
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setNameLoading(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: newName.trim() });
      toast({ title: 'Name updated successfully!' });
      setEditingName(false);
    } catch (error: any) {
      toast({ title: 'Failed to update name', description: error.message, variant: 'destructive' });
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setPasswordLoading(true);
    try {
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user!.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      // Then update password
      await updatePassword(auth.currentUser!, newPassword);
      toast({ title: 'Password changed successfully!' });
      setEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Failed to change password',
        description: error.code === 'auth/wrong-password'
          ? 'Current password is incorrect'
          : error.message,
        variant: 'destructive',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const activeRentals = rentals.filter((r: any) => r.status === 'active');
  const pendingOrders = orders.filter((o: any) => o.status === 'pending');

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', {
        month: 'long', year: 'numeric',
      })
    : 'N/A';

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground mb-8">
            {isAdmin ? 'Admin account settings' : 'Manage your account and preferences'}
          </p>

          {/* ============================
              PROFILE CARD
          ============================ */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground ${isAdmin ? 'bg-primary' : 'bg-primary/80'}`}>
                  {isAdmin ? <Crown className="w-8 h-8" /> : initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Display Name */}
                  {editingName ? (
                    <div className="flex items-center gap-2 mb-1">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="h-8 w-48 text-sm"
                        placeholder="Your name"
                      />
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-primary text-primary-foreground"
                        onClick={handleSaveName}
                        disabled={nameLoading}
                      >
                        {nameLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => setEditingName(false)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-semibold">{displayName}</h2>
                      {isAdmin && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Admin
                        </span>
                      )}
                      <button
                        onClick={handleEditName}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ============================
              CHANGE PASSWORD
          ============================ */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <KeyRound className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Change Password</CardTitle>
                </div>
                {!editingPassword && (
                  <Button variant="outline" size="sm" onClick={() => setEditingPassword(true)}>
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            {editingPassword && (
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    {passwordLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* ============================
              ADMIN — Store Summary
          ============================ */}
          {isAdmin && stats && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Store Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Books', value: stats.totalBooks, icon: BookOpen },
                    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
                    { label: 'Active Rentals', value: stats.activeRentals, icon: BookMarked },
                    { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-muted/50 rounded-lg p-4 text-center">
                      <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xl font-bold font-display">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Manage Books', to: '/admin', icon: BookOpen },
                    { label: 'View Orders', to: '/admin', icon: ShoppingBag },
                    { label: 'View Rentals', to: '/admin', icon: BookMarked },
                  ].map((link) => (
                    <Button key={link.label} variant="outline" asChild className="w-full">
                      <Link to={link.to}>
                        <link.icon className="w-4 h-4 mr-2" />
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============================
              CUSTOMER — Orders & Rentals
          ============================ */}
          {!isAdmin && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Orders Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Orders</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/order-tracking">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{orders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-orange-600">{pendingOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-medium text-primary">
                        {formatPrice(orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0))}
                      </span>
                    </div>
                  </div>
                  {orders.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No orders yet.{' '}
                      <Link to="/books" className="text-primary hover:underline">Browse books</Link>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Rentals Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Rentals</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/my-rentals">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Rentals</span>
                      <span className="font-medium">{rentals.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-medium text-green-600">{activeRentals.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-medium text-primary">
                        {formatPrice(rentals.reduce((sum: number, r: any) => sum + (r.price || 0), 0))}
                      </span>
                    </div>
                  </div>
                  {rentals.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No rentals yet.{' '}
                      <Link to="/books" className="text-primary hover:underline">Rent a book</Link>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Wishlist */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Wishlist</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/wishlist">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Save books you love to your wishlist and come back to them later.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
