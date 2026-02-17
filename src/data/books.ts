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

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  verified: boolean;
}

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

export const books: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    price: 16.99,
    originalPrice: 24.99,
    rating: 4.5,
    reviewCount: 2847,
    category: 'fiction',
    genre: 'Literary Fiction',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    isbn: '978-0525559474',
    publicationYear: 2020,
    language: 'English',
    pages: 304,
    inStock: true,
    stockQuantity: 45,
    isBestseller: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. The #1 New York Times bestseller.',
    price: 18.99,
    rating: 4.8,
    reviewCount: 5632,
    category: 'self-help',
    genre: 'Personal Development',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
    isbn: '978-0735211292',
    publicationYear: 2018,
    language: 'English',
    pages: 320,
    inStock: true,
    stockQuantity: 120,
    isBestseller: true,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    description: 'A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat.',
    price: 14.99,
    originalPrice: 19.99,
    rating: 4.7,
    reviewCount: 3891,
    category: 'fiction',
    genre: 'Historical Fiction',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    isbn: '978-0062060624',
    publicationYear: 2012,
    language: 'English',
    pages: 416,
    inStock: true,
    stockQuantity: 78,
    isBestseller: true,
  },
  {
    id: '4',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description: 'A landmark volume in science writing by one of the great minds of our time, Stephen Hawking explores mysteries of the universe.',
    price: 22.99,
    rating: 4.6,
    reviewCount: 4521,
    category: 'science',
    genre: 'Physics',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    isbn: '978-0553380163',
    publicationYear: 1998,
    language: 'English',
    pages: 212,
    inStock: true,
    stockQuantity: 34,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    description: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
    price: 15.99,
    rating: 4.6,
    reviewCount: 6234,
    category: 'fiction',
    genre: 'Contemporary Fiction',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    isbn: '978-1501161933',
    publicationYear: 2017,
    language: 'English',
    pages: 400,
    inStock: true,
    stockQuantity: 89,
    isBestseller: true,
    isNewArrival: false,
  },
  {
    id: '6',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution.',
    price: 24.99,
    rating: 4.5,
    reviewCount: 7891,
    category: 'history',
    genre: 'World History',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
    isbn: '978-0062316097',
    publicationYear: 2015,
    language: 'English',
    pages: 464,
    inStock: true,
    stockQuantity: 156,
    isBestseller: true,
    isFeatured: true,
  },
  {
    id: '7',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    description: 'The riveting first-person narrative of a young man who grows to be the most notorious magician his world has ever seen.',
    price: 17.99,
    originalPrice: 22.99,
    rating: 4.7,
    reviewCount: 5123,
    category: 'fantasy',
    genre: 'Epic Fantasy',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    isbn: '978-0756404741',
    publicationYear: 2007,
    language: 'English',
    pages: 722,
    inStock: true,
    stockQuantity: 67,
    isFeatured: true,
  },
  {
    id: '8',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that satirizes issues of marriage, morality, and money during the Regency era in Great Britain.',
    price: 12.99,
    rating: 4.8,
    reviewCount: 9876,
    category: 'romance',
    genre: 'Classic Romance',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    isbn: '978-0141439518',
    publicationYear: 1813,
    language: 'English',
    pages: 432,
    inStock: true,
    stockQuantity: 234,
  },
  {
    id: '9',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'Alicia Berenson\'s life is seemingly perfect until one evening when she shoots her husband five times and never speaks another word.',
    price: 16.99,
    rating: 4.3,
    reviewCount: 4567,
    category: 'mystery',
    genre: 'Psychological Thriller',
    coverImage: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=600&fit=crop',
    isbn: '978-1250301697',
    publicationYear: 2019,
    language: 'English',
    pages: 336,
    inStock: true,
    stockQuantity: 91,
    isBestseller: true,
    isNewArrival: true,
  },
  {
    id: '10',
    title: 'Becoming',
    author: 'Michelle Obama',
    description: 'In her memoir, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her.',
    price: 19.99,
    originalPrice: 32.50,
    rating: 4.7,
    reviewCount: 8234,
    category: 'biography',
    genre: 'Autobiography',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    isbn: '978-1524763138',
    publicationYear: 2018,
    language: 'English',
    pages: 448,
    inStock: true,
    stockQuantity: 178,
    isBestseller: true,
  },
  {
    id: '11',
    title: 'Where the Wild Things Are',
    author: 'Maurice Sendak',
    description: 'A timeless classic that explores the wild adventures of Max, sent to bed without supper.',
    price: 18.99,
    rating: 4.9,
    reviewCount: 3456,
    category: 'children',
    genre: 'Picture Book',
    coverImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=600&fit=crop',
    isbn: '978-0064431781',
    publicationYear: 1963,
    language: 'English',
    pages: 48,
    inStock: true,
    stockQuantity: 89,
  },
  {
    id: '12',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-fiction thriller.',
    price: 21.99,
    rating: 4.8,
    reviewCount: 2345,
    category: 'science',
    genre: 'Science Fiction',
    coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
    isbn: '978-0593135204',
    publicationYear: 2021,
    language: 'English',
    pages: 496,
    inStock: true,
    stockQuantity: 112,
    isNewArrival: true,
    isFeatured: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: 'user1',
    userName: 'Sarah M.',
    rating: 5,
    text: 'This book changed my perspective on life. Absolutely beautiful writing and such a thought-provoking concept.',
    date: '2024-01-15',
    helpful: 234,
    verified: true,
  },
  {
    id: '2',
    bookId: '1',
    userId: 'user2',
    userName: 'James K.',
    rating: 4,
    text: 'A wonderful exploration of regret and possibility. The ending left me in tears.',
    date: '2024-01-10',
    helpful: 156,
    verified: true,
  },
  {
    id: '3',
    bookId: '2',
    userId: 'user3',
    userName: 'Emily R.',
    rating: 5,
    text: 'Practical, actionable advice that actually works. I\'ve implemented several habits from this book.',
    date: '2024-01-20',
    helpful: 445,
    verified: true,
  },
];

export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const getBooksByCategory = (category: string): Book[] => {
  return books.filter(book => book.category === category);
};

export const getBestsellers = (): Book[] => {
  return books.filter(book => book.isBestseller);
};

export const getNewArrivals = (): Book[] => {
  return books.filter(book => book.isNewArrival);
};

export const getFeaturedBooks = (): Book[] => {
  return books.filter(book => book.isFeatured);
};

export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.isbn.includes(query)
  );
};

export const getReviewsByBookId = (bookId: string): Review[] => {
  return reviews.filter(review => review.bookId === bookId);
};
