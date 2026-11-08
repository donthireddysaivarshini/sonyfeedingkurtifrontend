import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Sparkles, ChevronRight, ShoppingBag, Grid, Heart, Phone, ShieldCheck, User, Search } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenCart, onOpenSearch }) => {
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  const { totalItemsCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  if (!isOpen) return null;

  const handleCartClick = () => {
    onClose();
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigate('/cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xs bg-ivory-50 h-full flex flex-col shadow-2xl z-10 animate-slide-right overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-ivory-300 flex items-center justify-between bg-white">
          <Link to="/" onClick={onClose} className="block">
            <span className="font-serif text-lg font-bold tracking-wider text-brand-700 block">
              SONY FEEDING KURTIS
            </span>
            <span className="text-[10px] tracking-widest text-ink-muted uppercase">
              Maternity & Ethnic Boutique
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Shop All Highlight */}
        <div className="p-3 bg-white border-b border-ivory-300 space-y-2">
          {onOpenSearch && (
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 hover:bg-ivory-100 transition-colors text-xs font-semibold text-ink-primary"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-700" />
                <span>Search Kurtis & Collections</span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted" />
            </button>
          )}

          <Link
            to="/shop"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-xl bg-brand-700 text-white font-semibold text-xs shadow-xs hover:bg-brand-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-brand-gold" />
              <span>Browse All Collections</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feeding Friendly Highlight Box */}
        <div className="p-3 bg-brand-50 border-b border-brand-100">
          <Link
            to="/shop?clothingType=Feeding"
            onClick={onClose}
            className="flex items-center gap-2.5 text-xs font-semibold text-brand-800 hover:text-brand-900"
          >
            <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            </span>
            <div className="flex-1">
              <p className="font-bold">Feeding-Friendly Collection</p>
              <p className="text-[10px] text-ink-secondary font-normal">Dual invisible concealed zips on both sides</p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-700" />
          </Link>
        </div>

        {/* Categories Section */}
        <div className="p-4 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-3">
            Shop by Category (8 Collections)
          </p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-ivory-200 transition-colors group"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-10 h-10 rounded-full object-cover border border-ivory-300 group-hover:border-brand-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary group-hover:text-brand-700">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-ink-muted">{cat.itemCount}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-light group-hover:text-brand-700" />
              </Link>
            ))}
          </div>

          <div className="my-4 border-t border-ivory-300 pt-3 space-y-1">
            <Link
              to="/shop?sort=featured"
              onClick={onClose}
              className="flex items-center justify-between p-2 text-sm font-medium text-ink-primary hover:bg-ivory-200 rounded-lg"
            >
              <span>Featured Ethnic Wear</span>
              <span className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-semibold">
                Curated
              </span>
            </Link>
            <Link
              to="/shop?sort=newest"
              onClick={onClose}
              className="flex items-center justify-between p-2 text-sm font-medium text-ink-primary hover:bg-ivory-200 rounded-lg"
            >
              <span>New Arrivals</span>
              <span className="text-xs text-brand-accent font-semibold">New</span>
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-ivory-300 bg-white space-y-2">
          {/* Account Shortcut */}
          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 hover:bg-ivory-100 transition-colors text-xs font-semibold text-ink-primary"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-700" />
              <span>{isAuthenticated ? `My Account (${user?.name?.split(' ')[0]})` : 'My Account / Sign In'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCartClick}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-700 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-800 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({totalItemsCount})</span>
            </button>
            <a
              href="#wishlist"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-ivory-300 text-ink-primary rounded-xl text-xs font-medium hover:bg-ivory-100"
            >
              <Heart className="w-4 h-4" />
              <span>{wishlistCount}</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-ink-secondary py-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-brand-700" />
            <span>Support details to be announced</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-muted pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
            <span>Pan-India Courier Delivery Service</span>
          </div>
        </div>

      </div>
    </div>
  );
};

