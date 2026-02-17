import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, BookOpen } from 'lucide-react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';
import SamplePdfViewer from '@/components/SamplePdfViewer';
import RentalModal from '@/components/RentalModal';

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'featured';
}

const BookCard: React.FC<BookCardProps> = ({ book, variant = 'default' }) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showSample, setShowSample] = useState(false);
  const [showRental, setShowRental] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  const handleReadOnline = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSample(true);
  };

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  if (variant === 'compact') {
    return (
      <Link to={`/book/${book.id}`} className="group flex gap-4 p-4 card-book">
        <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-sm font-medium">{book.rating}</span>
          </div>
          <p className="mt-2 font-semibold text-primary">{formatPrice(book.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <>
      <Link to={`/book/${book.id}`} className="group card-book overflow-hidden">
        {/* Cover Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {book.isBestseller && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Bestseller
              </Badge>
            )}
            {book.isNewArrival && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                New
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all",
              "bg-card/90 backdrop-blur-sm hover:bg-card shadow-md",
              isInWishlist(book.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("w-5 h-5", isInWishlist(book.id) && "fill-current")} />
          </button>

          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-charcoal/90 to-transparent pt-8">
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                disabled={isInCart(book.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {isInCart(book.id) ? 'In Cart' : 'Buy'}
              </Button>
              <Button
                onClick={handleReadOnline}
                size="sm"
                variant="outline"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Rent
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="text-sm font-medium">{book.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({book.reviewCount.toLocaleString()})
            </span>
          </div>

          <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-primary">{formatPrice(book.price)}</span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <SamplePdfViewer
        book={book}
        open={showSample}
        onClose={() => setShowSample(false)}
        onRent={() => {
          setShowSample(false);
          setShowRental(true);
        }}
      />
      <RentalModal
        book={book}
        open={showRental}
        onClose={() => setShowRental(false)}
      />
    </>
  );
};

export default BookCard;
