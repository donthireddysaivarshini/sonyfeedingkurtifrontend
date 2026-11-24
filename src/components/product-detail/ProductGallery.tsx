import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Heart, Share2 } from 'lucide-react';
import { Product, ProductColor, ClothingType } from '../../types/product';
import { getImageUrl } from '../../utils/imageUrl';

interface ProductGalleryProps {
  product: Product;
  activeColor?: ProductColor | null;
  activeClothingType?: ClothingType | null;
  onColorSelect?: (colorId: string) => void;
  isFavorited?: boolean;
  onToggleWishlist?: () => void;
  onShare?: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  activeColor,
  activeClothingType,
  onColorSelect,
  isFavorited = false,
  onToggleWishlist,
  onShare,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Close zoom modal with ESC key
  useEffect(() => {
    if (!isZoomModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen]);

  // Derive filtered images strictly adhering to Clothing Type (Option B - Myntra Fashion Model)
  const displayImages = useMemo(() => {
    const rawList = product.galleryImages || [];

    // Fallback if galleryImages is not populated
    if (rawList.length === 0) {
      return product.images.length > 0
        ? product.images.map((url, idx) => ({ id: idx, url, colorId: null, colorHex: null, colorName: null }))
        : [{ id: 0, url: '/images/dresses/mauve-anarkali.jpg', colorId: null, colorHex: null, colorName: null }];
    }

    // 1. Strict Clothing Type Filtering:
    let typeMatches = rawList.filter((g) => {
      if (!activeClothingType || product.feedingConfig === 'none') return true;
      if (!g.clothingType || g.clothingType === 'Standard') return true;
      return g.clothingType.toLowerCase() === activeClothingType.toLowerCase();
    });

    if (typeMatches.length === 0) {
      typeMatches = rawList.filter((g) => !g.clothingType || g.clothingType === 'Standard');
    }

    if (typeMatches.length === 0) {
      typeMatches = rawList;
    }

    return typeMatches;
  }, [product.galleryImages, product.images, product.feedingConfig, activeClothingType]);

  // Focus matching image whenever activeColor or activeClothingType changes
  useEffect(() => {
    if (activeColor && displayImages.length > 0) {
      const matchIdx = displayImages.findIndex(
        (g) => g.colorId && String(g.colorId) === String(activeColor.id)
      );
      if (matchIdx !== -1) {
        setSelectedIndex(matchIdx);
      } else {
        setSelectedIndex(0);
      }
    } else {
      setSelectedIndex(0);
    }
  }, [activeColor?.id, activeClothingType, displayImages]);

  const images = displayImages.map((g) => g.url);
  const safeIndex = selectedIndex < images.length ? selectedIndex : 0;
  const currentImageUrl = images[safeIndex] || '/images/dresses/mauve-anarkali.jpg';

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (idx: number) => {
    setSelectedIndex(idx);
    const clicked = displayImages[idx];
    if (clicked && clicked.colorId && onColorSelect) {
      onColorSelect(String(clicked.colorId));
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image Frame (Responsive 4:5 on mobile, 3:4 on tablet/desktop) */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[50vh] sm:max-h-none bg-ivory-100 rounded-2xl overflow-hidden border border-ivory-300 group shadow-card">
        <img
          src={getImageUrl(currentImageUrl)}
          alt={`${product.title} - View ${safeIndex + 1}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out cursor-zoom-in"
          onClick={() => setIsZoomModalOpen(true)}
        />

        {/* Vertical Floating Action Buttons at Bottom Right (Line-wise Wishlist & Share) */}
        <div className="absolute bottom-3 right-3 flex flex-col items-center gap-2 z-20">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-ink-primary shadow-md backdrop-blur-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-ivory-300/80 cursor-pointer"
              title={isFavorited ? 'In your Wishlist' : 'Add to Wishlist'}
            >
              <Heart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : 'text-ink-secondary hover:text-rose-500'
                }`}
              />
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              aria-label="Share product"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-ink-primary shadow-md backdrop-blur-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-ivory-300/80 cursor-pointer"
              title="Share this product"
            >
              <Share2 className="w-4 h-4 text-ink-secondary hover:text-brand-800" />
            </button>
          )}
        </div>

        {/* Carousel Arrows (Mobile/Tablet hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous view"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-ink-primary shadow-md transition-all z-10 opacity-70 hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next view"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-ink-primary shadow-md transition-all z-10 opacity-70 hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Carousel pagination dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThumbnailClick(idx);
                }}
                className={`transition-all rounded-full ${
                  safeIndex === idx
                    ? 'w-4 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Strip — Shows all photos for active clothing type (Myntra style) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {displayImages.map((g, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleThumbnailClick(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-ivory-100 cursor-pointer ${
                safeIndex === idx
                  ? 'border-brand-700 ring-2 ring-brand-700/20 shadow-xs'
                  : 'border-ivory-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getImageUrl(g.url)}
                alt={`${product.title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
              {g.colorHex && (
                <span
                  className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: g.colorHex }}
                  title={g.colorName || undefined}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Pure Fullscreen Image Viewer Modal (Rendered via React Portal at body level to prevent any stacking context leaks) */}
      {isZoomModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
            onClick={() => setIsZoomModalOpen(false)}
          >
            {/* Prominent Top-Right Close 'X' (Wrong) Button */}
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              aria-label="Close image zoom"
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10000] p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/25"
              title="Close (ESC)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left & Right Fullscreen Nav Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous image"
                  className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[10000] p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/25"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next image"
                  className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[10000] p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/25"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Centered High-Resolution Image (Pure image without any color or size options) */}
            <div
              className="relative max-w-5xl max-h-[88vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(currentImageUrl)}
                alt={product.title}
                className="max-h-[84vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-white/70 text-xs sm:text-sm mt-3 text-center font-medium">
                {product.title} • {safeIndex + 1} of {images.length} (Click ✕ or tap outside to close)
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
