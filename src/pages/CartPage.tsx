import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Edit2,
  ArrowLeft,
  Sparkles,
  Info,
  LogIn
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EditVariantModal } from '../components/cart/EditVariantModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types/cart';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    total,
    totalItemsCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { isAuthenticated, openAuthModal } = useAuth();

  // Modals & drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Mandatory Google Sign-in before checkout
      openAuthModal(() => {
        navigate('/checkout');
      }, '/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-ivory-300 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-brand-200">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
              <span>Review Bag Selection</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
              Your Shopping Bag
            </h1>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-ink-muted hover:text-rose-600 font-medium transition-colors"
              >
                Clear Bag
              </button>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-ivory-200 flex items-center justify-center mx-auto text-brand-accent shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-primary">
                Your shopping bag is empty
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 leading-relaxed">
                You haven't added any ethnic wear or feeding-friendly kurtis yet. Explore our curated collections to get started.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs shadow-md transition-all hover:shadow-lg"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Items Table / List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-ivory-300 shadow-card overflow-hidden divide-y divide-ivory-200">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${item.productSlug}`}
                      className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden border border-ivory-300 bg-ivory-100 shrink-0 block group"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block mb-0.5">
                              {item.category}
                            </span>
                            <Link
                              to={`/product/${item.productSlug}`}
                              className="font-serif text-base sm:text-lg font-bold text-ink-primary hover:text-brand-700 transition-colors line-clamp-1"
                            >
                              {item.productTitle}
                            </Link>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.productTitle} from cart`}
                            className="p-1.5 text-ink-light hover:text-rose-600 rounded-lg hover:bg-ivory-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variant Badges & Selections */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.clothingType ? (
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                item.clothingType === 'Feeding'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-ivory-100 text-ink-secondary border-ivory-300'
                              }`}
                            >
                              {item.clothingType === 'Feeding' ? '🤱 Feeding-Friendly' : '✨ Non-Feeding'}
                            </span>
                          ) : (
                            <span className="text-[11px] bg-ivory-100 text-ink-secondary px-2.5 py-0.5 rounded-full border border-ivory-300">
                              Standard Fit
                            </span>
                          )}

                          <span className="text-xs text-ink-secondary flex items-center gap-1.5 bg-ivory-50 px-2.5 py-0.5 rounded-lg border border-ivory-200">
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300 inline-block shrink-0"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span>{item.selectedColor.name}</span>
                          </span>

                          <span className="text-xs text-ink-secondary bg-ivory-50 px-2.5 py-0.5 rounded-lg border border-ivory-200">
                            Size: <strong className="text-ink-primary">{item.selectedSize}</strong>
                          </span>

                          {/* Quick Edit Variant Button */}
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-2.5 py-0.5 rounded-lg border border-brand-200 transition-colors ml-auto sm:ml-0"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Selection</span>
                          </button>
                        </div>

                        <div className="text-[11px] text-ink-muted mt-1 font-mono">
                          SKU: {item.sku}
                        </div>
                      </div>

                      {/* Quantity Stepper & Price Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-ivory-200">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-ink-muted font-medium">Quantity:</span>
                          <div className="inline-flex items-center rounded-xl border border-ivory-300 bg-ivory-50 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-primary hover:bg-ivory-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-ink-primary">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= item.maxStock}
                              aria-label="Increase quantity"
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-primary hover:bg-ivory-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {item.quantity >= item.maxStock && (
                            <span className="text-[10px] text-amber-700 font-semibold">
                              Max stock reached ({item.maxStock})
                            </span>
                          )}
                        </div>

                        {/* Price summary */}
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-ink-primary">
                            ₹{item.price * item.quantity}
                          </div>
                          <div className="text-[10px] text-ink-muted">
                            ₹{item.price} each
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Informative Shipping & Packaging Guidance */}
              <div className="p-4 bg-brand-50/70 border border-brand-200 rounded-2xl flex items-start gap-3 text-xs text-brand-900 leading-relaxed">
                <Sparkles className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Boutique Packaging Guidance:</strong> Every garment is individually inspected, carefully polybagged to prevent creases during transit, and shipped in durable outer packaging.
                </div>
              </div>
            </div>

            {/* Right Column: Order Financial Summary (4 cols) */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-ivory-200 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-ink-secondary">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({totalItemsCount} items)</span>
                    <span className="font-semibold text-ink-primary">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-ink-secondary text-[11px]">
                      Awaiting Confirmation
                    </span>
                  </div>

                  {/* Neutral Shipping Policy Note */}
                  <div className="text-[10px] text-ink-muted bg-ivory-100 p-2 rounded-lg border border-ivory-200 flex items-start gap-1.5 leading-tight">
                    <Info className="w-3 h-3 text-brand-gold shrink-0 mt-0.5" />
                    <span>Courier delivery policies and shipping charges are awaiting confirmation by Sony Collections upon official launch.</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-ink-primary pt-3 border-t border-ivory-200">
                    <span>Final Amount</span>
                    <span className="text-brand-900 text-lg">₹{total}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted text-right">
                    Inclusive of all applicable taxes
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white py-3.5 px-4 rounded-xl font-semibold text-sm shadow-md transition-all hover:shadow-lg"
                >
                  {isAuthenticated ? (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Google Sign In to Checkout</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-ivory-200 space-y-2 text-[11px] text-ink-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Razorpay UPI, Cards & NetBanking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Cash on Delivery (Provisional Support)</span>
                  </div>
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="text-center">
                <Link
                  to="/shop"
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
                >
                  ← Continue browsing more styles
                </Link>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => {}}
      />

      {/* Auth Modal */}
      <AuthModal />

      {/* Edit Variant Modal */}
      <EditVariantModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />
    </div>
  );
};

