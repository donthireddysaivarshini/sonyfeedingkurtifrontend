/**
 * SONY COLLECTIONS - Order & Checkout Service
 * 
 * Production service connecting to Django REST Framework:
 * - POST /api/orders/checkout/
 * - POST /api/payments/razorpay/verify/
 * - GET /api/orders/
 * - GET /api/orders/<order_number>/
 * - GET /api/orders/<order_number>/invoice/
 */

import { apiClient } from './apiClient';
import { Order } from '../types/order';
import { getImageUrl } from '../utils/imageUrl';

export const mapBackendOrder = (fetched: any): Order => ({
  id: String(fetched.id),
  orderNumber: fetched.order_number,
  date: new Date(fetched.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
  customerName: `${fetched.first_name || ''} ${fetched.last_name || ''}`.trim() || 'Customer',
  customerEmail: fetched.email || '',
  customerPhone: fetched.phone || '',
  shippingAddress: {
    fullName: `${fetched.first_name || ''} ${fetched.last_name || ''}`.trim() || 'Customer',
    phone: fetched.phone || '',
    houseFlat: fetched.shipping_address || '',
    streetArea: fetched.apartment || '',
    landmark: fetched.landmark || '',
    city: fetched.city || '',
    state: fetched.state || '',
    pincode: fetched.zip_code || '',
    country: 'India',
  },
  items: (fetched.items || []).map((it: any) => ({
    id: String(it.id),
    productId: String(it.id),
    productTitle: it.product_name,
    productSlug: it.product_slug || '',
    productImage: getImageUrl(it.product_image) || '/images/frocks/teal-zari-tiered-frock.jpg',
    category: it.clothing_type || 'Kurti',
    variantId: String(it.id),
    sku: it.product_sku,
    clothingType: it.clothing_type,
    selectedColor: { id: 'c', name: it.color || 'Royal Plum', hex: '#552058' },
    selectedSize: it.size || 'M',
    price: parseFloat(it.unit_price) || 0,
    originalPrice: parseFloat(it.unit_price) || 0,
    quantity: it.quantity || 1,
    lineTotal: parseFloat(it.line_total) || 0,
  })),
  subtotal: parseFloat(fetched.subtotal) || 0,
  discount: parseFloat(fetched.discount) || 0,
  coupon_code: fetched.coupon_code || '',
  shippingFee: parseFloat(fetched.shipping_fee) || 0,
  total: parseFloat(fetched.total_amount) || 0,
  paymentMethod: fetched.payment_method || 'razorpay',
  paymentStatus: (fetched.payment_status || 'completed').toLowerCase() as any,
  orderStatus: (fetched.order_status || 'placed').toLowerCase() as any,
  isCancellable: fetched.is_cancellable ?? ['ordered', 'processing', 'placed'].includes((fetched.order_status || '').toLowerCase()),
});

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  discount: number;
  discount_type: 'percentage' | 'fixed';
  value: number;
  is_exchange_code: boolean;
  message: string;
}

export interface CheckoutInput {
  address_id?: number | string;
  address?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    shipping_address?: string;
    houseFlat?: string;
    streetArea?: string;
    apartment?: string;
    landmark?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    pincode?: string;
    country?: string;
    is_default?: boolean;
  };
  payment_method: 'razorpay' | 'cod';
  coupon_code?: string;
  items?: Array<{
    variant_id?: number | string;
    sku?: string;
    product_id?: number | string;
    product_slug?: string;
    product_title?: string;
    clothing_type?: string;
    color?: string;
    size?: string;
    quantity: number;
  }>;
}

export interface RazorpayCheckoutResponse {
  order_id: number;
  order_number: string;
  payment_method: 'razorpay';
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key: string;
  reservation_expires_at?: string;
}

export interface CodCheckoutResponse {
  id: number;
  order_number: string;
  payment_method: 'cod';
  payment_status: string;
  order_status: string;
  total_amount: string;
  created_at: string;
}

export const orderService = {
  /**
   * Initialize checkout: returns Razorpay order details or creates COD order
   */
  async checkout(payload: CheckoutInput): Promise<RazorpayCheckoutResponse | CodCheckoutResponse> {
    const res = await apiClient.post('/orders/checkout/', payload);
    return res.data;
  },

  /**
   * Validate promo coupon or exchange store credit code
   */
  async validateCoupon(code: string, orderTotal: number): Promise<CouponValidationResponse> {
    const res = await apiClient.post<CouponValidationResponse>('/orders/coupons/validate/', {
      code,
      order_total: orderTotal,
    });
    return res.data;
  },

  /**
   * Verify Razorpay cryptographic signature after payment popup
   */
  async verifyPayment(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ status: string; order_number: string }> {
    const res = await apiClient.post('/payments/razorpay/verify/', payload);
    return res.data;
  },

  /**
   * Fetch customer orders from backend and map to typed Order objects
   */
  async getUserOrders(): Promise<Order[]> {
    const res = await apiClient.get<any[]>('/orders/');
    const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
    return list.map(mapBackendOrder);
  },

  /**
   * Fetch order details by public order number
   */
  async getOrderByNumber(orderNumber: string): Promise<any> {
    const res = await apiClient.get(`/orders/${orderNumber}/`);
    return res.data;
  },

  /**
   * Download official Order Invoice PDF blob
   */
  async downloadInvoice(orderNumber: string): Promise<void> {
    const res = await apiClient.get(`/orders/${orderNumber}/invoice/`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_invoice_${orderNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Submit damaged product exchange request with mandatory photo/video proof
   */
  async requestExchange(orderNumber: string, formData: FormData): Promise<any> {
    const res = await apiClient.post(`/orders/${orderNumber}/exchanges/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  /**
   * Cancel order prior to shipping (with automated Razorpay refund dispatch if paid)
   */
  async cancelOrder(orderNumber: string): Promise<{ message: string; order_status: string; payment_status: string }> {
    const res = await apiClient.post(`/orders/${orderNumber}/cancel/`);
    return res.data;
  },

  /**
   * Fetch customer exchange requests history
   */
  async getUserExchanges(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/orders/exchanges/');
    return Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
  },
};
