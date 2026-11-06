import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { FeedingHighlightBanner } from '../components/home/FeedingHighlightBanner';
import { MidBannerPromo } from '../components/home/MidBannerPromo';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CustomerTestimonials } from '../components/home/CustomerTestimonials';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { Footer } from '../components/layout/Footer';
import { QuickSelectModal } from '../components/products/QuickSelectModal';
import { CartDrawer } from '../components/layout/CartDrawer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { CheckoutPreviewModal } from '../components/checkout/CheckoutPreviewModal';
import { Product, Category } from '../types/product';
import { useCart } from '../context/CartContext';
import { X, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { openCart } = useCart();

  // Dialog and drawer visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutPreviewOpen, setIsCheckoutPreviewOpen] = useState(false);
  
  // Selected product for variant modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Active category filter (when user taps a category circle)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleSelectCategory = (category: Category) => {
    if (activeCategory?.id === category.id) {
      setActiveCategory(null); // Toggle off if already selected
    } else {
      setActiveCategory(category);
      // Smooth scroll to the products section
      const target = document.getElementById('bestsellers');
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickSelect = (product: Product) => {
    setSelectedProductForModal(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory w-full overflow-x-hidden">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={openCart}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 3. Hero Banner Slider */}
        <HeroBanner />

        {/* 4. Circular Category Presentation (All 8 Categories) */}
        <CategorySection
          onSelectCategory={handleSelectCategory}
          activeCategorySlug={activeCategory?.slug}
        />

        {/* Active Category Filter Indicator */}
        {activeCategory && (
          <div className="bg-brand-50 border-y border-brand-200 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-brand-900">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>
                  Showing styles for <strong>{activeCategory.name}</strong> ({activeCategory.itemCount})
                </span>
              </div>
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 bg-white px-2.5 py-1 rounded-full border border-brand-200 shadow-xs"
              >
                <span>Clear Filter</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5. Featured Collections / Product Cards */}
        <FeaturedCollections
          onQuickSelect={handleQuickSelect}
          selectedCategorySlug={activeCategory?.slug}
        />

        {/* 6. Educational Feeding Innovation Highlight Banner */}
        <FeedingHighlightBanner />

        {/* 7. Mid-Page Festive Promotional Banner */}
        <MidBannerPromo />

        {/* 8. Why Choose Us / Trust Pillars */}
        <WhyChooseUs />

        {/* 9. Real Customer Testimonials */}
        <CustomerTestimonials />

        {/* 10. Brand Story & Craftsmanship */}
        <BrandStorySection />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* Overlays, Drawers & Modals */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutPreviewOpen(true)}
      />
      
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProductForModal(product)}
      />

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCart={openCart}
      />

      <QuickSelectModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
      />

      <AuthModal />

      <CheckoutPreviewModal
        isOpen={isCheckoutPreviewOpen}
        onClose={() => setIsCheckoutPreviewOpen(false)}
      />
    </div>
  );
};
