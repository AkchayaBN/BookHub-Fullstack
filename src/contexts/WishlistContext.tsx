import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/types/book';
import { toast } from '@/hooks/use-toast';

interface WishlistContextType {
  items: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Book[]>(() => {
    const saved = localStorage.getItem('bookhub-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookhub-wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (book: Book) => {
    setItems(prevItems => {
      if (prevItems.some(item => item.id === book.id)) {
        return prevItems;
      }
      toast({
        title: "Added to wishlist",
        description: `${book.title} has been saved to your wishlist`,
      });
      return [...prevItems, book];
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setItems(prevItems => {
      const book = prevItems.find(item => item.id === bookId);
      if (book) {
        toast({
          title: "Removed from wishlist",
          description: `${book.title} has been removed from your wishlist`,
        });
      }
      return prevItems.filter(item => item.id !== bookId);
    });
  };

  const isInWishlist = (bookId: string) => {
    return items.some(item => item.id === bookId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
