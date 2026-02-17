import { Tables } from '@/integrations/supabase/types';

// Database book type from Supabase
export type DbBook = Tables<'books'>;

// Transformed book type for frontend use (matches the old static Book type)
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  genre: string;
  coverImage: string;
  isbn: string;
  publicationYear: number;
  language: string;
  pages: number;
  inStock: boolean;
  stockQuantity: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
}

// Transform database book to frontend book
export const transformDbBook = (dbBook: DbBook): Book => ({
  id: dbBook.id,
  title: dbBook.title,
  author: dbBook.author,
  description: dbBook.description || '',
  price: dbBook.price,
  originalPrice: dbBook.original_price ?? undefined,
  rating: dbBook.rating ?? 0,
  reviewCount: dbBook.review_count ?? 0,
  category: dbBook.category,
  genre: dbBook.genre || '',
  coverImage: dbBook.cover_image || '/placeholder.svg',
  isbn: dbBook.isbn || '',
  publicationYear: dbBook.publication_year ?? 0,
  language: dbBook.language || 'English',
  pages: dbBook.pages ?? 0,
  inStock: dbBook.in_stock ?? true,
  stockQuantity: dbBook.stock_quantity ?? 0,
  isBestseller: dbBook.is_bestseller ?? false,
  isNewArrival: dbBook.is_new_arrival ?? false,
  isFeatured: dbBook.is_featured ?? false,
});

// Static categories (these don't need to come from the database)
export const categories = [
  { id: 'fiction', name: 'Fiction', icon: '📚' },
  { id: 'non-fiction', name: 'Non-Fiction', icon: '📖' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'romance', name: 'Romance', icon: '💕' },
  { id: 'mystery', name: 'Mystery', icon: '🔍' },
  { id: 'fantasy', name: 'Fantasy', icon: '🐉' },
  { id: 'biography', name: 'Biography', icon: '👤' },
  { id: 'self-help', name: 'Self-Help', icon: '🌟' },
  { id: 'children', name: 'Children', icon: '🧸' },
];
