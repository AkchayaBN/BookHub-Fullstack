import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import { useBestsellers } from '@/hooks/useBooks';
import { Loader2 } from 'lucide-react';

const Bestsellers: React.FC = () => {
  const { data: bestsellers = [], isLoading } = useBestsellers();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Bestsellers</h1>
          <p className="text-muted-foreground mb-8">
            Discover our most popular books loved by readers worldwide.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {bestsellers.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bestsellers;
