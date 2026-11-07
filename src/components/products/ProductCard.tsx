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

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 3:4 portrait ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-100 cursor-pointer">
        <img
          src={currentImage}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onClick={handleDetailsClick}
        />

        {/* Top Badges (Only legitimate category/catalog tags) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span
              className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${
                product.badge === 'Feeding Essential'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-brand-700 text-white'
              }`}
            >
              {product.badge}
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
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-white text-rose-600 shadow-md scale-110'
              : 'bg-white/80 hover:bg-white text-ink-secondary hover:text-rose-600 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Feeding Feature Badge based on FeedingConfiguration */}
        {product.feedingConfig === 'both' && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-brand-200 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-brand-gold" />
              <span>Feeding & Non-Feeding</span>
            </span>
          </div>
        )}

        {product.feedingConfig === 'feeding-only' && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-emerald-200" />
              <span>Feeding Friendly</span>
            </span>
          </div>
        )}

        {/* Desktop Quick Add Button Overlay */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickSelect(product);
            }}
            className="w-full flex items-center justify-center gap-2 bg-brand-700/95 hover:bg-brand-800 text-white py-2.5 rounded-xl text-xs font-semibold backdrop-blur-xs shadow-lg transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Options & Add</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
            <span className="uppercase tracking-wider font-semibold text-brand-accent">
              {product.categoryName}
            </span>
            <span className="text-[10px] text-ink-secondary bg-ivory-100 px-1.5 py-0.5 rounded">
              {product.fabric}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleDetailsClick}
            className="font-serif text-sm sm:text-base font-semibold text-ink-primary group-hover:text-brand-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Transparent Honest Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-bold text-ink-primary">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-ink-muted line-through font-normal">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Metadata: Swatches & Sizes */}
        <div className="mt-3 pt-3 border-t border-ivory-200 flex items-center justify-between gap-2">
          {/* Color Swatches */}
          <div className="flex items-center gap-1">
            {product.availableColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color.name}`}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColor.id === color.id
                    ? 'ring-1.5 ring-brand-700 ring-offset-1 scale-110 border-white'
                    : 'border-gray-300 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Available Sizes List */}
          <div className="flex items-center gap-1 text-[10px] text-ink-secondary font-medium">
            {product.availableSizes.slice(0, 4).map((s) => (
              <span key={s} className="px-1 py-0.5 bg-ivory-200 rounded text-[9px]">
                {s}
              </span>
            ))}
            {product.availableSizes.length > 4 && (
              <span className="text-[9px] text-ink-muted">+{product.availableSizes.length - 4}</span>
            )}
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={() => onQuickSelect(product)}
          className="w-full mt-3 flex sm:hidden items-center justify-center gap-1.5 bg-brand-700 text-white py-2 rounded-xl text-xs font-semibold shadow-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Select Options</span>
        </button>

      </div>
    </div>
  );
};
