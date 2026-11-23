import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { HERO_SLIDES, HeroSlide } from '../../data/banners';
import { CUSTOMER_REVIEWS, CustomerReview } from '../../data/reviews';
import { Product, Category, ClothingType, ProductColor, ProductSize, ProductVariant, ProductGalleryImage, FeedingConfiguration, ProductReview } from '../../types/product';
import { DjangoProductResponse } from '../../types/api';
import { apiClient } from '../apiClient';
import { getImageUrl } from '../../utils/imageUrl';

export interface ProductFilterParams {
  category?: string;
  clothingType?: ClothingType;
  handstock?: boolean;
  section?: string;
  search?: string;
  sortBy?: 'popular' | 'bestseller' | 'newest' | 'price-low' | 'price-high';
}

/** Normalizes a Django REST API product payload (including dynamic MRP, SP, discount & ratings) into Product. */
export const normalizeClothingType = (val: string | null | undefined): ClothingType | null => {
  if (!val) return null;
  const lower = String(val).toLowerCase().replace(/_/g, '-');
  if (lower === 'feeding') return 'Feeding';
  if (lower === 'non-feeding') return 'Non-Feeding';
  return null;
};

export function mapDjangoProduct(dto: DjangoProductResponse): Product {
  const sp = Number(dto.price);
  const mrpRaw = dto.mrp ?? dto.original_price;
  const originalPrice = mrpRaw ? Number(mrpRaw) : null;
  const rawDiscount = dto.discount_percentage && dto.discount_percentage > 0
    ? dto.discount_percentage
    : originalPrice && originalPrice > sp
    ? Math.round(((originalPrice - sp) / originalPrice) * 100)
    : undefined;
  const discountPercentage = rawDiscount && rawDiscount > 0 ? rawDiscount : undefined;

  let feedingConfig: FeedingConfiguration = 'both';
  if (dto.feeding_config === 'feeding-only') feedingConfig = 'feeding-only';
  else if (dto.feeding_config === 'none') feedingConfig = 'none';
  else {
    const hasFeeding = (dto.variants || []).some((v) => normalizeClothingType(v.clothing_type) === 'Feeding');
    const hasNonFeeding = (dto.variants || []).some((v) => normalizeClothingType(v.clothing_type) === 'Non-Feeding');
    feedingConfig = hasFeeding && hasNonFeeding ? 'both' : hasFeeding ? 'feeding-only' : 'none';
  }

  const colorMap = new Map<string, ProductColor>();
  const sizeSet = new Set<ProductSize>();
  const variants: ProductVariant[] = (dto.variants || []).map((v) => {
    const colorId = String(v.color.id);
    if (!colorMap.has(colorId)) {
      colorMap.set(colorId, { id: colorId, name: v.color.name, hex: v.color.hex_code });
    }
    const size = v.size.name as ProductSize;
    sizeSet.add(size);
    return {
      id: String(v.id),
      sku: v.sku,
      clothingType: normalizeClothingType(v.clothing_type),
      color: { id: colorId, name: v.color.name, hex: v.color.hex_code },
      size,
      price: Number(v.final_price || sp),
      originalPrice,
      stock: v.stock,
      inStock: v.stock > 0,
    };
  });

  const sortedRawImages = [...(dto.images || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const galleryImages: ProductGalleryImage[] = sortedRawImages.map((img: any) => {
    const imgUrl = getImageUrl(img.url || img.image || '');
    const cId = img.color_id ? String(img.color_id) : (img.color?.id ? String(img.color.id) : null);
    const cName = img.color_name || img.color?.name || null;
    const cHex = img.color_hex || img.color?.hex_code || '#552058';

    if (cId && cName && !colorMap.has(cId)) {
      colorMap.set(cId, { id: cId, name: cName, hex: cHex });
    }

    return {
      id: img.id,
      url: imgUrl,
      clothingType: normalizeClothingType(img.clothing_type),
      colorId: cId,
      colorName: cName,
      colorHex: cHex,
      order: img.order ?? 0,
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
    images: galleryImages.map((g) => g.url),
    galleryImages,
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
    isFeedingCollection: dto.is_feeding_collection,
    isSareesCollection: dto.is_sarees_collection,
    isKidswearCollection: dto.is_kidswear_collection,
  };
}

/**
 * Service layer integrated directly with Django REST Framework backend APIs.
 * Automatically falls back to resilient local stores if backend is offline.
 */
export const storeApi = {
  async getSiteConfig(): Promise<{
    shipping_fee: number;
    free_shipping_threshold: number;
    shipping_notice: string;
    exchange_window_days: number;
    max_saved_addresses: number;
  }> {
    try {
      const res = await apiClient.get<any>('/catalog/config/');
      if (res.data) {
        return {
          shipping_fee: Number(res.data.shipping_fee ?? 99),
          free_shipping_threshold: Number(res.data.free_shipping_threshold ?? 1499),
          shipping_notice: res.data.shipping_notice || 'Free shipping across India on orders above ₹1499',
          exchange_window_days: Number(res.data.exchange_window_days ?? 7),
          max_saved_addresses: Number(res.data.max_saved_addresses ?? 3),
        };
      }
    } catch (e) {
      console.warn('Failed to fetch site config from backend:', e);
    }
    return {
      shipping_fee: 99,
      free_shipping_threshold: 1499,
      shipping_notice: 'Free shipping across India on orders above ₹1499',
      exchange_window_days: 7,
      max_saved_addresses: 3,
    };
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get<any[]>('/catalog/categories/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((c) => ({
          id: c.slug,
          name: c.name,
          slug: c.slug,
          image: getImageUrl(c.image_url || c.image || ''),
          itemCount: c.item_count_label || '',
          description: c.description || '',
          tagline: c.tagline || '',
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch categories from backend, using local fallback:', e);
    }
    return [...CATEGORIES];
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const res = await apiClient.get<any>(`/catalog/categories/${slug}/`);
      if (res.data) {
        const c = res.data;
        return {
          id: c.slug,
          name: c.name,
          slug: c.slug,
          image: getImageUrl(c.image_url || c.image || ''),
          itemCount: c.item_count_label || '',
          description: c.description || '',
          tagline: c.tagline || '',
        };
      }
    } catch {
      // Fallback to local
    }
    const category = CATEGORIES.find((c) => c.slug === slug);
    return category || null;
  },

  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.category) queryParams.category = params.category;
      if (params?.clothingType) queryParams.clothing_type = params.clothingType;
      if (params?.handstock) queryParams.handstock = 'true';
      if (params?.section) queryParams.section = params.section;
      if (params?.search) queryParams.search = params.search;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;

      const res = await apiClient.get<DjangoProductResponse[]>('/catalog/products/', { params: queryParams });
      if (Array.isArray(res.data)) {
        return res.data.map(mapDjangoProduct);
      }
    } catch (e) {
      console.warn('Failed to fetch products from backend, using local fallback:', e);
    }

    let result = [...PRODUCTS];

    if (params?.section) {
      const s = params.section.toLowerCase();
      if (s === 'feeding-collection' || s === 'feeding') {
        result = result.filter((p) => p.isFeedingCollection || p.feedingConfig === 'both' || p.feedingConfig === 'feeding-only');
      } else if (s === 'handstock' || s === 'handstocks') {
        result = result.filter((p) => Boolean(p.isHandstock));
      } else if (s === 'sarees') {
        result = result.filter((p) => p.isSareesCollection || p.category === 'sarees');
      } else if (s === 'kids-wear' || s === 'kidswear') {
        result = result.filter((p) => p.isKidswearCollection || p.category === 'kids-collections');
      } else if (s === 'new-arrivals') {
        result = result.filter((p) => Boolean(p.isNewArrival));
      } else if (s === 'best-sellers') {
        result = result.filter((p) => Boolean(p.isBestseller || p.isFeatured));
      }
    }

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
        case 'popular':
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await apiClient.get<DjangoProductResponse>(`/catalog/products/${slug}/`);
      if (res.data && res.data.id) {
        return mapDjangoProduct(res.data);
      }
    } catch (e) {
      console.warn(`Failed to fetch product ${slug} from backend, using local fallback:`, e);
    }
    const product = PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  },

  async getBestsellers(): Promise<Product[]> {
    try {
      const res = await apiClient.get<DjangoProductResponse[]>('/catalog/products/', { params: { is_best_seller: 'true' } });
      if (Array.isArray(res.data)) {
        return res.data.map(mapDjangoProduct);
      }
    } catch (e) {
      console.warn('Failed to fetch bestsellers from backend, using local fallback:', e);
    }
    return PRODUCTS.filter((p) => p.isFeatured);
  },

  async getNewArrivals(): Promise<Product[]> {
    try {
      const res = await apiClient.get<DjangoProductResponse[]>('/catalog/products/', { params: { is_new_arrival: 'true' } });
      if (Array.isArray(res.data)) {
        return res.data.map(mapDjangoProduct);
      }
    } catch (e) {
      console.warn('Failed to fetch new arrivals from backend, using local fallback:', e);
    }
    return PRODUCTS.filter((p) => p.isNewArrival || p.badge === 'New Arrival');
  },

  async getHeroSlides(): Promise<HeroSlide[]> {
    try {
      const res = await apiClient.get<any[]>('/catalog/hero-slides/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((s) => ({
          id: String(s.id),
          title: s.title,
          ctaLink: s.cta_link || '/shop',
          desktopImage: getImageUrl(s.desktop_image_url || s.desktop_image),
          mobileImage: getImageUrl(s.mobile_image_url || s.mobile_image || s.desktop_image_url || s.desktop_image),
          preserveArtwork: s.preserve_artwork ?? true,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch hero slides from backend, using local fallback:', e);
    }
    return [...HERO_SLIDES];
  },

  async getHomeData(): Promise<{
    heroSlides: HeroSlide[];
    categories: Category[];
    sectionsMeta?: Record<
      string,
      {
        id: number;
        title: string;
        slug: string;
        subtitle?: string;
        badge_label?: string;
        view_all_link?: string;
        direction?: string;
        display_order?: number;
      }
    >;
    sections: {
      feedingCollection: Product[];
      handstock: Product[];
      sarees: Product[];
      kidsWear: Product[];
      newArrivals: Product[];
      bestSellers: Product[];
    };
  }> {
    try {
      const res = await apiClient.get<any>('/catalog/home/');
      if (res.data) {
        const d = res.data;
        const heroSlides: HeroSlide[] = Array.isArray(d.hero_slides)
          ? d.hero_slides.map((s: any) => ({
              id: String(s.id),
              title: s.title,
              ctaLink: s.cta_link || '/shop',
              desktopImage: getImageUrl(s.desktop_image_url || s.desktop_image),
              mobileImage: getImageUrl(s.mobile_image_url || s.mobile_image || s.desktop_image_url || s.desktop_image),
              preserveArtwork: s.preserve_artwork ?? true,
            }))
          : [...HERO_SLIDES];

        const categories: Category[] = Array.isArray(d.categories)
          ? d.categories.map((c: any) => ({
              id: c.slug,
              name: c.name,
              slug: c.slug,
              image: getImageUrl(c.image_url || c.image || ''),
              itemCount: c.item_count_label || '',
              description: c.description || '',
              tagline: c.tagline || '',
            }))
          : [...CATEGORIES];

        const rawSec = d.sections || {};
        return {
          heroSlides,
          categories,
          sectionsMeta: d.sections_meta || {},
          sections: {
            feedingCollection: Array.isArray(rawSec.feeding_collection)
              ? rawSec.feeding_collection.map(mapDjangoProduct)
              : [],
            handstock: Array.isArray(rawSec.handstock)
              ? rawSec.handstock.map(mapDjangoProduct)
              : [],
            sarees: Array.isArray(rawSec.sarees)
              ? rawSec.sarees.map(mapDjangoProduct)
              : [],
            kidsWear: Array.isArray(rawSec.kids_wear)
              ? rawSec.kids_wear.map(mapDjangoProduct)
              : [],
            newArrivals: Array.isArray(rawSec.new_arrivals)
              ? rawSec.new_arrivals.map(mapDjangoProduct)
              : [],
            bestSellers: Array.isArray(rawSec.best_sellers)
              ? rawSec.best_sellers.map(mapDjangoProduct)
              : [],
          },
        };
      }
    } catch (e) {
      console.warn('Failed to fetch home data from backend, using fallback:', e);
    }

    return {
      heroSlides: [...HERO_SLIDES],
      categories: [...CATEGORIES],
      sections: {
        feedingCollection: PRODUCTS.filter((p) => p.feedingConfig === 'both' || p.feedingConfig === 'feeding-only'),
        handstock: PRODUCTS.filter((p) => Boolean(p.isHandstock)),
        sarees: PRODUCTS.filter((p) => p.category === 'sarees'),
        kidsWear: PRODUCTS.filter((p) => p.category === 'kids-collections'),
        newArrivals: PRODUCTS.filter((p) => p.isNewArrival),
        bestSellers: PRODUCTS.filter((p) => p.isFeatured || p.isBestseller),
      },
    };
  },

  async getReviews(): Promise<CustomerReview[]> {
    return [...CUSTOMER_REVIEWS];
  },

  async getProductReviews(slug: string): Promise<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<string, { stars: number; count: number; percentage: number }>;
    reviews: ProductReview[];
  }> {
    try {
      const res = await apiClient.get<any>(`/catalog/products/${slug}/reviews/`);
      if (res.data) {
        const reviews: ProductReview[] = (res.data.reviews || []).map((r: any) => ({
          id: String(r.id),
          userName: r.user_name || 'Verified Customer',
          rating: Number(r.rating) || 5,
          headline: r.headline || '',
          comment: r.comment || '',
          image: r.image_url || r.image || null,
          date: r.created_at
            ? new Date(r.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Recently',
          verifiedPurchase: Boolean(r.verified_purchase),
        }));
        return {
          averageRating: Number(res.data.average_rating) || 4.8,
          totalReviews: Number(res.data.total_reviews) || reviews.length,
          distribution: res.data.distribution || {},
          reviews,
        };
      }
    } catch (e) {
      console.warn(`Could not load reviews for ${slug}:`, e);
    }
    return {
      averageRating: 4.8,
      totalReviews: 0,
      distribution: {
        '5': { stars: 5, count: 0, percentage: 0 },
        '4': { stars: 4, count: 0, percentage: 0 },
        '3': { stars: 3, count: 0, percentage: 0 },
        '2': { stars: 2, count: 0, percentage: 0 },
        '1': { stars: 1, count: 0, percentage: 0 },
      },
      reviews: [],
    };
  },

  async submitProductReview(
    slug: string,
    data: { rating: number; headline?: string; comment: string; image?: File | null }
  ): Promise<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<string, { stars: number; count: number; percentage: number }>;
    reviews: ProductReview[];
  }> {
    let payload: any = data;
    let headers: Record<string, string> | undefined = undefined;
    if (data.image) {
      const formData = new FormData();
      formData.append('rating', String(data.rating));
      if (data.headline) formData.append('headline', data.headline);
      formData.append('comment', data.comment);
      formData.append('image', data.image);
      payload = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    const res = await apiClient.post<any>(`/catalog/products/${slug}/reviews/`, payload, { headers });
    const reviews: ProductReview[] = (res.data.reviews || []).map((r: any) => ({
      id: String(r.id),
      userName: r.user_name || 'Verified Customer',
      rating: Number(r.rating) || 5,
      headline: r.headline || '',
      comment: r.comment || '',
      image: r.image_url || r.image || null,
      date: r.created_at
        ? new Date(r.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Recently',
      verifiedPurchase: Boolean(r.verified_purchase),
    }));
    return {
      averageRating: Number(res.data.average_rating) || 4.8,
      totalReviews: Number(res.data.total_reviews) || reviews.length,
      distribution: res.data.distribution || {},
      reviews,
    };
  },
};

