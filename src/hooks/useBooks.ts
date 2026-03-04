import { useQuery } from '@tanstack/react-query';

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

const API = 'http://localhost:5000/api/books';

/* ------------------ ALL BOOKS ------------------ */

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async (): Promise<Book[]> => {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to fetch books');

      const data = await res.json();

      return data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price ?? 0,
        coverImage: book.coverImage ?? '',
        category: book.category ?? 'General',
        description: book.description ?? '',
        rating: book.rating ?? 4.5,
        reviewCount: book.reviewCount ?? 100,
        isFeatured: book.isFeatured ?? false,
        isBestseller: book.isBestseller ?? false,
        createdAt: book.createdAt ?? '',
      }));
    },
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
    queryKey: ['books', 'featured'],
    queryFn: async (): Promise<Book[]> => {
      const res = await fetch(API);
      const data = await res.json();
      return data.filter((b: Book) => b.isFeatured);
    },
  });
};

/* ------------------ BESTSELLERS ------------------ */

export const useBestsellers = () => {
  return useQuery({
    queryKey: ['books', 'bestsellers'],
    queryFn: async (): Promise<Book[]> => {
      const res = await fetch(API);
      const data = await res.json();
      return data.filter((b: Book) => b.isBestseller);
    },
  });
};

/* ------------------ NEW ARRIVALS ------------------ */

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['books', 'new'],
    queryFn: async (): Promise<Book[]> => {
      const res = await fetch(API);
      const data = await res.json();

      return data.sort(
        (a: Book, b: Book) =>
          new Date(b.createdAt || '').getTime() -
          new Date(a.createdAt || '').getTime()
      );
    },
  });
};

/* ------------------ CATEGORY ------------------ */

export const useBooksByCategory = (category: string) => {
  return useQuery({
    queryKey: ['books', 'category', category],
    enabled: !!category,
    queryFn: async (): Promise<Book[]> => {
      const res = await fetch(API);
      const data = await res.json();
      return data.filter((b: Book) => b.category === category);
    },
  });
};

/* ------------------ SEARCH ------------------ */

export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: async (): Promise<Book[]> => {
      const res = await fetch(API);
      const data = await res.json();

      if (!query.trim()) return data;

      return data.filter((book: Book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
    },
  });
};

/* ------------------ COUNT ------------------ */

export const useBookCount = () => {
  return useQuery({
    queryKey: ['books', 'count'],
    queryFn: async (): Promise<number> => {
      const res = await fetch(API);
      const data = await res.json();
      return data.length;
    },
  });
};
export const useCategoryBookCounts = () => {
  return useQuery({
    queryKey: ['books', 'category-counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      const res = await fetch('http://localhost:5000/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');

      const books = await res.json();

      // predefined categories used by the UI
      const counts: Record<string, number> = {
        "Fiction": 0,
        "Non-Fiction": 0,
        "Science": 0,
        "History": 0,
        "Romance": 0,
        "Mystery": 0,
        "Fantasy": 0,
        "Biography": 0,
        "Self-Help": 0,
        "Children": 0
      };

      books.forEach((book: any) => {
        const category = book.category?.trim();
        if (counts.hasOwnProperty(category)) {
          counts[category]++;
        }
      });

      return counts;
    },
  });
};