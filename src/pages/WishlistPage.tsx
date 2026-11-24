import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/products/ProductCard';
import { QuickSelectModal } from '../components/products/QuickSelectModal';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { storeApi } from '../services/api';
import { Product } from '../types/product';
import { PRODUCTS } from '../data/products';

export const WishlistPage: React.FC = () => {
  const { wishlistCount, isInWishlist } = useWishlist();
  const { openCart } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    storeApi.getProducts().then((items) => {
      if (isMounted && items && items.length > 0) {
        setAllProducts(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const wishlistProducts = allProducts.filter((p) => isInWishlist(p.id, p.slug));

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={openCart}
      />

      <div className="hidden sm:block">
        <Breadcrumbs
          items={[
            { label: 'Shop', path: '/shop' },
            { label: 'My Wishlist' },
          ]}
        />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-ivory-300">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary flex items-center gap-2.5">
              <span>My Wishlist</span>
              <span className="text-sm font-sans font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink-secondary">
              Handcrafted ethnic kurtis and gowns saved to shop anytime.
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickSelect={(p) => setSelectedProductForModal(p)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 max-w-md mx-auto text-center px-4 py-12 rounded-2xl bg-white border border-ivory-300 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl font-bold text-ink-primary mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary mb-6 leading-relaxed">
              Explore our boutique collection of maternity feeding kurtis, festive gowns, and everyday ethnic wear to save your favorite styles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand-700 text-white font-semibold text-xs shadow-md hover:bg-brand-800 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore All Collections</span>
              </Link>
              <Link
                to="/shop?clothingType=Feeding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200 font-semibold text-xs hover:bg-brand-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                <span>Feeding Kurtis</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Quick Select Modal for adding directly to bag from wishlist */}
      <QuickSelectModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
      />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCart={openCart}
      />

      <Footer />
    </div>
  );
};
