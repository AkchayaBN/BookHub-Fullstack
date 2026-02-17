import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { categories } from '@/types/book';
import { useBooks } from '@/hooks/useBooks';

const Books: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [sortBy, setSortBy] = useState('featured');

  const searchQuery = searchParams.get('search') || '';
  const filterType = searchParams.get('filter') || '';

  const { data: allBooks = [], isLoading } = useBooks();

  const filteredBooks = useMemo(() => {
    let result = [...allBooks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(book => selectedCategories.includes(book.category));
    }

    // Price filter
    result = result.filter(
      book => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    // Special filters
    if (filterType === 'bestseller') {
      result = result.filter(book => book.isBestseller);
    } else if (filterType === 'new') {
      result = result.filter(book => book.isNewArrival);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.publicationYear - a.publicationYear);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Featured - no additional sorting
        break;
    }

    return result;
  }, [allBooks, searchQuery, selectedCategories, priceRange, sortBy, filterType]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    setSortBy('featured');
    setSearchParams({});
  };

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0) +
    (filterType ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={category.id} className="flex-1 cursor-pointer text-sm">
                {category.icon} {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="font-display font-semibold mb-3">Quick Filters</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filterType === 'bestseller' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() =>
              setSearchParams(prev => {
                if (filterType === 'bestseller') {
                  prev.delete('filter');
                } else {
                  prev.set('filter', 'bestseller');
                }
                return prev;
              })
            }
          >
            Bestsellers
          </Badge>
          <Badge
            variant={filterType === 'new' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() =>
              setSearchParams(prev => {
                if (filterType === 'new') {
                  prev.delete('filter');
                } else {
                  prev.set('filter', 'new');
                }
                return prev;
              })
            }
          >
            New Arrivals
          </Badge>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
          <X className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : filterType === 'bestseller'
                ? 'Bestsellers'
                : filterType === 'new'
                ? 'New Arrivals'
                : 'All Books'}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} found`}
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
                <h2 className="font-display font-semibold text-lg mb-4">Filters</h2>
                <FiltersContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-2" variant="secondary">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Active filters badges */}
                  <div className="hidden md:flex flex-wrap gap-2">
                    {selectedCategories.map(cat => {
                      const category = categories.find(c => c.id === cat);
                      return (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleCategory(cat)}
                        >
                          {category?.name}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center border border-border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Books Grid/List */}
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredBooks.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredBooks.map((book, index) => (
                    <div
                      key={book.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <BookCard book={book} variant={viewMode === 'list' ? 'compact' : 'default'} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">No books found</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Books;
