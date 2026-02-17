import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/currency';

const CartSheet: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any books yet
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/books">Browse Books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle className="font-display">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1 -mx-6 px-6 my-4">
        <div className="space-y-4">
          {items.map(({ book, quantity }) => (
            <div key={book.id} className="flex gap-4 p-3 rounded-lg bg-muted/50">
              <Link to={`/book/${book.id}`} className="flex-shrink-0">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-md shadow-sm"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/book/${book.id}`}>
                  <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                    {book.title}
                  </h4>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                <p className="font-semibold text-primary mt-2">{formatPrice(book.price)}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(book.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-accent">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(getCartTotal())}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="outline" onClick={clearCart} className="w-full">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSheet;
