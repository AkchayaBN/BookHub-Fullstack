import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  BookOpen,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ThumbsUp,
  Loader2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBook, useBooksByCategory } from '@/hooks/useBooks';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';
import SamplePdfViewer from '@/components/SamplePdfViewer';
import RentalModal from '@/components/RentalModal';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showSample, setShowSample] = useState(false);
  const [showRental, setShowRental] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: book, isLoading } = useBook(id);
  const { data: relatedBooksAll = [] } = useBooksByCategory(book?.category || '');

  const relatedBooks = relatedBooksAll.filter(b => b.id !== book?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-4">Book Not Found</h1>
            <Button asChild>
              <Link to="/books">Browse All Books</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/books" className="hover:text-foreground">Books</Link>
            <span>/</span>
            <Link to={`/books?category=${book.category}`} className="hover:text-foreground capitalize">
              {book.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{book.title}</span>
          </nav>

          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-book">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {book.isBestseller && (
                    <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
                  )}
                  {book.isNewArrival && (
                    <Badge className="bg-accent text-accent-foreground">New Arrival</Badge>
                  )}
                  {discount > 0 && (
                    <Badge variant="destructive">-{discount}% OFF</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground text-sm mb-2">{book.genre}</p>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{book.title}</h1>
                <p className="text-lg text-muted-foreground">by {book.author}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <StarRating rating={book.rating} showValue reviewCount={book.reviewCount} />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">{formatPrice(book.price)}</span>
                {book.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(book.originalPrice)}
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                {book.inStock ? (
                  <>
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-accent font-medium">In Stock</span>
                    <span className="text-muted-foreground">({book.stockQuantity} available)</span>
                  </>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              <Separator />

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= book.stockQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={!book.inStock || isInCart(book.id)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInCart(book.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary/5"
                    onClick={() => setShowSample(true)}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Online
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className={cn(isInWishlist(book.id) && "text-primary border-primary")}
                  >
                    <Heart className={cn("w-5 h-5", isInWishlist(book.id) && "fill-current")} />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Orders ₹500+</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% Protected</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 Days</p>
                </div>
              </div>

              {/* Book Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ISBN</span>
                  <span className="font-medium">{book.isbn}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pages</span>
                  <span className="font-medium">{book.pages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{book.language}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{book.publicationYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({book.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {book.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <p className="text-muted-foreground text-center py-8">
                No reviews yet. Be the first to review this book!
              </p>
            </TabsContent>
          </Tabs>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedBooks.map(relatedBook => (
                  <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {book && (
        <>
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
      )}
    </div>
  );
};

export default BookDetail;
