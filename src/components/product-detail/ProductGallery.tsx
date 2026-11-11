import React, { useState } from 'react';
import { Sparkles, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const images = product.images.length > 0 ? product.images : [
    '/images/dresses/mauve-anarkali.jpg'
  ];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image Frame (3:4 ratio) */}
      <div className="relative aspect-[3/4] bg-ivory-100 rounded-2xl overflow-hidden border border-ivory-300 group shadow-card">
        <img
          src={images[selectedIndex]}
          alt={`${product.title} - View ${selectedIndex + 1}`}
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

        {/* Image index pill */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-ivory-100 ${
                selectedIndex === idx
                  ? 'border-brand-700 ring-2 ring-brand-700/20 shadow-xs'
                  : 'border-ivory-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${product.title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
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
              src={images[selectedIndex]}
              alt={product.title}
              className="max-h-[82vh] w-auto object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-ivory-200 text-xs mt-3 text-center">
              {product.title} • {selectedIndex + 1} of {images.length} (Tap anywhere outside to close)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

