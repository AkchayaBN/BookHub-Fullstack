import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/currency';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleMoveToCart = (book: typeof items[0]) => {
    addToCart(book);
    removeFromWishlist(book.id);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-6">
              Save your favorite books here for later
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/books">Browse Books</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-display font-bold mb-8">
            My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>

          <div className="grid gap-4">
            {items.map((book) => (
              <div
                key={book.id}
                className="flex gap-6 p-6 rounded-lg bg-card border border-border hover:shadow-card transition-shadow"
              >
                <Link to={`/book/${book.id}`} className="flex-shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-md shadow-sm"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/book/${book.id}`}>
                    <h2 className="font-display font-semibold text-lg hover:text-primary transition-colors">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground mt-1">{book.author}</p>
                  <div className="mt-2">
                    <StarRating rating={book.rating} size="sm" showValue />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xl font-bold text-primary">{formatPrice(book.price)}</span>
                    {book.originalPrice && (
                      <span className="text-muted-foreground line-through">
                        {formatPrice(book.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleMoveToCart(book)}
                    disabled={isInCart(book.id)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isInCart(book.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => removeFromWishlist(book.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
