import React, { useState, useEffect } from 'react';
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
import { Product, Category } from '../types/product';
import { PRODUCTS } from '../data/products';
import { HeroSlide } from '../data/banners';
import { storeApi } from '../services/api';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { openCart } = useCart();

  // Dialog and drawer visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Selected product for variant modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const handleSelectCategory = (category: Category) => {
    navigate(`/category/${category.slug}`);
  };

  const handleQuickSelect = (product: Product) => {
    setSelectedProductForModal(product);
  };

  // Live homepage sections loaded from Django REST Framework backend
  const [liveHomeData, setLiveHomeData] = useState<{
    heroSlides?: HeroSlide[];
    categories?: Category[];
    sectionsMeta?: Record<
      string,
      {
        id: number;
        title: string;
        slug: string;
        subtitle?: string;
        badge_label?: string;
        view_all_link?: string;
        direction?: string;
        display_order?: number;
      }
    >;
    sections: {
      feedingCollection: Product[];
      handstock: Product[];
      sarees: Product[];
      kidsWear: Product[];
      newArrivals: Product[];
      bestSellers: Product[];
    };
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    storeApi.getHomeData().then((data) => {
      if (isMounted && data) {
        setLiveHomeData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Feeding & Non-Feeding Section:
  const feedingCollectionProducts = React.useMemo(() => {
    if (liveHomeData?.sections?.feedingCollection && liveHomeData.sections.feedingCollection.length > 0) {
      return liveHomeData.sections.feedingCollection;
    }
    const preferredOrder = ['prod-26', 'prod-29', 'prod-27', 'prod-5', 'prod-1', 'prod-2', 'prod-4', 'prod-10'];
    const filtered = PRODUCTS.filter(
      (p) => p.feedingConfig === 'both' || p.feedingConfig === 'feeding-only'
    );
    return [...filtered].sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.id);
      const idxB = preferredOrder.indexOf(b.id);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
  }, [liveHomeData]);

  // 2. Handstock: Ready-to-dispatch inventory
  const handstockProducts = React.useMemo(() => {
    if (liveHomeData?.sections?.handstock && liveHomeData.sections.handstock.length > 0) {
      return liveHomeData.sections.handstock;
    }
    return PRODUCTS.filter((p) => Boolean(p.isHandstock));
  }, [liveHomeData]);

  // 3. Sarees: Traditional Kanchivaram silk, handloom cotton-silk, Paithani & Banarasi sarees
  const sareeProducts = React.useMemo(() => {
    if (liveHomeData?.sections?.sarees && liveHomeData.sections.sarees.length > 0) {
      return liveHomeData.sections.sarees;
    }
    const order = ['prod-6', 'prod-24', 'prod-25', 'prod-17', 'prod-14', 'prod-18'];
    return PRODUCTS.filter((p) => p.category === 'sarees').sort(
      (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
    );
  }, [liveHomeData]);

  // 4. Kids Wear: Toddler frocks, mom-child twinning, pattu pavadai & kids kurta sets
  const kidsWearProducts = React.useMemo(() => {
    if (liveHomeData?.sections?.kidsWear && liveHomeData.sections.kidsWear.length > 0) {
      return liveHomeData.sections.kidsWear;
    }
    return PRODUCTS.filter((p) => p.category === 'kids-collections');
  }, [liveHomeData]);

  // 5. New Arrivals: Fresh festive and seasonal launches
  const newArrivalProducts = React.useMemo(() => {
    if (liveHomeData?.sections?.newArrivals && liveHomeData.sections.newArrivals.length > 0) {
      return liveHomeData.sections.newArrivals;
    }
    return PRODUCTS.filter((p) => p.isNewArrival);
  }, [liveHomeData]);

  // 6. Best Sellers: Customer-favorite sarees, frocks & feeding designs
  const bestSellerProducts = React.useMemo(() => {
    if (liveHomeData?.sections?.bestSellers && liveHomeData.sections.bestSellers.length > 0) {
      return liveHomeData.sections.bestSellers;
    }
    return PRODUCTS.filter((p) => p.isFeatured || p.isBestseller);
  }, [liveHomeData]);

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
        <HeroBanner slides={liveHomeData?.heroSlides} />

        {/* Section 1: Browse Categories Circles (All 8 Sony Collections) */}
        <CategorySection
          categories={liveHomeData?.categories}
          onSelectCategory={handleSelectCategory}
        />

        {/* Section 2: Trust Badges Strip (3 Pillars) */}
        <WhyChooseUs />

        {/* Section 3: Sliding Carousel 1 — Feeding & Non-Feeding (Floats Left) */}
        <ProductSliderSection
          id="feeding-collection"
          title={liveHomeData?.sectionsMeta?.['feeding-collection']?.title || 'Feeding & Non-Feeding'}
          viewAllLink={liveHomeData?.sectionsMeta?.['feeding-collection']?.view_all_link || '/shop?section=feeding-collection'}
          products={feedingCollectionProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel={liveHomeData?.sectionsMeta?.['feeding-collection']?.badge_label || 'Feeding & Regular'}
          direction="left"
        />

        {/* Section 4: Sliding Carousel 2 — Handstock (Floats Right) */}
        <ProductSliderSection
          id="handstock"
          title={liveHomeData?.sectionsMeta?.['handstock']?.title || 'Handstocks'}
          viewAllLink={liveHomeData?.sectionsMeta?.['handstock']?.view_all_link || '/shop?section=handstock'}
          products={handstockProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel={liveHomeData?.sectionsMeta?.['handstock']?.badge_label || 'Ready to Ship'}
          direction="right"
        />

        {/* Section 5: Sliding Carousel 3 — Sarees (Floats Left) */}
        <ProductSliderSection
          id="sarees"
          title={liveHomeData?.sectionsMeta?.['sarees']?.title || 'Sarees'}
          viewAllLink={liveHomeData?.sectionsMeta?.['sarees']?.view_all_link || '/shop?section=sarees'}
          products={sareeProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel={liveHomeData?.sectionsMeta?.['sarees']?.badge_label || 'Pure Silk'}
          direction="left"
        />

        {/* Section 6: Sliding Carousel 4 — Kids Wear (Floats Right) */}
        <ProductSliderSection
          id="kids-wear"
          title={liveHomeData?.sectionsMeta?.['kids-wear']?.title || 'Kids Wear'}
          viewAllLink={liveHomeData?.sectionsMeta?.['kids-wear']?.view_all_link || '/shop?section=kids-wear'}
          products={kidsWearProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel={liveHomeData?.sectionsMeta?.['kids-wear']?.badge_label || 'Festive'}
          direction="right"
        />

        {/* Section 7: Sliding Carousel 5 — New Arrivals (Floats Left) */}
        <ProductSliderSection
          id="new-arrivals"
          title={liveHomeData?.sectionsMeta?.['new-arrivals']?.title || 'New Arrivals'}
          viewAllLink={liveHomeData?.sectionsMeta?.['new-arrivals']?.view_all_link || '/shop?section=new-arrivals'}
          products={newArrivalProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel={liveHomeData?.sectionsMeta?.['new-arrivals']?.badge_label || 'New'}
          direction="left"
        />

        {/* Section 8: Sliding Carousel 6 — Best Sellers (Floats Right) */}
        <ProductSliderSection
          id="best-sellers"
          title={liveHomeData?.sectionsMeta?.['best-sellers']?.title || 'Best Sellers'}
          viewAllLink={liveHomeData?.sectionsMeta?.['best-sellers']?.view_all_link || '/shop?section=best-sellers'}
          products={bestSellerProducts}
          onQuickSelect={handleQuickSelect}
          badgeLabel={liveHomeData?.sectionsMeta?.['best-sellers']?.badge_label || 'Best Seller'}
          direction="right"
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
      <CartDrawer />
      
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
    </div>
  );
};
