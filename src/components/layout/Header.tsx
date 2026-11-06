import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, ChevronDown, User, Sparkles, LogOut } from 'lucide-react';
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
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
        isScrolled ? 'shadow-soft py-2.5' : 'py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button & Search Shortcut */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open mobile menu"
              className="p-2 -ml-2 text-ink-primary hover:text-brand-700 transition-colors rounded-lg hover:bg-ivory-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              className="p-2 text-ink-primary hover:text-brand-700 transition-colors rounded-lg hover:bg-ivory-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo Placeholder */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <a href="#" className="group inline-block focus:outline-none">
              <span className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.12em] text-brand-700 block transition-colors group-hover:text-brand-900 uppercase">
                {theme.brandName}
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-ink-secondary block uppercase font-medium -mt-0.5">
                {theme.brandTagline}
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-ink-primary">
            <a
              href="#"
              className="hover:text-brand-700 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Home
            </a>

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
                <span>Shop by Category</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-brand-700' : ''
                  }`}
                />
              </button>

              {/* Category Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-ivory-300 rounded-xl shadow-dropdown py-3 px-2 mt-1 animate-slide-down">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted border-b border-ivory-200 mb-2 flex items-center justify-between">
                    <span>All 8 Collections</span>
                    <span className="text-brand-700 font-medium">Feeding Available</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CATEGORIES.map((category) => (
                      <a
                        key={category.id}
                        href={`#category-${category.slug}`}
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
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#feeding-highlight"
              className="hover:text-brand-700 transition-colors py-1 flex items-center gap-1.5 font-semibold text-brand-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Feeding Friendly</span>
            </a>

            <a href="#bestsellers" className="hover:text-brand-700 transition-colors py-1">
              Bestsellers
            </a>

            <a href="#new-arrivals" className="hover:text-brand-700 transition-colors py-1">
              New Arrivals
            </a>

            <a href="#about-us" className="hover:text-brand-700 transition-colors py-1">
              About
            </a>
          </nav>

          {/* Desktop Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3 text-ink-primary">
            {/* Desktop Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-200/80 hover:bg-ivory-200 text-ink-secondary hover:text-ink-primary transition-colors text-xs border border-ivory-300"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="pr-2">Search feeding kurtis, frocks...</span>
            </button>

            {/* Wishlist */}
            <a
              href="#wishlist"
              aria-label="Wishlist"
              className="p-2 hover:text-brand-700 transition-colors relative rounded-full hover:bg-ivory-200"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* Account / User with Google Auth Status */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div
                  className="flex items-center gap-1.5 cursor-pointer p-1 rounded-full hover:bg-ivory-200"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-brand-700"
                    title={user.name}
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-ink-secondary hidden sm:block" />
                </div>
              ) : (
                <button
                  aria-label="Sign in"
                  onClick={() => openAuthModal()}
                  className="p-2 hover:text-brand-700 transition-colors rounded-full hover:bg-ivory-200 hidden sm:block"
                  title="Sign In with Google"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && user && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-ivory-300 rounded-xl shadow-dropdown py-2 z-50 animate-slide-down">
                  <div className="px-3 py-1.5 border-b border-ivory-200">
                    <p className="text-xs font-bold text-ink-primary truncate">{user.name}</p>
                    <p className="text-[10px] text-ink-muted truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Icon & Counter */}
            <button
              onClick={onOpenCart}
              aria-label="Open Cart"
              className="p-2 hover:text-brand-700 transition-colors relative rounded-full hover:bg-ivory-200 flex items-center gap-1 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalItemsCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-brand-700 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                  {totalItemsCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs font-medium text-ink-secondary">₹0</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
