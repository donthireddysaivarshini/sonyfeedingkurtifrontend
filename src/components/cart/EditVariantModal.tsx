import React, { useState } from 'react';
import { X, Check, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { ClothingType, ProductColor, ProductSize } from '../../types/product';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';

interface EditVariantModalProps {
  item: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditVariantModal: React.FC<EditVariantModalProps> = ({ item, isOpen, onClose }) => {
  const { updateCartItemVariant } = useCart();

  if (!isOpen || !item) return null;

  const product = PRODUCTS.find((p) => p.id === item.productId);

  // Fallback if product not found in catalog
  if (!product) return null;

  const [selectedType, setSelectedType] = useState<ClothingType | null>(() => {
    if (product.feedingConfig === 'both') {
      return item.clothingType || 'Feeding';
    }
    if (product.feedingConfig === 'feeding-only') {
      return 'Feeding';
    }
    return null;
  });

  const [selectedColor, setSelectedColor] = useState<ProductColor>(item.selectedColor);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(item.selectedSize);

  // Variant matching
  const matchingVariant = product.variants.find((v) => {
    const typeMatch = product.feedingConfig === 'none' ? true : v.clothingType === selectedType;
    return typeMatch && v.color.id === selectedColor.id && v.size === selectedSize;
  });

  const isCurrentVariantInStock = matchingVariant ? matchingVariant.stock > 0 : false;
  const currentMaxStock = matchingVariant ? matchingVariant.stock : 10;

  const isCombinationAvailable = (type: ClothingType | null, colorId: string, size: ProductSize): boolean => {
    return product.variants.some((v) => {
      const typeMatch = product.feedingConfig === 'none' ? true : v.clothingType === type;
      return typeMatch && v.color.id === colorId && v.size === size && v.stock > 0;
    });
  };

  const handleSave = () => {
    if (!matchingVariant || !isCurrentVariantInStock) return;

    const typeCode = selectedType === 'Feeding' ? 'FD' : selectedType === 'Non-Feeding' ? 'NF' : 'std';
    const newCompositeId = `${product.id}_${typeCode}_${selectedColor.id}_${selectedSize}`;

    const updatedItem: CartItem = {
      ...item,
      id: newCompositeId,
      variantId: matchingVariant.id,
      sku: matchingVariant.sku,
      clothingType: selectedType,
      selectedColor,
      selectedSize,
      price: matchingVariant.price,
      maxStock: currentMaxStock,
      quantity: Math.min(item.quantity, currentMaxStock),
    };

    updateCartItemVariant(item.id, updatedItem);
    onClose();
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
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-ivory-300 overflow-hidden z-10 animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Edit Cart Selection
            </span>
            <h3 className="font-serif text-base font-bold text-ink-primary truncate max-w-xs">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Feeding Option where applicable */}
          {product.feedingConfig === 'both' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-primary block">
                1. Feeding Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType('Feeding')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedType === 'Feeding'
                      ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700 font-bold'
                      : 'border-ivory-300 bg-white text-ink-secondary hover:bg-ivory-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>🤱 Feeding-Friendly</span>
                    {selectedType === 'Feeding' && <Check className="w-3.5 h-3.5 text-brand-700" />}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('Non-Feeding')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedType === 'Non-Feeding'
                      ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700 font-bold'
                      : 'border-ivory-300 bg-white text-ink-secondary hover:bg-ivory-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>✨ Non-Feeding</span>
                    {selectedType === 'Non-Feeding' && <Check className="w-3.5 h-3.5 text-brand-700" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {product.feedingConfig === 'feeding-only' && (
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Dedicated Nursing Silhouette (Built-in dual zips)</span>
            </div>
          )}

          {/* 2. Color Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center justify-between">
              <span>{product.feedingConfig === 'both' ? '2. Colour' : '1. Colour'}:</span>
              <span className="text-brand-700 font-semibold">{selectedColor.name}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.availableColors.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-brand-700 bg-brand-50 text-brand-900 font-semibold ring-1 ring-brand-700'
                        : 'border-ivory-300 bg-white text-ink-secondary hover:bg-ivory-50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center justify-between">
              <span>{product.feedingConfig === 'both' ? '3. Size' : '2. Size'}:</span>
              <span className="text-brand-700 font-semibold">{selectedSize}</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {product.availableSizes.map((size) => {
                const isSelected = selectedSize === size;
                const inStock = isCombinationAvailable(selectedType, selectedColor.id, size);
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!inStock}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-brand-700 bg-brand-700 text-white shadow-xs'
                        : inStock
                        ? 'border-ivory-300 bg-white text-ink-primary hover:border-brand-700'
                        : 'border-ivory-200 bg-ivory-100 text-ink-light cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Notification */}
          <div className="text-xs pt-1">
            {isCurrentVariantInStock ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>In Stock • Ready to update</span>
              </span>
            ) : (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Selected combination is out of stock</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-ivory-200 bg-ivory-50 flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-ink-primary">
            ₹{matchingVariant ? matchingVariant.price * item.quantity : item.price * item.quantity}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-ivory-300 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-ivory-200"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isCurrentVariantInStock}
              onClick={handleSave}
              className="px-5 py-2 bg-brand-700 text-white rounded-xl text-xs font-semibold hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

