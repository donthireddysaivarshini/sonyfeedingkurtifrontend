import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../products/ProductCard';
import { Product, ClothingType } from '../../types/product';

interface FeaturedCollectionsProps {
  onQuickSelect: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  selectedCategorySlug?: string | null;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  onQuickSelect,
  onViewDetails,
  selectedCategorySlug,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'feeding' | 'bestsellers' | 'new-arrivals'>('bestsellers');
  const [clothingFilter, setClothingFilter] = useState<'All' | ClothingType>('All');

  // Filter products based on tab, category, and clothing type
  const filteredProducts = PRODUCTS.filter((product) => {
    // Category check
    if (selectedCategorySlug && product.category !== selectedCategorySlug) {
      return false;
    }

    // Clothing type filter
    if (clothingFilter !== 'All' && !product.supportedClothingTypes.includes(clothingFilter)) {
      return false;
    }

    // Tab check
    if (activeTab === 'feeding') {
      return product.supportedClothingTypes.includes('Feeding');
    }
    if (activeTab === 'bestsellers') {
      return product.isBestseller || product.badge === 'Bestseller' || product.badge === 'Feeding Essential';
    }
    if (activeTab === 'new-arrivals') {
      return product.isNewArrival || product.badge === 'New Arrival';
    }
    return true;
  });

  return (
    <section id="bestsellers" className="py-14 sm:py-20 bg-ivory-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Customer Favourites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary tracking-tight">
              Featured Ethnic Styles
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Handpicked designs blending effortless feeding access with royal Indian craftsmanship.
            </p>
          </div>

          {/* Clothing Type Quick Toggle Pill */}
          <div className="inline-flex p-1 bg-ivory-200 rounded-full border border-ivory-300 self-start md:self-auto">
            {(['All', 'Feeding', 'Non-Feeding'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setClothingFilter(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  clothingFilter === type
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {type === 'Feeding' ? '🤱 Feeding' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-4 border-b border-ivory-300 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'bestsellers', label: 'Bestselling Styles' },
            { id: 'feeding', label: 'Feeding Favourites' },
            { id: 'new-arrivals', label: 'New Arrivals 2026' },
            { id: 'all', label: 'All Collections' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-brand-700 text-brand-700'
                  : 'border-transparent text-ink-muted hover:text-ink-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickSelect={onQuickSelect}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-ivory-300 p-8">
            <p className="text-base font-semibold text-ink-primary">No products found in this filter</p>
            <p className="text-xs text-ink-muted mt-1">Try switching to "All Collections" or clearing category filters.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setClothingFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-brand-700 text-white text-xs font-semibold rounded-xl hover:bg-brand-800"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom View All Link */}
        <div className="mt-12 text-center">
          <a
            href="#categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-700 text-brand-700 font-semibold text-xs sm:text-sm hover:bg-brand-700 hover:text-white transition-all shadow-xs hover:shadow-md"
          >
            <span>Explore All 8 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

