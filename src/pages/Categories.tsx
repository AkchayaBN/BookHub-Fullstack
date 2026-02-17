import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/types/book';
import { useCategoryBookCounts } from '@/hooks/useBooks';

const Categories: React.FC = () => {
  const { data: categoryCounts = {} } = useCategoryBookCounts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">Browse Categories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide selection of books across various genres. Whether you're looking for 
              thrilling mysteries, heartwarming romances, or thought-provoking non-fiction, we have 
              something for every reader.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  bookCount={categoryCounts[category.id] || 0}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
