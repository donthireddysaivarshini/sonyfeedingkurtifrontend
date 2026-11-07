import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FilterState, INITIAL_PRICE_BOUNDS } from './FilterSidebar';
import { CATEGORIES } from '../../data/categories';
import { Product } from '../../types/product';

interface ActiveFilterPillsProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  lockCategory?: boolean;
  availableProducts: Product[];
}

export const ActiveFilterPills: React.FC<ActiveFilterPillsProps> = ({
  filters,
  onFilterChange,
  onReset,
  lockCategory = false,
  availableProducts,
}) => {
  const colorMap = React.useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    availableProducts.forEach((p) => {
      p.availableColors.forEach((c) => {
        map.set(c.id, { name: c.name, hex: c.hex });
      });
    });
    return map;
  }, [availableProducts]);

  const hasActiveFilters =
    (!lockCategory && filters.category !== null) ||
    filters.feedingType !== 'All' ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.fabrics.length > 0 ||
    filters.priceRange[0] !== INITIAL_PRICE_BOUNDS[0] ||
    filters.priceRange[1] !== INITIAL_PRICE_BOUNDS[1];

  if (!hasActiveFilters) return null;

  const currentCategory = CATEGORIES.find((c) => c.slug === filters.category);

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2.5">
      <span className="text-xs text-ink-muted mr-1 font-medium">Active:</span>

      {/* Feeding Type */}
      {filters.feedingType !== 'All' && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-xs font-semibold">
          <span>{filters.feedingType === 'Feeding' ? '🤱 Feeding-Friendly' : '✨ Regular Fit'}</span>
          <button
            onClick={() => onFilterChange({ ...filters, feedingType: 'All' })}
            className="hover:text-brand-950 p-0.5"
            aria-label="Remove feeding filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Category (if not locked) */}
      {!lockCategory && currentCategory && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ivory-200 text-ink-primary border border-ivory-300 text-xs font-semibold">
          <span>{currentCategory.name}</span>
          <button
            onClick={() => onFilterChange({ ...filters, category: null })}
            className="hover:text-brand-700 p-0.5"
            aria-label="Remove category filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Sizes */}
      {filters.sizes.map((size) => (
        <span
          key={size}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ivory-200 text-ink-primary border border-ivory-300 text-xs font-semibold"
        >
          <span>Size: {size}</span>
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                sizes: filters.sizes.filter((s) => s !== size),
              })
            }
            className="hover:text-brand-700 p-0.5"
            aria-label={`Remove size ${size} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Colors */}
      {filters.colors.map((colorId) => {
        const color = colorMap.get(colorId);
        return (
          <span
            key={colorId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ivory-200 text-ink-primary border border-ivory-300 text-xs font-semibold"
          >
            {color?.hex && (
              <span
                className="w-2.5 h-2.5 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
            )}
            <span>{color?.name || colorId}</span>
            <button
              onClick={() =>
                onFilterChange({
                  ...filters,
                  colors: filters.colors.filter((c) => c !== colorId),
                })
              }
              className="hover:text-brand-700 p-0.5"
              aria-label={`Remove colour filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        );
      })}

      {/* Fabrics */}
      {filters.fabrics.map((fabric) => (
        <span
          key={fabric}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ivory-200 text-ink-primary border border-ivory-300 text-xs font-semibold"
        >
          <span>{fabric}</span>
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                fabrics: filters.fabrics.filter((f) => f !== fabric),
              })
            }
            className="hover:text-brand-700 p-0.5"
            aria-label={`Remove fabric ${fabric} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Price Range */}
      {(filters.priceRange[0] !== INITIAL_PRICE_BOUNDS[0] ||
        filters.priceRange[1] !== INITIAL_PRICE_BOUNDS[1]) && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ivory-200 text-ink-primary border border-ivory-300 text-xs font-semibold">
          <span>
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </span>
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                priceRange: INITIAL_PRICE_BOUNDS,
              })
            }
            className="hover:text-brand-700 p-0.5"
            aria-label="Reset price filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 ml-1 underline decoration-brand-200 underline-offset-2"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

