import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { Category } from '../../types/product';
import { Sparkles } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory?: (category: Category) => void;
  activeCategorySlug?: string | null;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  activeCategorySlug,
}) => {
  return (
    <section id="categories" className="py-12 sm:py-16 bg-ivory-50 border-b border-ivory-300 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-widest mb-2 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Curated Wardrobe</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2">
            Explore our eight signature ethnic collections, thoughtfully tailored for everyday comfort and festive elegance.
          </p>
        </div>

        {/* 8 Circular Categories Presentation (GSS Clothing Style) */}
        <div className="w-full flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 sm:pb-0 px-2 sm:px-0 scroll-smooth items-start justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className="flex-shrink-0 w-24 sm:w-auto text-center cursor-pointer group flex flex-col items-center focus:outline-none"
              >
                {/* Circular Image Container */}
                <div className="relative mb-2.5">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 ease-out bg-white ${
                      isActive
                        ? 'ring-2 ring-brand-700 ring-offset-2 scale-105'
                        : 'ring-1 ring-ivory-300 group-hover:ring-2 group-hover:ring-brand-700 group-hover:ring-offset-2 group-hover:scale-105'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top rounded-full transition-transform duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Category Name & Count without truncating text */}
                <div className="min-h-[2.5rem] flex flex-col items-center justify-start">
                  <h3
                    className={`text-xs sm:text-sm font-semibold transition-colors duration-200 text-center leading-snug px-0.5 ${
                      isActive
                        ? 'text-brand-700 font-bold'
                        : 'text-ink-primary group-hover:text-brand-700'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-ink-muted block mt-0.5 group-hover:text-ink-secondary">
                    {cat.itemCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
