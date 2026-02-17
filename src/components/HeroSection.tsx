import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedBooks, useBookCount } from '@/hooks/useBooks';
import heroImage from '@/assets/hero-books.jpg';

const HeroSection: React.FC = () => {
  const { data: featuredBooks = [] } = useFeaturedBooks();
  const { data: bookCount = 0 } = useBookCount();
  const displayedBooks = featuredBooks.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm font-medium">{bookCount.toLocaleString()} books available</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Discover Your Next
              <span className="block text-gradient-gold">Great Read</span>
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl text-justify">
              Explore our curated collection of bestsellers, new releases, and timeless classics. 
              Find the perfect book for every mood and moment.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              >
                <Link to="/books">
                  Browse Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg"
                className="bg-primary-foreground/20 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/30 font-semibold backdrop-blur-sm"
              >
                <Link to="/categories">
                  Explore Categories
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold font-display">50K+</p>
                <p className="text-sm text-primary-foreground/70">Happy Readers</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display">{bookCount.toLocaleString()}</p>
                <p className="text-sm text-primary-foreground/70">Books Available</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display">4.8</p>
                <p className="text-sm text-primary-foreground/70">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right content - Hero image + Featured books */}
          <div className="relative">
            {/* Mobile/tablet: smaller image */}
            <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="A cozy bookstore with stacked books and warm golden lighting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            {/* Floating book cards - desktop only */}
            <div className="hidden lg:block">
              {displayedBooks.slice(0, 2).map((book, index) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="absolute transition-all duration-500 hover:z-10"
                  style={{
                    right: index === 0 ? '10%' : '40%',
                    bottom: index === 0 ? '8%' : '12%',
                    zIndex: 2 - index,
                  }}
                >
                  <div className="group relative">
                    <div className="w-32 h-48 rounded-lg overflow-hidden shadow-2xl ring-2 ring-primary-foreground/20 group-hover:ring-gold/50 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L48 105C96 90 192 60 288 50C384 40 480 50 576 55C672 60 768 60 864 65C960 70 1056 80 1152 80C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
