import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { HERO_SLIDES, HeroSlide } from '../../data/banners';
import { CUSTOMER_REVIEWS, CustomerReview } from '../../data/reviews';
import { Product, Category, ClothingType, ProductColor, ProductSize, ProductVariant } from '../../types/product';
import { DjangoProductResponse } from '../../types/api';

export interface ProductFilterParams {
  category?: string;
  clothingType?: ClothingType;
  handstock?: boolean;
  search?: string;
  sortBy?: 'popular' | 'bestseller' | 'newest' | 'price-low' | 'price-high';
}

/** Normalizes a Django REST API product payload (including dynamic MRP, SP, discount & ratings) into Product. */
export function mapDjangoProduct(dto: DjangoProductResponse): Product {
  const sp = Number(dto.price);
  const mrpRaw = dto.mrp ?? dto.original_price;
  const originalPrice = mrpRaw ? Number(mrpRaw) : null;
  const discountPercentage =
    dto.discount_percentage ??
    (originalPrice && originalPrice > sp ? Math.round(((originalPrice - sp) / originalPrice) * 100) : undefined);

  const hasFeeding = dto.variants.some((v) => v.clothing_type === 'feeding');
  const hasNonFeeding = dto.variants.some((v) => v.clothing_type === 'non_feeding');
  const feedingConfig =
    hasFeeding && hasNonFeeding ? 'both' : hasFeeding ? 'feeding-only' : 'none';

  const colorMap = new Map<string, ProductColor>();
  const sizeSet = new Set<ProductSize>();
  const variants: ProductVariant[] = dto.variants.map((v) => {
    const colorId = String(v.color.id);
    if (!colorMap.has(colorId)) {
      colorMap.set(colorId, { id: colorId, name: v.color.name, hex: v.color.hex_code });
    }
    const size = v.size.name as ProductSize;
    sizeSet.add(size);
    return {
      id: String(v.id),
      sku: v.sku,
      clothingType: v.clothing_type === 'feeding' ? 'Feeding' : 'Non-Feeding',
      color: { id: colorId, name: v.color.name, hex: v.color.hex_code },
      size,
      price: Number(v.final_price || sp),
      originalPrice,
      stock: v.stock,
      inStock: v.stock > 0,
    };
  });

  return {
    id: String(dto.id),
    title: dto.title,
    slug: dto.slug,
    skuPrefix: dto.sku,
    category: dto.category.slug,
    categoryName: dto.category.name,
    price: sp,
    originalPrice,
    discountPercentage,
    rating: dto.rating,
    reviewCount: dto.review_count,
    images: [...dto.images].sort((a, b) => a.order - b.order).map((img) => img.image),
    feedingConfig,
    supportedClothingTypes:
      feedingConfig === 'both'
        ? ['Feeding', 'Non-Feeding']
        : feedingConfig === 'feeding-only'
        ? ['Feeding']
        : [],
    availableColors: Array.from(colorMap.values()),
    availableSizes: Array.from(sizeSet),
    variants,
    description: dto.description,
    fabric: dto.fabric,
    careInstructions: dto.care_instructions ? dto.care_instructions.split('\n').filter(Boolean) : [],
    isNewArrival: dto.is_new_arrival,
    isBestseller: dto.is_best_seller,
    isFeatured: dto.is_best_seller,
    isHandstock: dto.is_handstock,
  };
}

/**
 * Service layer ready for Django REST Framework.
 * In Phase 1 it cleanly wraps the centralized mock store.
 * In Stage 5, axios / fetch calls will replace the mock resolvers without changing any component code!
 */
export const storeApi = {
  async getCategories(): Promise<Category[]> {
    // Simulated network latency
    return new Promise((resolve) => {
      setTimeout(() => resolve([...CATEGORIES]), 50);
    });
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = CATEGORIES.find((c) => c.slug === slug);
    return category || null;
  },

  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    let result = [...PRODUCTS];

    if (params?.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === params.category?.toLowerCase() || p.slug === params.category
      );
    }

    if (params?.clothingType) {
      result = result.filter((p) => p.supportedClothingTypes.includes(params.clothingType!));
    }

    if (params?.handstock) {
      result = result.filter((p) => Boolean(p.isHandstock));
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'bestseller':
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
        case 'popular':
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  },

  async getBestsellers(): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isFeatured);
  },

  async getNewArrivals(): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isNewArrival || p.badge === 'New Arrival');
  },

  async getHeroSlides(): Promise<HeroSlide[]> {
    return [...HERO_SLIDES];
  },

  async getReviews(): Promise<CustomerReview[]> {
    return [...CUSTOMER_REVIEWS];
  },

  async getSiteConfig() {
    return {
      shipping_policy: 'Official shipping rates to be confirmed by client upon launch',
      tax_percentage: 0,
      currency: 'INR',
      currencySymbol: '₹',
    };
  },
};

