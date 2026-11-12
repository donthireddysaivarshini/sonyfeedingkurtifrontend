export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DjangoProductVariantResponse {
  id: number;
  clothing_type: 'feeding' | 'non_feeding';
  color: { id: number; name: string; hex_code: string };
  size: { id: number; name: string };
  sku: string;
  stock: number;
  price_override: string;
  final_price: number;
}

export interface DjangoProductResponse {
  id: number;
  title: string;
  slug: string;
  sku: string;
  category: { id: number; name: string; slug: string };
  price: string;
  original_price: string | null;
  mrp?: string | null;
  discount_percentage?: number;
  rating?: number;
  review_count?: number;
  description: string;
  fabric: string;
  care_instructions: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_handstock?: boolean;
  images: { id: number; image: string; order: number }[];
  variants: DjangoProductVariantResponse[];
}

export interface DjangoSiteConfig {
  shipping_policy_status: 'pending_client_confirmation';
  tax_percentage: number;
}
