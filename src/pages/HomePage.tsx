import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategorySection } from '../components/home/CategorySection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProductSliderSection } from '../components/home/ProductSliderSection';
import { SocialProofBanner } from '../components/home/SocialProofBanner';
import { CustomerTestimonials } from '../components/home/CustomerTestimonials';
import { BrandPromiseSection } from '../components/home/BrandPromiseSection';
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Footer } from '../components/layout/Footer';
import { QuickSelectModal } from '../components/products/QuickSelectModal';
import { CartDrawer } from '../components/layout/CartDrawer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { CheckoutPreviewModal } from '../components/checkout/CheckoutPreviewModal';
import { Product, Category } from '../types/product';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { openCart } = useCart();

  // Dialog and drawer visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutPreviewOpen, setIsCheckoutPreviewOpen] = useState(false);
  
  // Selected product for variant modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const handleSelectCategory = (category: Category) => {
    navigate(`/category/${category.slug}`);
  };

  const handleQuickSelect = (product: Product) => {
    setSelectedProductForModal(product);
  };

  // 1. Dresses: Flared frocks, partywear gowns, 3-piece sets & anarkali dresses
  const dressProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) =>
      p.category === 'frocks' ||
      p.category === 'partywear-dresses' ||
      p.category === '3-piece-dresses' ||
      p.category === 'kurti-dupatta'
    );
  }, []);

  // 2. Kids Wear: Toddler frocks, mom-child twinning, pattu pavadai & kids kurta sets
  const kidsWearProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'kids-collections');
  }, []);

  // 3. Sarees: Traditional Kanchivaram silk, handloom linen zari & Banarasi sarees
  const sareeProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'sarees');
  }, []);

  // 4. New Arrivals: Fresh festive and seasonal launches
  const newArrivalProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.isNewArrival);
  }, []);

  // 5. Best Sellers: Customer-favorite sarees, frocks & feeding designs
  const bestSellerProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.isFeatured);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 w-full overflow-x-hidden selection:bg-maroon-100 selection:text-maroon-900">
      {/* 1. Continuous Marquee Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={openCart}
      />

      {/* Main Content Area Matching GSS Section Sequence */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Section 0: Widescreen Hero Banner Slider */}
        <HeroBanner />

        {/* Section 1: Browse Categories Circles (All 8 Sony Collections) */}
        <CategorySection onSelectCategory={handleSelectCategory} />

        {/* Section 2: Trust Badges Strip (3 Pillars) */}
        <WhyChooseUs />

        {/* Section 3: Sliding Carousel 1 — Dresses */}
        <ProductSliderSection
          id="dresses"
          title="Dresses"
          viewAllLink="/category/frocks"
          products={dressProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel="Trending"
        />

        {/* Section 4: Sliding Carousel 2 — Kids Wear */}
        <ProductSliderSection
          id="kids-wear"
          title="Kids Wear"
          viewAllLink="/category/kids-collections"
          products={kidsWearProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel="Festive"
        />

        {/* Section 5: Sliding Carousel 3 — Sarees */}
        <ProductSliderSection
          id="sarees"
          title="Sarees"
          viewAllLink="/category/sarees"
          products={sareeProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel="Pure Silk"
        />

        {/* Section 6: Sliding Carousel 4 — New Arrivals */}
        <ProductSliderSection
          id="new-arrivals"
          title="New Arrivals"
          viewAllLink="/shop?sort=newest"
          products={newArrivalProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel="New"
        />

        {/* Section 7: Sliding Carousel 5 — Best Sellers */}
        <ProductSliderSection
          id="best-sellers"
          title="Best Sellers"
          viewAllLink="/shop?sort=bestseller"
          products={bestSellerProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel="Best Seller"
        />

        {/* Section 6: Social Proof Strip */}
        <SocialProofBanner />

        {/* Section 7: Loved by our women (Customer Testimonials Carousel) */}
        <CustomerTestimonials />

        {/* Section 8: The Sony Promise (Maroon Stats Banner & CTA) */}
        <BrandPromiseSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={openCart}
        onOpenCategories={() => setIsMobileMenuOpen(true)}
      />

      {/* Overlays, Drawers & Modals */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutPreviewOpen(true)}
      />
      
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          setIsSearchOpen(false);
          navigate(`/product/${product.slug}`);
        }}
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
