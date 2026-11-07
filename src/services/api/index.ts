import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { HERO_SLIDES, HeroSlide } from '../../data/banners';
import { CUSTOMER_REVIEWS, CustomerReview } from '../../data/reviews';
import { Product, Category, ClothingType } from '../../types/product';

export interface ProductFilterParams {
  category?: string;
  clothingType?: ClothingType;
  search?: string;
  sortBy?: 'popular' | 'newest' | 'price-low' | 'price-high';
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
      shipping_fee: 79,
      free_shipping_threshold: 999,
      tax_percentage: 0,
      currency: 'INR',
      currencySymbol: '₹',
    };
  },
};

