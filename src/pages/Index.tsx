import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sparkles, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BookCard from '@/components/BookCard';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/types/book';
import { useBooks, useBestsellers, useNewArrivals, useCategoryBookCounts } from '@/hooks/useBooks';

const Index: React.FC = () => {
  const { data: allBooks = [], isLoading: booksLoading } = useBooks();
  const { data: bestsellers = [], isLoading: bestsellersLoading } = useBestsellers();
  const { data: newArrivals = [], isLoading: newArrivalsLoading } = useNewArrivals();
  const { data: categoryCounts = {} } = useCategoryBookCounts();

  const isLoading = booksLoading || bestsellersLoading || newArrivalsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display font-bold">Browse by Category</h2>
                <p className="text-muted-foreground mt-1">Find your perfect read by genre</p>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/categories">
                  View All Categories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  bookCount={categoryCounts[category.id] || 0}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-16 bg-cream-gradient">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold">Bestsellers</h2>
                  <p className="text-muted-foreground">Top picks loved by readers</p>
                </div>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link to="/bestsellers">
                  See All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {bestsellersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {bestsellers.slice(0, 5).map((book, index) => (
                  <div 
                    key={book.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link to="/bestsellers">
                  View All Bestsellers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold">New Arrivals</h2>
                    <p className="text-muted-foreground">Fresh titles just added</p>
                  </div>
                </div>
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link to="/new-arrivals">
                    Explore New Books
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((book, index) => (
                  <div 
                    key={book.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Collection Banner */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-hero-gradient text-primary-foreground p-8 md:p-12">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">
                  <Award className="w-4 h-4" />
                  Editor's Choice
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  2024 Award Winners Collection
                </h2>
                <p className="text-primary-foreground/80 mb-6">
                  Explore this year's most acclaimed literary works, featuring Pulitzer Prize 
                  winners, Booker Prize finalists, and more.
                </p>
                <Button 
                  asChild
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Link to="/books">
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary opacity-50" />
              </div>
            </div>
          </div>
        </section>

        {/* All Books Preview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-3">Explore Our Collection</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dive into our extensive library of carefully curated books across all genres. 
                Find your next adventure, learn something new, or escape into fiction.
              </p>
            </div>

            {booksLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {allBooks.slice(0, 12).map((book, index) => (
                  <div 
                    key={book.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/books">
                  View All Books
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold mb-3">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter for exclusive deals, new releases, and reading recommendations.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
