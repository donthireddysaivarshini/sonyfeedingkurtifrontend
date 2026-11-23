import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductColor, ClothingType } from '../../types/product';
import { getImageUrl } from '../../utils/imageUrl';

interface ProductGalleryProps {
  product: Product;
  activeColor?: ProductColor | null;
  activeClothingType?: ClothingType | null;
  onColorSelect?: (colorId: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  activeColor,
  activeClothingType,
  onColorSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Derive filtered images strictly adhering to Clothing Type (Option B - Myntra Fashion Model)
  // Shows all photos of active clothing type, while activeColor focuses the corresponding photo.
  const displayImages = useMemo(() => {
    const rawList = product.galleryImages || [];

    // Fallback if galleryImages is not populated
    if (rawList.length === 0) {
      return product.images.length > 0
        ? product.images.map((url, idx) => ({ id: idx, url, colorId: null, colorHex: null, colorName: null }))
        : [{ id: 0, url: '/images/dresses/mauve-anarkali.jpg', colorId: null, colorHex: null, colorName: null }];
    }

    // 1. Strict Clothing Type Filtering:
    // If activeClothingType is Non-Feeding, ONLY show Non-Feeding (and neutral/standard) images!
    // If activeClothingType is Feeding, ONLY show Feeding (and neutral/standard) images!
    let typeMatches = rawList.filter((g) => {
      if (!activeClothingType || product.feedingConfig === 'none') return true;
      if (!g.clothingType || g.clothingType === 'Standard') return true;
      return g.clothingType.toLowerCase() === activeClothingType.toLowerCase();
    });

    // Fallback to neutral/standard images if no images exist for this specific clothing type
    if (typeMatches.length === 0) {
      typeMatches = rawList.filter((g) => !g.clothingType || g.clothingType === 'Standard');
    }

    // If still empty, fallback safely
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

        {/* Feature / Feeding Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.feedingConfig === 'both' && (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-brand-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-brand-200 shadow-xs">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>Feeding & Non-Feeding</span>
            </span>
          )}

          {product.feedingConfig === 'feeding-only' && (
            <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              <span>Feeding Friendly</span>
            </span>
          )}

          {product.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-700 text-white shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomModalOpen(true)}
          aria-label="Enlarge image"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/85 hover:bg-white text-ink-primary shadow-md transition-all hover:scale-110 z-10"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Mobile / Hover Carousel Arrows if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous view"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-ink-primary shadow-md transition-all z-10 opacity-70 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next view"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-ink-primary shadow-md transition-all z-10 opacity-70 hover:opacity-100"
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
              onClick={() => handleThumbnailClick(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-ivory-100 ${
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

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={getImageUrl(currentImageUrl)}
              alt={product.title}
              className="max-h-[82vh] w-auto object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-ivory-200 text-xs mt-3 text-center">
              {product.title} • {safeIndex + 1} of {images.length} (Tap anywhere outside to close)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

