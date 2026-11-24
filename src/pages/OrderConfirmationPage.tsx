import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  Printer,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  Clock,
  Sparkles,
  FileText,
  Loader2,
  Truck,
  X
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Order } from '../types/order';
import { orderService, mapBackendOrder } from '../services/orderService';
import { getImageUrl } from '../utils/imageUrl';

const renderOrderStatusBadge = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Delivered
      </span>
    );
  }
  if (s === 'shipped' || s === 'dispatched') {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
        <Truck className="w-3.5 h-3.5 text-blue-600" />
        Shipped
      </span>
    );
  }
  if (s === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
        <Clock className="w-3.5 h-3.5 text-purple-600" />
        Processing
      </span>
    );
  }
  if (s === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
        <X className="w-3.5 h-3.5 text-rose-600" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
      <Clock className="w-3.5 h-3.5 text-amber-600" />
      Order Placed
    </span>
  );
};

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber: urlOrderNumber } = useParams<{ orderNumber?: string }>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (urlOrderNumber) {
        try {
          const fetched = await orderService.getOrderByNumber(urlOrderNumber);
          if (fetched) {
            setOrder(mapBackendOrder(fetched));
            setIsLoading(false);
            return;
          }
        } catch {
          // fallback to local stored order
        }
      }

      try {
        const stored = sessionStorage.getItem('sony_feeding_kurtis_last_order');
        if (stored) {
          setOrder(JSON.parse(stored));
        }
      } catch {
        // storage unavailable
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [urlOrderNumber]);

  const handleDownloadInvoice = async () => {
    if (!order?.orderNumber) return;
    setDownloadingInvoice(true);
    try {
      await orderService.downloadInvoice(order.orderNumber);
    } catch {
      alert('Could not download invoice right now. Please try again or download from your Account.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <div className="no-print">
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
      </div>

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
          <>
            {/* Placed Order Interactive Confirmation (Hidden during print) */}
            <div className="no-print space-y-8">
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
                    Online (Razorpay)
                  </span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-neutral-stone/50" />
                <div>
                  <span className="block text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider mb-1">Order Status</span>
                  {renderOrderStatusBadge(order.orderStatus)}
                </div>
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
                        <Link
                          to={item.productSlug ? `/product/${item.productSlug}` : '/shop'}
                          className="shrink-0"
                        >
                          <img
                            src={getImageUrl(item.productImage)}
                            alt={item.productTitle}
                            className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-neutral-stone/30 shrink-0 bg-neutral-stone/10 hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-semibold text-neutral-charcoal text-base mb-1 truncate">
                            <Link
                              to={item.productSlug ? `/product/${item.productSlug}` : '/shop'}
                              className="hover:text-brand-maroon transition-colors"
                            >
                              {item.productTitle}
                            </Link>
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
                      <span>Cart Subtotal</span>
                      <span className="font-medium text-neutral-charcoal">₹{order.subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {order.discount && order.discount > 0 ? (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                        <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                      </div>
                    ) : null}

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
                  </div>

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-serif font-bold text-base text-neutral-charcoal">
                      Total Amount Paid
                    </span>
                    <span className="font-serif font-bold text-2xl text-brand-maroon">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Payment Mode Callout */}
                  <div className="p-3.5 rounded-xl bg-ivory border border-neutral-stone/40 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-brand-maroon" />
                      <span className="text-xs font-sans font-bold text-neutral-charcoal uppercase tracking-wider">
                        Online Payment (Razorpay)
                      </span>
                    </div>
                    <p className="text-xs font-sans text-neutral-charcoal/70 leading-relaxed">
                      Payment completed successfully via Razorpay (UPI, Cards & NetBanking).
                    </p>
                  </div>

                  {/* Primary Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleDownloadInvoice}
                      disabled={downloadingInvoice}
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-sm font-medium py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                    >
                      {downloadingInvoice ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Order Invoice...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Download Order Invoice (PDF)
                        </>
                      )}
                    </button>

                    <Link
                      to="/account/orders"
                      className="w-full inline-flex items-center justify-center gap-2 border border-neutral-stone/60 hover:bg-neutral-stone/10 text-neutral-charcoal font-sans text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
                    >
                      View in My Orders
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={handlePrint}
                      className="w-full inline-flex items-center justify-center gap-2 border border-neutral-stone/40 hover:bg-neutral-stone/10 text-neutral-charcoal/80 font-sans text-xs font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Order Summary
                    </button>

                    <Link
                      to="/shop"
                      className="w-full inline-flex items-center justify-center gap-2 text-brand-maroon hover:text-brand-maroon/80 font-sans text-xs font-medium py-1 transition-colors"
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
                  <p className="pt-1">
                    <a
                      href="mailto:sonycollections00@gmail.com"
                      className="text-brand-maroon font-semibold underline hover:opacity-80 transition-opacity"
                    >
                      sonycollections00@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DEDICATED PRINTABLE ORDER RECEIPT (Clean single-page Amazon/Myntra invoice layout) */}
            <div className="hidden print:block w-full font-sans text-neutral-900 bg-white p-2">
              {/* Boutique Header */}
              <div className="border-b-2 border-neutral-800 pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-neutral-900">
                    SONY COLLECTIONS
                  </h1>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Mom&apos;s Love • Handcrafted Ethnic & Feeding Wear
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Email: sonycollections00@gmail.com | Phone: +91 70931 35162
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded text-right">
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">Official Order Summary</span>
                    <span className="font-mono font-bold text-sm text-neutral-900">{order.orderNumber}</span>
                  </div>
                  <p className="text-xs text-neutral-700 mt-1">
                    <strong>Date:</strong> {order.date}
                  </p>
                  <p className="text-xs text-neutral-700">
                    <strong>Payment:</strong> Online Prepaid (Razorpay) • Paid
                  </p>
                </div>
              </div>

              {/* Recipient & Address Details */}
              <div className="grid grid-cols-2 gap-4 border border-neutral-300 rounded-lg p-3 mb-4 text-xs">
                <div>
                  <span className="block font-bold text-neutral-600 uppercase text-[10px] mb-1">
                    Customer Information
                  </span>
                  <p className="font-bold text-neutral-900">{order.shippingAddress.fullName}</p>
                  <p className="text-neutral-700">+91 {order.shippingAddress.phone}</p>
                  <p className="text-neutral-700">{order.customerEmail}</p>
                </div>
                <div>
                  <span className="block font-bold text-neutral-600 uppercase text-[10px] mb-1">
                    Shipping Coordinates
                  </span>
                  <p className="text-neutral-900 font-medium">
                    {order.shippingAddress.houseFlat}, {order.shippingAddress.streetArea}
                  </p>
                  {order.shippingAddress.landmark && (
                    <p className="text-neutral-600 text-[11px]">Landmark: {order.shippingAddress.landmark}</p>
                  )}
                  <p className="text-neutral-900 font-medium">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p className="text-neutral-600 text-[11px]">{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left border-collapse mb-4">
                <thead>
                  <tr className="border-b-2 border-neutral-800 bg-neutral-100">
                    <th className="py-2 px-2 font-bold text-neutral-700 w-12">Item</th>
                    <th className="py-2 px-2 font-bold text-neutral-700">Garment Description</th>
                    <th className="py-2 px-2 font-bold text-neutral-700">Type</th>
                    <th className="py-2 px-2 font-bold text-neutral-700">Color</th>
                    <th className="py-2 px-2 font-bold text-neutral-700">Size</th>
                    <th className="py-2 px-2 font-bold text-neutral-700 text-right">Unit Price</th>
                    <th className="py-2 px-2 font-bold text-neutral-700 text-center">Qty</th>
                    <th className="py-2 px-2 font-bold text-neutral-700 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {order.items.map((item, idx) => (
                    <tr key={item.id || idx} className="align-middle">
                      <td className="py-2 px-2">
                        <img
                          src={getImageUrl(item.productImage)}
                          alt={item.productTitle}
                          className="w-10 h-12 object-cover rounded border border-neutral-200"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <div className="font-semibold text-neutral-900">{item.productTitle}</div>
                        {item.sku && <div className="text-[10px] text-neutral-500 font-mono">SKU: {item.sku}</div>}
                      </td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${item.clothingType === 'Feeding' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.clothingType || 'Standard'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-neutral-800">{item.selectedColor.name}</td>
                      <td className="py-2 px-2 text-neutral-800 font-semibold">{item.selectedSize}</td>
                      <td className="py-2 px-2 text-right text-neutral-800">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-center font-bold text-neutral-800">{item.quantity}</td>
                      <td className="py-2 px-2 text-right font-bold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="flex justify-end mb-6">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Items Subtotal:</span>
                    <span className="font-medium text-neutral-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount && order.discount > 0 ? (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}:</span>
                      <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping:</span>
                    <span className="font-medium text-neutral-900">
                      {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="border-t-2 border-neutral-800 pt-1.5 flex justify-between text-sm font-bold text-neutral-900">
                    <span>Total Paid:</span>
                    <span>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="border-t border-neutral-300 pt-3 text-[10px] text-neutral-500 text-center leading-relaxed">
                <p className="font-semibold text-neutral-700">Thank you for choosing Sony Collections!</p>
                <p>Store Policy: No returns or refunds offered. We facilitate replacements/exchanges strictly for items received damaged upon verification of unboxing video proof.</p>
                <p>For questions or exchange assistance, contact us at sonycollections00@gmail.com | Phone: +91 70931 35162</p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <div className="no-print">
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
    </div>
  );
};

export default OrderConfirmationPage;
