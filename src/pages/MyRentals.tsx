import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Clock, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRentals } from '@/hooks/useRentals';
import { useBook } from '@/hooks/useBooks';
import { formatPrice } from '@/lib/currency';

const RentalCard: React.FC<{ rental: any }> = ({ rental }) => {
  const { data: book } = useBook(rental.book_id);
  const expiresAt = new Date(rental.expires_at);
  const isExpired = expiresAt < new Date();
  const daysLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const durationLabel = rental.duration === '1_month' ? '1 Month' : rental.duration === '6_months' ? '6 Months' : '1 Year';

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-card border border-border">
      <Link to={`/book/${rental.book_id}`} className="flex-shrink-0">
        <img
          src={book?.coverImage || '/placeholder.svg'}
          alt={book?.title || 'Book'}
          className="w-20 h-28 object-cover rounded-md shadow-sm"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/book/${rental.book_id}`}>
          <h3 className="font-display font-semibold hover:text-primary transition-colors">
            {book?.title || 'Loading...'}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{book?.author}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={isExpired ? 'destructive' : 'default'} className={!isExpired ? 'bg-accent text-accent-foreground' : ''}>
            {isExpired ? 'Expired' : 'Active'}
          </Badge>
          <span className="text-xs text-muted-foreground">{durationLabel} plan</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-muted-foreground">
            <Clock className="w-3 h-3 inline mr-1" />
            {isExpired ? 'Expired' : `${daysLeft} days left`}
          </span>
          <span className="font-medium text-primary">{formatPrice(rental.price)}</span>
        </div>
      </div>
    </div>
  );
};

const MyRentals: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: rentals = [], isLoading } = useUserRentals();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-display font-bold mb-8">My Rentals</h1>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : rentals.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-display font-bold mb-2">No rentals yet</h2>
              <p className="text-muted-foreground mb-6">Rent a book to start reading online</p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/books">Browse Books</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 max-w-2xl">
              {rentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyRentals;
