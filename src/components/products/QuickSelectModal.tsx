import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ShoppingBag, AlertCircle } from 'lucide-react';
import { Product, ClothingType, ProductColor, ProductSize } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../types/cart';
import { PriceDisplay } from '../common/PriceDisplay';
import { FeedingOptionSelector } from './FeedingOptionSelector';
import { getImageUrl } from '../../utils/imageUrl';

interface QuickSelectModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSelectModal: React.FC<QuickSelectModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();

  // Selection states:
  // 1. Feeding Type (Defaults to 'Feeding' if 'both' or 'feeding-only')
  // 2. Colour (Derived from valid variants for selected clothing type)
  // 3. Size (Derived from valid variants for selected type & colour)
  // 4. Quantity
  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Helper functions for strict hierarchy derivation
  const getColorsForType = (
    variants: Product['variants'],
    feedingConfig: Product['feedingConfig'],
    clothingType: ClothingType | null
  ): ProductColor[] => {
    const map = new Map<string, ProductColor>();
    variants.forEach((v) => {
      const typeMatch =
        feedingConfig === 'none' ||
        !clothingType ||
        v.clothingType === clothingType;
      if (typeMatch && v.color) {
        const cid = String(v.color.id);
        if (!map.has(cid)) {
          map.set(cid, v.color);
        }
      }
    });
    return Array.from(map.values());
  };

  const getSizesForSelection = (
    variants: Product['variants'],
    feedingConfig: Product['feedingConfig'],
    clothingType: ClothingType | null,
    color: ProductColor | null
  ): { size: ProductSize; inStock: boolean; stock: number }[] => {
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
    }));
  };

  useEffect(() => {
    if (product) {
      let defaultType: ClothingType | null = null;
      if (product.feedingConfig === 'both' || product.feedingConfig === 'feeding-only') {
        defaultType = 'Feeding';
      } else if (product.supportedClothingTypes?.includes('Feeding')) {
        defaultType = 'Feeding';
      } else if (product.supportedClothingTypes?.includes('Non-Feeding')) {
        defaultType = 'Non-Feeding';
      }
      setSelectedType(defaultType);

      const validColors = getColorsForType(product.variants, product.feedingConfig, defaultType);
      const initialColor = validColors[0] || null;
      setSelectedColor(initialColor);

      if (initialColor) {
        const validSizes = getSizesForSelection(product.variants, product.feedingConfig, defaultType, initialColor);
        const inStockSize = validSizes.find((s) => s.inStock)?.size;
        setSelectedSize(inStockSize || validSizes[0]?.size || null);
      } else {
        setSelectedSize(null);
      }

      setQuantity(1);
      setAddedSuccess(false);
    }
  }, [product]);

  if (!isOpen || !product || !selectedColor) return null;

  const requiresExplicitFeedingChoice = product.feedingConfig === 'both';
  const hasSelectedFeedingChoice = !requiresExplicitFeedingChoice || selectedType !== null;

  // Derived available colors strictly based on current clothing type
  const availableColorsForType = getColorsForType(product.variants, product.feedingConfig, selectedType);

  // Derived available sizes strictly based on current clothing type and selected color
  const availableSizesForSelection = getSizesForSelection(product.variants, product.feedingConfig, selectedType, selectedColor);

  // Find exact matching variant
  const currentVariant = selectedSize
    ? product.variants.find((v) => {
        const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
        const colorMatch = String(v.color.id) === String(selectedColor.id);
        const sizeMatch = v.size === selectedSize;
        return typeMatch && colorMatch && sizeMatch;
      })
    : null;

  const isCurrentVariantInStock = Boolean(currentVariant && currentVariant.stock > 0);

  // Smart color change handler
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

  // Smart clothing type change handler
  const handleTypeChange = (newType: ClothingType) => {
    setSelectedType(newType);
    if (!product) return;

    const newColors = getColorsForType(product.variants, product.feedingConfig, newType);
    let nextColor = selectedColor;
    if (!selectedColor || !newColors.some((c) => String(c.id) === String(selectedColor.id))) {
      nextColor = newColors[0] || null;
      setSelectedColor(nextColor);
    }

    if (nextColor) {
      const newSizes = getSizesForSelection(product.variants, product.feedingConfig, newType, nextColor);
      const inStockSize = newSizes.find((s) => s.inStock)?.size;
      setSelectedSize(inStockSize || newSizes[0]?.size || null);
    } else {
      setSelectedSize(null);
    }
  };

  const handleAddToCart = () => {
    if (!hasSelectedFeedingChoice) return;
    if (!selectedSize || !currentVariant || !isCurrentVariantInStock) return;

    // Effective clothingType strictly according to requirements:
    // for 'feeding-only', automatically 'Feeding'
    // for 'both', customer's explicit selection
    // for 'none', null
    const effectiveClothingType: ClothingType | null =
      product.feedingConfig === 'feeding-only'
        ? 'Feeding'
        : product.feedingConfig === 'both'
        ? selectedType
        : null;

    const typeKey = effectiveClothingType || 'std';
    const cartItemId = `${product.id}_${typeKey}_${selectedColor.id}_${selectedSize}`;

    const cartItem: CartItem = {
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

    addToCart(cartItem);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-ivory-300 overflow-hidden z-10 animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-ivory-300 flex items-center justify-between bg-ivory-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Select Product Options
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-ink-primary line-clamp-1">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Product Snapshot */}
          <div className="flex gap-4 items-center pb-4 border-b border-ivory-200">
            <img
              src={getImageUrl(product.images[0])}
              alt={product.title}
              className="w-16 h-20 object-cover rounded-lg border border-ivory-300 shrink-0"
            />
            <div>
              <PriceDisplay
                price={currentVariant ? currentVariant.price : product.price}
                originalPrice={currentVariant?.originalPrice ?? product.originalPrice}
                discountPercentage={product.discountPercentage}
                size="md"
              />
              <p className="text-xs text-ink-secondary mt-1">
                Fabric: <strong>{product.fabric}</strong>
              </p>
              {currentVariant && (
                <p className="text-[11px] text-ink-muted">
                  SKU: <span className="font-mono">{currentVariant.sku}</span>
                </p>
              )}
            </div>
          </div>

          {/* Dedicated Feeding Banner for 'feeding-only' */}
          {product.feedingConfig === 'feeding-only' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Dedicated Nursing Style:</strong> Automatically tailored with twin concealed side zippers for feeding convenience.
              </span>
            </div>
          )}

          {/* Standard notice for 'none' */}
          {product.feedingConfig === 'none' && (
            <div className="p-2.5 bg-ivory-100 border border-ivory-200 rounded-xl text-xs text-ink-secondary">
              <span>Standard ethnic fit without nursing zippers.</span>
            </div>
          )}

          {/* STEP 1: Clothing Type Selection (ONLY WHEN ENABLED 'both') */}
          {requiresExplicitFeedingChoice && (
            <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200">
              <FeedingOptionSelector
                selectedType={selectedType}
                onSelect={handleTypeChange}
                showPromptError={!selectedType}
              />
            </div>
          )}

          {/* STEP (1 or 2): Colour Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5 mb-2">
              <span className="w-4 h-4 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px]">
                {requiresExplicitFeedingChoice ? '2' : '1'}
              </span>
              <span>
                Select Colour:{' '}
                <strong className="font-semibold text-brand-700">{selectedColor.name}</strong>
              </span>
            </label>

            <div className="flex items-center gap-3">
              {availableColorsForType.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                      isSelected
                        ? 'border-brand-700 bg-brand-50 font-semibold ring-1 ring-brand-700'
                        : 'border-ivory-300 hover:border-brand-400 bg-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP (2 or 3): Size Selection with Availability Validation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px]">
                  {requiresExplicitFeedingChoice ? '3' : '2'}
                </span>
                <span>
                  Select Size:{' '}
                  <strong className="font-semibold text-brand-700">
                    {selectedSize || 'Choose size'}
                  </strong>
                </span>
              </label>
              <button
                type="button"
                onClick={() =>
                  alert('Standard Indian Sizing: S (36"), M (38"), L (40"), XL (42"), XXL (44"). Relaxed comfortable fit.')
                }
                className="text-[11px] text-brand-700 hover:underline"
              >
                Size Guide
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
                    className={`min-w-[48px] h-10 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center relative ${
                      !inStock
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-brand-700 bg-brand-700 text-white shadow-xs'
                        : 'border-ivory-300 hover:border-brand-400 text-ink-primary bg-white'
                    }`}
                    title={inStock ? `Size ${size}` : `Size ${size} out of stock in ${selectedColor.name}`}
                  >
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
            {selectedSize && !isCurrentVariantInStock && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Selected size is currently out of stock in this colour.
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
              Quantity:
            </span>
            <div className="flex items-center border border-ivory-300 rounded-lg overflow-hidden bg-ivory-50">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 hover:bg-ivory-200 text-ink-secondary text-sm font-bold"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold text-ink-primary">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                className="px-3 py-1 hover:bg-ivory-200 text-ink-secondary text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Validation Warning for Unselected Feeding Option */}
          {requiresExplicitFeedingChoice && !selectedType && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Please select whether you need <strong>Feeding</strong> or <strong>Non-Feeding</strong> above.</span>
            </div>
          )}

        </div>

        {/* Modal Footer / Add to Cart CTA */}
        <div className="p-4 border-t border-ivory-300 bg-ivory-50/70 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-ink-muted">Price</p>
            <p className="text-lg font-bold text-brand-700">
              ₹{(currentVariant ? currentVariant.price : product.price) * quantity}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !hasSelectedFeedingChoice ||
              !selectedSize ||
              !isCurrentVariantInStock ||
              addedSuccess
            }
            className={`flex-[2] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all ${
              addedSuccess
                ? 'bg-emerald-700 text-white'
                : !hasSelectedFeedingChoice
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : !selectedSize || !isCurrentVariantInStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-brand-700 hover:bg-brand-800 text-white hover:shadow-lg'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : !hasSelectedFeedingChoice ? (
              <span>Select Feeding Option</span>
            ) : !selectedSize || !isCurrentVariantInStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
