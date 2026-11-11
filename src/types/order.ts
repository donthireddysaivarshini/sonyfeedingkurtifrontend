/**
 * SONY COLLECTIONS - Order & Checkout Types
 * 
 * Prepares the frontend for future Django order, checkout, and Razorpay endpoints.
 */

import { CartItem } from './cart';

export type PaymentMethod = 'razorpay' | 'cod';

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  badge?: string;
  description: string;
  isAvailable: boolean;
  isProvisional?: boolean;
}

export const PAYMENT_METHODS: PaymentOption[] = [
  {
    id: 'razorpay',
    name: 'Online Payment (Razorpay)',
    badge: 'Recommended',
    description: 'Pay instantly via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking.',
    isAvailable: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    badge: 'Provisional',
    description: 'Pay cash upon delivery. (Provisional payment mode pending final client approval).',
    isAvailable: true,
    isProvisional: true,
  },
];

export interface DeliveryAddress {
  id?: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  streetArea: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export type OrderStatus = 'placed' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'cod_pending' | 'failed';

export interface OrderItem extends CartItem {
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
}
