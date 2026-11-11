import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { Category } from '../../types/product';

interface CategorySectionProps {
  onSelectCategory?: (category: Category) => void;
  activeCategorySlug?: string | null;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  activeCategorySlug,
}) => {
  return (
    <section aria-label="Browse Categories" className="bg-cream-50/60 py-3 md:py-6 border-b border-stone-200/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* Responsive Layout: 4 columns per row on mobile (2 neat rows of 4 for 8 categories), centered flex on desktop */}
        <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={(e) => {
                  if (onSelectCategory) {
                    e.preventDefault();
                    onSelectCategory(cat);
                  }
                }}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5 focus:outline-none"
              >
                {/* Category Circle matching GSS dimensions */}
                <div
                  className={`relative flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-full border-2 bg-white p-0.5 shadow-2xs transition-all duration-300 ${
                    isActive
                      ? 'border-maroon-700 ring-2 ring-maroon-700/20 shadow-md scale-105'
                      : 'border-stone-200/80 group-hover:border-maroon-400 group-hover:shadow-md'
                  }`}
                >
                  <img
                    alt={cat.name}
                    src={cat.image}
                    className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Category Title matching GSS font metrics */}
                <span
                  className={`mt-1.5 line-clamp-1 max-w-[4.5rem] sm:max-w-[5.5rem] text-[11px] sm:text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-maroon-800 font-bold'
                      : 'text-stone-800 group-hover:text-maroon-700'
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
