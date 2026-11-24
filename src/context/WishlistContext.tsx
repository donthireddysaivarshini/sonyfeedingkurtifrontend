import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { storeApi } from '../services/api';

interface WishlistContextType {
  wishlist: string[]; // unique canonical keys (slugs / IDs)
  toggleWishlist: (productIdOrSlug: string | number, productSlug?: string) => void;
  isInWishlist: (productIdOrSlug: string | number, productSlug?: string) => boolean;
  wishlistCount: number;
}

const WISHLIST_KEY = 'sony_feeding_kurtis_wishlist';

// Helper to canonicalize any product ID, mock ID, or slug into its canonical key (slug)
export function getCanonicalWishlistKey(rawIdOrSlug: string | number, optionalSlug?: string): string {
  if (optionalSlug && typeof optionalSlug === 'string' && optionalSlug.trim()) {
    return optionalSlug.trim().toLowerCase();
  }
  const str = String(rawIdOrSlug).trim().toLowerCase();
  if (!str) return '';

  // 1. Check if str is already a known slug in static PRODUCTS
  const bySlug = PRODUCTS.find((p) => p.slug.toLowerCase() === str);
  if (bySlug) return bySlug.slug.toLowerCase();

  // 2. Check if str is a mock ID (e.g. 'prod-1') in static PRODUCTS
  const byMockId = PRODUCTS.find((p) => p.id.toLowerCase() === str);
  if (byMockId) return byMockId.slug.toLowerCase();

  // 3. Fallback: return str
  return str;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const canonicalItems = parsed
          .map((id) => getCanonicalWishlistKey(id))
          .filter(Boolean);
        return Array.from(new Set(canonicalItems));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Reconcile and deduplicate with backend products to resolve any numeric backend IDs to slugs
  useEffect(() => {
    let isMounted = true;
    storeApi.getProducts().then((products) => {
      if (!isMounted || !products || products.length === 0) return;
      setWishlist((prev) => {
        const resolved = prev.map((item) => {
          const match = products.find(
            (p) => String(p.id) === String(item) || p.slug.toLowerCase() === item.toLowerCase()
          );
          return match ? match.slug.toLowerCase() : getCanonicalWishlistKey(item);
        });
        const deduplicated = Array.from(new Set(resolved.filter(Boolean)));
        try {
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(deduplicated));
        } catch {
          // ignore storage error
        }
        return deduplicated;
      });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // storage error
    }
  }, [wishlist]);

  const isInWishlist = (rawId: string | number, optionalSlug?: string): boolean => {
    if (!rawId && !optionalSlug) return false;
    const targetCanonical = getCanonicalWishlistKey(rawId, optionalSlug);
    const targetIdStr = String(rawId).trim().toLowerCase();
    const targetSlugStr = optionalSlug ? optionalSlug.trim().toLowerCase() : '';

    return wishlist.some((item) => {
      const itemLower = item.toLowerCase();
      return (
        itemLower === targetCanonical ||
        itemLower === targetSlugStr ||
        itemLower === targetIdStr ||
        getCanonicalWishlistKey(itemLower) === targetCanonical
      );
    });
  };

  const toggleWishlist = (rawId: string | number, optionalSlug?: string) => {
    if (!rawId && !optionalSlug) return;
    const targetCanonical = getCanonicalWishlistKey(rawId, optionalSlug);
    const targetIdStr = String(rawId).trim().toLowerCase();
    const targetSlugStr = optionalSlug ? optionalSlug.trim().toLowerCase() : '';

    setWishlist((prev) => {
      const alreadyIn = prev.some((item) => {
        const itemLower = item.toLowerCase();
        return (
          itemLower === targetCanonical ||
          itemLower === targetSlugStr ||
          itemLower === targetIdStr ||
          getCanonicalWishlistKey(itemLower) === targetCanonical
        );
      });

      let next: string[];
      if (alreadyIn) {
        // Remove this product completely (any representations)
        next = prev.filter((item) => {
          const itemLower = item.toLowerCase();
          if (itemLower === targetCanonical) return false;
          if (itemLower === targetSlugStr) return false;
          if (itemLower === targetIdStr) return false;
          if (getCanonicalWishlistKey(itemLower) === targetCanonical) return false;
          return true;
        });
      } else {
        // Add canonical key (strictly 1 entry per product)
        const keyToAdd = targetCanonical || targetSlugStr || targetIdStr;
        next = Array.from(new Set([...prev, keyToAdd]));
      }

      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const uniqueWishlist = useMemo(() => {
    const canonicals = wishlist.map((item) => getCanonicalWishlistKey(item)).filter(Boolean);
    return Array.from(new Set(canonicals));
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
