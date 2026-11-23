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
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ShieldCheck,
  Home,
  Save,
  LogIn,
  FileText,
  Loader2,
  Copy,
  Check,
  Upload,
  X,
  AlertTriangle,
  RefreshCw,
  Truck
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { Order, DeliveryAddress } from '../types/order';
import { ALL_INDIAN_REGIONS } from '../data/regions';
import { getImageUrl } from '../utils/imageUrl';

type AccountTab = 'overview' | 'orders' | 'addresses' | 'profile';

const renderOrderStatusBadge = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') {
    return (
      <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Delivered
      </span>
    );
  }
  if (s === 'shipped' || s === 'dispatched') {
    return (
      <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
        <Truck className="w-3.5 h-3.5 text-blue-600" />
        Shipped
      </span>
    );
  }
  if (s === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
        <Clock className="w-3.5 h-3.5 text-purple-600" />
        Processing
      </span>
    );
  }
  if (s === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
        <X className="w-3.5 h-3.5 text-rose-600" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
      <Clock className="w-3.5 h-3.5 text-amber-600" />
      Order Placed
    </span>
  );
};

export const AccountPage: React.FC = () => {
  const { tab: urlTab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading, logout, updateUser, openAuthModal } = useAuth();

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

  // Orders State & Pagination
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 5;
  const [downloadingInvoiceNumber, setDownloadingInvoiceNumber] = useState<string | null>(null);

  const [invoiceErrorMsg, setInvoiceErrorMsg] = useState<string | null>(null);

  const totalOrderPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage);

  const handleDownloadInvoice = async (orderNumber: string) => {
    setDownloadingInvoiceNumber(orderNumber);
    setInvoiceErrorMsg(null);
    try {
      await orderService.downloadInvoice(orderNumber);
    } catch {
      setInvoiceErrorMsg('Could not download invoice right now. Please try again later.');
      setTimeout(() => setInvoiceErrorMsg(null), 4000);
    } finally {
      setDownloadingInvoiceNumber(null);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const backendOrders = await orderService.getUserOrders();
        if (backendOrders && backendOrders.length > 0) {
          setOrders(backendOrders);
        } else {
          const stored = sessionStorage.getItem('sony_feeding_kurtis_orders');
          if (stored) {
            setOrders(JSON.parse(stored));
          } else {
            setOrders([]);
          }
        }
      } catch {
        const stored = sessionStorage.getItem('sony_feeding_kurtis_orders');
        if (stored) setOrders(JSON.parse(stored));
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [isAuthenticated]);

  // Saved Addresses State (Up to 3 addresses)
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
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
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [addressSuccessMsg, setAddressSuccessMsg] = useState('');
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Exchange Requests State
  const [customerExchanges, setCustomerExchanges] = useState<any[]>([]);
  const [exchangeModalItem, setExchangeModalItem] = useState<{ orderNumber: string; item: any } | null>(null);
  const [showExchangeSuccessModal, setShowExchangeSuccessModal] = useState<boolean>(false);
  const [exchangeReason, setExchangeReason] = useState<'damaged' | 'other'>('damaged');
  const [exchangeOtherReason, setExchangeOtherReason] = useState('');
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [exchangeProofFile, setExchangeProofFile] = useState<File | null>(null);
  const [exchangeSubmitting, setExchangeSubmitting] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadAddresses = async () => {
    try {
      const addrs = await authService.getAddresses();
      setSavedAddresses(addrs || []);
    } catch {
      setSavedAddresses([]);
    }
  };

  const loadExchanges = async () => {
    try {
      const excs = await orderService.getUserExchanges();
      setCustomerExchanges(excs || []);
    } catch {
      setCustomerExchanges([]);
    }
  };

  // Load saved addresses and exchanges from backend API
  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
      loadExchanges();
    } else {
      setSavedAddresses([]);
      setCustomerExchanges([]);
    }
  }, [isAuthenticated]);

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
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    try {
      const updated = await authService.updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      updateUser(updated);
      setProfileSavedMsg('Profile updated successfully.');
    } catch {
      updateUser({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      setProfileSavedMsg('Profile updated.');
    }
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  // Handle Address Save (supporting up to 3 saved delivery addresses)
  const handleSaveAddress = async (e: React.FormEvent) => {
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

    if (!editingAddressId && savedAddresses.length >= 3) {
      setAddressErrors({ form: 'You can save up to 3 delivery addresses. Please edit or delete an existing address.' });
      return;
    }

    setAddressErrors({});
    const newAddress: DeliveryAddress = {
      ...addressForm,
      id: editingAddressId || undefined,
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      houseFlat: addressForm.houseFlat.trim(),
      streetArea: addressForm.streetArea.trim(),
      city: addressForm.city.trim(),
      pincode: addressForm.pincode.trim(),
    };

    try {
      await authService.saveAddress(newAddress);
      await loadAddresses();
      setIsEditingAddress(false);
      setEditingAddressId(null);
      setAddressSuccessMsg(editingAddressId ? 'Address updated successfully.' : 'New address saved successfully.');
      setTimeout(() => setAddressSuccessMsg(''), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to save address.';
      setAddressErrors({ form: msg });
    }
  };

  const handleDeleteAddress = (id?: string) => {
    if (!id) return;
    setAddressToDelete(id);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    const id = addressToDelete;
    setAddressToDelete(null);
    try {
      await authService.deleteAddress(id);
      await loadAddresses();
      setAddressSuccessMsg('Delivery address removed.');
      setTimeout(() => setAddressSuccessMsg(''), 4000);
    } catch {
      setAddressErrors({ form: 'Could not delete address. Please try again.' });
    }
  };

  const handleSetDefaultAddress = async (id?: string) => {
    if (!id) return;
    try {
      await authService.setDefaultAddress(id);
      await loadAddresses();
      setAddressSuccessMsg('Default delivery address updated.');
      setTimeout(() => setAddressSuccessMsg(''), 4000);
    } catch {
      setAddressErrors({ form: 'Could not update default address. Please try again.' });
    }
  };

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeModalItem) return;
    setExchangeError(null);

    if (!exchangeProofFile) {
      setExchangeError('Please upload a photo or unboxing video showing the damaged product (Mandatory).');
      return;
    }

    if (exchangeReason === 'other' && !exchangeOtherReason.trim()) {
      setExchangeError('Please specify the other reason.');
      return;
    }

    setExchangeSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('item_id', String(exchangeModalItem.item.id));
      formData.append('reason', exchangeReason);
      if (exchangeReason === 'other') {
        formData.append('other_reason', exchangeOtherReason.trim());
      }
      if (exchangeNotes.trim()) {
        formData.append('customer_notes', exchangeNotes.trim());
      }
      formData.append('proof_file', exchangeProofFile);

      await orderService.requestExchange(exchangeModalItem.orderNumber, formData);
      await loadExchanges();
      setExchangeModalItem(null);
      setExchangeProofFile(null);
      setExchangeOtherReason('');
      setExchangeNotes('');
      setExchangeError(null);
      setShowExchangeSuccessModal(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Could not submit exchange request. Please try again.';
      setExchangeError(msg);
    } finally {
      setExchangeSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
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
        {authLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-brand-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-neutral-charcoal/70 font-sans tracking-wide">Loading account details...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          /* Unauthenticated Gate */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-neutral-stone/40 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-800 flex items-center justify-center mx-auto mb-4 border border-brand-100">
              <User className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-neutral-charcoal mb-2">
              Sign In to Your Account
            </h1>
            <p className="text-sm font-sans text-neutral-charcoal/70 mb-6 leading-relaxed">
              Sign in to view your feeding-friendly kurti orders, track live parcel dispatches, and manage saved delivery addresses.
            </p>

            <button
              onClick={() => openAuthModal(() => {}, '/account')}
              className="w-full inline-flex items-center justify-center gap-3 bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-sm font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md mb-4 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Proceed
            </button>

            <p className="text-xs font-sans text-neutral-charcoal/60">
              New to Sony Collections? Create a free account in seconds.
            </p>
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
                      {savedAddresses.length}
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
                    {/* Recent Order Preview */}
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-stone/30 mb-4">
                        <h2 className="font-serif font-bold text-lg text-neutral-charcoal">
                          Latest Order
                        </h2>
                        {orders.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleTabChange('orders')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-maroon/30 bg-brand-maroon/5 hover:bg-brand-maroon text-brand-maroon hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-2xs group"
                          >
                            <span>View all {orders.length} orders</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownloadInvoice(orders[0].orderNumber)}
                                disabled={downloadingInvoiceNumber === orders[0].orderNumber}
                                className="inline-flex items-center gap-1 text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg border border-brand-maroon/30 bg-white hover:bg-brand-maroon/5 text-brand-maroon transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                                title="Download official Order Invoice PDF"
                              >
                                {downloadingInvoiceNumber === orders[0].orderNumber ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Downloading...</span>
                                  </>
                                ) : (
                                  <>
                                    <FileText className="w-3 h-3" />
                                    <span>Invoice PDF</span>
                                  </>
                                )}
                              </button>
                              {renderOrderStatusBadge(orders[0].orderStatus)}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {orders[0].items.map((item) => (
                              <Link
                                to={item.productSlug ? `/product/${item.productSlug}` : '/shop'}
                                key={item.id}
                                className="flex items-center gap-3 shrink-0 p-2 rounded-xl bg-white border border-neutral-stone/30 hover:border-brand-maroon/50 transition-colors group"
                              >
                                <img
                                  src={getImageUrl(item.productImage)}
                                  alt={item.productTitle}
                                  className="w-14 h-16 object-cover rounded-lg bg-neutral-stone/10 group-hover:opacity-90 transition-opacity"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                  }}
                                />
                                <div className="text-xs font-sans pr-2">
                                  <p className="font-medium text-neutral-charcoal max-w-[140px] truncate group-hover:text-brand-maroon transition-colors">{item.productTitle}</p>
                                  <p className="text-neutral-charcoal/60">Qty: {item.quantity} • {item.selectedSize}</p>
                                  <p className="font-bold text-brand-maroon">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                              </Link>
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
                          {invoiceErrorMsg && (
                            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded-xl flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>{invoiceErrorMsg}</span>
                            </div>
                          )}
                          {paginatedOrders.map((ord) => (
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
                                      {ord.paymentMethod === 'razorpay' ? 'Online (Razorpay)' : 'Prepaid Online'}
                                    </span>
                                  </div>
                                  {ord.coupon_code && (
                                    <div>
                                      <span className="text-neutral-charcoal/60 block uppercase">Code Applied</span>
                                      <span className="font-mono font-bold text-emerald-800 text-xs">{ord.coupon_code}</span>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  {renderOrderStatusBadge(ord.orderStatus)}
                                </div>
                              </div>

                              {/* Order Card Items */}
                              <div className="p-4 sm:p-5 divide-y divide-neutral-stone/30">
                                {ord.items.map((item) => {
                                  const itemExchange = customerExchanges.find(
                                    (e) =>
                                      String(e.item_id) === String(item.id) ||
                                      (e.order_number === ord.orderNumber &&
                                        (e.original_product_name === item.productTitle || e.item_id === Number(item.id)))
                                  );

                                  return (
                                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4">
                                      <Link
                                        to={item.productSlug ? `/product/${item.productSlug}` : '/shop'}
                                        className="shrink-0"
                                      >
                                        <img
                                          src={getImageUrl(item.productImage)}
                                          alt={item.productTitle}
                                          className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-neutral-stone/30 shrink-0 bg-neutral-stone/10 hover:opacity-90 transition-opacity"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                          }}
                                        />
                                      </Link>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                          <div>
                                            <h4 className="font-serif font-semibold text-neutral-charcoal text-sm sm:text-base truncate mb-1">
                                              <Link
                                                to={item.productSlug ? `/product/${item.productSlug}` : '/shop'}
                                                className="hover:text-brand-maroon transition-colors"
                                              >
                                                {item.productTitle}
                                              </Link>
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
                                          </div>

                                          {/* Exchange Action or Status */}
                                          {itemExchange ? (
                                            <div className="p-2.5 rounded-xl border border-neutral-stone/40 bg-neutral-stone/10 text-xs space-y-1.5 max-w-sm">
                                              <div className="flex items-center gap-1.5">
                                                {itemExchange.status === 'Requested' && (
                                                  <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                                                    <Clock className="w-3 h-3" /> Exchange Requested (Under Review)
                                                  </span>
                                                )}
                                                {itemExchange.status === 'Approved' && (
                                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                                    <Check className="w-3 h-3" /> Exchange Approved!
                                                  </span>
                                                )}
                                                {itemExchange.status === 'Rejected' && (
                                                  <span className="inline-flex items-center gap-1 font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[10px]">
                                                    <X className="w-3 h-3" /> Exchange Not Approved
                                                  </span>
                                                )}
                                              </div>

                                              {itemExchange.status === 'Approved' && itemExchange.exchange_code && (
                                                <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg space-y-1">
                                                  <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] text-purple-900 font-bold uppercase tracking-wider">Exchange Code:</span>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleCopyCode(itemExchange.exchange_code)}
                                                      className="inline-flex items-center gap-1 text-[10px] text-brand-800 font-bold bg-white px-2 py-0.5 rounded border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                                                    >
                                                      {copiedCode === itemExchange.exchange_code ? (
                                                        <>
                                                          <Check className="w-3 h-3 text-emerald-600" />
                                                          <span>Copied!</span>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <Copy className="w-3 h-3" />
                                                          <span>Copy Code</span>
                                                        </>
                                                      )}
                                                    </button>
                                                  </div>
                                                  <div className="font-mono font-bold text-brand-maroon text-xs tracking-wider">
                                                    {itemExchange.exchange_code}
                                                  </div>
                                                  <p className="text-[10px] text-purple-800 leading-tight">
                                                    Apply this in the <strong>Coupon Code</strong> box at checkout to redeem your exchange value.
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            ord.orderStatus === 'delivered' && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setExchangeModalItem({ orderNumber: ord.orderNumber, item });
                                                  setExchangeReason('damaged');
                                                  setExchangeOtherReason('');
                                                  setExchangeNotes('');
                                                  setExchangeProofFile(null);
                                                  setExchangeError(null);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-maroon/40 text-brand-maroon hover:bg-brand-maroon/5 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                                              >
                                                <RefreshCw className="w-3.5 h-3.5 text-brand-maroon" />
                                                <span>Request Exchange</span>
                                              </button>
                                            )
                                          )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-neutral-charcoal/75 mt-1">
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
                                  );
                                })}
                              </div>

                              {/* Order Card Footer */}
                              <div className="bg-ivory/60 p-4 border-t border-neutral-stone/30 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                                <div className="text-neutral-charcoal/70">
                                  Deliver to: <strong className="text-neutral-charcoal">{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.city}, {ord.shippingAddress.pincode})
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <button
                                    onClick={() => handleDownloadInvoice(ord.orderNumber)}
                                    disabled={downloadingInvoiceNumber === ord.orderNumber}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-maroon/30 bg-white hover:bg-brand-maroon/5 text-brand-maroon font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                                    title="Download official Order Invoice PDF"
                                  >
                                    {downloadingInvoiceNumber === ord.orderNumber ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Downloading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Order Invoice (PDF)</span>
                                      </>
                                    )}
                                  </button>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-neutral-charcoal/70">Total:</span>
                                    <span className="font-serif font-bold text-lg text-brand-maroon">
                                      ₹{ord.total.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Orders Pagination Controls */}
                          {totalOrderPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-stone/30">
                              <p className="text-xs font-sans text-neutral-charcoal/70">
                                Showing <strong>{(ordersPage - 1) * ordersPerPage + 1}–{Math.min(ordersPage * ordersPerPage, orders.length)}</strong> of <strong>{orders.length}</strong> orders
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                                  disabled={ordersPage === 1}
                                  className="px-3 py-1.5 rounded-xl border border-neutral-stone/40 text-xs font-sans font-medium text-neutral-charcoal hover:bg-neutral-stone/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                  Previous
                                </button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                      key={pageNum}
                                      type="button"
                                      onClick={() => setOrdersPage(pageNum)}
                                      className={`w-7 h-7 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer ${
                                        ordersPage === pageNum
                                          ? 'bg-brand-maroon text-white shadow-2xs'
                                          : 'border border-neutral-stone/40 text-neutral-charcoal hover:bg-neutral-stone/15'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setOrdersPage((p) => Math.min(totalOrderPages, p + 1))}
                                  disabled={ordersPage === totalOrderPages}
                                  className="px-3 py-1.5 rounded-xl border border-neutral-stone/40 text-xs font-sans font-medium text-neutral-charcoal hover:bg-neutral-stone/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-stone/30 mb-6 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-serif font-bold text-xl text-neutral-charcoal">Saved Delivery Addresses</h2>
                            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-brand-maroon/10 text-brand-maroon">
                              {savedAddresses.length} / 3
                            </span>
                          </div>
                          <p className="text-xs font-sans text-neutral-charcoal/65 mt-0.5">
                            You can save up to 3 delivery addresses for quick and effortless checkout.
                          </p>
                        </div>
                        {!isEditingAddress && (
                          <div>
                            {savedAddresses.length < 3 ? (
                              <button
                                onClick={() => {
                                  setEditingAddressId(null);
                                  setAddressForm({
                                    fullName: user?.name || '',
                                    phone: user?.phone || '',
                                    houseFlat: '',
                                    streetArea: '',
                                    landmark: '',
                                    city: '',
                                    state: 'Telangana',
                                    pincode: '',
                                    country: 'India',
                                    isDefault: savedAddresses.length === 0,
                                  });
                                  setIsEditingAddress(true);
                                  setAddressErrors({});
                                }}
                                className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-xs font-medium py-2 px-3.5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs"
                              >
                                <Plus className="w-4 h-4" />
                                Add New Address
                              </button>
                            ) : (
                              <span className="text-xs font-sans text-neutral-charcoal/60 bg-neutral-stone/20 px-3 py-1.5 rounded-xl">
                                Max 3 addresses reached
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {addressSuccessMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          {addressSuccessMsg}
                        </div>
                      )}

                      {addressErrors.form && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                          {addressErrors.form}
                        </div>
                      )}

                      {/* Address Form (Editing / Creating) */}
                      {isEditingAddress ? (
                        <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl">
                          <h3 className="font-serif font-semibold text-base text-neutral-charcoal mb-4">
                            {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
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

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="checkbox"
                              id="isDefaultAddress"
                              checked={!!addressForm.isDefault}
                              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                              className="rounded border-neutral-stone/60 text-brand-maroon focus:ring-brand-maroon h-4 w-4"
                            />
                            <label htmlFor="isDefaultAddress" className="text-xs font-sans text-neutral-charcoal cursor-pointer select-none">
                              Make this my default shipping address
                            </label>
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
                                setEditingAddressId(null);
                                setAddressErrors({});
                              }}
                              className="font-sans text-xs font-medium text-neutral-charcoal/70 hover:text-neutral-charcoal py-2.5 px-4"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : savedAddresses.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-neutral-stone/20 text-neutral-charcoal/50 flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8" />
                          </div>
                          <h3 className="font-serif font-bold text-lg text-neutral-charcoal mb-2">
                            No Delivery Address Saved
                          </h3>
                          <p className="text-sm font-sans text-neutral-charcoal/70 max-w-sm mx-auto mb-6">
                            Add up to 3 delivery addresses now to speed up checkout on your future orders.
                          </p>
                          <button
                            onClick={() => {
                              setEditingAddressId(null);
                              setAddressForm({
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
                              setIsEditingAddress(true);
                              setAddressErrors({});
                            }}
                            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-sm font-medium py-2.5 px-5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            Add Primary Address
                          </button>
                        </div>
                      ) : (
                        /* Saved Address Grid (Up to 3 addresses) */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr.id || `${addr.fullName}-${addr.pincode}`}
                              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                                addr.isDefault
                                  ? 'border-brand-maroon/50 bg-brand-maroon/[0.02] shadow-xs'
                                  : 'border-neutral-stone/40 bg-white hover:border-neutral-stone/70'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  {addr.isDefault ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-maroon border border-brand-gold/30">
                                      Default Address
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleSetDefaultAddress(addr.id)}
                                      className="text-[11px] font-sans text-neutral-charcoal/60 hover:text-brand-maroon underline"
                                    >
                                      Set as Default
                                    </button>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingAddressId(addr.id || null);
                                        setAddressForm({
                                          fullName: addr.fullName,
                                          phone: addr.phone,
                                          houseFlat: addr.houseFlat,
                                          streetArea: addr.streetArea,
                                          landmark: addr.landmark || '',
                                          city: addr.city,
                                          state: addr.state,
                                          pincode: addr.pincode,
                                          country: addr.country || 'India',
                                          isDefault: !!addr.isDefault,
                                        });
                                        setIsEditingAddress(true);
                                        setAddressErrors({});
                                      }}
                                      className="p-1.5 text-neutral-charcoal/60 hover:text-brand-maroon rounded-lg hover:bg-neutral-stone/20 transition-colors"
                                      title="Edit Address"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAddress(addr.id)}
                                      className="p-1.5 text-neutral-charcoal/60 hover:text-red-700 rounded-lg hover:bg-rose-50 transition-colors"
                                      title="Delete Address"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-sm font-sans space-y-1">
                                  <p className="font-bold text-neutral-charcoal">{addr.fullName}</p>
                                  <p className="text-neutral-charcoal/80 text-xs">+91 {addr.phone}</p>
                                  <p className="text-neutral-charcoal/80 pt-1 text-xs leading-relaxed">
                                    {addr.houseFlat}, {addr.streetArea}
                                  </p>
                                  {addr.landmark && (
                                    <p className="text-neutral-charcoal/60 text-xs">
                                      Landmark: {addr.landmark}
                                    </p>
                                  )}
                                  <p className="text-neutral-charcoal/80 text-xs">
                                    {addr.city}, {addr.state} - {addr.pincode}
                                  </p>
                                  <p className="text-xs text-neutral-charcoal/60">{addr.country || 'India'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Damaged Product Exchange Request Modal */}
        {exchangeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-neutral-stone/30 relative">
              <button
                onClick={() => {
                  if (!exchangeSubmitting) {
                    setExchangeModalItem(null);
                    setExchangeProofFile(null);
                    setExchangeError(null);
                  }
                }}
                className="absolute right-4 top-4 text-neutral-charcoal/60 hover:text-neutral-charcoal p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-brand-maroon">
                <RefreshCw className="w-5 h-5" />
                <h3 className="font-serif font-bold text-xl text-neutral-charcoal">Request Damaged Product Exchange</h3>
              </div>
              <p className="text-xs font-sans text-neutral-charcoal/70 mb-4">
                Boutique Policy: No returns or refunds are offered. We strictly facilitate replacements/exchanges for items received damaged upon verification of photographic or unboxing video proof.
              </p>

              {/* Item Preview */}
              <div className="flex items-center gap-3 p-3 bg-neutral-stone/15 rounded-xl mb-4 border border-neutral-stone/30">
                <img
                  src={getImageUrl(exchangeModalItem.item.productImage || exchangeModalItem.item.product_image)}
                  alt={exchangeModalItem.item.productTitle || exchangeModalItem.item.product_name || 'Garment'}
                  className="w-16 h-20 object-cover rounded-lg border border-neutral-stone/40 bg-white"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                />
                <div className="text-xs font-sans flex-1">
                  <p className="font-semibold text-neutral-charcoal text-sm">
                    {exchangeModalItem.item.productTitle || exchangeModalItem.item.product_name}
                  </p>
                  <p className="text-neutral-charcoal/75 mt-0.5">
                    {exchangeModalItem.item.clothingType && (
                      <span className="font-medium text-brand-maroon mr-1.5">
                        [{exchangeModalItem.item.clothingType}]
                      </span>
                    )}
                    {(exchangeModalItem.item.selectedColor?.name || exchangeModalItem.item.color) && (
                      <span className="mr-1.5">
                        {exchangeModalItem.item.selectedColor?.name || exchangeModalItem.item.color} •
                      </span>
                    )}
                    Size: <strong>{typeof exchangeModalItem.item.selectedSize === 'object' ? exchangeModalItem.item.selectedSize.name : (exchangeModalItem.item.selectedSize || exchangeModalItem.item.size || 'M')}</strong> • Qty: <strong>{exchangeModalItem.item.quantity || 1}</strong>
                  </p>
                  <p className="text-brand-maroon font-serif font-bold text-base mt-1">
                    ₹{Number((exchangeModalItem.item.price || exchangeModalItem.item.unit_price || 0) * (exchangeModalItem.item.quantity || 1)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {exchangeError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{exchangeError}</span>
                </div>
              )}

              <form onSubmit={handleExchangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                    Exchange Reason *
                  </label>
                  <select
                    value={exchangeReason}
                    onChange={(e) => setExchangeReason(e.target.value as 'damaged' | 'other')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm bg-white focus:outline-hidden focus:border-brand-maroon"
                  >
                    <option value="damaged">Received damaged product</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {exchangeReason === 'other' && (
                  <div>
                    <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                      Please Specify Reason *
                    </label>
                    <textarea
                      rows={2}
                      value={exchangeOtherReason}
                      onChange={(e) => setExchangeOtherReason(e.target.value)}
                      placeholder="Describe the issue with the received garment..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                    Mandatory Damage Proof (Photo or Video) *
                  </label>
                  <div className="relative border-2 border-dashed border-brand-maroon/30 rounded-xl p-4 text-center bg-brand-maroon/[0.02] hover:bg-brand-maroon/[0.05] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setExchangeProofFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <Upload className="w-6 h-6 text-brand-maroon mx-auto mb-1.5" />
                    <p className="text-xs font-sans font-medium text-neutral-charcoal">
                      {exchangeProofFile ? (
                        <span className="text-emerald-700 font-semibold">{exchangeProofFile.name} (Ready to upload)</span>
                      ) : (
                        <span>Click or drag damaged product photo / unboxing video</span>
                      )}
                    </p>
                    <p className="text-[11px] font-sans text-neutral-charcoal/60 mt-1">
                      JPG, PNG, MP4, MOV up to 50MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-neutral-charcoal/80 mb-1">
                    Customer Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={exchangeNotes}
                    onChange={(e) => setExchangeNotes(e.target.value)}
                    placeholder="Any additional details regarding unboxing or damage..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] font-sans text-amber-900 leading-relaxed">
                  💡 <strong>How Exchange Works:</strong> Once our admin team approves your damage proof, an exchange coupon code equal to the purchased item total will be issued directly in your order history. You can apply it on checkout for an item of equal or higher value. (Coupons are single-use).
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={exchangeSubmitting}
                    onClick={() => {
                      setExchangeModalItem(null);
                      setExchangeProofFile(null);
                      setExchangeError(null);
                    }}
                    className="px-4 py-2.5 text-xs font-sans font-medium text-neutral-charcoal/70 hover:text-neutral-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={exchangeSubmitting}
                    className="inline-flex items-center gap-2 bg-brand-maroon text-white font-sans text-xs font-medium py-2.5 px-5 rounded-xl hover:bg-brand-maroon/90 transition-all shadow-xs disabled:opacity-50"
                  >
                    {exchangeSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Exchange Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Exchange Request Success Confirmation Modal */}
        {showExchangeSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-stone/30 text-center animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-neutral-charcoal mb-2">
                Exchange Request Submitted!
              </h3>
              <p className="text-xs font-sans text-neutral-charcoal/75 mb-6 leading-relaxed">
                Our boutique team will verify your damage proof video/photos and issue a single-use exchange coupon directly in your order history within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setShowExchangeSuccessModal(false)}
                className="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Understood, Got It
              </button>
            </div>
          </div>
        )}

        {/* Delete Address Confirmation Modal */}
        {addressToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-stone/40">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-center text-lg text-neutral-charcoal mb-2">
                Remove Delivery Address?
              </h3>
              <p className="font-sans text-xs text-center text-neutral-charcoal/70 mb-6">
                Are you sure you want to remove this saved delivery address from your account?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddressToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-stone/60 font-sans text-xs font-semibold text-neutral-charcoal hover:bg-neutral-stone/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAddress}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 font-sans text-xs font-semibold text-white shadow-xs transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-stone/40">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4 text-brand-maroon">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-center text-lg text-neutral-charcoal mb-2">
                Sign Out
              </h3>
              <p className="font-sans text-xs text-center text-neutral-charcoal/70 mb-6">
                Are you sure you want to sign out of your Sony Collections account?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-stone/60 font-sans text-xs font-semibold text-neutral-charcoal hover:bg-neutral-stone/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-brand-maroon hover:bg-brand-maroon/90 font-sans text-xs font-semibold text-white shadow-xs transition-colors"
                >
                  Sign Out
                </button>
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
