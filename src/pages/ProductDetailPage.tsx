import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  Ruler,
  Truck,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Layers,
  Shirt,
  Star,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Maximize2,
  X
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { RatingBadge } from '../components/common/RatingBadge';
import { ProductGallery } from '../components/product-detail/ProductGallery';
import { SizeGuideModal } from '../components/product-detail/SizeGuideModal';
import { ProductCard } from '../components/products/ProductCard';
import { QuickSelectModal } from '../components/products/QuickSelectModal';
import { FeedingOptionSelector } from '../components/products/FeedingOptionSelector';
import { SITE_CONFIG } from '../config/siteConfig';
import { PRODUCTS } from '../data/products';
import { getImageUrl } from '../utils/imageUrl';
import { Product, ClothingType, ProductColor, ProductSize, ProductVariant, FeedingConfiguration, ProductReview } from '../types/product';
import { storeApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types/cart';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Dialog & Drawer States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickSelectProduct, setQuickSelectProduct] = useState<Product | null>(null);

  // Accordion section states
  const [openSections, setOpenSections] = useState({
    details: true,
    fabric: true,
    feeding: true,
    delivery: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Find matching product by slug (initialized from local cache if available, enriched from backend)
  const [product, setProduct] = useState<Product | null>(() => PRODUCTS.find((p) => p.slug === slug) || null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    storeApi.getProductBySlug(slug).then((fetched) => {
      if (isMounted && fetched) {
        setProduct(fetched);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [slug]);

// Variant Selection Order State:
  // 1. Feeding Type (Defaults to 'Feeding' if 'both' or 'feeding-only')
  // 2. Colour (Strictly filtered by valid variants for current Feeding Type)
  // 3. Size (Strictly filtered by valid variants for current Type & Colour)
  // 4. Quantity
  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);
  const [sizePromptNotice, setSizePromptNotice] = useState<string | null>(null);

  // Amazon-style Customer Reviews State
  const [reviewsData, setReviewsData] = useState<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<string, { stars: number; count: number; percentage: number }>;
    reviews: ProductReview[];
  }>({
    averageRating: 4.8,
    totalReviews: 0,
    distribution: {
      '5': { stars: 5, count: 0, percentage: 0 },
      '4': { stars: 4, count: 0, percentage: 0 },
      '3': { stars: 3, count: 0, percentage: 0 },
      '2': { stars: 2, count: 0, percentage: 0 },
      '1': { stars: 1, count: 0, percentage: 0 },
    },
    reviews: [],
  });
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newHeadline, setNewHeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
  const [enlargedReviewImage, setEnlargedReviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    storeApi.getProductReviews(slug).then((data) => {
      if (data) {
        setReviewsData(data);
      }
    });
  }, [slug]);

  // Helper functions for strict hierarchy derivation
  const getColorsForType = (
    currentProduct: Product,
    clothingType: ClothingType | null
  ): ProductColor[] => {
    const map = new Map<string, ProductColor>();

    // 1. From variants for this clothing type
    (currentProduct.variants || []).forEach((v) => {
      const typeMatch =
        currentProduct.feedingConfig === 'none' ||
        !clothingType ||
        v.clothingType === clothingType;
      if (typeMatch && v.color) {
        const cid = String(v.color.id);
        if (!map.has(cid)) {
          map.set(cid, v.color);
        }
      }
    });

    // 2. From gallery images matching this clothing type
    (currentProduct.galleryImages || []).forEach((g) => {
      const typeMatch =
        currentProduct.feedingConfig === 'none' ||
        !clothingType ||
        !g.clothingType ||
        g.clothingType === 'Standard' ||
        g.clothingType === clothingType;
      if (typeMatch && g.colorId && g.colorName) {
        const cid = String(g.colorId);
        if (!map.has(cid)) {
          map.set(cid, {
            id: cid,
            name: g.colorName,
            hex: g.colorHex || '#552058',
          });
        }
      }
    });

    return Array.from(map.values());
  };

  const getSizesForSelection = (
    variants: ProductVariant[],
    feedingConfig: FeedingConfiguration,
    clothingType: ClothingType | null,
    color: ProductColor | null
  ): { size: ProductSize; inStock: boolean; stock: number; variant: ProductVariant }[] => {
    if (!color) return [];
    const matching = variants.filter((v) => {
      const typeMatch =
        feedingConfig === 'none' ||
        !clothingType ||
        v.clothingType === clothingType;
      const colorMatch = String(v.color.id) === String(color.id);
      return typeMatch && colorMatch;
    });

    return matching.map((v) => ({
      size: v.size,
      stock: v.stock,
      inStock: v.stock > 0,
      variant: v,
    }));
  };

  // Initialize or reset selections when product changes
  useEffect(() => {
    if (product) {
      // 1. Default clothing type: 'Feeding' by default if supported/both, else 'Non-Feeding', else null
      let defaultType: ClothingType | null = null;
      if (product.feedingConfig === 'both' || product.feedingConfig === 'feeding-only') {
        defaultType = 'Feeding';
      } else if (product.supportedClothingTypes?.includes('Feeding')) {
        defaultType = 'Feeding';
      } else if (product.supportedClothingTypes?.includes('Non-Feeding')) {
        defaultType = 'Non-Feeding';
      }
      setSelectedType(defaultType);

      // 2. Default color: first valid color for this clothing type
      const validColors = getColorsForType(product, defaultType);
      const initialColor = validColors[0] || null;
      setSelectedColor(initialColor);

      // 3. Find first available in-stock size for this initial configuration
      if (initialColor) {
        const validSizes = getSizesForSelection(product.variants, product.feedingConfig, defaultType, initialColor);
        const inStockSize = validSizes.find((s) => s.inStock)?.size;
        setSelectedSize(inStockSize || validSizes[0]?.size || null);
      } else {
        setSelectedSize(null);
      }

      setQuantity(1);
      setAddSuccessMessage(null);
    }
  }, [product]);

  // Derived available colors strictly based on current clothing type
  const availableColorsForType = React.useMemo(() => {
    if (!product) return [];
    return getColorsForType(product, selectedType);
  }, [product, selectedType]);

  // Derived available sizes strictly based on current clothing type and selected color
  const availableSizesForSelection = React.useMemo(() => {
    if (!product || !selectedColor) return [];
    return getSizesForSelection(product.variants, product.feedingConfig, selectedType, selectedColor);
  }, [product, selectedType, selectedColor]);

  // Handle color change with smart size auto-selection
  const handleColorChange = (newColor: ProductColor) => {
    setSelectedColor(newColor);
    if (!product) return;

    const newSizes = getSizesForSelection(product.variants, product.feedingConfig, selectedType, newColor);
    const currentSizeMatch = newSizes.find((s) => s.size === selectedSize && s.inStock);
    if (!currentSizeMatch) {
      const firstInStock = newSizes.find((s) => s.inStock);
      setSelectedSize(firstInStock?.size || newSizes[0]?.size || null);
    }
  };

  // Handle clothing type change with color & size re-synchronization
  const handleTypeChange = (newType: ClothingType) => {
    setSelectedType(newType);
    if (!product) return;

    // Check if current color exists in new clothing type
    const newColors = getColorsForType(product, newType);
    let nextColor = selectedColor;
    if (!selectedColor || !newColors.some((c) => String(c.id) === String(selectedColor.id))) {
      nextColor = newColors[0] || null;
      setSelectedColor(nextColor);
    }

    // Now re-calculate valid sizes for (newType, nextColor)
    if (nextColor) {
      const newSizes = getSizesForSelection(product.variants, product.feedingConfig, newType, nextColor);
      const inStockSize = newSizes.find((s) => s.inStock)?.size;
      setSelectedSize(inStockSize || newSizes[0]?.size || null);
    } else {
      setSelectedSize(null);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-ivory">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCart={openCart}
        />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-ink-primary mb-3">
            Product Not Found
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            The ethnic design you are looking for may have been updated or moved.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-700 text-white font-semibold text-xs shadow-md hover:bg-brand-800 transition-colors"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id, product.slug);
  const requiresExplicitFeedingChoice = product.feedingConfig === 'both';
  const hasSelectedFeedingChoice = !requiresExplicitFeedingChoice || selectedType !== null;

  // Find exact matching variant
  const currentVariant =
    selectedColor && selectedSize
      ? product.variants.find((v) => {
          const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
          const colorMatch = String(v.color.id) === String(selectedColor.id);
          const sizeMatch = v.size === selectedSize;
          return typeMatch && colorMatch && sizeMatch;
        })
      : null;

  const isCurrentVariantInStock = Boolean(currentVariant && currentVariant.stock > 0);
  const availableStock = currentVariant ? currentVariant.stock : 0;

  const validateSelection = (): boolean => {
    if (!hasSelectedFeedingChoice) {
      setSizePromptNotice('Please choose Feeding or Non-Feeding first');
      const el = document.getElementById('feeding-type-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setSizePromptNotice(null), 3500);
      return false;
    }
    if (!selectedSize) {
      setSizePromptNotice('Please select your size');
      const el = document.getElementById('size-selector-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setSizePromptNotice(null), 3500);
      return false;
    }
    if (!currentVariant || !isCurrentVariantInStock) {
      setSizePromptNotice('Selected size/color combination is currently out of stock');
      setTimeout(() => setSizePromptNotice(null), 3500);
      return false;
    }
    return true;
  };

  const buildCartItem = (): CartItem | null => {
    if (!hasSelectedFeedingChoice || !selectedColor || !selectedSize || !currentVariant || !isCurrentVariantInStock) {
      return null;
    }

    const effectiveClothingType: ClothingType | null =
      product.feedingConfig === 'feeding-only'
        ? 'Feeding'
        : product.feedingConfig === 'both'
        ? selectedType
        : null;

    const typeKey = effectiveClothingType || 'std';
    const cartItemId = `${product.id}_${typeKey}_${selectedColor.id}_${selectedSize}`;

    return {
      id: cartItemId,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      productImage: getImageUrl(product.images[0]),
      category: product.category,
      variantId: currentVariant.id,
      sku: currentVariant.sku,
      clothingType: effectiveClothingType,
      selectedColor,
      selectedSize,
      price: currentVariant.price,
      originalPrice: currentVariant.originalPrice ?? product.originalPrice ?? null,
      quantity,
      maxStock: currentVariant.stock,
    };
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    const item = buildCartItem();
    if (!item) return;

    addToCart(item);
    setAddSuccessMessage(`Added "${product.title}" (${item.selectedSize}, ${item.selectedColor.name}) to your cart!`);
    setTimeout(() => setAddSuccessMessage(null), 4000);
    openCart();
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Take a look at "${product.title}" on Sony Collections!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccessToast(true);
      setTimeout(() => setShareSuccessToast(false), 3000);
    } catch {
      // fallback if clipboard fails
    }
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    const item = buildCartItem();
    if (!item) return;

    // Direct Buy Now Express Checkout: does not pollute user's regular bag
    sessionStorage.setItem('sony_buy_now_item', JSON.stringify(item));
    navigate('/checkout?mode=buy_now');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/account');
      return;
    }
    if (!newComment.trim()) {
      setReviewSubmitMessage({ type: 'error', text: 'Please write a brief comment describing your experience.' });
      return;
    }

    setIsSubmittingReview(true);
    setReviewSubmitMessage(null);
    try {
      const updated = await storeApi.submitProductReview(product.slug, {
        rating: newRating,
        headline: newHeadline.trim(),
        comment: newComment.trim(),
        image: reviewImageFile,
      });
      setReviewsData(updated);
      setReviewSubmitMessage({ type: 'success', text: 'Thank you! Your verified review has been submitted successfully.' });
      setNewHeadline('');
      setNewComment('');
      setReviewImageFile(null);
      setReviewImagePreview(null);
      setIsWritingReview(false);
      setProduct((prev) => prev ? { ...prev, rating: updated.averageRating, reviewCount: updated.totalReviews } : null);
    } catch (err: any) {
      setReviewSubmitMessage({
        type: 'error',
        text: err?.response?.data?.error || err?.response?.data?.detail || 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, max = 5, sizeClass = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={`${sizeClass} ${filled ? 'fill-amber-400 text-amber-500' : half ? 'fill-amber-200 text-amber-500' : 'text-stone-300'}`}
            />
          );
        })}
      </div>
    );
  };

  // Related products from same category or relevant collection
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.feedingConfig === product.feedingConfig)
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={openCart}
      />

      {/* Breadcrumb Navigation - Hidden on mobile for immediate above-the-fold visibility */}
      <div className="hidden md:block">
        <Breadcrumbs
          items={[
            { label: 'Shop', path: '/shop' },
            { label: product.categoryName, path: `/category/${product.category}` },
            { label: product.title },
          ]}
        />
      </div>

      {/* Main Product Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 pb-28 sm:pb-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Left Column: Product Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="sticky top-24">
              <ProductGallery
                product={product}
                activeColor={selectedColor}
                activeClothingType={selectedType}
                onColorSelect={(colorId) => {
                  const match = availableColorsForType.find((c) => String(c.id) === String(colorId));
                  if (match) {
                    handleColorChange(match);
                  }
                }}
                isFavorited={isFavorited}
                onToggleWishlist={() => toggleWishlist(product.id, product.slug)}
                onShare={handleShare}
              />
            </div>
          </div>

          {/* Right Column: Variant Selection & Details (7 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Title, Category & Price Header (Rendered below gallery thumbnails on mobile, right column on desktop) */}
            <div>
              <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
                <Link
                  to={`/category/${product.category}`}
                  className="font-semibold text-brand-700 hover:text-brand-900 uppercase tracking-wider transition-colors"
                >
                  {product.categoryName}
                </Link>
                {product.fabric && (
                  <span className="text-[11px] text-ink-secondary bg-ivory-200 px-2 py-0.5 rounded-md font-medium">
                    {product.fabric}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-ink-primary leading-tight">
                {product.title}
              </h1>

              {/* Dynamic Rating */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                <RatingBadge
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  onClick={() => {
                    document
                      .getElementById('pdp-reviews-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>

              {/* Dynamic Price, MRP & Discount */}
              <div className="mt-3 pt-3 border-t border-ivory-200">
                <PriceDisplay
                  price={currentVariant ? currentVariant.price : product.price}
                  originalPrice={currentVariant?.originalPrice ?? product.originalPrice}
                  discountPercentage={product.discountPercentage}
                  size="lg"
                />
                <p className="mt-1 text-xs text-ink-muted font-medium">
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            {/* Feeding / Non-Feeding Option */}
            {product.feedingConfig === 'both' && (
              <div id="feeding-type-section" className="p-4 bg-brand-50/70 rounded-2xl border border-brand-200">
                <FeedingOptionSelector
                  selectedType={selectedType}
                  onSelect={handleTypeChange}
                  showPromptError={!selectedType}
                />
              </div>
            )}

            {/* Slim Feeding-Only Indicator */}
            {product.feedingConfig === 'feeding-only' && (
              <div className="px-3.5 py-2.5 bg-brand-50/80 rounded-xl border border-brand-200 flex items-center gap-2 text-xs text-brand-900">
                <Sparkles className="w-4 h-4 text-brand-700 shrink-0" />
                <span>
                  <strong>Feeding Friendly:</strong> Twin concealed nursing zippers included.
                </span>
              </div>
            )}

            {/* Colour Selector */}
            {selectedColor && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold uppercase tracking-wider text-ink-primary">
                    Colour:{' '}
                    <span className="font-semibold text-brand-800 normal-case">
                      {selectedColor.name}
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {availableColorsForType.map((color) => {
                    const isSelected = selectedColor.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        aria-label={`Select colour ${color.name}`}
                        aria-pressed={isSelected}
                        className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-xs ${
                          isSelected
                            ? 'border-brand-800 bg-brand-800 text-white font-bold shadow-sm ring-2 ring-brand-200'
                            : 'border-ivory-300 bg-white hover:bg-brand-50 hover:border-brand-400 text-ink-secondary'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/80 shrink-0 shadow-2xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div id="size-selector-section" className="space-y-2.5">
              {sizePromptNotice && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-semibold">{sizePromptNotice}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-ink-primary">
                  Select Size{' '}
                  {selectedSize && (
                    <span className="font-semibold text-brand-800 normal-case">
                      — {selectedSize}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 font-semibold text-brand-800 hover:text-brand-900 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizesForSelection.map(({ size, inStock }) => {
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-11 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center relative ${
                        isSelected
                          ? 'border-brand-800 bg-brand-800 text-white shadow-sm'
                          : inStock
                          ? 'border-ivory-300 bg-white text-ink-primary hover:border-brand-700 hover:text-brand-800 hover:bg-brand-50'
                          : 'border-ivory-200 bg-ivory-100/50 text-ink-light cursor-not-allowed line-through'
                      }`}
                      title={!inStock ? `${size} is currently out of stock in this combination` : size}
                    >
                      <span>{size}</span>
                    </button>
                  );
                })}
              </div>

              {!isCurrentVariantInStock && (
                <div className="pt-1 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Currently out of stock in selected combination</span>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-ivory-300 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-primary hover:bg-brand-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-ink-primary">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(availableStock || 10, q + 1))}
                    disabled={quantity >= availableStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-primary hover:bg-brand-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  >
                    +
                  </button>
                </div>
                {availableStock > 0 && availableStock <= 5 && (
                  <span className="text-xs text-amber-700 font-semibold">
                    Only {availableStock} left
                  </span>
                )}
              </div>
            </div>

            {/* Success Toast */}
            {addSuccessMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{addSuccessMessage}</span>
                </div>
                <button
                  onClick={openCart}
                  className="font-bold underline text-emerald-900 hover:text-emerald-950 ml-2"
                >
                  View Cart
                </button>
              </div>
            )}

            {/* SELECTION ORDER STEP 5: Add to Cart & Buy Now Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isCurrentVariantInStock}
                className="flex-1 py-3.5 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg disabled:bg-ivory-300 disabled:text-ink-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!isCurrentVariantInStock}
                className="flex-1 py-3.5 px-6 rounded-full bg-brand-900 hover:bg-ink-primary text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg disabled:bg-ivory-300 disabled:text-ink-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Product Details & Accordions (Moved cleanly below Buy Actions, Myntra-style) */}
            <div className="pt-6 border-t border-ivory-300 space-y-4">
              {/* Open Product Details Summary */}
              <div className="rounded-xl border border-brand-200 bg-[#FDFBFE] p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
                  <Shirt className="w-4 h-4 text-brand-800" />
                  <span>Product Details</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
                {product.feedingConfig === 'none' && (
                  <p className="text-xs text-ink-muted italic">
                    Classic ethnic wardrobe piece. Tailored in standard silhouette.
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-ivory-200 text-[11px]">
                  <div>
                    <span className="text-ink-muted block">Category</span>
                    <strong className="text-ink-primary">{product.categoryName}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Fabric</span>
                    <strong className="text-ink-primary">{product.fabric}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Style Code</span>
                    <strong className="text-ink-primary font-mono">
                      {currentVariant?.sku || product.skuPrefix}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Accordion 2: Fabric & Care */}
              {product.fabric && (
                <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleSection('fabric')}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-ink-primary hover:bg-ivory-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-800" />
                      <span>Fabric & Wash Care Instructions</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-ink-muted transition-transform ${
                        openSections.fabric ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openSections.fabric && (
                    <div className="p-4 pt-3 text-xs text-ink-secondary leading-relaxed space-y-2 border-t border-ivory-200 bg-ivory-50/40">
                      <p>
                        <strong>Fabric Composition:</strong> {product.fabric}
                      </p>
                      {product.careInstructions.length > 0 && (
                        <div>
                          <strong className="text-ink-primary block mb-1">Care Guidelines:</strong>
                          <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                            {product.careInstructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 3: Feeding Access Design (Only if feeding details exist) */}
              {product.feedingDetails && (
                <div className="border border-brand-200 rounded-xl overflow-hidden bg-brand-50/50">
                  <button
                    type="button"
                    onClick={() => toggleSection('feeding')}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:bg-brand-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-800" />
                      <span>Feeding Access & Zipper Details</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-800 transition-transform ${
                        openSections.feeding ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openSections.feeding && (
                    <div className="p-4 pt-3 text-xs text-ink-secondary leading-relaxed space-y-3 border-t border-brand-200 bg-white/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <strong className="block text-ink-primary">Zipper Mechanism:</strong>
                          <span>{product.feedingDetails.zipType}</span>
                        </div>
                        <div>
                          <strong className="block text-ink-primary">Placement:</strong>
                          <span>{product.feedingDetails.zipPlacement}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-ink-secondary">
                        {product.feedingDetails.description}
                      </p>
                      <div className="overflow-hidden rounded-xl border border-brand-200 bg-white max-w-xs">
                        <img
                          src="/images/guides/feeding-access-guide.jpg"
                          alt="Discreet Feeding Access Visual Guide"
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 4: Delivery & Support */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('delivery')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-ink-primary hover:bg-ivory-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-800" />
                    <span>Delivery & Boutique Support</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted transition-transform ${
                      openSections.delivery ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSections.delivery && (
                  <div className="p-4 pt-3 text-xs text-ink-secondary leading-relaxed space-y-1.5 border-t border-ivory-200 bg-ivory-50/40 text-[11px]">
                    <p>• Pan-India dispatch from {SITE_CONFIG.addressPrimary}.</p>
                    <p>• Need sizing or feeding-option advice? Call or WhatsApp {SITE_CONFIG.phoneDisplay} ({SITE_CONFIG.businessHours}).</p>
                  </div>
                )}
              </div>

              {/* Quick Reviews Indicator Link */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('pdp-reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-2.5 px-4 rounded-xl border border-ivory-300 bg-white hover:bg-ivory-50 flex items-center justify-between text-xs font-semibold text-ink-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>Customer Ratings & Reviews ({reviewsData.totalReviews})</span>
                  </div>
                  <span className="text-brand-700 font-bold">View breakdown ↓</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Amazon-style Customer Reviews & Ratings Section */}
        <section id="pdp-reviews-section" className="mt-14 pt-10 border-t border-ivory-300">
          <div className="mb-8">
            <span className="text-[11px] uppercase tracking-wider font-bold text-brand-700 block mb-1">
              Feedback from verified buyers
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
              Customer Reviews & Ratings
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 5 cols: Amazon Rating Breakdown & Star Bars */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-xs space-y-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-ink-primary">
                    {reviewsData.averageRating.toFixed(1)}
                  </span>
                  <div>
                    {renderStars(reviewsData.averageRating, 5, "w-5 h-5")}
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {reviewsData.totalReviews} global {reviewsData.totalReviews === 1 ? 'rating' : 'ratings'}
                    </p>
                  </div>
                </div>

                {/* 5-Star to 1-Star Progress Breakdown Bars */}
                <div className="space-y-2 pt-2 border-t border-ivory-200">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const bar = reviewsData.distribution[String(star)] || { stars: star, count: 0, percentage: 0 };
                    const isSelected = starFilter === star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStarFilter(isSelected ? null : star)}
                        className={`w-full flex items-center gap-2.5 text-xs py-1 px-1.5 rounded transition-colors group ${
                          isSelected ? 'bg-amber-50 font-bold text-amber-900' : 'hover:bg-ivory-50 text-ink-secondary'
                        }`}
                        title={`Filter by ${star} star reviews`}
                      >
                        <span className="w-12 text-left font-medium group-hover:text-amber-800">
                          {star} star
                        </span>
                        <div className="flex-1 h-3.5 bg-ivory-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300 group-hover:bg-amber-500"
                            style={{ width: `${bar.percentage}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-ink-muted group-hover:text-ink-primary">
                          {bar.percentage}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {starFilter && (
                  <div className="pt-2 flex items-center justify-between text-xs text-brand-800 bg-brand-50/80 p-2.5 rounded-lg border border-brand-200">
                    <span>Filtering by {starFilter} star reviews</span>
                    <button
                      type="button"
                      onClick={() => setStarFilter(null)}
                      className="font-bold underline hover:text-brand-900"
                    >
                      Clear filter
                    </button>
                  </div>
                )}
              </div>

              {/* Review this product CTA box (Amazon Style) */}
              <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-xs space-y-3">
                <h3 className="font-serif text-base font-bold text-ink-primary">
                  Review this product
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Share your thoughts on sizing, fabric softness, feeding zippers, and styling with other mothers and shoppers.
                </p>

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsWritingReview((prev) => !prev);
                      setReviewSubmitMessage(null);
                    }}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-stone-800 bg-stone-900 text-white hover:bg-stone-800 transition-colors text-xs font-semibold shadow-xs"
                  >
                    <span>{isWritingReview ? 'Close Review Form' : 'Write a Product Review'}</span>
                  </button>
                ) : (
                  <Link
                    to="/account"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-brand-700 bg-brand-50 text-brand-800 hover:bg-brand-100 transition-colors text-xs font-semibold"
                  >
                    <span>Sign in to write a review</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right 7 cols: Interactive Write Review Form & Review Cards List */}
            <div className="lg:col-span-7 space-y-6">
              {/* Collapsible Write Review Form */}
              {isWritingReview && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-6 rounded-2xl bg-white border-2 border-brand-700 shadow-md space-y-4 animate-in fade-in duration-200"
                >
                  <h3 className="font-serif text-lg font-bold text-ink-primary flex items-center justify-between">
                    <span>Write Your Review</span>
                    <span className="text-xs font-sans font-normal text-ink-muted">Logged in as verified user</span>
                  </h3>

                  {/* Interactive Star Selector */}
                  <div>
                    <label className="block text-xs font-bold text-ink-primary mb-1.5">
                      Overall Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewRating(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none transition-transform hover:scale-115"
                            aria-label={`Rate ${s} stars`}
                          >
                            <Star
                              className={`w-7 h-7 ${
                                s <= (hoverRating || newRating)
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-ink-secondary ml-2">
                        {['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'][
                          (hoverRating || newRating) - 1
                        ]}
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <div>
                    <label htmlFor="review-headline" className="block text-xs font-bold text-ink-primary mb-1">
                      Add a headline (Optional)
                    </label>
                    <input
                      id="review-headline"
                      type="text"
                      value={newHeadline}
                      onChange={(e) => setNewHeadline(e.target.value)}
                      placeholder="What's most important to know? (e.g. Great fit & invisible feeding zip)"
                      className="w-full px-3.5 py-2 rounded-lg border border-ivory-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                      maxLength={120}
                    />
                  </div>

                  {/* Written Review */}
                  <div>
                    <label htmlFor="review-comment" className="block text-xs font-bold text-ink-primary mb-1">
                      Written Review *
                    </label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="What did you like or dislike? How was the fabric softness, sizing fit, or feeding zippers?"
                      className="w-full px-3.5 py-2 rounded-lg border border-ivory-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* Photo Upload Attachment (Amazon-style) */}
                  <div>
                    <label className="block text-xs font-bold text-ink-primary mb-1.5">
                      Add Product Photo (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-brand-700/50 bg-brand-50/50 hover:bg-brand-50 text-xs font-semibold text-brand-800 transition-colors">
                        <Camera className="w-4 h-4 text-brand-700 shrink-0" />
                        <span>{reviewImageFile ? 'Change Photo' : 'Attach Outfit Photo'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setReviewImageFile(file);
                              setReviewImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                      {reviewImagePreview && (
                        <div className="relative group">
                          <img
                            src={reviewImagePreview}
                            alt="Selected review"
                            className="w-12 h-12 rounded-xl object-cover border border-ivory-300 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setReviewImageFile(null);
                              setReviewImagePreview(null);
                            }}
                            className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-stone-900 text-white hover:bg-rose-600 transition-colors shadow-xs"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-ink-muted mt-1">
                      Upload photo showing fit, fabric, or feeding features (JPG, PNG, WebP up to 10MB).
                    </p>
                  </div>

                  {reviewSubmitMessage && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium ${
                        reviewSubmitMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {reviewSubmitMessage.text}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting Review...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-4 py-2.5 rounded-full bg-ivory-100 hover:bg-ivory-200 text-ink-secondary font-medium text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Review Success Notification if closed */}
              {!isWritingReview && reviewSubmitMessage && reviewSubmitMessage.type === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSubmitMessage.text}</span>
                </div>
              )}

              {/* Customer Reviews List */}
              <div className="space-y-4">
                {(() => {
                  const filtered = starFilter
                    ? reviewsData.reviews.filter((r) => r.rating === starFilter)
                    : reviewsData.reviews;

                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center rounded-2xl bg-white border border-ivory-300">
                        <p className="text-sm font-semibold text-ink-primary mb-1">
                          {starFilter ? `No ${starFilter}-star reviews yet.` : 'No customer reviews yet.'}
                        </p>
                        <p className="text-xs text-ink-secondary mb-4">
                          Be the first verified customer to share feedback on this outfit.
                        </p>
                        {isAuthenticated && !isWritingReview && (
                          <button
                            type="button"
                            onClick={() => setIsWritingReview(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors"
                          >
                            <span>Write the First Review</span>
                          </button>
                        )}
                      </div>
                    );
                  }

                  return filtered.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-xs space-y-2.5"
                    >
                      {/* Customer Info & Verified Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                            {rev.userName.charAt(0) || 'C'}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-ink-primary block leading-tight">
                              {rev.userName}
                            </span>
                            {rev.verifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified Purchase</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] text-ink-muted">
                          {rev.date}
                        </span>
                      </div>

                      {/* Stars & Headline */}
                      <div className="flex items-center gap-2">
                        {renderStars(rev.rating, 5, "w-3.5 h-3.5")}
                        {rev.headline && (
                          <span className="font-bold text-xs text-ink-primary">
                            {rev.headline}
                          </span>
                        )}
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-ink-secondary leading-relaxed pt-0.5">
                        {rev.comment}
                      </p>

                      {/* Customer Photo Attachment (Amazon style) */}
                      {rev.image && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setEnlargedReviewImage(getImageUrl(rev.image!))}
                            className="group relative inline-block rounded-xl overflow-hidden border border-ivory-300 bg-ivory-50 hover:border-brand-700 transition-all cursor-zoom-in shadow-2xs"
                            title="Click to view full photo"
                          >
                            <img
                              src={getImageUrl(rev.image)}
                              alt={`${rev.userName}'s review photo`}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-ivory-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-brand-700 block mb-1">
                  Complete Your Look
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/category/${product.category}`}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
              >
                <span>View More in {product.categoryName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onQuickSelect={(p) => setQuickSelectProduct(p)}
                  onViewDetails={(p) => navigate(`/product/${p.slug}`)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick Select Modal */}
      <QuickSelectModal
        product={quickSelectProduct}
        isOpen={Boolean(quickSelectProduct)}
        onClose={() => setQuickSelectProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={product}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          navigate(`/product/${p.slug}`);
        }}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCart={openCart}
      />

      {/* Share Toast */}
      {shareSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-sans font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

      {/* Fullscreen Customer Review Photo Lightbox Modal */}
      {enlargedReviewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEnlargedReviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setEnlargedReviewImage(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close photo"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={enlargedReviewImage}
              alt="Customer Review Enlarged"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-ivory-300 text-xs mt-3 text-center">
              Customer Photo • Tap anywhere outside or ✕ to close
            </p>
          </div>
        </div>
      )}
      {/* Flipkart-Style Sticky Bottom Action Bar on Mobile (Cart & Buy Now only, no price) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-ivory-300 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center gap-2.5 safe-bottom">
        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isCurrentVariantInStock}
          className="flex-1 py-3 px-3 rounded-xl bg-ivory-100 hover:bg-ivory-200 border border-brand-300 text-brand-900 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-brand-700" />
          <span>Add to Cart</span>
        </button>

        {/* Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!isCurrentVariantInStock}
          className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-800 hover:to-brand-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Buy Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
