import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { Product, ProductColor } from '../../types/product';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickSelect: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickSelect,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.availableColors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const hasMultipleImages = product.images.length > 1;
  const currentImage = isHovered && hasMultipleImages ? product.images[1] : product.images[0];

  const handleDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      navigate(`/product/${product.slug}`);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : null;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:border-maroon-200 hover:shadow-lg hover:shadow-maroon-950/5 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 3:4 portrait ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer">
        <img
          src={currentImage}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onClick={handleDetailsClick}
        />

        {/* Top Badges (GSS Styled Pills) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`rounded-xs px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs ${
                product.badge.includes('Feeding')
                  ? 'bg-emerald-800'
                  : 'bg-red-700'
              }`}
            >
              {product.badge}
            </span>
          )}

          {discountPercent && (
            <span className="rounded-xs bg-saffron-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-110 hover:bg-white z-10 ${
            isFavorited
              ? 'text-red-600 shadow-md scale-105'
              : 'text-stone-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Feeding Feature Badge */}
        {product.feedingConfig === 'both' && (
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-maroon-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs border border-stone-200">
              <Sparkles className="w-2.5 h-2.5 text-saffron-500" />
              <span>Feeding & Non-Feeding</span>
            </span>
          </div>
        )}

        {product.feedingConfig === 'feeding-only' && (
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-emerald-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 text-emerald-200" />
              <span>Feeding Friendly</span>
            </span>
          </div>
        )}

        {/* Desktop Quick Add Button Overlay */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickSelect(product);
            }}
            className="w-full flex items-center justify-center gap-1.5 bg-maroon-800/95 hover:bg-maroon-900 text-white py-2 rounded-lg text-xs font-bold backdrop-blur-xs shadow-md transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Options</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-maroon-700">
              {product.categoryName}
            </span>
            <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              {product.fabric}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleDetailsClick}
            className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-maroon-700 transition-colors line-clamp-1 cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Price matching GSS format */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm sm:text-base font-bold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}.00
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through font-normal">
                ₹{product.originalPrice.toLocaleString('en-IN')}.00
              </span>
            )}
          </div>
        </div>

        {/* Available Sizes List */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
          <span className="truncate">
            {product.availableSizes.join(', ')}
          </span>
        </div>

        {/* Bottom Metadata: Swatches & Sizes */}
        <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1">
          {/* Color Count */}
          <span className="text-[10px] font-medium text-stone-500">
            +{product.availableColors.length} Colors
          </span>

          {/* Color Swatches */}
          <div className="flex items-center -space-x-1">
            {product.availableColors.slice(0, 4).map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color.name}`}
                className={`inline-block h-2.5 w-2.5 rounded-full border border-white shadow-2xs transition-transform ${
                  selectedColor.id === color.id ? 'scale-125 ring-1 ring-maroon-700 z-10' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={() => onQuickSelect(product)}
          className="w-full mt-2 flex sm:hidden items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 rounded text-[11px] font-semibold transition-colors"
        >
          <ShoppingBag className="w-3 h-3 text-maroon-700" />
          <span>Select Options</span>
        </button>

      </div>
    </div>
  );
};
