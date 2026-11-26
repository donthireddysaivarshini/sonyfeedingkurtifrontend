import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Check,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  Tag,
  X,
  Zap
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DeliveryAddress } from '../types/order';
import { ALL_INDIAN_REGIONS } from '../data/regions';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { storeApi } from '../services/api';
import { loadRazorpayScript, openRazorpayCheckout } from '../services/razorpay';
import { getImageUrl } from '../utils/imageUrl';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('mode') === 'buy_now';
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Buy Now direct express item state (isolated from cart drawer)
  const [buyNowItems] = useState<any[]>(() => {
    if (isBuyNow) {
      try {
        const stored = sessionStorage.getItem('sony_buy_now_item');
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : [parsed];
        }
      } catch {}
    }
    return [];
  });

  const activeItems = isBuyNow && buyNowItems.length > 0 ? buyNowItems : cartItems;
  const subtotal = isBuyNow && buyNowItems.length > 0
    ? buyNowItems.reduce((acc, it) => acc + (it.price * it.quantity), 0)
    : cartSubtotal;

  // Navigation state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State: Contact Details
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Form State: Delivery Address
  const [houseFlat, setHouseFlat] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);

  // Dynamic Site Config (shipping fees & policies)
  const [siteConfig, setSiteConfig] = useState({
    shipping_fee: 99,
    free_shipping_threshold: 1499,
    shipping_notice: 'Free shipping across India on orders above ₹1499',
    max_saved_addresses: 3,
  });

  // Saved Delivery Addresses (max 3 allowed)
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);


  // Coupon & Exchange Code State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
    is_exchange_code: boolean;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    storeApi.getSiteConfig().then((cfg) => {
      if (cfg) setSiteConfig(cfg);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      authService.getAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        if (addrs && addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr.id || null);
          setFullName(defaultAddr.fullName);
          setPhone(defaultAddr.phone);
          setHouseFlat(defaultAddr.houseFlat);
          setStreetArea(defaultAddr.streetArea);
          setLandmark(defaultAddr.landmark || '');
          setCity(defaultAddr.city);
          setState(defaultAddr.state);
          setPincode(defaultAddr.pincode);
          setIsAddingNewAddress(false);
        } else {
          setIsAddingNewAddress(true);
        }
      }).catch(() => {
        setIsAddingNewAddress(true);
      });
    }
  }, [isAuthenticated]);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await orderService.validateCoupon(code, subtotal);
      setAppliedCoupon({
        code: res.code,
        discount: res.discount,
        message: res.message,
        is_exchange_code: res.is_exchange_code,
      });
    } catch (err: any) {
      setAppliedCoupon(null);
      const msg = err?.error || err?.detail || err?.message || 'Invalid coupon or exchange code.';
      setCouponError(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const couponDiscount = appliedCoupon?.discount ?? 0;
  const isFreeShipping = subtotal >= siteConfig.free_shipping_threshold;
  const shippingFee = isFreeShipping ? 0 : siteConfig.shipping_fee;
  const effectiveTotal = Math.max(0, subtotal + shippingFee - couponDiscount);

  // Validation Errors & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Keep contact info in sync with authenticated user profile
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Pre-fill delivery address if saved previously
  useEffect(() => {
    try {
      const savedRaw = sessionStorage.getItem('sony_feeding_kurtis_saved_address');
      if (savedRaw) {
        const addr = JSON.parse(savedRaw);
        if (addr) {
          if (!houseFlat && addr.houseFlat) setHouseFlat(addr.houseFlat);
          if (!streetArea && addr.streetArea) setStreetArea(addr.streetArea);
          if (!landmark && addr.landmark) setLandmark(addr.landmark);
          if (!city && addr.city) setCity(addr.city);
          if (addr.state) setState(addr.state);
          if (!pincode && addr.pincode) setPincode(addr.pincode);
        }
      } else if (import.meta.env.DEV) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === '1') {
          if (!houseFlat) setHouseFlat('Flat 402, Lotus Residency');
          if (!streetArea) setStreetArea('Road No 12, Banjara Hills');
          if (!landmark) setLandmark('Near Care Hospital');
          if (!city) setCity('Hyderabad');
          setState('Telangana');
          if (!pincode) setPincode('500034');
        }
      }
    } catch {
      // storage unavailable
    }
  }, [isAuthenticated]);

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    const phoneClean = phone.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneClean)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    if (!houseFlat.trim()) {
      errs.houseFlat = 'House / Flat / Building is required.';
    }

    if (!streetArea.trim()) {
      errs.streetArea = 'Street / Area / Locality is required.';
    }

    if (!city.trim()) {
      errs.city = 'City / Town is required.';
    }

    const pinClean = pincode.replace(/\D/g, '');
    if (!/^\d{6}$/.test(pinClean)) {
      errs.pincode = 'Please enter a valid 6-digit Indian PIN code (e.g. 500001).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!isAuthenticated) {
      openAuthModal(() => {}, isBuyNow ? '/checkout?mode=buy_now' : '/checkout');
      return;
    }

    if (activeItems.length === 0) {
      setCheckoutError('Your checkout items are empty.');
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const addressPayload = {
      first_name: firstName,
      last_name: lastName,
      phone: phone.trim(),
      shipping_address: houseFlat.trim(),
      houseFlat: houseFlat.trim(),
      streetArea: streetArea.trim(),
      apartment: streetArea.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state,
      zip_code: pincode.trim(),
      pincode: pincode.trim(),
      country: 'India',
      is_default: saveAddress,
    };

    if (saveAddress && isAddingNewAddress && savedAddresses.length < siteConfig.max_saved_addresses) {
      try {
        await authService.saveAddress({
          fullName: fullName.trim(),
          phone: phone.trim(),
          houseFlat: houseFlat.trim(),
          streetArea: streetArea.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state,
          pincode: pincode.trim(),
          country: 'India',
          isDefault: savedAddresses.length === 0,
        });
      } catch {
        // ignore background save errors
      }
    }

    try {
      const checkoutRes = await orderService.checkout({
        address_id: !isAddingNewAddress && selectedAddressId && !isNaN(Number(selectedAddressId)) ? Number(selectedAddressId) : undefined,
        address: addressPayload,
        payment_method: 'razorpay',
        coupon_code: appliedCoupon?.code,
        items: activeItems.map((it) => {
          const numVid = Number(it.variantId);
          const numPid = Number(it.productId);
          return {
            variant_id: !isNaN(numVid) && numVid > 0 ? numVid : undefined,
            sku: it.sku || (isNaN(numVid) ? it.variantId : undefined),
            product_id: !isNaN(numPid) && numPid > 0 ? numPid : undefined,
            product_slug: it.productSlug || undefined,
            product_title: it.productTitle || undefined,
            clothing_type: it.clothingType || undefined,
            color: it.selectedColor?.name || undefined,
            size: it.selectedSize || undefined,
            quantity: it.quantity,
          };
        }),
      });

      const rzpData = checkoutRes as any;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutError('Could not initialize payment gateway. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      openRazorpayCheckout({
        key: rzpData.key || 'rzp_test_placeholder_key',
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        order_id: rzpData.razorpay_order_id,
        name: 'Sony Collections',
        description: `Order ${rzpData.order_number}`,
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: {
          color: '#552058',
        },
        handler: async (response) => {
          try {
            await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (isBuyNow) {
              sessionStorage.removeItem('sony_buy_now_item');
            } else {
              clearCart();
            }
            sessionStorage.setItem('sony_feeding_kurtis_last_order', JSON.stringify({
              orderNumber: rzpData.order_number,
              total: effectiveTotal,
              discount: couponDiscount,
              coupon_code: appliedCoupon?.code || '',
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              customerName: fullName.trim(),
              customerEmail: email.trim(),
              customerPhone: phone.trim(),
              shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                houseFlat: houseFlat.trim(),
                streetArea: streetArea.trim(),
                city: city.trim(),
                state,
                pincode: pincode.trim(),
                country: 'India',
              },
              items: activeItems,
              total_amount: effectiveTotal,
              paymentMethod: 'razorpay',
              paymentStatus: 'Paid',
              orderStatus: 'Ordered',
            }));
            navigate(`/order-confirmation/${rzpData.order_number}`);
          } catch (err: any) {
            setCheckoutError(err?.response?.data?.error || 'Payment signature verification failed. Please contact support.');
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });
    } catch (err: any) {
      console.error('Checkout error details:', err?.response?.data || err);
      let msg = 'Could not complete order. Please try again.';
      if (err?.response?.data) {
        const d = err.response.data;
        if (typeof d === 'string') {
          msg = d;
        } else if (d.error) {
          msg = d.error;
        } else if (d.detail) {
          msg = d.detail;
        } else if (d.non_field_errors) {
          msg = Array.isArray(d.non_field_errors) ? d.non_field_errors.join(' ') : String(d.non_field_errors);
        } else if (typeof d === 'object') {
          const firstKey = Object.keys(d)[0];
          const val = d[firstKey];
          if (Array.isArray(val)) {
            msg = `${firstKey}: ${val.join(', ')}`;
          } else if (typeof val === 'object') {
            msg = JSON.stringify(val);
          } else {
            msg = String(val);
          }
        }
      } else if (err?.message) {
        msg = err.message;
      }
      setCheckoutError(msg);
      setIsSubmitting(false);
    }
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
          ...(isBuyNow ? [{ label: 'Collections', path: '/shop' }] : [{ label: 'Shopping Cart', path: '/cart' }]),
          { label: isBuyNow ? 'Express Checkout' : 'Secure Checkout' },
        ]}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-ivory-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-brand-200">
              {isBuyNow ? <Zap className="w-3.5 h-3.5 text-brand-gold" /> : <Lock className="w-3.5 h-3.5 text-brand-gold" />}
              <span>{isBuyNow ? 'Instant Express Checkout' : 'Encrypted Checkout Protocol'}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
              Order Delivery & Payment
            </h1>
          </div>

          <Link
            to={isBuyNow ? (activeItems[0]?.productSlug ? `/product/${activeItems[0].productSlug}` : '/shop') : '/cart'}
            className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-900 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBuyNow ? 'Back to Product' : 'Back to Cart'}</span>
          </Link>
        </div>

        {/* Empty Cart Redirection State */}
        {activeItems.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-200 flex items-center justify-center mx-auto text-ink-muted">
              <ShoppingBag className="w-8 h-8 text-brand-accent" />
            </div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              No items in cart to checkout
            </h2>
            <p className="text-xs text-ink-secondary">
              Your cart is currently empty. Please select products from our collections before proceeding to checkout.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-semibold hover:bg-brand-800 transition-colors shadow-sm"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : !isAuthenticated ? (
          /* Authentication Gate */
          <div className="max-w-xl mx-auto py-12 px-6 bg-white rounded-2xl border border-ivory-300 shadow-card text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-brand-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-primary">
                Google Authentication Required
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 max-w-md mx-auto leading-relaxed">
                As per store policy, Google login is mandatory before checkout to safely attach your delivery address, package tracking, and order history.
              </p>
            </div>

            <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-left flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink-primary">
                  {isBuyNow ? 'Direct Purchase' : 'Shopping Cart'} ({activeItems.length} {activeItems.length === 1 ? 'item' : 'items'})
                </p>
                <p className="text-[11px] text-ink-secondary">
                  Total: <strong>₹{subtotal.toLocaleString('en-IN')}</strong> • Safely preserved during login
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Preserved
              </span>
            </div>

            <button
              onClick={() => openAuthModal(() => {}, isBuyNow ? '/checkout?mode=buy_now' : '/checkout')}
              className="w-full py-3.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Continue Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Authenticated Checkout Form Layout */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Authenticated Customer Banner */}
              <div className="p-4 bg-white rounded-2xl border border-ivory-300 shadow-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 border border-brand-200 text-brand-800 font-bold flex items-center justify-center text-sm">
                    {user?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">Signed In as:</p>
                    <p className="text-sm font-bold text-ink-primary">{user?.name}</p>
                    <p className="text-[11px] text-ink-secondary">{user?.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Session</span>
                </span>
              </div>

              {/* SECTION A: Customer Details */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-serif text-base font-bold text-ink-primary">
                    Customer Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-ink-primary block mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Receiver's complete name"
                      className={`w-full text-xs p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                        errors.fullName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-xs font-bold text-ink-primary block mb-1">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="order-updates@example.com"
                      className={`w-full text-xs p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                        errors.email ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="text-xs font-bold text-ink-primary block mb-1">
                      Mobile Number <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-ink-muted font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className={`w-full text-xs p-2.5 pl-11 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                          errors.phone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION B: Delivery Address */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-bold text-ink-primary">
                      Delivery Address
                    </h3>
                    <p className="text-[11px] text-ink-muted">
                      Pan-India courier delivery via insured logistics partners (Saved: {savedAddresses.length}/{siteConfig.max_saved_addresses})
                    </p>
                  </div>
                </div>

                {/* Saved Address Cards */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-primary">
                        Select Delivery Address:
                      </span>
                      {savedAddresses.length < siteConfig.max_saved_addresses && !isAddingNewAddress && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNewAddress(true);
                            setSelectedAddressId(null);
                            setHouseFlat('');
                            setStreetArea('');
                            setLandmark('');
                            setCity('');
                            setPincode('');
                          }}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-900 underline cursor-pointer"
                        >
                          + Deliver to a New Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = !isAddingNewAddress && selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id || null);
                              setIsAddingNewAddress(false);
                              setFullName(addr.fullName);
                              setPhone(addr.phone);
                              setHouseFlat(addr.houseFlat);
                              setStreetArea(addr.streetArea);
                              setLandmark(addr.landmark || '');
                              setCity(addr.city);
                              setState(addr.state);
                              setPincode(addr.pincode);
                            }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-brand-700 bg-brand-50/50 ring-2 ring-brand-700 shadow-xs'
                                : 'border-ivory-300 bg-white hover:bg-ivory-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-ink-primary flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="selectedSavedAddress"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="text-brand-700 focus:ring-brand-700"
                                />
                                <span>{addr.fullName}</span>
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-ink-secondary leading-relaxed pl-5">
                              {addr.houseFlat}, {addr.streetArea}
                              {addr.landmark ? `, Near ${addr.landmark}` : ''}
                              <br />
                              {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                            </p>
                            <p className="text-[10px] text-ink-muted pl-5 mt-1">Phone: +91 {addr.phone}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Address Input Form */}
                {(isAddingNewAddress || savedAddresses.length === 0) && (
                  <div className="space-y-3.5 pt-2 border-t border-ivory-200">
                    {savedAddresses.length > 0 && (
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-brand-800">New Delivery Coordinates:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
                            setSelectedAddressId(defaultAddr.id || null);
                            setIsAddingNewAddress(false);
                            setFullName(defaultAddr.fullName);
                            setPhone(defaultAddr.phone);
                            setHouseFlat(defaultAddr.houseFlat);
                            setStreetArea(defaultAddr.streetArea);
                            setLandmark(defaultAddr.landmark || '');
                            setCity(defaultAddr.city);
                            setState(defaultAddr.state);
                            setPincode(defaultAddr.pincode);
                          }}
                          className="text-xs font-semibold text-neutral-charcoal underline cursor-pointer"
                        >
                          ← Choose from Saved Addresses
                        </button>
                      </div>
                    )}

                    {/* House / Flat / Building */}
                    <div>
                      <label className="text-xs font-bold text-ink-primary block mb-1">
                        House / Flat / Building Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={houseFlat}
                        onChange={(e) => setHouseFlat(e.target.value)}
                        placeholder="e.g. Flat 402, Sai Nilayam Apartments"
                        className={`w-full text-xs p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                          errors.houseFlat ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                        }`}
                      />
                      {errors.houseFlat && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.houseFlat}</span>
                        </p>
                      )}
                    </div>

                    {/* Street / Area / Locality */}
                    <div>
                      <label className="text-xs font-bold text-ink-primary block mb-1">
                        Street / Road / Locality <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={streetArea}
                        onChange={(e) => setStreetArea(e.target.value)}
                        placeholder="e.g. Road No 12, Banjara Hills"
                        className={`w-full text-xs p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                          errors.streetArea ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                        }`}
                      />
                      {errors.streetArea && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.streetArea}</span>
                        </p>
                      )}
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className="text-xs font-bold text-ink-primary block mb-1">
                        Landmark <span className="text-ink-muted font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near City Center Mall / Opposite Park"
                        className="w-full text-xs p-2.5 rounded-xl border border-ivory-300 bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                      />
                    </div>

                    {/* City, State, PIN code */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* City */}
                      <div>
                        <label className="text-xs font-bold text-ink-primary block mb-1">
                          City / Town <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Hyderabad"
                          className={`w-full text-xs p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                            errors.city ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-[10px] text-rose-600 mt-1">{errors.city}</p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="text-xs font-bold text-ink-primary block mb-1">
                          State <span className="text-rose-600">*</span>
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-ivory-300 bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                        >
                          {ALL_INDIAN_REGIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* PIN Code */}
                      <div>
                        <label className="text-xs font-bold text-ink-primary block mb-1">
                          PIN Code <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="500034"
                          className={`w-full text-xs p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 ${
                            errors.pincode ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20' : 'border-ivory-300 focus:ring-brand-700'
                          }`}
                        />
                        {errors.pincode && (
                          <p className="text-[10px] text-rose-600 mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>

                    {/* Save Address Checkbox */}
                    {savedAddresses.length < siteConfig.max_saved_addresses && (
                      <div className="pt-3 border-t border-ivory-200">
                        <label className="flex items-start gap-2.5 text-xs text-ink-primary cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="mt-0.5 rounded border-ivory-300 text-brand-700 focus:ring-brand-700 w-4 h-4"
                          />
                          <span className="font-medium">
                            Save this delivery address to my account ({savedAddresses.length + 1} of {siteConfig.max_saved_addresses} maximum allowed)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION E: Payment Method Selection (100% Secure Prepaid via Razorpay - Strictly No COD) */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink-primary">
                      Payment Mode
                    </h3>
                    <p className="text-[11px] text-ink-muted">
                      100% secure online prepaid gateway
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-brand-700 bg-brand-50/60 ring-1 ring-brand-700 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-700" />
                        <span className="text-xs font-bold text-ink-primary">
                          Online Prepaid (Razorpay Gateway)
                        </span>
                        <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-bold">
                          Prepaid
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-secondary mt-1">
                        Instant payment via UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards, and NetBanking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutique Policy Notice */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Boutique Policy:</strong> No Cash on Delivery (COD) or Returns/Refunds. We provide guaranteed <strong>Exchange for Damaged Products</strong> within 7 days of delivery.
                  </div>
                </div>

                {/* Payment Security Assurance */}
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bank-Grade Security:</strong> 256-bit SSL encryption. Card and UPI details are securely tokenized.
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                  <h3 className="font-serif text-lg font-bold text-ink-primary">
                    Order Items ({activeItems.length})
                  </h3>
                  {isBuyNow ? (
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      Direct Purchase (Buy Now)
                    </span>
                  ) : (
                    <Link
                      to="/cart"
                      className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                    >
                      Edit Cart
                    </Link>
                  )}
                </div>

                {/* Items Scrollable List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-ivory-100">
                  {activeItems.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={getImageUrl(item.productImage)}
                        alt={item.productTitle}
                        className="w-12 h-16 object-cover rounded-lg border border-ivory-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ink-primary truncate">
                          {item.productTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-ink-secondary mt-0.5">
                          {item.clothingType && (
                            <span className="font-semibold text-brand-700">
                              {item.clothingType === 'Feeding' ? 'Feeding' : 'Non-Feeding'}
                            </span>
                          )}
                          <span>• {item.selectedColor.name}</span>
                          <span>• Size {item.selectedSize}</span>
                          <span>• Qty {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-ink-primary shrink-0">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input Card */}
                <div className="pt-3 border-t border-ivory-200">
                  <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">
                    Have a Coupon Code?
                  </label>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-bold text-emerald-900 uppercase">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-emerald-700 ml-1.5 font-medium">
                            (- ₹{appliedCoupon.discount.toLocaleString('en-IN')})
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-neutral-charcoal/60 hover:text-red-700 p-1 rounded-md transition-colors cursor-pointer"
                        title="Remove coupon code"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          placeholder="Enter coupon or exchange voucher"
                          className="flex-1 px-3 py-2 text-xs font-mono tracking-wider uppercase rounded-xl border border-neutral-stone/60 focus:outline-hidden focus:border-brand-maroon transition-colors bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-4 py-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          {couponLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>Apply</span>
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-1.5 text-[11px] text-rose-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{couponError}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {appliedCoupon && appliedCoupon.message && (
                    <p className="mt-1.5 text-[11px] text-emerald-700 font-medium">
                      ✓ {appliedCoupon.message}
                    </p>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2 text-xs text-ink-secondary pt-3 border-t border-ivory-200">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-ink-primary">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>
                        {appliedCoupon?.is_exchange_code ? 'Exchange Voucher' : 'Coupon Discount'} ({appliedCoupon?.code})
                      </span>
                      <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-xs">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-800 font-bold">FREE</span>
                      ) : (
                        <span className="text-ink-primary font-bold">₹{shippingFee}</span>
                      )}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-brand-800 italic text-right">
                      Add ₹{(siteConfig.free_shipping_threshold - subtotal).toLocaleString('en-IN')} more for FREE shipping
                    </p>
                  )}

                  <div className="flex justify-between text-base font-bold text-ink-primary pt-3 border-t border-ivory-200">
                    <span>Total Amount</span>
                    <span className="text-brand-maroon text-lg">₹{effectiveTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted text-right">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Error Banner */}
                {checkoutError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white py-3.5 px-4 rounded-xl font-semibold text-sm shadow-md transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay ₹{effectiveTotal.toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </button>

                {/* Trust & Guarantee Disclosures */}
                <div className="pt-2 border-t border-ivory-200 space-y-2 text-[11px] text-neutral-charcoal/70">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>256-bit SSL encrypted & secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Dispatched in hygienic sealed protective packaging</span>
                  </div>
                </div>

              </div>
            </div>

          </form>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => {}}
      />

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
};
