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

// Global runtime lookup map between IDs and canonical Slugs to ensure 1:1 cross-referencing
const productKeyMap = new Map<string, string>();

// Initialize with static products
PRODUCTS.forEach((p) => {
  const canonical = p.slug.trim().toLowerCase();
  productKeyMap.set(String(p.id).trim().toLowerCase(), canonical);
  productKeyMap.set(canonical, canonical);
});

export function registerProductKeys(id?: string | number | null, slug?: string | null) {
  if (!id && !slug) return;
  const canonical = (slug || String(id)).trim().toLowerCase();
  if (id !== undefined && id !== null) {
    productKeyMap.set(String(id).trim().toLowerCase(), canonical);
  }
  if (slug) {
    productKeyMap.set(slug.trim().toLowerCase(), canonical);
  }
}

// Helper to canonicalize any product ID, mock ID, or slug into its canonical key (slug)
export function getCanonicalWishlistKey(rawIdOrSlug: string | number, optionalSlug?: string): string {
  if (optionalSlug && typeof optionalSlug === 'string' && optionalSlug.trim()) {
    const slugLower = optionalSlug.trim().toLowerCase();
    registerProductKeys(rawIdOrSlug, slugLower);
    return slugLower;
  }
  const str = String(rawIdOrSlug).trim().toLowerCase();
  if (!str) return '';

  // 1. Check runtime product key map
  if (productKeyMap.has(str)) {
    return productKeyMap.get(str)!;
  }

  // 2. Check if str is already a known slug in static PRODUCTS
  const bySlug = PRODUCTS.find((p) => p.slug.toLowerCase() === str);
  if (bySlug) {
    registerProductKeys(bySlug.id, bySlug.slug);
    return bySlug.slug.toLowerCase();
  }

  // 3. Check if str is a mock ID (e.g. 'prod-1') in static PRODUCTS
  const byMockId = PRODUCTS.find((p) => p.id.toLowerCase() === str);
  if (byMockId) {
    registerProductKeys(byMockId.id, byMockId.slug);
    return byMockId.slug.toLowerCase();
  }

  // 4. Fallback: return str
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

      // Register all backend products
      products.forEach((p) => {
        registerProductKeys(p.id, p.slug);
      });

      setWishlist((prev) => {
        const resolved = prev.map((item) => {
          const keyLower = String(item).trim().toLowerCase();
          return productKeyMap.get(keyLower) || getCanonicalWishlistKey(item);
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
    registerProductKeys(rawId, optionalSlug);
    const targetCanonical = getCanonicalWishlistKey(rawId, optionalSlug);
    const targetIdStr = String(rawId).trim().toLowerCase();
    const targetSlugStr = optionalSlug ? optionalSlug.trim().toLowerCase() : '';

    return wishlist.some((item) => {
      const itemLower = item.toLowerCase();
      const itemCanonical = productKeyMap.get(itemLower) || getCanonicalWishlistKey(itemLower);
      return (
        itemCanonical === targetCanonical ||
        itemLower === targetCanonical ||
        itemLower === targetSlugStr ||
        itemLower === targetIdStr
      );
    });
  };

  const toggleWishlist = (rawId: string | number, optionalSlug?: string) => {
    if (!rawId && !optionalSlug) return;
    registerProductKeys(rawId, optionalSlug);
    const targetCanonical = getCanonicalWishlistKey(rawId, optionalSlug);
    const targetIdStr = String(rawId).trim().toLowerCase();
    const targetSlugStr = optionalSlug ? optionalSlug.trim().toLowerCase() : '';

    setWishlist((prev) => {
      // Deduplicate previous entries first against known product keys
      const canonicalPrev = prev.map((item) => {
        const itemLower = item.toLowerCase();
        return productKeyMap.get(itemLower) || getCanonicalWishlistKey(itemLower);
      });

      const alreadyIn = canonicalPrev.some((itemCanonical, idx) => {
        const rawItem = prev[idx].toLowerCase();
        return (
          itemCanonical === targetCanonical ||
          rawItem === targetCanonical ||
          rawItem === targetSlugStr ||
          rawItem === targetIdStr
        );
      });

      let next: string[];
      if (alreadyIn) {
        // Remove this product completely
        next = canonicalPrev.filter((itemCanonical, idx) => {
          const rawItem = prev[idx].toLowerCase();
          if (itemCanonical === targetCanonical) return false;
          if (rawItem === targetCanonical) return false;
          if (rawItem === targetSlugStr) return false;
          if (rawItem === targetIdStr) return false;
          return true;
        });
      } else {
        // Add canonical key (strictly 1 entry per product)
        next = [...canonicalPrev, targetCanonical];
      }

      const deduplicatedNext = Array.from(new Set(next.filter(Boolean)));

      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(deduplicatedNext));
      } catch {
        // ignore storage error
      }
      return deduplicatedNext;
    });
  };

  const uniqueWishlist = useMemo(() => {
    const canonicals = wishlist
      .map((item) => {
        const itemLower = String(item).trim().toLowerCase();
        return productKeyMap.get(itemLower) || getCanonicalWishlistKey(itemLower);
      })
      .filter(Boolean);
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
