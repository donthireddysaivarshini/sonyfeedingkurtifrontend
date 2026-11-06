/**
 * SONY FEEDING KURTIS - Product Type System
 * 
 * Feeding / Non-Feeding is an OPTIONAL product-level configuration:
 * 1. 'both': Customer chooses Feeding or Non-Feeding -> Colour -> Size
 * 2. 'feeding-only': Dedicated nursing wear with built-in zips -> Colour -> Size
 * 3. 'none': Standard ethnic wear with no feeding option -> Colour -> Size
 */

export type ClothingType = 'Feeding' | 'Non-Feeding';

export type FeedingConfiguration = 'both' | 'feeding-only' | 'none';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  imageIndex?: number;
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | 'Free Size';

export interface ProductVariant {
  id: string;
  sku: string;
  clothingType?: ClothingType | null; // Optional when product feedingConfig is 'none'
  color: ProductColor;
  size: ProductSize;
  price: number;
  originalPrice: number | null;
  stock: number;
  inStock: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: string;
  description: string;
  tagline: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  skuPrefix: string;
  category: string;       // Matches one of the 8 category names/slugs
  categoryName: string;
  price: number;          // Base / Starting price
  originalPrice: number | null;
  discountPercentage?: number;
  badge?: 'Bestseller' | 'New Arrival' | 'Trending' | 'Festive Special' | 'Feeding Essential' | null;
  
  // High quality photography
  images: string[];
  
  // Optional Feeding Configuration
  feedingConfig: FeedingConfiguration;
  supportedClothingTypes: ClothingType[];
  
  // Available variant dimensions
  availableColors: ProductColor[];
  availableSizes: ProductSize[];
  
  // Granular variant combinations for inventory & cart
  variants: ProductVariant[];
  
  // Product details
  description: string;
  fabric: string;
  careInstructions: string[];
  feedingDetails?: {
    zipType: string;
    zipPlacement: string;
    description: string;
  };
  
  // Reviews & ratings are optional (populated post-launch)
  rating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
  
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
}
