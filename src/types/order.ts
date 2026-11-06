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
    description: 'Pay cash upon delivery. (Pending final operational approval; subject to verification).',
    isAvailable: true,
    isProvisional: true,
  },
];

