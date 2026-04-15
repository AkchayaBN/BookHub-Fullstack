// Static categories
export const categories = [
  { id: 'fiction',     name: 'Fiction',     icon: '📚' },
  { id: 'non-fiction', name: 'Non-Fiction', icon: '📖' },
  { id: 'science',     name: 'Science',     icon: '🔬' },
  { id: 'history',     name: 'History',     icon: '🏛️' },
  { id: 'romance',     name: 'Romance',     icon: '💕' },
  { id: 'mystery',     name: 'Mystery',     icon: '🔍' },
  { id: 'fantasy',     name: 'Fantasy',     icon: '🐉' },
  { id: 'biography',   name: 'Biography',   icon: '👤' },
  { id: 'self-help',   name: 'Self-Help',   icon: '🌟' },
  { id: 'children',    name: 'Children',    icon: '🧸' },
];

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