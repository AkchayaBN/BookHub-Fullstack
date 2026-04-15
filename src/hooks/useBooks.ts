import { useQuery } from '@tanstack/react-query';
import { categories } from '@/types/book';
import { API_URL } from '@/lib/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  createdAt?: string;
}

const API = `${API_URL}/books`;

const fetchAllBooks = async (): Promise<Book[]> => {
  const res = await fetch(API);
  if (!res.ok) throw new Error('Failed to fetch books');
  const data = await res.json();
  return data.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    price: book.price ?? 0,
    coverImage: book.coverImage ?? '',
    category: book.category?.trim() ?? 'General', // ✅ trim here at source
    description: book.description ?? '',
    rating: book.rating ?? 4.5,
    reviewCount: book.reviewCount ?? 100,
    isFeatured: book.isFeatured ?? false,
    isBestseller: book.isBestseller ?? false,
    createdAt: book.createdAt ?? '',
  }));
};

/* ------------------ ALL BOOKS ------------------ */
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5, // ✅ cache for 5 min — all hooks share this
  });
};

/* ------------------ SINGLE BOOK ------------------ */
export const useBook = (id: string | undefined) => {
  return useQuery({
    queryKey: ['book', id],
    enabled: !!id,
    queryFn: async (): Promise<Book | null> => {
      const res = await fetch(`${API}/${id}`);
      if (!res.ok) return null;
      return res.json();
    },
  });
};

/* ------------------ FEATURED ------------------ */
export const useFeaturedBooks = () => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache, no extra fetch
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.filter((b) => b.isFeatured),
  });
};

/* ------------------ BESTSELLERS ------------------ */
export const useBestsellers = () => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.filter((b) => b.isBestseller),
  });
};

/* ------------------ NEW ARRIVALS ------------------ */
export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return [...data]
    .filter(book => new Date(book.createdAt || '') >= oneWeekAgo)
    .sort((a, b) =>
      new Date(b.createdAt || '').getTime() -
      new Date(a.createdAt || '').getTime()
    );
}
  });
};

/* ------------------ CATEGORY ------------------ */
export const useBooksByCategory = (category: string) => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    enabled: !!category,
    select: (data) =>
      data.filter(
        (b) => b.category?.toLowerCase() === category.toLowerCase() // ✅ case-safe
      ),
  });
};

/* ------------------ SEARCH ------------------ */
export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      if (!query.trim()) return data;
      return data.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase())
      );
    },
  });
};

/* ------------------ COUNT ------------------ */
export const useBookCount = () => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.length,
  });
};

/* ------------------ CATEGORY COUNTS ------------------ */
export const useCategoryBookCounts = () => {
  return useQuery({
    queryKey: ['books'],           // ✅ same queryKey = hits cache, no extra fetch
    queryFn: fetchAllBooks,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      // Build lowercase lookup map from canonical category names
      const lowerToCanonical: Record<string, string> = {};
      categories.forEach((cat) => {
        lowerToCanonical[cat.name.toLowerCase()] = cat.name;
      });

      // Start all counts at 0
      const counts: Record<string, number> = {};
      categories.forEach((cat) => (counts[cat.name] = 0));

      data.forEach((book) => {
        const raw = book.category?.trim();
        if (!raw) return;
        const canonical = lowerToCanonical[raw.toLowerCase()]; // ✅ case-safe match
        if (canonical) counts[canonical]++;
      });

      return counts;
    },
  });
};
