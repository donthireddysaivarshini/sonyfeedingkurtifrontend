import { ClothingType, ProductColor, ProductSize } from './product';

export interface CartItem {
  id: string; // composite key: `${productId}_${clothingType || 'std'}_${colorId}_${size}`
  productId: string;
  productTitle: string;
  productSlug: string;
  productImage: string;
  category: string;
  
  // Selected Variant Details
  variantId: string;
  sku: string;
  clothingType?: ClothingType | null; // Optional if product has no feeding selection
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  
  // Pricing & Quantity
  price: number;
  originalPrice: number | null;
  quantity: number;
  maxStock: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
  totalItemsCount: number;
}
