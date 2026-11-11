/**
 * SONY COLLECTIONS - Order Service
 * 
 * Provides typed contract boundaries for order placement and payment orchestration.
 * In Phase 3, this interfaces cleanly with client-side state / sessionStorage.
 * In Stage 5, this will make REST calls to Django endpoints:
 * - POST /api/orders/
 * - GET /api/orders/
 * - GET /api/orders/:id/
 * - POST /api/payments/razorpay/order/
 */

import { Order } from '../types/order';

export interface CreateOrderResult {
  success: boolean;
  order: Order;
  message?: string;
}

export interface RazorpayOrderInitResult {
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
}

export const orderService = {
  /**
   * Submit an order for processing
   */
  async createOrder(payload: Order): Promise<CreateOrderResult> {
    try {
      // Store in session storage
      sessionStorage.setItem('sony_feeding_kurtis_last_order', JSON.stringify(payload));
      
      const existingRaw = sessionStorage.getItem('sony_feeding_kurtis_orders');
      const existing: Order[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(payload);
      sessionStorage.setItem('sony_feeding_kurtis_orders', JSON.stringify(existing));

      return {
        success: true,
        order: payload,
        message: 'Order created successfully.',
      };
    } catch (err) {
      return {
        success: false,
        order: payload,
        message: 'Failed to persist order in local session.',
      };
    }
  },

  /**
   * Retrieve order history for the current customer session
   */
  async getOrders(): Promise<Order[]> {
    try {
      const raw = sessionStorage.getItem('sony_feeding_kurtis_orders');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Retrieve a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  },

  /**
   * Retrieve the latest order from the active session
   */
  async getLastOrder(): Promise<Order | null> {
    try {
      const raw = sessionStorage.getItem('sony_feeding_kurtis_last_order');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Prepare a Razorpay payment order (Stage 5 Integration Hook)
   */
  async initiateRazorpayPayment(orderId: string, amount: number): Promise<RazorpayOrderInitResult> {
    // When Django is connected, this issues POST /api/payments/razorpay/order/
    return {
      razorpayOrderId: `rzp_order_mock_${orderId}`,
      keyId: 'rzp_test_placeholder',
      amount: amount * 100, // in paise
      currency: 'INR',
    };
  },
};
