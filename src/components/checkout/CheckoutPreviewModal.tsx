import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PaymentMethod, PAYMENT_METHODS } from '../../types/order';

interface CheckoutPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutPreviewModal: React.FC<CheckoutPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { items, subtotal, total } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('razorpay');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-ivory-300 overflow-hidden z-10 animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-ivory-300 flex items-center justify-between bg-ivory-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Checkout & Payment Preview
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
              Order Summary & Payment Methods
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Restored Cart Items with Full Variant Detail */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary mb-2">
              Cart Items Restored ({items.length})
            </h4>
            <div className="space-y-2 border border-ivory-200 rounded-xl p-3 bg-ivory-50/50 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-ivory-200 last:border-b-0">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img src={item.productImage} alt={item.productTitle} className="w-10 h-12 object-cover rounded border border-ivory-200" />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-primary truncate">{item.productTitle}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-ink-secondary mt-0.5">
                        {item.clothingType ? (
                          <span className={`font-bold px-1.5 py-0.2 rounded ${item.clothingType === 'Feeding' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                            {item.clothingType}
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded">Standard</span>
                        )}
                        <span>• {item.selectedColor.name}</span>
                        <span>• Size: {item.selectedSize}</span>
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-ink-primary shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection (Extensible for Razorpay & COD) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Planned Payment Methods:
              </label>
              <span className="text-[11px] text-ink-muted">Extensible Architecture</span>
            </div>

            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-700 bg-brand-50/60 ring-1 ring-brand-700 shadow-xs'
                        : 'border-ivory-300 hover:border-brand-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-brand-700 text-white' : 'bg-ivory-200 text-ink-secondary'}`}>
                          {method.id === 'razorpay' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-ink-primary">
                              {method.name}
                            </span>
                            {method.badge && (
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  method.id === 'razorpay'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink-secondary mt-0.5">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-brand-700 bg-brand-700' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Honest Stage 5 Notification — No fake payment confirmation */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Phase 1 Architecture Status:</strong> Real Razorpay online transactions and provisional Cash on Delivery order creation will be connected with the Django backend in Stage 5. No transaction has been processed in this preview.
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-3 bg-ivory-100/70 rounded-xl space-y-1.5 text-xs text-ink-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink-primary">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-ink-secondary text-[11px]">
                Awaiting Confirmation
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ink-primary pt-1.5 border-t border-ivory-200">
              <span>Estimated Total</span>
              <span className="text-brand-700 text-base">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ivory-300 bg-ivory-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
            <span>Phase 1 Architecture Preview</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
