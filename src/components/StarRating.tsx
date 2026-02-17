import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onRatingChange,
}) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isHalfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!interactive}
              className={cn(
                "relative",
                interactive && "cursor-pointer hover:scale-110 transition-transform"
              )}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled || isHalfFilled ? "fill-gold text-gold" : "text-muted-foreground/30"
                )}
              />
              {isHalfFilled && (
                <Star
                  className={cn(
                    sizes[size],
                    "absolute inset-0 fill-gold text-gold",
                    "clip-path-[inset(0_50%_0_0)]"
                  )}
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-medium", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", textSizes[size])}>
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
