import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book, transformDbBook } from '@/types/book';

// Fetch all books
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async (): Promise<Book[]> => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return (data || []).map(transformDbBook);
    },
  });
};

// Fetch a single book by ID
export const useBook = (id: string | undefined) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async (): Promise<Book | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data ? transformDbBook(data) : null;
    },
    enabled: !!id,
  });
};

// Fetch bestsellers
export const useBestsellers = () => {
  return useQuery({
    queryKey: ['books', 'bestsellers'],
    queryFn: async (): Promise<Book[]> => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_bestseller', true)
        .order('review_count', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformDbBook);
    },
  });
};

// Fetch new arrivals
export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['books', 'new-arrivals'],
    queryFn: async (): Promise<Book[]> => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_new_arrival', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformDbBook);
    },
  });
};

// Fetch featured books
export const useFeaturedBooks = () => {
  return useQuery({
    queryKey: ['books', 'featured'],
    queryFn: async (): Promise<Book[]> => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_featured', true)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformDbBook);
    },
  });
};

// Fetch books by category
export const useBooksByCategory = (category: string) => {
  return useQuery({
    queryKey: ['books', 'category', category],
    queryFn: async (): Promise<Book[]> => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('category', category)
        .order('title');
      
      if (error) throw error;
      return (data || []).map(transformDbBook);
    },
    enabled: !!category,
  });
};

// Search books
export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: async (): Promise<Book[]> => {
      if (!query.trim()) {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('title');
        
        if (error) throw error;
        return (data || []).map(transformDbBook);
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
        .order('title');
      
      if (error) throw error;
      return (data || []).map(transformDbBook);
    },
  });
};

// Get category book counts
export const useCategoryBookCounts = () => {
  return useQuery({
    queryKey: ['books', 'category-counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await supabase
        .from('books')
        .select('category');
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      (data || []).forEach(book => {
        counts[book.category] = (counts[book.category] || 0) + 1;
      });
      return counts;
    },
  });
};

// Get total book count
export const useBookCount = () => {
  return useQuery({
    queryKey: ['books', 'count'],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });
};
