import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ShoppingBag, AlertCircle } from 'lucide-react';
import { Product, ClothingType, ProductColor, ProductSize } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../types/cart';

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
  // For 'both': selectedType starts as null to REQUIRE explicit customer selection!
  // For 'feeding-only': automatically initialized to 'Feeding'
  // For 'none': initialized to null
  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.feedingConfig === 'both') {
        setSelectedType(null); // REQUIRE explicit user choice
      } else if (product.feedingConfig === 'feeding-only') {
        setSelectedType('Feeding'); // Automatically store Feeding
      } else {
        setSelectedType(null); // None
      }

      const initialColor = product.availableColors[0] || null;
      setSelectedColor(initialColor);

      // Find first available size in stock for this initial configuration
      if (initialColor) {
        const firstAvailable = product.availableSizes.find((size) => {
          return product.variants.some((v) => {
            const typeMatch =
              product.feedingConfig === 'none' ||
              (product.feedingConfig === 'feeding-only' && v.clothingType === 'Feeding') ||
              (product.feedingConfig === 'both');
            return typeMatch && v.color.id === initialColor.id && v.size === size && v.stock > 0;
          });
        });
        setSelectedSize(firstAvailable || product.availableSizes[0] || null);
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

  // Check which sizes are valid and in stock for the current (selectedType, selectedColor)
  const isSizeValidAndInStock = (size: ProductSize): boolean => {
    return product.variants.some((v) => {
      const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
      const colorMatch = v.color.id === selectedColor.id;
      const sizeMatch = v.size === size;
      return typeMatch && colorMatch && sizeMatch && v.stock > 0;
    });
  };

  // Find exact matching variant
  const currentVariant = selectedSize
    ? product.variants.find((v) => {
        const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
        const colorMatch = v.color.id === selectedColor.id;
        const sizeMatch = v.size === selectedSize;
        return typeMatch && colorMatch && sizeMatch;
      })
    : null;

  const isCurrentVariantInStock = Boolean(currentVariant && currentVariant.stock > 0);

  // Automatically update selectedSize if it becomes invalid when color or type changes
  const handleColorChange = (newColor: ProductColor) => {
    setSelectedColor(newColor);
    if (selectedSize && !product.variants.some((v) => {
      const typeMatch = product.feedingConfig === 'none' || v.clothingType === selectedType;
      return typeMatch && v.color.id === newColor.id && v.size === selectedSize && v.stock > 0;
    })) {
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

  const handleTypeChange = (newType: ClothingType) => {
    setSelectedType(newType);
    if (selectedSize && !product.variants.some((v) => {
      return v.clothingType === newType && v.color.id === selectedColor.id && v.size === selectedSize && v.stock > 0;
    })) {
      const validSize = product.availableSizes.find((size) => {
        return product.variants.some((v) => {
          return v.clothingType === newType && v.color.id === selectedColor.id && v.size === size && v.stock > 0;
        });
      });
      setSelectedSize(validSize || null);
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
              src={product.images[0]}
              alt={product.title}
              className="w-16 h-20 object-cover rounded-lg border border-ivory-300 shrink-0"
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-ink-primary">
                  ₹{currentVariant ? currentVariant.price : product.price}
                </span>
              </div>
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Select Clothing Type:</span>
                </label>
                {!selectedType ? (
                  <span className="text-[11px] text-amber-700 font-semibold animate-pulse">
                    * Required Selection
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-medium">Selected</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(['Feeding', 'Non-Feeding'] as ClothingType[]).map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-700 bg-brand-50/80 ring-2 ring-brand-700'
                          : 'border-ivory-300 hover:border-brand-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-ink-primary">
                          {type === 'Feeding' ? '🤱 Feeding-Friendly' : '👗 Non-Feeding'}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-brand-700" />}
                      </div>
                      <p className="text-[10px] text-ink-secondary mt-1">
                        {type === 'Feeding'
                          ? 'Dual concealed side zips for discreet nursing'
                          : 'Standard regular tailored fit'}
                      </p>
                    </button>
                  );
                })}
              </div>
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
              {product.availableColors.map((color) => {
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
              {product.availableSizes.map((size) => {
                const isSelected = selectedSize === size;
                const isAvailable = isSizeValidAndInStock(size);

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center relative ${
                      !isAvailable
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-brand-700 bg-brand-700 text-white shadow-xs'
                        : 'border-ivory-300 hover:border-brand-400 text-ink-primary bg-white'
                    }`}
                    title={isAvailable ? `Size ${size}` : `Size ${size} out of stock in ${selectedColor.name}`}
                  >
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
            {selectedSize && !isSizeValidAndInStock(selectedSize) && (
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
                <span>Added to Bag!</span>
              </>
            ) : !hasSelectedFeedingChoice ? (
              <span>Select Feeding Option</span>
            ) : !selectedSize || !isCurrentVariantInStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
