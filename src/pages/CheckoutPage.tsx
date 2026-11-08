import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Info
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, DeliveryAddress } from '../types/order';
import { ALL_INDIAN_REGIONS } from '../data/regions';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, total } = useCart();
  const { user, isAuthenticated, openAuthModal, devLogin } = useAuth();

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

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');

  // Validation Errors & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);
  const [validatedPayload, setValidatedPayload] = useState<{
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: DeliveryAddress;
    total: number;
    paymentMethod: PaymentMethod;
    itemsCount: number;
  } | null>(null);

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
          if (!isAuthenticated) devLogin();
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal(() => {}, '/checkout');
      return;
    }

    if (items.length === 0) {
      alert('Your shopping bag is empty.');
      return;
    }

    if (!validateForm()) {
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: DeliveryAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      houseFlat: houseFlat.trim(),
      streetArea: streetArea.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state,
      pincode: pincode.trim(),
      country: 'India',
      isDefault: saveAddress,
    };

    // Requirement 5: Save address if requested with explicit temporary browser storage marking
    if (saveAddress) {
      try {
        sessionStorage.setItem('sony_feeding_kurtis_saved_address', JSON.stringify({
          ...shippingAddress,
          isTemporaryStorage: true,
        }));
      } catch {
        // Storage unavailable
      }
    }

    // Requirement 2: Prevent frontend-only fake order generation, fake order numbers, and fake cart clearing
    setValidatedPayload({
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      shippingAddress,
      itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
      total,
      paymentMethod,
    });

    setIsSubmitting(false);
    setIsReadinessModalOpen(true);
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
          { label: 'Shopping Bag', path: '/cart' },
          { label: 'Secure Checkout' },
        ]}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-ivory-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-brand-200">
              <Lock className="w-3.5 h-3.5 text-brand-gold" />
              <span>Encrypted Checkout Protocol</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
              Order Delivery & Payment
            </h1>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-900 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Cart</span>
          </Link>
        </div>

        {/* Empty Cart Redirection State */}
        {items.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-200 flex items-center justify-center mx-auto text-ink-muted">
              <ShoppingBag className="w-8 h-8 text-brand-accent" />
            </div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              No items in bag to checkout
            </h2>
            <p className="text-xs text-ink-secondary">
              Your bag is currently empty. Please select products from our collections before proceeding to checkout.
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
                  Shopping Bag ({items.length} items)
                </p>
                <p className="text-[11px] text-ink-secondary">
                  Total: <strong>₹{total}</strong> • Safely preserved during login
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Preserved
              </span>
            </div>

            <button
              onClick={() => openAuthModal(() => {}, '/checkout')}
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
                      Pan-India courier delivery via insured logistics partners
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
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

                  {/* Country & Save Address Checkbox with Temporary Storage Label */}
                  <div className="pt-3 border-t border-ivory-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">
                        Country: <strong>India 🇮🇳</strong> (Pan-India delivery across all 28 states & 8 UTs)
                      </span>
                    </div>

                    <div className="p-3 bg-ivory-100/70 border border-ivory-200 rounded-xl space-y-1">
                      <label className="flex items-start gap-2.5 text-xs text-ink-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="mt-0.5 rounded border-ivory-300 text-brand-700 focus:ring-brand-700 w-4 h-4"
                        />
                        <span className="font-medium">
                          Save this delivery address in temporary browser storage (Temporary local browser session for testing)
                        </span>
                      </label>
                      <p className="text-[10px] text-ink-muted pl-6 leading-relaxed">
                        <strong>Temporary Local Storage Notice:</strong> Address data saved here is stored only in your local browser session for testing. Permanent address sync will occur via your authenticated account once the Django backend is live in Stage 5.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION E: Payment Method Selection */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink-primary">
                      Payment Method Selection
                    </h3>
                    <p className="text-[11px] text-ink-muted">
                      Select your preferred payment mode for this order
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-brand-700 bg-brand-50/60 ring-1 ring-brand-700 shadow-xs'
                        : 'border-ivory-300 bg-white hover:bg-ivory-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="mt-1 text-brand-700 focus:ring-brand-700 w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brand-700" />
                          <span className="text-xs font-bold text-ink-primary">
                            Online Payment (Razorpay)
                          </span>
                          <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.2 rounded-full font-bold">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-secondary mt-1">
                          Instant payment via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-brand-700 bg-brand-50/60 ring-1 ring-brand-700 shadow-xs'
                        : 'border-ivory-300 bg-white hover:bg-ivory-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-brand-700 focus:ring-brand-700 w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-brand-700" />
                          <span className="text-xs font-bold text-ink-primary">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full font-bold">
                            Provisional
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-secondary mt-1">
                          Pay cash upon courier delivery. Provisional payment mode pending final client approval.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Gateway Integration Disclaimer */}
                <div className="p-3 bg-ivory-100/80 border border-ivory-200 rounded-xl text-[11px] text-ink-muted leading-relaxed flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Gateway Architecture Note:</strong> Real Razorpay API keys and transaction verification will be connected via the Django backend in Stage 5. No actual financial transactions take place in this interface preview.
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                  <h3 className="font-serif text-lg font-bold text-ink-primary">
                    Order Items ({items.length})
                  </h3>
                  <Link
                    to="/cart"
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                  >
                    Edit Bag
                  </Link>
                </div>

                {/* Items Scrollable List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-ivory-100">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.productImage}
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

                {/* Financial Summary */}
                <div className="space-y-2 text-xs text-ink-secondary pt-3 border-t border-ivory-200">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-ink-primary">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-ink-secondary text-[11px]">
                      Awaiting Confirmation
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-ink-primary pt-3 border-t border-ivory-200">
                    <span>Total Amount</span>
                    <span className="text-brand-900 text-lg">₹{total}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted text-right">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white py-3.5 px-4 rounded-xl font-semibold text-sm shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'cod' ? 'Confirm & Place COD Order' : 'Proceed to Place Order'} • ₹{total}
                  </span>
                </button>

                {/* Trust & Guarantee Disclosures */}
                <div className="pt-2 border-t border-ivory-200 space-y-2 text-[11px] text-ink-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Official terms and dispatch tracking provided upon catalog launch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Hygienic protective polybagging for all ethnic garments</span>
                  </div>
                </div>

              </div>
            </div>

          </form>
        )}
      </main>

      {/* Order Submission Readiness Modal (Safety Architecture Requirement) */}
      {isReadinessModalOpen && validatedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ivory-300 space-y-5 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Checkout Validation Passed
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
                Order Payload Verified
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                All contact, address, and payment selections have passed client-side validation.
              </p>
            </div>

            {/* Verified Details Card */}
            <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-300 text-xs text-ink-primary space-y-2.5">
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-ink-muted">Customer:</span>
                <span className="font-bold">{validatedPayload.customerName} (+91 {validatedPayload.customerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-ink-muted">Delivery Address:</span>
                <span className="font-medium text-right max-w-[240px]">
                  {validatedPayload.shippingAddress.houseFlat}, {validatedPayload.shippingAddress.streetArea}, {validatedPayload.shippingAddress.city}, {validatedPayload.shippingAddress.state} - {validatedPayload.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-ink-muted">Items in Bag:</span>
                <span className="font-bold">{validatedPayload.itemsCount} garments (Cart intact)</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-ink-muted">Selected Payment:</span>
                <span className="font-bold capitalize">
                  {validatedPayload.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (Provisional)'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-primary font-bold">Total Payable:</span>
                <span className="font-serif text-base font-bold text-brand-900">₹{validatedPayload.total}</span>
              </div>
            </div>

            {/* Architectural Safety Notice */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-xl text-left text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-950">Architectural Safety & Verification Note:</p>
                <p className="text-[11px] text-amber-900/90 leading-normal">
                  In accordance with strict safety rules, frontend-only fake order generation and fake cart clearing are disabled. When the Django backend API (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">POST /api/orders/</code>) is connected in Stage 5, this payload will submit directly to create the order and generate the official order ID. Payment processing (via Razorpay or COD) and verification then take place against that created order. Your shopping bag remains safe and intact.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsReadinessModalOpen(false);
                  navigate('/shop');
                }}
                className="flex-1 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
              >
                Keep Shopping (Cart Preserved)
              </button>
              <button
                type="button"
                onClick={() => setIsReadinessModalOpen(false)}
                className="border border-ivory-300 hover:bg-ivory-100 text-ink-primary font-medium text-xs py-2.5 px-4 rounded-xl transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

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
