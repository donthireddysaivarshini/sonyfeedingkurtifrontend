import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating?: number;
  reviewCount?: number;
  variant?: 'inline' | 'overlay';
  onClick?: () => void;
}

/** Renders customer star rating dynamically when populated by catalog/backend data. */
export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  reviewCount,
  variant = 'inline',
  onClick,
}) => {
  if (!rating || rating <= 0) return null;

  const formattedRating = Number(rating).toFixed(1);

  if (variant === 'overlay') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-stone-900 shadow-xs backdrop-blur-xs border border-brand-200/70">
        <span>{formattedRating}</span>
        <Star className="h-2.5 w-2.5 fill-saffron-500 text-saffron-500" />
        {typeof reviewCount === 'number' && reviewCount > 0 && (
          <span className="text-stone-400 font-normal">| {reviewCount}</span>
        )}
      </span>
    );
  }

  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-900 ${
        onClick ? 'hover:bg-brand-100 transition-colors cursor-pointer' : ''
      }`}
    >
      <span>{formattedRating}</span>
      <Star className="h-3.5 w-3.5 fill-saffron-500 text-saffron-500" />
      {typeof reviewCount === 'number' && reviewCount > 0 && (
        <span className="border-l border-brand-200 pl-1.5 font-medium text-ink-secondary">
          {reviewCount} {reviewCount === 1 ? 'Rating' : 'Ratings'}
        </span>
      )}
    </Tag>
  );
};

