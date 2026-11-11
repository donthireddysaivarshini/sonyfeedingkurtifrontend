import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  Printer,
  MapPin,
  CreditCard,
  Banknote,
  Phone,
  Mail,
  User,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Order } from '../types/order';

export const OrderConfirmationPage: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('sony_feeding_kurtis_last_order');
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        const params = new URLSearchParams(window.location.search);
        if (import.meta.env.DEV && params.get('demo') === '1') {
          const demoOrder: Order = {
            id: 'ord_demo_101',
            orderNumber: 'SFK-842915',
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            customerName: 'Pooja Sharma',
            customerEmail: 'pooja.sharma@example.com',
            customerPhone: '9876543210',
            shippingAddress: {
              fullName: 'Pooja Sharma',
              phone: '9876543210',
              houseFlat: 'Flat 402, Lotus Residency',
              streetArea: 'Road No 12, Banjara Hills',
              landmark: 'Near Care Hospital',
              city: 'Hyderabad',
              state: 'Telangana',
              pincode: '500034',
              country: 'India',
              isDefault: true,
            },
            items: [
              {
                id: 'nayantara-rose-flared-maxi-dupatta-set_Feeding_clr-maroon_L',
                productId: 'sfk-01',
                productTitle: 'Nayantara Rose Flared Maxi Kurti & Dupatta Set',
                productSlug: 'nayantara-rose-flared-maxi-dupatta-set',
                productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                category: 'Kurti + Dupatta',
                variantId: 'var-nayantara-feeding-maroon-l',
                sku: 'SFK-NAY-F-MRN-L',
                clothingType: 'Feeding',
                selectedColor: { id: 'clr-maroon', name: 'Deep Maroon', hex: '#800020' },
                selectedSize: 'L',
                price: 1499,
                originalPrice: 1999,
                quantity: 1,
                maxStock: 5,
                lineTotal: 1499,
              },
              {
                id: 'kalyani-tiered-gathered-feeding-frock_Feeding_clr-mustard_M',
                productId: 'sfk-02',
                productTitle: 'Kalyani Tiered Gathered Feeding Frock',
                productSlug: 'kalyani-tiered-gathered-feeding-frock',
                productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                category: 'Frocks',
                variantId: 'var-kalyani-feeding-mustard-m',
                sku: 'SFK-KAL-F-MUS-M',
                clothingType: 'Feeding',
                selectedColor: { id: 'clr-mustard', name: 'Mustard Gold', hex: '#E1AD01' },
                selectedSize: 'M',
                price: 1299,
                originalPrice: 1699,
                quantity: 2,
                maxStock: 4,
                lineTotal: 2598,
              },
            ],
            subtotal: 4097,
            shippingFee: 0,
            total: 4097,
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            orderStatus: 'placed',
          };
          setOrder(demoOrder);
        }
      }
    } catch {
      // sessionStorage unavailable
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Shop', path: '/shop' },
          { label: 'Order Confirmation' },
        ]}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-sans text-neutral-charcoal/70">Retrieving your order details...</p>
          </div>
        ) : !order ? (
          /* Empty / Fallback State */
          <div className="bg-white rounded-2xl border border-neutral-stone/40 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-neutral-stone/20 text-neutral-charcoal/60 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-neutral-charcoal mb-2">
              No Active Order Found
            </h1>
            <p className="text-sm font-sans text-neutral-charcoal/70 mb-8 leading-relaxed">
              We couldn&apos;t locate an order session from this browser. If you recently completed an order, you can review it in your account dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-sm font-medium py-3 px-6 rounded-xl transition-all shadow-sm"
              >
                Browse Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/account/orders"
                className="inline-flex items-center justify-center gap-2 border border-brand-maroon/30 text-brand-maroon hover:bg-brand-maroon/5 font-sans text-sm font-medium py-3 px-6 rounded-xl transition-all"
              >
                View Order History
              </Link>
            </div>
          </div>
        ) : (
          /* Placed Order Confirmation */
          <div className="space-y-8">
            {/* Success Hero Banner */}
            <div className="bg-white rounded-2xl border border-brand-maroon/20 p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-maroon via-brand-gold to-brand-maroon" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm animate-pulse">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-maroon text-xs font-sans font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Thank You for Choosing Sony Collections
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-charcoal mb-2">
                Your Order Has Been Placed!
              </h1>
              <p className="text-sm sm:text-base font-sans text-neutral-charcoal/75 max-w-xl mx-auto mb-6 leading-relaxed">
                We have received your order request. A confirmation summary is displayed below and saved to your account.
              </p>

              {/* Order Meta Bar */}
              <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-ivory rounded-xl border border-neutral-stone/40 px-5 py-3 text-left">
                <div>
                  <span className="block text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider">Order Number</span>
                  <span className="font-mono font-bold text-brand-maroon text-sm sm:text-base">{order.orderNumber}</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-neutral-stone/50" />
                <div>
                  <span className="block text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider">Order Date</span>
                  <span className="font-sans font-medium text-neutral-charcoal text-sm">{order.date}</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-neutral-stone/50" />
                <div>
                  <span className="block text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider">Payment Mode</span>
                  <span className="font-sans font-medium text-neutral-charcoal text-sm capitalize">
                    {order.paymentMethod === 'razorpay' ? 'Online (Razorpay)' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-neutral-stone/50" />
                <div>
                  <span className="block text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider">Order Status</span>
                  <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    Pending Dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* Backend Integration Note */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-sans text-amber-900 leading-relaxed">
                <span className="font-semibold text-amber-950">Development & Architecture Verification:</span> This page displays an order confirmation summary. In Stage 5, real orders and official order IDs are created directly by the Django backend API (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">POST /api/orders/</code>) upon receiving the order request; payment verification via Razorpay or boutique COD approval follows.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items Breakdown (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-neutral-stone/40 p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-stone/30 mb-4">
                    <h2 className="font-serif font-bold text-lg text-neutral-charcoal flex items-center gap-2">
                      <PackageCheck className="w-5 h-5 text-brand-maroon" />
                      Items in this Order ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                    </h2>
                  </div>

                  <div className="divide-y divide-neutral-stone/30">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-neutral-stone/30 shrink-0 bg-neutral-stone/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-semibold text-neutral-charcoal text-base mb-1 truncate">
                            {item.productTitle}
                          </h3>

                          {/* Feeding badge */}
                          <div className="mb-2">
                            {item.clothingType === 'Feeding' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Feeding Friendly
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                                Standard Ethnic Fit
                              </span>
                            )}
                          </div>

                          {/* Selected Variant Attributes */}
                          <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-neutral-charcoal/75 mb-2">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span className="font-medium text-neutral-charcoal">{item.selectedColor.name}</span>
                            </span>
                            <span className="text-neutral-charcoal/30">•</span>
                            <span>Size: <strong className="text-neutral-charcoal">{item.selectedSize}</strong></span>
                            <span className="text-neutral-charcoal/30">•</span>
                            <span>Qty: <strong className="text-neutral-charcoal">{item.quantity}</strong></span>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-xs font-sans text-neutral-charcoal/60">
                              ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                            </span>
                            <span className="text-sm font-sans font-bold text-neutral-charcoal">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white rounded-2xl border border-neutral-stone/40 p-5 sm:p-6 shadow-sm">
                  <h2 className="font-serif font-bold text-lg text-neutral-charcoal flex items-center gap-2 mb-4 pb-3 border-b border-neutral-stone/30">
                    <MapPin className="w-5 h-5 text-brand-maroon" />
                    Shipping & Delivery Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                    <div className="space-y-1">
                      <span className="text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider block">Recipient</span>
                      <p className="font-semibold text-neutral-charcoal flex items-center gap-1.5">
                        <User className="w-4 h-4 text-neutral-charcoal/60" />
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-neutral-charcoal/80 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-neutral-charcoal/60" />
                        +91 {order.shippingAddress.phone}
                      </p>
                      <p className="text-neutral-charcoal/80 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-neutral-charcoal/60" />
                        {order.customerEmail}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider block">Delivery Address</span>
                      <p className="text-neutral-charcoal font-medium">
                        {order.shippingAddress.houseFlat}, {order.shippingAddress.streetArea}
                      </p>
                      {order.shippingAddress.landmark && (
                        <p className="text-neutral-charcoal/70 text-xs">
                          Landmark: {order.shippingAddress.landmark}
                        </p>
                      )}
                      <p className="text-neutral-charcoal font-medium">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p className="text-xs text-neutral-charcoal/60">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Actions (Right Column) */}
              <div className="space-y-6">
                {/* Financial Summary */}
                <div className="bg-white rounded-2xl border border-neutral-stone/40 p-5 sm:p-6 shadow-sm">
                  <h2 className="font-serif font-bold text-lg text-neutral-charcoal pb-3 border-b border-neutral-stone/30 mb-4">
                    Payment Breakdown
                  </h2>

                  <div className="space-y-3 text-sm font-sans mb-4 pb-4 border-b border-neutral-stone/30">
                    <div className="flex justify-between text-neutral-charcoal/80">
                      <span>Bag Subtotal</span>
                      <span className="font-medium text-neutral-charcoal">₹{order.subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-neutral-charcoal/80">
                      <span>Standard Shipping</span>
                      <span>
                        {order.shippingFee === 0 ? (
                          <span className="text-neutral-charcoal font-medium">Awaiting Confirmation</span>
                        ) : (
                          <span className="text-neutral-charcoal font-medium">₹{order.shippingFee}</span>
                        )}
                      </span>
                    </div>

                    {order.paymentMethod === 'cod' && (
                      <div className="flex justify-between text-xs text-neutral-charcoal/70 pt-1">
                        <span>COD Service</span>
                        <span className="text-neutral-charcoal/80 font-medium">Provisional Pending Approval</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-serif font-bold text-base text-neutral-charcoal">
                      {order.paymentMethod === 'cod' ? 'Payable upon Delivery' : 'Total Amount Paid'}
                    </span>
                    <span className="font-serif font-bold text-2xl text-brand-maroon">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Payment Mode Callout */}
                  <div className="p-3.5 rounded-xl bg-ivory border border-neutral-stone/40 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      {order.paymentMethod === 'razorpay' ? (
                        <CreditCard className="w-4 h-4 text-brand-maroon" />
                      ) : (
                        <Banknote className="w-4 h-4 text-brand-maroon" />
                      )}
                      <span className="text-xs font-sans font-bold text-neutral-charcoal uppercase tracking-wider">
                        {order.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (COD)'}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-neutral-charcoal/70 leading-relaxed">
                      {order.paymentMethod === 'razorpay'
                        ? 'Simulated successful checkout. In production, Razorpay provides live UPI, Debit/Credit Card, and NetBanking gateways.'
                        : 'Provisional Cash on Delivery (COD) order. Cash on delivery availability is subject to final boutique confirmation.'}
                    </p>
                  </div>

                  {/* Primary Actions */}
                  <div className="space-y-3">
                    <Link
                      to="/account/orders"
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-sm font-medium py-3 px-4 rounded-xl transition-all shadow-sm"
                    >
                      View in My Orders
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={handlePrint}
                      className="w-full inline-flex items-center justify-center gap-2 border border-neutral-stone/60 hover:bg-neutral-stone/10 text-neutral-charcoal font-sans text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print Order Receipt
                    </button>

                    <Link
                      to="/shop"
                      className="w-full inline-flex items-center justify-center gap-2 text-brand-maroon hover:text-brand-maroon/80 font-sans text-xs font-medium py-2 transition-colors"
                    >
                      Continue Shopping Sony Collections
                    </Link>
                  </div>
                </div>

                {/* Boutique Support Card */}
                <div className="bg-white rounded-2xl border border-neutral-stone/40 p-5 shadow-sm text-xs font-sans text-neutral-charcoal/75 space-y-2">
                  <h3 className="font-semibold text-neutral-charcoal text-sm">Need Help With Your Order?</h3>
                  <p>
                    For inquiries, customization queries, or order status checks, reach out with your order number <strong className="text-neutral-charcoal">{order.orderNumber}</strong>.
                  </p>
                  <p className="text-brand-maroon font-medium pt-1">
                    support@sonyfeedingkurtis.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

export default OrderConfirmationPage;
