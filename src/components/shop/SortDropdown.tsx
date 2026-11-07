import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { FilterState } from './FilterSidebar';

interface SortDropdownProps {
  value: FilterState['sortBy'];
  onChange: (newValue: FilterState['sortBy']) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative inline-flex items-center gap-1.5 w-full sm:w-auto">
      <div className="hidden sm:flex items-center gap-1 text-xs text-ink-secondary shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-ink-muted" />
        <span className="font-medium">Sort By:</span>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FilterState['sortBy'])}
        aria-label="Sort products by"
        className="w-full sm:w-auto text-xs font-semibold text-ink-primary bg-white border border-ivory-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-brand-700 shadow-xs cursor-pointer hover:border-ivory-400"
      >
        <option value="featured">Featured / Recommended</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest Additions</option>
      </select>
    </div>
  );
};

