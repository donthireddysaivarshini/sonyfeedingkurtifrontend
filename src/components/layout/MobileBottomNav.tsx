import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenCategories: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenSearch,
  onOpenCart,
  onOpenCategories,
}) => {
  const location = useLocation();
  const { totalItemsCount } = useCart();

  const isHome = location.pathname === '/';
  const isShop = location.pathname.startsWith('/shop') || location.pathname.startsWith('/category');
  const isAccount = location.pathname.startsWith('/account');

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-lg md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
            isHome ? 'text-maroon-800 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform ${isHome ? 'scale-110' : ''}`}>
            <Home className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </Link>

        {/* 2. Categories */}
        <button
          type="button"
          onClick={onOpenCategories}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
            isShop ? 'text-maroon-800 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full">
            <Grid className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-medium tracking-tight">Categories</span>
        </button>

        {/* 3. Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center text-stone-500 transition-colors hover:text-stone-800"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full">
            <Search className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-medium tracking-tight">Search</span>
        </button>

        {/* 4. Bag */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Shopping Bag"
          className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center text-stone-500 transition-colors hover:text-stone-800"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full">
            <ShoppingBag className="h-5 w-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-maroon-800 px-1 text-[9px] font-bold text-white">
                {totalItemsCount}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium tracking-tight">Bag</span>
        </button>

        {/* 5. Account */}
        <Link
          to="/account"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
            isAccount ? 'text-maroon-800 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full">
            <User className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-medium tracking-tight">Account</span>
        </Link>
      </div>
    </nav>
  );
};
