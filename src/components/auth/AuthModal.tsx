import React, { useState } from 'react';
import { X, ShieldCheck, ShoppingBag, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, devLogin, loginWithGoogle } = useAuth();
  const { totalItemsCount, subtotal } = useCart();
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = async () => {
    const res = await loginWithGoogle();
    if (!res.success) {
      setGoogleNotice(res.message);
    }
  };

  const handleClose = () => {
    setGoogleNotice(null);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-ivory-300 overflow-hidden z-10 animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Customer Authentication
            </span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-1 rounded-full hover:bg-ivory-200 text-ink-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
              Sign In to Proceed
            </h3>
            <p className="text-xs text-ink-secondary mt-1 max-w-xs mx-auto">
              Google sign-in is required before checkout to link your order tracking, address book, and dispatch updates.
            </p>
          </div>

          {/* Cart Preservation Indicator */}
          {totalItemsCount > 0 && (
            <div className="p-3 bg-brand-50/80 border border-brand-200 rounded-xl flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink-primary truncate">
                    Shopping Bag ({totalItemsCount} items)
                  </p>
                  <p className="text-[10px] text-ink-secondary">
                    Total: <strong>₹{subtotal}</strong> • Safely preserved
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                Preserved
              </span>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleGoogleClick}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Google Notice on Click */}
            {googleNotice && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-left text-xs text-amber-900 leading-relaxed flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Backend Integration Point:</p>
                  <p className="text-[11px] text-amber-800">{googleNotice}</p>
                </div>
              </div>
            )}

            {/* Development Mode Review Session Sign-In (DEV BUILDS ONLY) */}
            {import.meta.env.DEV && (
              <div className="pt-2 border-t border-ivory-200 mt-2">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded mb-2">
                  Dev Build Only
                </span>
                <button
                  onClick={() => devLogin()}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md"
                >
                  <span>Continue with Test Session (Dev Only)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-ink-muted mt-1.5 flex items-center justify-center gap-1">
                  <Info className="w-3 h-3 text-brand-gold shrink-0" />
                  <span>Restricted to development builds. Never exposed in production.</span>
                </p>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-muted pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>Browsing and adding to bag do not require an account.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-ivory-50 border-t border-ivory-200 text-center text-[10px] text-ink-muted">
          Sony Collections • Secure Ecommerce Architecture
        </div>
      </div>
    </div>
  );
};
