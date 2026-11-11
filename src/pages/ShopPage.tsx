import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { CheckoutPreviewModal } from '../components/checkout/CheckoutPreviewModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/products/ProductCard';
import { QuickSelectModal } from '../components/products/QuickSelectModal';
import { FilterSidebar, FilterState, INITIAL_FILTERS } from '../components/shop/FilterSidebar';
import { FilterDrawer } from '../components/shop/FilterDrawer';
import { SortDropdown } from '../components/shop/SortDropdown';
import { ActiveFilterPills } from '../components/shop/ActiveFilterPills';
import { filterAndSortProducts } from '../utils/filterProducts';
import { resolveCategorySlug } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { Product, ProductSize } from '../types/product';
import { useCart } from '../context/CartContext';

function parseFiltersFromParams(params: URLSearchParams): FilterState {
  const category = resolveCategorySlug(params.get('category'));
  const feedingParam = params.get('clothingType') || params.get('feeding');
  const feedingType: FilterState['feedingType'] =
    feedingParam === 'Feeding'
      ? 'Feeding'
      : feedingParam === 'Non-Feeding'
      ? 'Non-Feeding'
      : 'All';

  const sortParam = params.get('sort');
  const sortBy: FilterState['sortBy'] =
    sortParam === 'price-low'
      ? 'price-low'
      : sortParam === 'price-high'
      ? 'price-high'
      : sortParam === 'newest'
      ? 'newest'
      : 'featured';

  const sizes = (params.get('sizes')?.split(',').filter(Boolean) as ProductSize[]) || [];
  const colors = params.get('colors')?.split(',').filter(Boolean) || [];
  const fabrics = params.get('fabrics')?.split(',').filter(Boolean) || [];
  const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : 800;
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : 3000;

  return {
    category,
    feedingType,
    sizes,
    colors,
    fabrics,
    priceRange: [isNaN(minPrice) ? 800 : minPrice, isNaN(maxPrice) ? 3000 : maxPrice],
    sortBy,
  };
}

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openCart } = useCart();

  // Modals & drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCheckoutPreviewOpen, setIsCheckoutPreviewOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Initialize filter state from URL query parameters
  const [filters, setFilters] = useState<FilterState>(() => parseFiltersFromParams(searchParams));

  // Sync state if URL query params change externally (e.g. back/forward navigation)
  useEffect(() => {
    setFilters(parseFiltersFromParams(searchParams));
  }, [searchParams]);

  // Compute filtered and sorted products
  const matchingProducts = useMemo(() => {
    return filterAndSortProducts(PRODUCTS, filters);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    const newParams = new URLSearchParams();
    if (newFilters.category) newParams.set('category', newFilters.category);
    if (newFilters.feedingType !== 'All') newParams.set('clothingType', newFilters.feedingType);
    if (newFilters.sizes.length > 0) newParams.set('sizes', newFilters.sizes.join(','));
    if (newFilters.colors.length > 0) newParams.set('colors', newFilters.colors.join(','));
    if (newFilters.fabrics.length > 0) newParams.set('fabrics', newFilters.fabrics.join(','));
    if (newFilters.priceRange[0] > 800) newParams.set('minPrice', String(newFilters.priceRange[0]));
    if (newFilters.priceRange[1] < 3000) newParams.set('maxPrice', String(newFilters.priceRange[1]));
    if (newFilters.sortBy !== 'featured') newParams.set('sort', newFilters.sortBy);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={openCart}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Shop All Collections' }]} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        
        {/* Page Banner / Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left border-b border-ivory-300 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Curated Ethnic Wardrobe</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary">
            Explore All Collections
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 max-w-2xl">
            Browse our complete selection of ethnic wear, frocks, dresses, sarees, co-ord sets, and thoughtfully engineered feeding-friendly designs.
          </p>
        </div>

        {/* Toolbar: Filter Toggle on Mobile, Count & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ivory-200">
          
          {/* Status count */}
          <div className="text-xs text-ink-muted">
            Showing <strong className="text-ink-primary font-bold">{matchingProducts.length}</strong> of{' '}
            {PRODUCTS.length} styles
          </div>

          {/* Controls: Mobile Filter Drawer Button & Sort */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-ivory-300 text-ink-primary font-semibold text-xs shadow-xs hover:border-brand-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-700" />
              <span>Filters</span>
              <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-800 text-[10px] font-bold flex items-center justify-center">
                {matchingProducts.length}
              </span>
            </button>

            <div className="flex-1 sm:flex-none">
              <SortDropdown
                value={filters.sortBy}
                onChange={(newSort) => handleFilterChange({ ...filters, sortBy: newSort })}
              />
            </div>
          </div>

        </div>

        {/* Active Filters Badges */}
        <ActiveFilterPills
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          availableProducts={PRODUCTS}
        />

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Desktop Filter Sidebar (1 col on lg) */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-ivory-300 shadow-card h-fit sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              availableProducts={PRODUCTS}
              matchingCount={matchingProducts.length}
            />
          </aside>

          {/* Product Grid Area (3 cols on lg) */}
          <section className="lg:col-span-3">
            {matchingProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {matchingProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickSelect={(p) => setSelectedProductForModal(p)}
                    onViewDetails={(p) => navigate(`/product/${p.slug}`)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State when no products match */
              <div className="bg-white rounded-2xl border border-ivory-300 p-8 sm:p-12 text-center shadow-card max-w-lg mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-primary mb-1">
                  No matching styles found
                </h3>
                <p className="text-xs text-ink-secondary mb-5 leading-relaxed">
                  We couldn't find any designs matching your exact combination of filters. Try broadening your criteria or reset all filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-700 text-white font-semibold text-xs shadow-md hover:bg-brand-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </section>

        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        availableProducts={PRODUCTS}
        matchingCount={matchingProducts.length}
      />

      {/* Quick Select Modal */}
      <QuickSelectModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutPreviewOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          navigate(`/product/${p.slug}`);
        }}
      />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCart={openCart}
      />

      {/* Checkout Preview Modal */}
      <CheckoutPreviewModal
        isOpen={isCheckoutPreviewOpen}
        onClose={() => setIsCheckoutPreviewOpen(false)}
      />
    </div>
  );
};
