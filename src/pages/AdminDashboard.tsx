import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBooks } from '@/hooks/useBooks';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, ShoppingBag, BookMarked, TrendingUp, Trash2, Plus, X, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency';
import { API_URL } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const API = API_URL;

// ============================
// TYPES
// ============================
interface Stats {
  totalBooks: number;
  totalOrders: number;
  totalRentals: number;
  activeRentals: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { title: string; quantity: number; price: number }[];
}

interface Rental {
  id: string;
  userId: string;
  bookId: string;
  planName: string;
  price: number;
  status: string;
  createdAt: string;
  expiresAt: string;
}

const emptyBookForm = {
  title: '',
  author: '',
  description: '',
  price: '',
  coverImage: '',
  category: 'Fiction',
  isFeatured: false,
  isBestseller: false,
};

// ============================
// MAIN COMPONENT
// ============================
const AdminDashboard: React.FC = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'stats' | 'books' | 'orders' | 'rentals'>('stats');
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [bookForm, setBookForm] = useState(emptyBookForm);

  // ============================
  // FETCH STATS
  // ============================
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<Stats> => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  // ============================
  // FETCH ALL BOOKS
  // ============================
  const { data: allBooks = [], isLoading: booksLoading } = useBooks();

  // ============================
  // FETCH ALL ORDERS
  // ============================
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async (): Promise<Order[]> => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  // ============================
  // FETCH ALL RENTALS
  // ============================
  const { data: rentals = [], isLoading: rentalsLoading } = useQuery({
    queryKey: ['admin', 'rentals'],
    queryFn: async (): Promise<Rental[]> => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/rentals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch rentals');
      return res.json();
    },
  });

  // ============================
  // ADD BOOK
  // ============================
  const addBookMutation = useMutation({
    mutationFn: async (bookData: any) => {
      const token = await getToken();
      const res = await fetch(`${API}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (!res.ok) throw new Error('Failed to add book');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({ title: 'Book added successfully!' });
      setShowBookModal(false);
      setBookForm(emptyBookForm);
    },
    onError: (error: any) => {
      toast({ title: 'Failed to add book', description: error.message, variant: 'destructive' });
    },
  });

  // ============================
  // EDIT BOOK
  // ============================
  const editBookMutation = useMutation({
    mutationFn: async ({ id, bookData }: { id: string; bookData: any }) => {
      const token = await getToken();
      const res = await fetch(`${API}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (!res.ok) throw new Error('Failed to update book');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({ title: 'Book updated successfully!' });
      setShowBookModal(false);
      setEditingBook(null);
      setBookForm(emptyBookForm);
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update book', description: error.message, variant: 'destructive' });
    },
  });

  // ============================
  // DELETE BOOK
  // ============================
  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete book');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({ title: 'Book deleted successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete book', description: error.message, variant: 'destructive' });
    },
  });

  // ============================
  // UPDATE ORDER STATUS
  // ============================
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast({ title: 'Order status updated!' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update order', description: error.message, variant: 'destructive' });
    },
  });

  // ============================
  // HANDLERS
  // ============================
  const handleOpenAdd = () => {
    setEditingBook(null);
    setBookForm(emptyBookForm);
    setShowBookModal(true);
  };

  const handleOpenEdit = (book: any) => {
    setEditingBook(book);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: book.price?.toString() || '',
      coverImage: book.coverImage || '',
      category: book.category || 'Fiction',
      isFeatured: book.isFeatured || false,
      isBestseller: book.isBestseller || false,
    });
    setShowBookModal(true);
  };

  const handleBookFormSubmit = () => {
    const bookData = {
      ...bookForm,
      price: Number(bookForm.price),
    };
    if (editingBook) {
      editBookMutation.mutate({ id: editingBook.id, bookData });
    } else {
      addBookMutation.mutate(bookData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = dateStr ? new Date(dateStr) : null;
    if (!date || isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: TrendingUp },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'rentals', label: 'Rentals', icon: BookMarked },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your BookHub store</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ============================
              STATS TAB
          ============================ */}
          {activeTab === 'stats' && (
            <div>
              {statsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Books', value: stats?.totalBooks ?? 0, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
                    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
                    { label: 'Total Rentals', value: stats?.totalRentals ?? 0, icon: BookMarked, color: 'bg-purple-50 text-purple-600' },
                    { label: 'Active Rentals', value: stats?.activeRentals ?? 0, icon: BookMarked, color: 'bg-pink-50 text-pink-600' },
                    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue ?? 0), icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-card rounded-xl border border-border p-6">
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <p className="text-2xl font-bold font-display">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================
              BOOKS TAB
          ============================ */}
          {activeTab === 'books' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">All Books ({allBooks.length})</h2>
                <Button onClick={handleOpenAdd} className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              </div>

              {booksLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Book</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Flags</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {allBooks.map((book) => (
                          <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-10 h-14 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium text-sm">{book.title}</p>
                                  <p className="text-xs text-muted-foreground">{book.author}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">{book.category}</Badge>
                            </td>
                            <td className="p-4 text-sm font-medium">{formatPrice(book.price)}</td>
                            <td className="p-4">
                              <div className="flex gap-1 flex-wrap">
                                {book.isFeatured && <Badge className="bg-blue-100 text-blue-800 text-xs">Featured</Badge>}
                                {book.isBestseller && <Badge className="bg-green-100 text-green-800 text-xs">Bestseller</Badge>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenEdit(book)}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete "{book.title}"?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteBookMutation.mutate(book.id)}
                                        className="bg-destructive text-destructive-foreground"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================
              ORDERS TAB
          ============================ */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-display font-bold mb-6">All Orders ({orders.length})</h2>

              {ordersLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-16">No orders yet</p>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <p className="font-medium text-sm">{order.orderNumber || `#${order.id.slice(0, 8).toUpperCase()}`}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{order.userId}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                                {order.items?.map((i) => i.title).join(', ')}
                              </p>
                            </td>
                            <td className="p-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                            <td className="p-4 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                            <td className="p-4">
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  updateOrderMutation.mutate({ id: order.id, status: value })
                                }
                              >
                                <SelectTrigger className="w-36 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                    <SelectItem key={s} value={s} className="text-xs">
                                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(s)}`}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================
              RENTALS TAB
          ============================ */}
          {activeTab === 'rentals' && (
            <div>
              <h2 className="text-xl font-display font-bold mb-6">All Rentals ({rentals.length})</h2>

              {rentalsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : rentals.length === 0 ? (
                <p className="text-muted-foreground text-center py-16">No rentals yet</p>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Book ID</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Expires</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{rental.userId}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{rental.bookId}</p>
                            </td>
                            <td className="p-4 text-sm">{rental.planName}</td>
                            <td className="p-4 text-sm font-medium">{formatPrice(rental.price)}</td>
                            <td className="p-4 text-sm text-muted-foreground">{formatDate(rental.expiresAt)}</td>
                            <td className="p-4">
                              <Badge className={rental.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {rental.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ============================
          ADD / EDIT BOOK MODAL
      ============================ */}
      <Dialog open={showBookModal} onOpenChange={setShowBookModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="Book title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Author</Label>
                <Input
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  placeholder="Author name"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                placeholder="Book description"
                className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-background text-sm resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={bookForm.price}
                  onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                  placeholder="299"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={bookForm.category}
                  onValueChange={(value) => setBookForm({ ...bookForm, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Fiction', 'Non-Fiction', 'Science', 'History', 'Romance', 'Mystery', 'Fantasy', 'Biography', 'Self-Help', 'Children'].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={bookForm.coverImage}
                onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookForm.isFeatured}
                  onChange={(e) => setBookForm({ ...bookForm, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookForm.isBestseller}
                  onChange={(e) => setBookForm({ ...bookForm, isBestseller: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Bestseller</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowBookModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookFormSubmit}
                className="flex-1 bg-primary text-primary-foreground"
                disabled={addBookMutation.isPending || editBookMutation.isPending}
              >
                {addBookMutation.isPending || editBookMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingBook ? 'Update Book' : 'Add Book'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
