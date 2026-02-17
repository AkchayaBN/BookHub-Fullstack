import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, MapPin, CreditCard, Heart, Settings, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MyAccount: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const accountSections = [
    { icon: User, title: 'Profile Information', description: 'Update your name, email, and password', link: '#' },
    { icon: Package, title: 'Order History', description: 'View and track your orders', link: '/order-tracking' },
    { icon: MapPin, title: 'Address Book', description: 'Manage your delivery addresses', link: '#' },
    { icon: CreditCard, title: 'Payment Methods', description: 'Add or remove payment options', link: '#' },
    { icon: Heart, title: 'Wishlist', description: 'View your saved books', link: '/wishlist' },
    { icon: Settings, title: 'Account Settings', description: 'Preferences and notifications', link: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">My Account</h1>
          <p className="text-muted-foreground mb-8">
            Welcome back! Manage your account settings and preferences.
          </p>

          {/* User Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.user_metadata?.display_name || user.email?.split('@')[0]}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountSections.map((section) => (
              <Card key={section.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{section.description}</p>
                  <Button variant="outline" asChild>
                    <Link to={section.link}>Manage</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAccount;
