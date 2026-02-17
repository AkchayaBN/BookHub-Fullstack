import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import { useNewArrivals } from '@/hooks/useBooks';
import { Loader2 } from 'lucide-react';

const NewArrivals: React.FC = () => {
  const { data: newArrivals = [], isLoading } = useNewArrivals();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">New Arrivals</h1>
          <p className="text-muted-foreground mb-8">
            Fresh off the press! Check out the latest additions to our collection.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {newArrivals.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No new arrivals at the moment. Check back soon!
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivals;
