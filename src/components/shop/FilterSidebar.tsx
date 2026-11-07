import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Product, ProductSize } from '../../types/product';
import { CATEGORIES } from '../../data/categories';

export interface FilterState {
  category: string | null;
  feedingType: 'All' | 'Feeding' | 'Non-Feeding';
  colors: string[];
  sizes: string[];
  fabrics: string[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
}

export const INITIAL_PRICE_BOUNDS: [number, number] = [800, 3000];

export const INITIAL_FILTERS: FilterState = {
  category: null,
  feedingType: 'All',
  colors: [],
  sizes: [],
  fabrics: [],
  priceRange: INITIAL_PRICE_BOUNDS,
  sortBy: 'featured',
};

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  availableProducts: Product[];
  lockCategory?: boolean;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  matchingCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableProducts,
  lockCategory = false,
  isMobileDrawer = false,
  onCloseMobileDrawer,
  matchingCount,
}) => {
  // Extract distinct fabrics actually present in available products
  const availableFabrics = React.useMemo(() => {
    const set = new Set<string>();
    availableProducts.forEach((p) => {
      if (p.fabric) set.add(p.fabric);
    });
    return Array.from(set).sort();
  }, [availableProducts]);

  // Extract distinct colors with hex actually present in available products
  const availableColors = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; hex: string }>();
    availableProducts.forEach((p) => {
      p.availableColors.forEach((c) => {
        if (!map.has(c.id)) {
          map.set(c.id, c);
        }
      });
    });
    return Array.from(map.values());
  }, [availableProducts]);

  // Extract sizes present in available in-stock variants
  const availableSizes = React.useMemo(() => {
    const sizeOrder: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
    const presentSizes = new Set<string>();
    availableProducts.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock > 0) {
          presentSizes.add(v.size);
        }
      });
    });
    return sizeOrder.filter((s) => presentSizes.has(s));
  }, [availableProducts]);

  const hasActiveFilters =
    (!lockCategory && filters.category !== null) ||
    filters.feedingType !== 'All' ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.fabrics.length > 0 ||
    filters.priceRange[0] !== INITIAL_PRICE_BOUNDS[0] ||
    filters.priceRange[1] !== INITIAL_PRICE_BOUNDS[1];

  const handleFeedingChange = (type: 'All' | 'Feeding' | 'Non-Feeding') => {
    onFilterChange({ ...filters, feedingType: type });
  };

  const handleCategoryChange = (catSlug: string) => {
    if (lockCategory) return;
    const newCat = filters.category === catSlug ? null : catSlug;
    onFilterChange({ ...filters, category: newCat });
  };

  const toggleColor = (colorId: string) => {
    const exists = filters.colors.includes(colorId);
    const newColors = exists
      ? filters.colors.filter((id) => id !== colorId)
      : [...filters.colors, colorId];
    onFilterChange({ ...filters, colors: newColors });
  };

  const toggleSize = (size: string) => {
    const exists = filters.sizes.includes(size);
    const newSizes = exists
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const toggleFabric = (fabric: string) => {
    const exists = filters.fabrics.includes(fabric);
    const newFabrics = exists
      ? filters.fabrics.filter((f) => f !== fabric)
      : [...filters.fabrics, fabric];
    onFilterChange({ ...filters, fabrics: newFabrics });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = Number(e.target.value);
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = val;
    if (index === 0 && val > newRange[1]) newRange[1] = val;
    if (index === 1 && val < newRange[0]) newRange[0] = val;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-5' : ''}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-ivory-300">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-primary">Filters</h3>
          <p className="text-xs text-ink-muted">
            {matchingCount} {matchingCount === 1 ? 'style' : 'styles'} found
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. Feeding Friendly Filter (Signature Feature) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Feeding Access</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: 'All', label: 'All Silhouettes' },
            { id: 'Feeding', label: '🤱 Feeding Friendly (Discreet Zips)' },
            { id: 'Non-Feeding', label: '✨ Regular Ethnic Fit' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleFeedingChange(opt.id as any)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                filters.feedingType === opt.id
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-ivory-100/80 hover:bg-ivory-200 text-ink-secondary hover:text-ink-primary border border-ivory-300'
              }`}
            >
              <span>{opt.label}</span>
              {filters.feedingType === opt.id && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Categories (Only shown if category is not locked to current category page) */}
      {!lockCategory && (
        <div className="space-y-2.5 pt-4 border-t border-ivory-200">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
            Category
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1">
            {CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'text-ink-secondary hover:bg-ivory-100 hover:text-ink-primary'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <span className="text-brand-700 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Sizes Filter */}
      {availableSizes.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-ivory-200">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
            Size
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`min-w-[40px] h-9 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-brand-700 text-white border-brand-700 shadow-xs scale-105'
                      : 'bg-white hover:bg-ivory-100 text-ink-secondary border-ivory-300'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Colours Filter */}
      {availableColors.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-ivory-200">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
            Colour
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto no-scrollbar pr-1">
            {availableColors.map((color) => {
              const isSelected = filters.colors.includes(color.id);
              return (
                <button
                  key={color.id}
                  onClick={() => toggleColor(color.id)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg text-xs transition-all border text-left ${
                    isSelected
                      ? 'bg-brand-50 border-brand-700 text-brand-900 font-semibold'
                      : 'bg-white border-ivory-300 text-ink-secondary hover:bg-ivory-100'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="truncate text-[11px]">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Fabric Filter */}
      {availableFabrics.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-ivory-200">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
            Fabric
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar pr-1">
            {availableFabrics.map((fabric) => {
              const isSelected = filters.fabrics.includes(fabric);
              return (
                <label
                  key={fabric}
                  className="flex items-center gap-2 text-xs text-ink-secondary hover:text-ink-primary cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFabric(fabric)}
                    className="rounded border-ivory-400 text-brand-700 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className={`truncate ${isSelected ? 'font-semibold text-brand-900' : ''}`}>
                    {fabric}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-ivory-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
            Price Range
          </label>
          <span className="text-xs font-bold text-brand-700">
            ₹{filters.priceRange[0]} — ₹{filters.priceRange[1]}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-[10px] text-ink-muted block mb-0.5">Min (₹)</span>
              <input
                type="number"
                min={INITIAL_PRICE_BOUNDS[0]}
                max={filters.priceRange[1]}
                step={50}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full text-xs p-1.5 rounded-lg border border-ivory-300 bg-white"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-ink-muted block mb-0.5">Max (₹)</span>
              <input
                type="number"
                min={filters.priceRange[0]}
                max={INITIAL_PRICE_BOUNDS[1]}
                step={50}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full text-xs p-1.5 rounded-lg border border-ivory-300 bg-white"
              />
            </div>
          </div>

          <input
            type="range"
            min={INITIAL_PRICE_BOUNDS[0]}
            max={INITIAL_PRICE_BOUNDS[1]}
            step={50}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            aria-label="Filter maximum price"
            className="w-full accent-brand-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Drawer Bottom Action */}
      {isMobileDrawer && (
        <div className="pt-6 border-t border-ivory-300">
          <button
            onClick={onCloseMobileDrawer}
            className="w-full py-3 bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-brand-800 transition-colors"
          >
            Show {matchingCount} {matchingCount === 1 ? 'Product' : 'Products'}
          </button>
        </div>
      )}
    </div>
  );
};
