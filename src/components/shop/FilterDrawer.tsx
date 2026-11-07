import React from 'react';
import { X } from 'lucide-react';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { Product } from '../../types/product';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  availableProducts: Product[];
  lockCategory?: boolean;
  matchingCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  availableProducts,
  lockCategory = false,
  matchingCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-right overflow-y-auto">
        {/* Top Bar with Close button */}
        <div className="p-4 border-b border-ivory-300 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
          <span className="font-serif text-base font-bold text-ink-primary">Refine Selection</span>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <FilterSidebar
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onReset}
          availableProducts={availableProducts}
          lockCategory={lockCategory}
          isMobileDrawer={true}
          onCloseMobileDrawer={onClose}
          matchingCount={matchingCount}
        />
      </div>
    </div>
  );
};

