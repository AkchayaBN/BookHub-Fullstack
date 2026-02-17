import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/types/book';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (bookId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bookhub-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookhub-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book: Book, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.book.id === book.id);
      
      if (existingItem) {
        toast({
          title: "Updated cart",
          description: `${book.title} quantity updated`,
        });
        return prevItems.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      toast({
        title: "Added to cart",
        description: `${book.title} has been added to your cart`,
      });
      return [...prevItems, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.book.id === bookId);
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.book.title} has been removed`,
        });
      }
      return prevItems.filter(item => item.book.id !== bookId);
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (bookId: string) => {
    return items.some(item => item.book.id === bookId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
