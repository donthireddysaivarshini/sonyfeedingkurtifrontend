import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, ChevronDown, User, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/categories';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMobileMenu,
  onOpenCart,
}) => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigate('/cart');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-300 border-b border-stone-200/80 ${
        isScrolled ? 'shadow-xs py-2 sm:py-2.5' : 'shadow-2xs py-2.5 sm:py-3.5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile Left: Menu Toggle & Search Button */}
          <div className="flex items-center gap-1 md:hidden shrink-0">
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open menu"
              className="p-1.5 text-stone-700 hover:text-maroon-700 transition-colors rounded-lg hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenSearch}
              aria-label="Search styles"
              className="p-1.5 text-stone-700 hover:text-maroon-700 transition-colors rounded-lg hover:bg-stone-100"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Brand Logo & Title (Matching GSS Clean Aesthetic with Official Sony Collections Emblem) */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link to="/" className="group flex items-center gap-2.5 focus:outline-none">
              <img
                src="/logo.jpeg"
                alt="Sony Collections Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover shadow-xs border border-amber-300/60 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-stone-900 group-hover:text-maroon-800 transition-colors uppercase leading-tight truncate">
                  Sony Collections
                </span>
                <span className="hidden sm:block text-[10px] tracking-widest text-stone-500 uppercase font-semibold">
                  Elegant Wear for Every Moment
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-[13px] font-semibold text-stone-800">
            <Link
              to="/"
              className="hover:text-maroon-700 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-maroon-700 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              All Products
            </Link>

            <Link
              to="/shop?clothingType=Feeding"
              className="hover:text-maroon-700 transition-colors py-1 flex items-center gap-1.5 text-maroon-800 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              <span>Feeding Kurtis</span>
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:text-maroon-700 transition-colors py-1 focus:outline-none"
                onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-maroon-800' : ''
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-stone-200 rounded-xl shadow-xl py-3 px-2 mt-1 animate-slide-down z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1.5 flex items-center justify-between">
                    <span>All 8 Collections</span>
                    <span className="text-maroon-700 font-semibold">Feeding Options</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-50 transition-colors group"
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 group-hover:border-maroon-700 transition-colors"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-800 group-hover:text-maroon-800 truncate">
                            {category.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">{category.itemCount}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shop?sort=bestseller"
              className="hover:text-maroon-700 transition-colors py-1 text-stone-800"
            >
              Best Sellers
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-stone-800 shrink-0">
            {/* Desktop Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 transition-colors text-xs border border-stone-200"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="pr-2 font-medium">Search kurtis, frocks...</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/account"
              aria-label="Wishlist"
              className="p-1.5 sm:p-2 hover:text-maroon-800 transition-colors relative rounded-full hover:bg-stone-100"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700 hover:text-maroon-800" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              to="/account"
              aria-label="My Account"
              className="p-1.5 sm:p-2 hover:text-maroon-800 transition-colors rounded-full hover:bg-stone-100 hidden sm:block relative"
              title={isAuthenticated ? `Account (${user?.name})` : "My Account"}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" />
              {isAuthenticated && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
              )}
            </Link>

            {/* Cart Icon & Counter */}
            <button
              onClick={handleCartClick}
              aria-label="Open Cart"
              className="p-1.5 sm:p-2 hover:text-maroon-800 transition-colors relative rounded-full hover:bg-stone-100 flex items-center gap-1 group"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform text-stone-800" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-maroon-800 text-cream-50 text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-xs">
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
