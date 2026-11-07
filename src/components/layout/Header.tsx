import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, ChevronDown, User, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/categories';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMobileMenu,
  onOpenCart,
}) => {
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme } = useTheme();
  const { openAuthModal } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 bg-ivory-50/95 backdrop-blur-md border-b border-ivory-300/60 ${
        isScrolled ? 'shadow-soft py-2 sm:py-2.5' : 'py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 sm:gap-4">
          
          {/* Mobile Left: Menu Button & Search Shortcut */}
          <div className="flex items-center gap-0.5 lg:hidden shrink-0">
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open mobile menu"
              className="p-1 sm:p-1.5 text-ink-primary hover:text-brand-700 transition-colors rounded-lg hover:bg-ivory-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              className="p-1 sm:p-1.5 text-ink-primary hover:text-brand-700 transition-colors rounded-lg hover:bg-ivory-200"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Brand Logo Placeholder (Responsive & Fits Mobile Viewport) */}
          <div className="flex-1 min-w-0 text-center lg:text-left px-1">
            <Link to="/" className="group inline-block focus:outline-none">
              <span className="font-serif text-xs sm:text-lg lg:text-[24px] font-bold tracking-wide sm:tracking-wider text-brand-700 block transition-colors group-hover:text-brand-900 uppercase truncate">
                {theme.brandName}
              </span>
              <span className="hidden sm:block text-[9px] sm:text-[11px] tracking-widest text-ink-secondary uppercase font-medium -mt-0.5">
                {theme.brandTagline}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6 text-sm font-medium text-ink-primary">
            <Link
              to="/"
              className="hover:text-brand-700 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-brand-700 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Shop All
            </Link>

            {/* Shop by Category Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:text-brand-700 transition-colors py-1 focus:outline-none"
                onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-brand-700' : ''
                  }`}
                />
              </button>

              {/* Category Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-ivory-300 rounded-xl shadow-dropdown py-3 px-2 mt-1 animate-slide-down z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted border-b border-ivory-200 mb-2 flex items-center justify-between">
                    <span>All 8 Collections</span>
                    <span className="text-brand-700 font-medium">Feeding Available</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-ivory-100 transition-colors group"
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 rounded-full object-cover border border-ivory-300 group-hover:border-brand-700 transition-colors"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-primary group-hover:text-brand-700 truncate">
                            {category.name}
                          </p>
                          <p className="text-[11px] text-ink-muted truncate">{category.itemCount}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shop?clothingType=Feeding"
              className="hover:text-brand-700 transition-colors py-1 flex items-center gap-1.5 font-semibold text-brand-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Feeding Friendly</span>
            </Link>

            <Link to="/shop?sort=featured" className="hover:text-brand-700 transition-colors py-1">
              Featured Styles
            </Link>

            <Link to="/shop?sort=newest" className="hover:text-brand-700 transition-colors py-1">
              New Arrivals
            </Link>
          </nav>

          {/* Right Action Icons (Always Visible & Never Overflowing) */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-ink-primary shrink-0">
            {/* Desktop Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-200/80 hover:bg-ivory-200 text-ink-secondary hover:text-ink-primary transition-colors text-xs border border-ivory-300"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="pr-2">Search styles...</span>
            </button>

            {/* Wishlist */}
            <a
              href="#wishlist"
              aria-label="Wishlist"
              className="p-1.5 sm:p-2 hover:text-brand-700 transition-colors relative rounded-full hover:bg-ivory-200"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* Account / Sign-In Button */}
            <button
              aria-label="Sign In"
              onClick={() => openAuthModal()}
              className="p-1.5 sm:p-2 hover:text-brand-700 transition-colors rounded-full hover:bg-ivory-200 hidden sm:block"
              title="Google Sign In (Stage 5 Integration)"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Cart Icon & Counter */}
            <button
              onClick={onOpenCart}
              aria-label="Open Cart"
              className="p-1.5 sm:p-2 hover:text-brand-700 transition-colors relative rounded-full hover:bg-ivory-200 flex items-center gap-1 group"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform text-brand-700" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
