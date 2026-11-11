import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ShieldCheck,
  Home,
  Save,
  LogIn
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order, DeliveryAddress } from '../types/order';
import { ALL_INDIAN_REGIONS } from '../data/regions';

type AccountTab = 'overview' | 'orders' | 'addresses' | 'profile';

export const AccountPage: React.FC = () => {
  const { tab: urlTab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser, openAuthModal, devLogin } = useAuth();
  const { totalItemsCount } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active tab state
  const validTabs: AccountTab[] = ['overview', 'orders', 'addresses', 'profile'];
  const initialTab: AccountTab = (urlTab && validTabs.includes(urlTab as AccountTab))
    ? (urlTab as AccountTab)
    : 'overview';
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  // Sync tab with URL parameter
  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab as AccountTab)) {
      setActiveTab(urlTab as AccountTab);
    }
  }, [urlTab]);

  const handleTabChange = (newTab: AccountTab) => {
    setActiveTab(newTab);
    if (newTab === 'overview') {
      navigate('/account');
    } else {
      navigate(`/account/${newTab}`);
    }
  };

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('sony_feeding_kurtis_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        const params = new URLSearchParams(window.location.search);
        if (import.meta.env.DEV && params.get('demo') === '1') {
          if (!isAuthenticated) devLogin();
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
                productTitle: 'Nayantara Magenta & Ombre Dupatta Kurti Set',
                productSlug: 'nayantara-rose-flared-maxi-dupatta-set',
                productImage: '/images/kurti-dupatta/magenta-ombre-kurti-dupatta.jpg',
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
            ],
            subtotal: 1499,
            shippingFee: 0,
            total: 1499,
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            orderStatus: 'placed',
          };
          setOrders([demoOrder]);
        }
      }
    } catch {
      // storage unavailable
    }
  }, [activeTab, isAuthenticated]);

  // Saved Address State
  const [savedAddress, setSavedAddress] = useState<DeliveryAddress | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<DeliveryAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    houseFlat: '',
    streetArea: '',
    landmark: '',
    city: '',
    state: 'Telangana',
    pincode: '',
    country: 'India',
    isDefault: true,
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [addressSuccessMsg, setAddressSuccessMsg] = useState('');

  // Load saved address from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sony_feeding_kurtis_saved_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedAddress(parsed);
        setAddressForm(parsed);
      } else {
        const params = new URLSearchParams(window.location.search);
        if (import.meta.env.DEV && params.get('demo') === '1') {
          const demoAddress: DeliveryAddress = {
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
          };
          setSavedAddress(demoAddress);
          setAddressForm(demoAddress);
        }
      }
    } catch {
      // storage unavailable
    }
  }, []);

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    updateUser({
      name: profileName.trim(),
      phone: profilePhone.trim(),
    });
    setProfileSavedMsg('Profile updated successfully.');
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  // Handle Address Save
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!addressForm.fullName.trim()) errs.fullName = 'Full name is required.';
    const phoneClean = addressForm.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      errs.phone = 'Valid 10-digit Indian phone number required.';
    }
    if (!addressForm.houseFlat.trim()) errs.houseFlat = 'Flat / House number required.';
    if (!addressForm.streetArea.trim()) errs.streetArea = 'Street / Locality required.';
    if (!addressForm.city.trim()) errs.city = 'City required.';
    const pinClean = addressForm.pincode.replace(/\D/g, '');
    if (!/^\d{6}$/.test(pinClean)) errs.pincode = 'Valid 6-digit PIN code required.';

    if (Object.keys(errs).length > 0) {
      setAddressErrors(errs);
      return;
    }

    setAddressErrors({});
    const newAddress: DeliveryAddress = {
      ...addressForm,
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      houseFlat: addressForm.houseFlat.trim(),
      streetArea: addressForm.streetArea.trim(),
      city: addressForm.city.trim(),
      pincode: addressForm.pincode.trim(),
    };

    setSavedAddress(newAddress);
    try {
      sessionStorage.setItem('sony_feeding_kurtis_saved_address', JSON.stringify(newAddress));
    } catch {
      // storage unavailable
    }

    setIsEditingAddress(false);
    setAddressSuccessMsg('Delivery address saved successfully.');
    setTimeout(() => setAddressSuccessMsg(''), 4000);
  };

  const handleDeleteAddress = () => {
    if (window.confirm('Are you sure you want to remove this saved delivery address?')) {
      setSavedAddress(null);
      try {
        sessionStorage.removeItem('sony_feeding_kurtis_saved_address');
      } catch {
        // storage unavailable
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Do you want to sign out of your account?')) {
      logout();
      navigate('/');
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
          { label: 'My Account', path: activeTab === 'overview' ? undefined : '/account' },
          ...(activeTab !== 'overview' ? [{ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }] : []),
        ]}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!isAuthenticated ? (
          /* Unauthenticated Gate */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-neutral-stone/40 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-gold/15 text-brand-maroon flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-neutral-charcoal mb-2">
              Sign In to Your Account
            </h1>
            <p className="text-sm font-sans text-neutral-charcoal/70 mb-6 leading-relaxed">
              Google sign-in enables you to track your ethnic kurti orders, manage saved delivery addresses, and quickly proceed to checkout.
            </p>

            <button
              onClick={() => openAuthModal(() => {}, '/account')}
              className="w-full inline-flex items-center justify-center gap-3 bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-sm font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm mb-4"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>

            <div className="pt-4 border-t border-neutral-stone/30 text-xs font-sans text-neutral-charcoal/60">
              Testing the frontend? Open the login dialog to use the reviewer test session.
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8">
            {/* Account Welcome Bar */}
            <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-maroon text-brand-gold flex items-center justify-center font-serif text-2xl font-bold border-2 border-brand-gold/40 shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-neutral-charcoal">
                      Hello, {user?.name || 'Customer'}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Active Member
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-neutral-charcoal/65 mt-0.5">
                    {user?.email} {user?.phone && `• +91 ${user.phone}`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-xs font-sans font-medium text-neutral-charcoal/70 hover:text-red-700 py-2 px-3 rounded-lg border border-neutral-stone/50 hover:border-red-200 hover:bg-red-50/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Layout Grid: Sidebar Tabs + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Tab Navigation Sidebar */}
              <div className="lg:col-span-1">
                <nav className="bg-white rounded-2xl border border-neutral-stone/40 p-2 shadow-sm space-y-1">
                  <button
                    onClick={() => handleTabChange('overview')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-brand-maroon text-white shadow-xs'
                        : 'text-neutral-charcoal hover:bg-neutral-stone/15'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Home className="w-4 h-4" />
                      Overview
                    </span>
                  </button>

                  <button
                    onClick={() => handleTabChange('orders')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-brand-maroon text-white shadow-xs'
                        : 'text-neutral-charcoal hover:bg-neutral-stone/15'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      My Orders
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'orders'
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-stone/25 text-neutral-charcoal'
                      }`}
                    >
                      {orders.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleTabChange('addresses')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                      activeTab === 'addresses'
                        ? 'bg-brand-maroon text-white shadow-xs'
                        : 'text-neutral-charcoal hover:bg-neutral-stone/15'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="w-4 h-4" />
                      Saved Addresses
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'addresses'
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-stone/25 text-neutral-charcoal'
                      }`}
                    >
                      {savedAddress ? 1 : 0}
                    </span>
                  </button>

                  <button
                    onClick={() => handleTabChange('profile')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-brand-maroon text-white shadow-xs'
                        : 'text-neutral-charcoal hover:bg-neutral-stone/15'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </span>
                  </button>
                </nav>
              </div>

              {/* Main Tab Content (Right 3 cols) */}
              <div className="lg:col-span-3">
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div
                        onClick={() => handleTabChange('orders')}
                        className="bg-white rounded-2xl border border-neutral-stone/40 p-5 shadow-sm cursor-pointer hover:border-brand-maroon/30 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider font-semibold">Total Orders</span>
                          <Package className="w-5 h-5 text-brand-maroon group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-3xl font-serif font-bold text-neutral-charcoal">{orders.length}</div>
                        <p className="text-xs font-sans text-brand-maroon mt-2 font-medium flex items-center gap-1">
                          View order history <ArrowRight className="w-3 h-3" />
                        </p>
                      </div>

                      <div
                        onClick={() => handleTabChange('addresses')}
                        className="bg-white rounded-2xl border border-neutral-stone/40 p-5 shadow-sm cursor-pointer hover:border-brand-maroon/30 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider font-semibold">Saved Addresses</span>
                          <MapPin className="w-5 h-5 text-brand-maroon group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-3xl font-serif font-bold text-neutral-charcoal">
                          {savedAddress ? 1 : 0}
                        </div>
                        <p className="text-xs font-sans text-brand-maroon mt-2 font-medium flex items-center gap-1">
                          Manage delivery destinations <ArrowRight className="w-3 h-3" />
                        </p>
                      </div>

                      <Link
                        to="/cart"
                        className="bg-white rounded-2xl border border-neutral-stone/40 p-5 shadow-sm hover:border-brand-maroon/30 transition-all group block"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-sans text-neutral-charcoal/60 uppercase tracking-wider font-semibold">Shopping Bag</span>
                          <ShoppingBag className="w-5 h-5 text-brand-maroon group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-3xl font-serif font-bold text-neutral-charcoal">{totalItemsCount}</div>
                        <p className="text-xs font-sans text-brand-maroon mt-2 font-medium flex items-center gap-1">
                          Open shopping bag <ArrowRight className="w-3 h-3" />
                        </p>
                      </Link>
                    </div>

                    {/* Recent Order Preview */}
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-stone/30 mb-4">
                        <h2 className="font-serif font-bold text-lg text-neutral-charcoal">
                          Latest Order
                        </h2>
                        {orders.length > 0 && (
                          <button
                            onClick={() => handleTabChange('orders')}
                            className="text-xs font-sans text-brand-maroon hover:underline font-medium"
                          >
                            View all {orders.length} orders
                          </button>
                        )}
                      </div>

                      {orders.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 rounded-full bg-neutral-stone/20 text-neutral-charcoal/50 flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-sans font-medium text-neutral-charcoal mb-1">
                            You have not placed any orders yet
                          </p>
                          <p className="text-xs font-sans text-neutral-charcoal/60 mb-4">
                            Explore our curated feeding friendly and ethnic festive collections.
                          </p>
                          <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-xs font-medium py-2 px-4 rounded-xl hover:bg-brand-maroon/90 transition-all"
                          >
                            Explore Collections
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-xl bg-ivory border border-neutral-stone/40">
                            <div>
                              <span className="text-xs font-sans text-neutral-charcoal/60 block">Order Number</span>
                              <span className="font-mono font-bold text-brand-maroon text-sm">{orders[0].orderNumber}</span>
                            </div>
                            <div>
                              <span className="text-xs font-sans text-neutral-charcoal/60 block">Order Date</span>
                              <span className="font-sans text-xs font-medium text-neutral-charcoal">{orders[0].date}</span>
                            </div>
                            <div>
                              <span className="text-xs font-sans text-neutral-charcoal/60 block">Total Amount</span>
                              <span className="font-sans font-bold text-sm text-neutral-charcoal">₹{orders[0].total.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-xs font-sans text-neutral-charcoal/60 block">Status</span>
                              <span className="inline-flex items-center gap-1 font-sans text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3 h-3" />
                                Pending Dispatch
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {orders[0].items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 shrink-0 p-2 rounded-xl bg-white border border-neutral-stone/30">
                                <img
                                  src={item.productImage}
                                  alt={item.productTitle}
                                  className="w-14 h-16 object-cover rounded-lg bg-neutral-stone/10"
                                />
                                <div className="text-xs font-sans pr-2">
                                  <p className="font-medium text-neutral-charcoal max-w-[140px] truncate">{item.productTitle}</p>
                                  <p className="text-neutral-charcoal/60">Qty: {item.quantity} • {item.selectedSize}</p>
                                  <p className="font-bold text-brand-maroon">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-stone/30 mb-6">
                        <div>
                          <h2 className="font-serif font-bold text-xl text-neutral-charcoal">My Orders</h2>
                          <p className="text-xs font-sans text-neutral-charcoal/65 mt-0.5">
                            Track your past and present ethnic kurti orders.
                          </p>
                        </div>
                        <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-neutral-stone/20 text-neutral-charcoal">
                          {orders.length} Total
                        </span>
                      </div>

                      {orders.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 rounded-full bg-neutral-stone/20 text-neutral-charcoal/50 flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                          <h3 className="font-serif font-bold text-lg text-neutral-charcoal mb-2">
                            No Orders Found
                          </h3>
                          <p className="text-sm font-sans text-neutral-charcoal/70 max-w-sm mx-auto mb-6">
                            You have not placed any orders during this session. Add your favourite kurtis to the bag and experience our checkout flow!
                          </p>
                          <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-sm font-medium py-3 px-6 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-sm"
                          >
                            Start Shopping
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((ord) => (
                            <div
                              key={ord.id}
                              className="rounded-2xl border border-neutral-stone/40 overflow-hidden shadow-2xs"
                            >
                              {/* Order Card Header */}
                              <div className="bg-neutral-stone/15 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-stone/30">
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-sans">
                                  <div>
                                    <span className="text-neutral-charcoal/60 block uppercase">Order ID</span>
                                    <span className="font-mono font-bold text-brand-maroon text-sm">{ord.orderNumber}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-charcoal/60 block uppercase">Placed On</span>
                                    <span className="font-medium text-neutral-charcoal">{ord.date}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-charcoal/60 block uppercase">Payment Mode</span>
                                    <span className="font-medium text-neutral-charcoal capitalize">
                                      {ord.paymentMethod === 'razorpay' ? 'Online (Razorpay)' : 'Cash on Delivery (COD)'}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                    <Clock className="w-3.5 h-3.5" />
                                    Order Placed
                                  </span>
                                </div>
                              </div>

                              {/* Order Card Items */}
                              <div className="p-4 sm:p-5 divide-y divide-neutral-stone/30">
                                {ord.items.map((item) => (
                                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                                    <img
                                      src={item.productImage}
                                      alt={item.productTitle}
                                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-neutral-stone/30 shrink-0 bg-neutral-stone/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-serif font-semibold text-neutral-charcoal text-sm sm:text-base truncate mb-1">
                                        {item.productTitle}
                                      </h4>

                                      <div className="mb-2">
                                        {item.clothingType === 'Feeding' ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                            Feeding Friendly
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                                            Standard Ethnic Fit
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-neutral-charcoal/75">
                                        <span className="inline-flex items-center gap-1">
                                          <span
                                            className="w-3 h-3 rounded-full border border-black/15"
                                            style={{ backgroundColor: item.selectedColor.hex }}
                                          />
                                          {item.selectedColor.name}
                                        </span>
                                        <span>•</span>
                                        <span>Size: <strong>{item.selectedSize}</strong></span>
                                        <span>•</span>
                                        <span>Qty: <strong>{item.quantity}</strong></span>
                                      </div>

                                      <div className="mt-2 text-sm font-sans font-bold text-neutral-charcoal">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Order Card Footer */}
                              <div className="bg-ivory/60 p-4 border-t border-neutral-stone/30 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                                <div className="text-neutral-charcoal/70">
                                  Deliver to: <strong className="text-neutral-charcoal">{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.city}, {ord.shippingAddress.pincode})
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-neutral-charcoal/70">Total:</span>
                                  <span className="font-serif font-bold text-lg text-brand-maroon">
                                    ₹{ord.total.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-stone/30 mb-6">
                        <div>
                          <h2 className="font-serif font-bold text-xl text-neutral-charcoal">Saved Delivery Addresses</h2>
                          <p className="text-xs font-sans text-neutral-charcoal/65 mt-0.5">
                            Manage where your orders get delivered across all 28 States and 8 Union Territories of India.
                          </p>
                        </div>
                        {!isEditingAddress && (
                          <button
                            onClick={() => {
                              setIsEditingAddress(true);
                              setAddressErrors({});
                            }}
                            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-xs font-medium py-2 px-3.5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            {savedAddress ? 'Update Address' : 'Add New Address'}
                          </button>
                        )}
                      </div>

                      {/* Temporary Storage Transparency Notice */}
                      <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs font-sans flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-950">Notice: Temporary Browser Session Storage</p>
                          <p className="mt-0.5 leading-relaxed text-amber-900/90">
                            Addresses saved in this phase are stored locally in your browser session for checkout testing. In Stage 5, your verified delivery addresses will be securely synchronized with the Django backend database (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">/api/customer/addresses/</code>).
                          </p>
                        </div>
                      </div>

                      {addressSuccessMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          {addressSuccessMsg}
                        </div>
                      )}

                      {/* Address Form (Editing/Creating) */}
                      {isEditingAddress ? (
                        <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl">
                          <h3 className="font-serif font-semibold text-base text-neutral-charcoal mb-4">
                            {savedAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={addressForm.fullName}
                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                                placeholder="Recipient name"
                              />
                              {addressErrors.fullName && <p className="text-xs text-red-600 mt-1">{addressErrors.fullName}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                                10-Digit Mobile Number *
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-neutral-charcoal/60">+91</span>
                                <input
                                  type="tel"
                                  maxLength={10}
                                  value={addressForm.phone}
                                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                                  placeholder="9876543210"
                                />
                              </div>
                              {addressErrors.phone && <p className="text-xs text-red-600 mt-1">{addressErrors.phone}</p>}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                              Flat / House / Building *
                            </label>
                            <input
                              type="text"
                              value={addressForm.houseFlat}
                              onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                              placeholder="e.g. Flat 302, Sai Residency"
                            />
                            {addressErrors.houseFlat && <p className="text-xs text-red-600 mt-1">{addressErrors.houseFlat}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                              Street / Area / Locality *
                            </label>
                            <input
                              type="text"
                              value={addressForm.streetArea}
                              onChange={(e) => setAddressForm({ ...addressForm, streetArea: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                              placeholder="e.g. Road No 12, Banjara Hills"
                            />
                            {addressErrors.streetArea && <p className="text-xs text-red-600 mt-1">{addressErrors.streetArea}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                              Landmark (Optional)
                            </label>
                            <input
                              type="text"
                              value={addressForm.landmark || ''}
                              onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                              placeholder="e.g. Near Apollo Hospital"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                                City / Town *
                              </label>
                              <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                                placeholder="Hyderabad"
                              />
                              {addressErrors.city && <p className="text-xs text-red-600 mt-1">{addressErrors.city}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                                State *
                              </label>
                              <select
                                value={addressForm.state}
                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon bg-white"
                              >
                                {ALL_INDIAN_REGIONS.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                                PIN Code *
                              </label>
                              <input
                                type="text"
                                maxLength={6}
                                value={addressForm.pincode}
                                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                                placeholder="500034"
                              />
                              {addressErrors.pincode && <p className="text-xs text-red-600 mt-1">{addressErrors.pincode}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-4">
                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-xs font-medium py-2.5 px-5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save Address
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingAddress(false);
                                setAddressErrors({});
                              }}
                              className="font-sans text-xs font-medium text-neutral-charcoal/70 hover:text-neutral-charcoal py-2.5 px-4"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : !savedAddress ? (
                        /* Empty State */
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-neutral-stone/20 text-neutral-charcoal/50 flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8" />
                          </div>
                          <h3 className="font-serif font-bold text-lg text-neutral-charcoal mb-2">
                            No Delivery Address Saved
                          </h3>
                          <p className="text-sm font-sans text-neutral-charcoal/70 max-w-sm mx-auto mb-6">
                            Add a delivery address now to speed up checkout on your future orders.
                          </p>
                          <button
                            onClick={() => setIsEditingAddress(true)}
                            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-sm font-medium py-2.5 px-5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            Add Primary Address
                          </button>
                        </div>
                      ) : (
                        /* Saved Address Card */
                        <div className="max-w-md p-5 rounded-2xl border border-brand-maroon/30 bg-ivory/50 relative shadow-2xs">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-maroon border border-brand-gold/30">
                                Default Shipping Address
                              </span>
                              <span className="inline-flex items-center text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-neutral-stone/30 text-neutral-charcoal/70">
                                Temporary Browser Storage
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsEditingAddress(true)}
                                className="p-1.5 text-neutral-charcoal/60 hover:text-brand-maroon rounded-lg hover:bg-white transition-colors"
                                title="Edit Address"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleDeleteAddress}
                                className="p-1.5 text-neutral-charcoal/60 hover:text-red-700 rounded-lg hover:bg-white transition-colors"
                                title="Delete Address"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-sm font-sans space-y-1">
                            <p className="font-bold text-neutral-charcoal">{savedAddress.fullName}</p>
                            <p className="text-neutral-charcoal/80 text-xs">{savedAddress.phone}</p>
                            <p className="text-neutral-charcoal/80 pt-1">
                              {savedAddress.houseFlat}, {savedAddress.streetArea}
                            </p>
                            {savedAddress.landmark && (
                              <p className="text-neutral-charcoal/60 text-xs">
                                Landmark: {savedAddress.landmark}
                              </p>
                            )}
                            <p className="text-neutral-charcoal/80">
                              {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                            </p>
                            <p className="text-xs text-neutral-charcoal/60">{savedAddress.country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 shadow-sm">
                      <div className="pb-4 border-b border-neutral-stone/30 mb-6">
                        <h2 className="font-serif font-bold text-xl text-neutral-charcoal">Profile Settings</h2>
                        <p className="text-xs font-sans text-neutral-charcoal/65 mt-0.5">
                          View and manage your account credentials and personal preferences.
                        </p>
                      </div>

                      {profileSavedMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          {profileSavedMsg}
                        </div>
                      )}

                      <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                        <div>
                          <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1.5">
                            Email Address (Google Account)
                          </label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/40 bg-neutral-stone/15 text-neutral-charcoal/70 font-sans text-sm cursor-not-allowed"
                          />
                          <p className="text-[11px] font-sans text-neutral-charcoal/55 mt-1">
                            Your email is authenticated via Google and cannot be modified directly.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1.5">
                            Phone Number
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-neutral-charcoal/60">+91</span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, ''))}
                              className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                              placeholder="9876543210"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-xs font-medium py-2.5 px-5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Update Profile
                          </button>
                        </div>
                      </form>

                      {/* Architecture Disclosure */}
                      <div className="mt-8 pt-6 border-t border-neutral-stone/30">
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="text-xs font-sans text-amber-900 leading-relaxed">
                            <span className="font-semibold text-amber-950">Backend Architecture Target:</span> In Stage 5, customer profiles will connect directly to Django REST Framework (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">/api/users/profile/</code>) authenticated via verified Google OAuth 2.0 tokens.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export default AccountPage;
