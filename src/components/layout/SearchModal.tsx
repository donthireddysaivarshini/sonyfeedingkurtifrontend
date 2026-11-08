import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ChevronRight, Tag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES } from '../../data/categories';
import { Product } from '../../types/product';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Feeding' | 'Non-Feeding'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedFilter('All');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesQuery =
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(query.toLowerCase()) ||
      product.fabric.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All'
        ? true
        : product.supportedClothingTypes.includes(selectedFilter);

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-ivory-300 overflow-hidden z-10 animate-slide-down">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-ivory-300 flex items-center gap-3 bg-ivory-50/50">
          <Search className="w-5 h-5 text-brand-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kurtis, feeding frocks, sarees, coord sets..."
            className="w-full bg-transparent text-sm sm:text-base text-ink-primary placeholder:text-ink-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-ivory-200 rounded-full text-ink-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-ink-secondary hover:text-brand-700 rounded-lg hover:bg-ivory-200"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="px-4 py-2.5 bg-ivory-100/60 border-b border-ivory-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-ink-muted flex items-center gap-1 font-medium shrink-0">
            <Tag className="w-3 h-3" /> Filter:
          </span>
          {(['All', 'Feeding', 'Non-Feeding'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                selectedFilter === filter
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-white text-ink-secondary hover:bg-ivory-200 border border-ivory-300'
              }`}
            >
              {filter === 'Feeding' ? '🤱 Feeding Friendly' : filter}
            </button>
          ))}
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                Popular Categories
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setQuery(c.name)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-left transition-colors border border-ivory-200"
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-primary truncate">{c.name}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Dual Zip Feeding Kurti', 'Cotton Frocks', 'Organza Dupatta', 'Pure Silk Saree', '3-Piece Anarkali'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs px-3 py-1 bg-ivory-100 hover:bg-brand-100 hover:text-brand-800 rounded-full text-ink-secondary border border-ivory-200 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-ink-muted">
                Found {filteredProducts.length} style{filteredProducts.length > 1 ? 's' : ''}
              </p>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(product);
                    } else {
                      navigate(`/product/${product.slug}`);
                    }
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ivory-100 border border-transparent hover:border-ivory-300 transition-all cursor-pointer group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-14 h-18 object-cover rounded-lg border border-ivory-300 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {product.categoryName}
                      </span>
                      {product.supportedClothingTypes.includes('Feeding') && (
                        <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          Feeding
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-ink-primary group-hover:text-brand-700 truncate">
                      {product.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-ink-primary">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-ink-muted line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-ink-light group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-ink-primary">No matching products found</p>
              <p className="text-xs text-ink-muted mt-1">
                Try searching for "Kurti", "Frock", "Feeding", or "Cotton"
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

