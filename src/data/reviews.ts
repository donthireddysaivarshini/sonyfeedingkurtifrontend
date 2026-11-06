export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  clothingType: 'Feeding' | 'Non-Feeding';
  review: string;
  avatar?: string;
  verified: boolean;
}

// In Phase 1, customer reviews are kept empty until real verified purchases occur.
// Real reviews will be populated via the Django /store/products/:slug/reviews/ endpoint.
export const CUSTOMER_REVIEWS: CustomerReview[] = [];
