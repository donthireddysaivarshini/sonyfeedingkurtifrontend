import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Sparkles, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
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
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openCart } = useCart();

  // Modals & drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCheckoutPreviewOpen, setIsCheckoutPreviewOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Find category metadata
  const category = CATEGORIES.find((c) => c.slug === slug);

  // Products belonging to this category
  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === slug);
  }, [slug]);

  // Filters state (with category locked to current slug)
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    category: slug || null,
  }));

  // Re-sync filters if slug changes
  useEffect(() => {
    if (slug) {
      setFilters((prev) => ({
        ...prev,
        category: slug,
      }));
    }
  }, [slug]);

  // Matching filtered and sorted products
  const matchingProducts = useMemo(() => {
    return filterAndSortProducts(categoryProducts, filters);
  }, [categoryProducts, filters]);

  const handleResetFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
      category: slug || null,
    });
  };

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-ivory">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCart={openCart}
        />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-ink-primary mb-3">
            Category Not Found
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            The collection you are trying to view does not exist.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-700 text-white font-semibold text-xs shadow-md hover:bg-brand-800 transition-colors"
          >
            <span>Browse All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={openCart}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Shop', path: '/shop' },
          { label: category.name },
        ]}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        
        {/* Category Hero / Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 border border-ivory-300 bg-ivory-100 shadow-card">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Text Information */}
            <div className="p-6 sm:p-10 md:w-3/5 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider border border-brand-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>{category.tagline}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink-primary leading-tight">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-lg">
                {category.description}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-brand-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{categoryProducts.length} Signature Styles Available</span>
              </div>
            </div>

            {/* Category Imagery */}
            <div className="w-full md:w-2/5 h-48 md:h-64 overflow-hidden relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-ivory-100 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Toolbar: Filter Toggle on Mobile, Count & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ivory-200">
          
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-ivory-300 text-ink-primary font-semibold text-xs shadow-xs hover:border-brand-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-700" />
              <span>Filters</span>
              <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-800 text-[10px] font-bold flex items-center justify-center">
                {matchingProducts.length}
              </span>
            </button>

            <span className="text-xs text-ink-muted">
              Showing <strong className="text-ink-primary font-bold">{matchingProducts.length}</strong> of{' '}
              {categoryProducts.length} {category.name}
            </span>
          </div>

          <div className="flex items-center justify-end">
            <SortDropdown
              value={filters.sortBy}
              onChange={(newSort) => setFilters({ ...filters, sortBy: newSort })}
            />
          </div>

        </div>

        {/* Active Filters Badges */}
        <ActiveFilterPills
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          lockCategory={true}
          availableProducts={categoryProducts}
        />

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Desktop Filter Sidebar (locked to this category) */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-ivory-300 shadow-card h-fit sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              availableProducts={categoryProducts}
              lockCategory={true}
              matchingCount={matchingProducts.length}
            />
          </aside>

          {/* Product Grid Area */}
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
              /* Empty State */
              <div className="bg-white rounded-2xl border border-ivory-300 p-8 sm:p-12 text-center shadow-card max-w-lg mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-primary mb-1">
                  No {category.name} match these filters
                </h3>
                <p className="text-xs text-ink-secondary mb-5 leading-relaxed">
                  Try adjusting or clearing your size, color, or price range filters to see all available {category.name}.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-700 text-white font-semibold text-xs shadow-md hover:bg-brand-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Category Filters</span>
                </button>
              </div>
            )}
          </section>

        </div>

        {/* Other Categories Switcher at the bottom */}
        <section className="mt-16 pt-10 border-t border-ivory-300">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-wider font-bold text-brand-700 block mb-1">
              Explore More
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
              Other Ethnic Collections
            </h2>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 justify-start sm:justify-center">
            {CATEGORIES.filter((c) => c.slug !== slug).map((otherCat) => (
              <Link
                key={otherCat.id}
                to={`/category/${otherCat.slug}`}
                className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-ivory-300 hover:border-brand-700 hover:bg-ivory-100 transition-all text-xs font-semibold text-ink-primary shadow-2xs group"
              >
                <img
                  src={otherCat.image}
                  alt={otherCat.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="group-hover:text-brand-700">{otherCat.name}</span>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        availableProducts={categoryProducts}
        lockCategory={true}
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
