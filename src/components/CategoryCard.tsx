import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  bookCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, icon, bookCount }) => {
  return (
    <Link
      to={`/books?category=${id}`}
      className="group flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
    >
      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
        {name}
      </h3>
      {bookCount !== undefined && (
        <p className="text-sm text-muted-foreground mt-1">
          {bookCount} books
        </p>
      )}
      <ArrowRight className="w-4 h-4 mt-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

export default CategoryCard;
