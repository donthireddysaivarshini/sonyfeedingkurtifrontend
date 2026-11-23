import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface WishlistContextType {
  wishlist: string[]; // unique product IDs
  toggleWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  wishlistCount: number;
}

const WISHLIST_KEY = 'sony_feeding_kurtis_wishlist';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return Array.from(new Set(parsed.map((id) => String(id).trim()))).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // storage error
    }
  }, [wishlist]);

  const toggleWishlist = (rawId: string | number) => {
    const productId = String(rawId).trim();
    if (!productId) return;

    setWishlist((prev) => {
      const cleanPrev = Array.from(new Set(prev.map((id) => String(id).trim()))).filter(Boolean);
      if (cleanPrev.includes(productId)) {
        return cleanPrev.filter((id) => id !== productId);
      } else {
        return [...cleanPrev, productId];
      }
    });
  };

  const isInWishlist = (rawId: string | number): boolean => {
    const productId = String(rawId).trim();
    if (!productId) return false;
    return wishlist.some((id) => String(id).trim() === productId);
  };

  const uniqueWishlist = useMemo(() => {
    return Array.from(new Set(wishlist.map((id) => String(id).trim()))).filter(Boolean);
  }, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist: uniqueWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: uniqueWishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
