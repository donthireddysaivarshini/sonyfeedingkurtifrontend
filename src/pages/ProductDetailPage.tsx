import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Ruler,
  Truck,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Layers,
  Shirt
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { SearchModal } from '../components/layout/SearchModal';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { CheckoutPreviewModal } from '../components/checkout/CheckoutPreviewModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGallery } from '../components/product-detail/ProductGallery';
import { SizeGuideModal } from '../components/product-detail/SizeGuideModal';
import { ProductCard } from '../components/products/ProductCard';
import { QuickSelectModal } from '../components/products/QuickSelectModal';
import { PRODUCTS } from '../data/products';
import { Product, ClothingType, ProductColor, ProductSize } from '../types/product';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CartItem } from '../types/cart';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Dialog & Drawer States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutPreviewOpen, setIsCheckoutPreviewOpen] = useState(false);
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

  // Find matching product by slug
  const product = PRODUCTS.find((p) => p.slug === slug);

  // Variant Selection Order State:
  // 1. Feeding Type (null if 'both' to require explicit selection; 'Feeding' if 'feeding-only'; null if 'none')
  // 2. Colour
  // 3. Size
  // 4. Quantity
  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);

  // Initialize or reset selections when product changes
  useEffect(() => {
    if (product) {
      if (product.feedingConfig === 'both') {
        setSelectedType(null); // REQUIRE explicit user choice
      } else if (product.feedingConfig === 'feeding-only') {
        setSelectedType('Feeding'); // Dedicated feeding wear
      } else {
        setSelectedType(null); // Standard product
      }

      const initialColor = product.availableColors[0] || null;
      setSelectedColor(initialColor);

      // Find first available in-stock size for this initial configuration
      if (initialColor) {
        const firstAvailable = product.availableSizes.find((size) => {
          return product.variants.some((v) => {
            const typeMatch =
              product.feedingConfig === 'none' ||
              (product.feedingConfig === 'feeding-only' && v.clothingType === 'Feeding') ||
              product.feedingConfig === 'both';
            return typeMatch && v.color.id === initialColor.id && v.size === size && v.stock > 0;
          });
        });
        setSelectedSize(firstAvailable || product.availableSizes[0] || null);
      } else {
        setSelectedSize(null);
      }

      setQuantity(1);
      setAddSuccessMessage(null);
    }
  }, [product]);

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

  const isFavorited = isInWishlist(product.id);
  const requiresExplicitFeedingChoice = product.feedingConfig === 'both';
  const hasSelectedFeedingChoice = !requiresExplicitFeedingChoice || selectedType !== null;

  // Check if a size is valid and in-stock for current (selectedType, selectedColor)
  const isSizeValidAndInStock = (size: ProductSize): boolean => {
    if (!selectedColor) return false;
    return product.variants.some((v) => {
      const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
      const colorMatch = v.color.id === selectedColor.id;
      const sizeMatch = v.size === size;
      return typeMatch && colorMatch && sizeMatch && v.stock > 0;
    });
  };

  // Find exact matching variant
  const currentVariant =
    selectedColor && selectedSize
      ? product.variants.find((v) => {
          const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
          const colorMatch = v.color.id === selectedColor.id;
          const sizeMatch = v.size === selectedSize;
          return typeMatch && colorMatch && sizeMatch;
        })
      : null;

  const isCurrentVariantInStock = Boolean(currentVariant && currentVariant.stock > 0);
  const availableStock = currentVariant ? currentVariant.stock : 0;

  // Handle color change with size re-validation
  const handleColorChange = (newColor: ProductColor) => {
    setSelectedColor(newColor);
    if (
      selectedSize &&
      !product.variants.some((v) => {
        const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
        return typeMatch && v.color.id === newColor.id && v.size === selectedSize && v.stock > 0;
      })
    ) {
      // Find new available size
      const validSize = product.availableSizes.find((size) => {
        return product.variants.some((v) => {
          const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
          return typeMatch && v.color.id === newColor.id && v.size === size && v.stock > 0;
        });
      });
      setSelectedSize(validSize || null);
    }
  };

  // Handle feeding type change with size re-validation
  const handleTypeChange = (newType: ClothingType) => {
    setSelectedType(newType);
    if (
      selectedColor &&
      selectedSize &&
      !product.variants.some((v) => {
        return (
          v.clothingType === newType &&
          v.color.id === selectedColor.id &&
          v.size === selectedSize &&
          v.stock > 0
        );
      })
    ) {
      const validSize = product.availableSizes.find((size) => {
        return product.variants.some((v) => {
          return (
            v.clothingType === newType &&
            v.color.id === selectedColor.id &&
            v.size === size &&
            v.stock > 0
          );
        });
      });
      setSelectedSize(validSize || null);
    }
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
      productImage: product.images[0],
      category: product.category,
      variantId: currentVariant.id,
      sku: currentVariant.sku,
      clothingType: effectiveClothingType,
      selectedColor,
      selectedSize,
      price: currentVariant.price,
      originalPrice: null,
      quantity,
      maxStock: currentVariant.stock,
    };
  };

  const handleAddToCart = () => {
    const item = buildCartItem();
    if (!item) return;

    addToCart(item);
    setAddSuccessMessage(`Added "${product.title}" (${item.selectedSize}, ${item.selectedColor.name}) to your bag!`);
    setTimeout(() => setAddSuccessMessage(null), 4000);
    openCart();
  };

  const handleBuyNow = () => {
    const item = buildCartItem();
    if (!item) return;

    addToCart(item);
    openCart();
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

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Shop', path: '/shop' },
          { label: product.categoryName, path: `/category/${product.category}` },
          { label: product.title },
        ]}
      />

      {/* Main Product Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Product Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="sticky top-24">
              <ProductGallery product={product} />
            </div>
          </div>

          {/* Right Column: Variant Selection & Details (7 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            
            {/* Title, Category & Price Header */}
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

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary leading-tight">
                {product.title}
              </h1>

              {/* Price & SKU */}
              <div className="flex flex-wrap items-baseline gap-3 mt-3">
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-brand-900">
                  ₹{product.price}
                </span>
                <span className="text-xs text-ink-muted font-normal">
                  Inclusive of all taxes
                </span>
                {currentVariant && (
                  <span className="text-[11px] font-mono text-ink-muted bg-ivory-100 px-2 py-0.5 rounded border border-ivory-300">
                    SKU: {currentVariant.sku}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-ink-secondary mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Demonstration Data Disclaimer */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-ivory-100/90 border border-ivory-300 flex items-start gap-2 text-[11px] text-ink-muted">
                <AlertCircle className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Demonstration Preview:</strong> Photography, sample pricing, and indicative specifications shown are for interface review. Official Sony Feeding Kurtis brand assets will be provided upon launch.
                </span>
              </div>
            </div>

            {/* SELECTION ORDER STEP 1: Feeding / Non-Feeding Configuration */}
            {product.feedingConfig === 'both' && (
              <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span>1. Choose Feeding Option</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  {!selectedType && (
                    <span className="text-[11px] font-semibold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                      Selection required
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('Feeding')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedType === 'Feeding'
                        ? 'border-brand-700 bg-white text-brand-900 ring-2 ring-brand-700/20 shadow-sm'
                        : 'border-ivory-300 bg-white/80 hover:bg-white text-ink-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">🤱 Feeding-Friendly</span>
                      {selectedType === 'Feeding' && <Check className="w-3.5 h-3.5 text-brand-700" />}
                    </div>
                    <p className="text-[10px] text-ink-muted leading-tight">
                      Discreet dual side nursing zips
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange('Non-Feeding')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedType === 'Non-Feeding'
                        ? 'border-brand-700 bg-white text-brand-900 ring-2 ring-brand-700/20 shadow-sm'
                        : 'border-ivory-300 bg-white/80 hover:bg-white text-ink-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">✨ Non-Feeding</span>
                      {selectedType === 'Non-Feeding' && <Check className="w-3.5 h-3.5 text-brand-700" />}
                    </div>
                    <p className="text-[10px] text-ink-muted leading-tight">
                      Standard festive ethnic fit
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Feeding-Only Banner (No redundant toggle) */}
            {product.feedingConfig === 'feeding-only' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong>Dedicated Feeding Silhouette:</strong> Crafted with twin invisible concealed zippers for nursing access.
                </div>
              </div>
            )}

            {/* Standard Ethnic Wear Notice */}
            {product.feedingConfig === 'none' && (
              <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300 text-xs text-ink-secondary flex items-center gap-2">
                <Shirt className="w-4 h-4 text-ink-muted shrink-0" />
                <span>Classic ethnic wardrobe piece. Tailored in standard silhouette.</span>
              </div>
            )}

            {/* SELECTION ORDER STEP 2: Colour Selection */}
            {selectedColor && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold uppercase tracking-wider text-ink-primary">
                    {product.feedingConfig === 'both' ? '2. Select Colour:' : '1. Select Colour:'}{' '}
                    <span className="font-semibold text-brand-700 normal-case">{selectedColor.name}</span>
                  </label>
                  <span className="text-[11px] text-ink-muted">
                    {product.availableColors.length} options available
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {product.availableColors.map((color) => {
                    const isSelected = selectedColor.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        aria-label={`Select colour ${color.name}`}
                        className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs ${
                          isSelected
                            ? 'border-brand-700 bg-brand-50/50 text-brand-900 font-bold ring-2 ring-brand-700/20'
                            : 'border-ivory-300 bg-white hover:bg-ivory-100 text-ink-secondary'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shrink-0 shadow-2xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SELECTION ORDER STEP 3: Size Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-ink-primary">
                  {product.feedingConfig === 'both' ? '3. Select Size:' : '2. Select Size:'}{' '}
                  {selectedSize && <span className="font-semibold text-brand-700 normal-case">{selectedSize}</span>}
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-900 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const inStock = isSizeValidAndInStock(size);

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-11 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center relative ${
                        isSelected
                          ? 'border-brand-700 bg-brand-700 text-white shadow-sm scale-105'
                          : inStock
                          ? 'border-ivory-300 bg-white text-ink-primary hover:border-brand-700 hover:text-brand-700'
                          : 'border-ivory-200 bg-ivory-100/50 text-ink-light cursor-not-allowed line-through'
                      }`}
                      title={!inStock ? `${size} is currently out of stock in this combination` : size}
                    >
                      <span>{size}</span>
                    </button>
                  );
                })}
              </div>

              {/* Stock Notice */}
              <div className="pt-1 flex items-center gap-2 text-xs">
                {isCurrentVariantInStock ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Sample Inventory • In Stock</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Currently out of stock in selected combination</span>
                  </span>
                )}
              </div>
            </div>

            {/* SELECTION ORDER STEP 4: Quantity */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
                {product.feedingConfig === 'both' ? '4. Quantity' : '3. Quantity'}
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-ivory-300 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-primary hover:bg-ivory-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-primary hover:bg-ivory-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  >
                    +
                  </button>
                </div>
                {availableStock > 0 && availableStock <= 5 && (
                  <span className="text-xs text-amber-700 font-semibold">
                    Hurry! Only {availableStock} left in stock
                  </span>
                )}
              </div>
            </div>

            {/* Validation Notice if Feeding choice is required */}
            {!hasSelectedFeedingChoice && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Please select either <strong>Feeding-Friendly</strong> or <strong>Non-Feeding</strong> above to proceed.</span>
              </div>
            )}

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
                  View Bag
                </button>
              </div>
            )}

            {/* SELECTION ORDER STEP 5: Add to Bag & Buy Now Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!hasSelectedFeedingChoice || !isCurrentVariantInStock}
                className="flex-1 py-3.5 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg disabled:bg-ivory-300 disabled:text-ink-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!hasSelectedFeedingChoice || !isCurrentVariantInStock}
                className="flex-1 py-3.5 px-6 rounded-full bg-brand-900 hover:bg-ink-primary text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg disabled:bg-ivory-300 disabled:text-ink-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`p-3.5 rounded-full border transition-all flex items-center justify-center ${
                  isFavorited
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-ivory-300 bg-white text-ink-secondary hover:text-rose-600 hover:bg-ivory-100'
                }`}
                title={isFavorited ? 'Saved in Wishlist' : 'Save to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Informational Accordion Sections */}
            <div className="pt-6 border-t border-ivory-300 space-y-3">
              
              {/* Accordion 1: Product Details */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('details')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-ink-primary hover:bg-ivory-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-brand-700" />
                    <span>Product Specifications & Details</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted transition-transform ${
                      openSections.details ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSections.details && (
                  <div className="p-4 pt-0 text-xs text-ink-secondary leading-relaxed space-y-2 border-t border-ivory-200 bg-ivory-50/40">
                    <p>{product.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div>
                        <span className="text-ink-muted block">Category:</span>
                        <strong className="text-ink-primary">{product.categoryName}</strong>
                      </div>
                      <div>
                        <span className="text-ink-muted block">Style Code:</span>
                        <strong className="text-ink-primary">{product.skuPrefix}</strong>
                      </div>
                    </div>
                  </div>
                )}
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
                      <Layers className="w-4 h-4 text-brand-700" />
                      <span>Fabric & Wash Care Instructions</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-ink-muted transition-transform ${
                        openSections.fabric ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openSections.fabric && (
                    <div className="p-4 pt-0 text-xs text-ink-secondary leading-relaxed space-y-2 border-t border-ivory-200 bg-ivory-50/40">
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
                <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/30">
                  <button
                    type="button"
                    onClick={() => toggleSection('feeding')}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-950 hover:bg-emerald-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Feeding Feature & Nursing Zipper Details</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-emerald-700 transition-transform ${
                        openSections.feeding ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openSections.feeding && (
                    <div className="p-4 pt-0 text-xs text-emerald-900 leading-relaxed space-y-2 border-t border-emerald-200 bg-white/70">
                      <div>
                        <strong className="block text-ink-primary">Zipper Mechanism:</strong>
                        <span>{product.feedingDetails.zipType}</span>
                      </div>
                      <div>
                        <strong className="block text-ink-primary">Placement:</strong>
                        <span>{product.feedingDetails.zipPlacement}</span>
                      </div>
                      <p className="text-[11px] text-ink-secondary">
                        {product.feedingDetails.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 4: Delivery & Brand Terms */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('delivery')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-ink-primary hover:bg-ivory-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-700" />
                    <span>Packaging & Delivery Guidance</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted transition-transform ${
                      openSections.delivery ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSections.delivery && (
                  <div className="p-4 pt-0 text-xs text-ink-secondary leading-relaxed space-y-1.5 border-t border-ivory-200 bg-ivory-50/40 text-[11px]">
                    <p>• Official dispatch timelines and courier partners will be announced upon catalog launch.</p>
                    <p>• Sample packaging specifications and tracking updates will follow client policies.</p>
                    <p>• Returns and exchange terms will adhere to confirmed boutique guidelines.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

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
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutPreviewOpen(true)}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
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

      {/* Checkout Preview Modal */}
      <CheckoutPreviewModal
        isOpen={isCheckoutPreviewOpen}
        onClose={() => setIsCheckoutPreviewOpen(false)}
      />
    </div>
  );
};
