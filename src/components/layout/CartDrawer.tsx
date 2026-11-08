import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, LogIn, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    totalItemsCount,
  } = useCart();

  const { isAuthenticated, openAuthModal } = useAuth();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    if (!isAuthenticated) {
      // Mandatory Google login before checkout. After auth, navigate to checkout!
      openAuthModal(() => {
        navigate('/checkout');
      }, '/checkout');
    } else {
      if (onProceedToCheckout) {
        onProceedToCheckout();
      } else {
        navigate('/checkout');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-ivory-300 flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
            <h3 className="font-serif text-lg font-bold text-ink-primary">
              Shopping Bag ({totalItemsCount})
            </h3>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Shipping Notice (No unconfirmed promises) */}
        <div className="px-4 py-2.5 bg-ivory-100 border-b border-ivory-200 text-xs text-ink-secondary flex items-center justify-between">
          <span>Pan-India Courier Delivery</span>
          <span className="text-[11px] font-semibold text-brand-700">Awaiting Confirmation</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-ivory-200 flex items-center justify-center text-ink-muted">
                <ShoppingBag className="w-8 h-8 text-brand-accent" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-ink-primary">Your bag is empty</h4>
                <p className="text-xs text-ink-secondary mt-1 max-w-xs">
                  Browse our collections of frocks, co-ords, sarees, and feeding-friendly kurtis.
                </p>
              </div>
              <Link
                to="/shop"
                onClick={closeCart}
                className="px-6 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-semibold hover:bg-brand-800 transition-colors shadow-sm inline-block"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 pb-4 border-b border-ivory-200 last:border-b-0"
              >
                {/* Thumbnail */}
                <img
                  src={item.productImage}
                  alt={item.productTitle}
                  className="w-20 h-26 object-cover rounded-lg border border-ivory-300 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-medium text-ink-primary line-clamp-1">
                        {item.productTitle}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        className="text-ink-light hover:text-rose-600 transition-colors p-1 -mr-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Clothing Type & Color/Size Details */}
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {item.clothingType ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.clothingType === 'Feeding'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-ivory-200 text-ink-secondary border border-ivory-300'
                          }`}
                        >
                          {item.clothingType === 'Feeding' ? '🤱 Feeding-Friendly' : 'Non-Feeding'}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-ivory-200 text-ink-secondary px-2 py-0.5 rounded-full border border-ivory-300">
                          Standard Fit
                        </span>
                      )}
                      
                      <span className="text-[11px] text-ink-muted flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span className="text-[11px] text-ink-muted">
                        Size: <strong>{item.selectedSize}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    {/* Stepper */}
                    <div className="flex items-center border border-ivory-300 rounded-lg overflow-hidden bg-ivory-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-ivory-200 text-ink-secondary transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-ink-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-ivory-200 text-ink-secondary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-ink-primary">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 border-t border-ivory-300 bg-ivory-50/70 space-y-3">
            <div className="space-y-1.5 text-xs text-ink-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink-primary">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Policy</span>
                <span className="font-semibold text-ink-secondary text-[11px]">
                  Awaiting Confirmation
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-ink-primary pt-1.5 border-t border-ivory-200">
                <span>Estimated Total</span>
                <span className="text-brand-700 text-base">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all hover:shadow-lg"
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

            <Link
              to="/cart"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-brand-700 hover:text-brand-900 border border-brand-200 hover:bg-brand-50 rounded-xl transition-colors"
            >
              <span>View & Edit Full Bag</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] text-ink-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>Razorpay & Cash on Delivery (Provisional)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
