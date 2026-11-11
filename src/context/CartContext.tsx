import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartState } from '../types/cart';

interface CartContextType extends CartState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  updateCartItemVariant: (oldId: string, updatedItem: CartItem) => void;
  clearCart: () => void;
  lastAddedItem: CartItem | null;
}

const CART_STORAGE_KEY = 'sony_feeding_kurtis_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // handle storage errors gracefully
    }
  }, [items]);

  // Demo session seeder for interface reviews
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (import.meta.env.DEV && params.get('demo') === '1' && items.length === 0) {
        const sampleItems: CartItem[] = [
          {
            id: 'nayantara-rose-flared-maxi-dupatta-set_Feeding_clr-maroon_L',
            productId: 'sfk-01',
            productTitle: 'Nayantara Magenta & Ombre Dupatta Kurti Set',
            productSlug: 'nayantara-rose-flared-maxi-dupatta-set',
            productImage: '/images/kurti-dupatta/magenta-ombre-kurti-dupatta.jpg',
            category: 'Kurti + Dupatta',
            variantId: 'var-nayantara-feeding-maroon-l',
            sku: 'SFK-NAY-F-MRN-L',
            clothingType: 'Feeding',
            selectedColor: { id: 'clr-maroon', name: 'Deep Maroon', hex: '#800020' },
            selectedSize: 'L',
            price: 1499,
            originalPrice: 1999,
            quantity: 1,
            maxStock: 5,
          },
          {
            id: 'kalyani-tiered-gathered-feeding-frock_Feeding_clr-mustard_M',
            productId: 'sfk-02',
            productTitle: 'Kalyani Peacock-Teal Zari-Border Tiered Feeding Frock',
            productSlug: 'kalyani-tiered-gathered-feeding-frock',
            productImage: '/images/frocks/teal-zari-tiered-frock.jpg',
            category: 'Frocks',
            variantId: 'var-kalyani-feeding-mustard-m',
            sku: 'SFK-KAL-F-MUS-M',
            clothingType: 'Feeding',
            selectedColor: { id: 'clr-mustard', name: 'Mustard Gold', hex: '#E1AD01' },
            selectedSize: 'M',
            price: 1299,
            originalPrice: 1699,
            quantity: 2,
            maxStock: 4,
          },
        ];
        setItems(sampleItems);
      }
    } catch {
      // storage or window check
    }
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === newItem.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = Math.min(existing.quantity + newItem.quantity, existing.maxStock || 10);
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      }

      return [...prevItems, newItem];
    });

    setLastAddedItem(newItem);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const updatedQty = item.quantity + delta;
            if (updatedQty <= 0) return null;
            const clamped = Math.min(updatedQty, item.maxStock || 10);
            return { ...item, quantity: clamped };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const setItemQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const clamped = Math.max(1, Math.min(quantity, item.maxStock || 10));
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const updateCartItemVariant = (oldId: string, updatedItem: CartItem) => {
    setItems((prevItems) => {
      // Check if target composite key already exists in another cart line
      const existingCollisionIndex = prevItems.findIndex(
        (item) => item.id === updatedItem.id && item.id !== oldId
      );

      if (existingCollisionIndex > -1) {
        // Merge with existing line and remove oldId line
        return prevItems
          .map((item, idx) => {
            if (idx === existingCollisionIndex) {
              const mergedQty = Math.min(
                item.quantity + updatedItem.quantity,
                updatedItem.maxStock || 10
              );
              return { ...item, quantity: mergedQty };
            }
            return item;
          })
          .filter((item) => item.id !== oldId);
      }

      // No collision: replace oldId with updatedItem in place
      return prevItems.map((item) => (item.id === oldId ? updatedItem : item));
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  // Unapproved ₹999 threshold and ₹79 fee removed; client courier rates pending launch confirmation
  const shippingFee = 0;
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        shippingFee,
        shippingNote: 'Official delivery rates to be confirmed upon launch',
        total,
        totalItemsCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setItemQuantity,
        updateCartItemVariant,
        clearCart,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

