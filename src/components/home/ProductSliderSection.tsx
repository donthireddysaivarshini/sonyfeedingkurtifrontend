import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { useWishlist } from '../../context/WishlistContext';
import { PriceDisplay } from '../common/PriceDisplay';
import { RatingBadge } from '../common/RatingBadge';

interface ProductSliderSectionProps {
  id: string;
  title: string;
  viewAllLink: string;
  products: Product[];
  onQuickSelect: (product: Product) => void;
  badgeLabel?: string;
  enableAutoMarquee?: boolean;
  direction?: 'left' | 'right';
}

export const ProductSliderSection: React.FC<ProductSliderSectionProps> = ({
  id,
  title,
  viewAllLink,
  products,
  onQuickSelect,
  badgeLabel,
  enableAutoMarquee = true,
  direction = 'left',
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderCard = (product: Product, keySuffix = '') => {
    const isFavorited = isInWishlist(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
      : null;

    return (
      <div
        key={`${product.id}${keySuffix}`}
        className="w-36 shrink-0 sm:w-48 md:w-56"
      >
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-brand-200/70 bg-[#FDFBFE] transition-all duration-300 hover:border-brand-400 hover:shadow-lg hover:shadow-brand-900/10">
          
          {/* 3:4 Image Container */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-50">
            <Link
              to={`/product/${product.slug}`}
              className="block h-full w-full focus:outline-none"
            >
              <img
                alt={product.title}
                src={product.images[0]}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </Link>

            {/* Top-Left Badges */}
            <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1 items-start">
              {badgeLabel ? (
                <span className="rounded-xs bg-brand-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                  {badgeLabel}
                </span>
              ) : product.badge ? (
                <span className="rounded-xs bg-brand-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                  {product.badge}
                </span>
              ) : product.feedingConfig === 'both' || product.feedingConfig === 'feeding-only' ? (
                <span className="rounded-xs bg-emerald-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                  Feeding
                </span>
              ) : null}

              {discountPercent && (
                <span className="rounded-xs bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Dynamic Customer Rating Overlay */}
            <div className="pointer-events-none absolute left-2 bottom-2 z-10 sm:group-hover:opacity-0 transition-opacity">
              <RatingBadge
                rating={product.rating}
                reviewCount={product.reviewCount}
                variant="overlay"
              />
            </div>

            {/* Top-Right Wishlist Heart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-110 hover:bg-white ${
                isFavorited ? 'text-red-600' : 'text-stone-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Add Overlay on Hover (Desktop) */}
            <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickSelect(product);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-brand-800/95 hover:bg-brand-900 text-white py-1.5 rounded-lg text-xs font-bold shadow-md transition-all backdrop-blur-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Select Options</span>
              </button>
            </div>
          </div>

          {/* Product Card Details */}
          <div className="flex flex-1 flex-col p-2.5 sm:p-3">
            <Link
              to={`/product/${product.slug}`}
              className="line-clamp-1 text-xs font-semibold text-stone-900 transition-colors group-hover:text-brand-800 sm:text-sm"
              title={product.title}
            >
              {product.title}
            </Link>

            {/* Dynamic Selling Price, MRP & % Discount */}
            <div className="mt-1">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                discountPercentage={product.discountPercentage}
                size="sm"
                showDecimals
              />
            </div>

            {/* Available Sizes List */}
            <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
              <span className="truncate">
                {product.availableSizes.join(', ')}
              </span>
            </div>

            {/* Bottom Row: Colors & Swatches */}
            <div className="mt-2 flex items-center justify-between gap-1 pt-1.5 border-t border-stone-100">
              <span className="text-[10px] font-medium text-stone-500">
                +{product.availableColors.length} Colors
              </span>
              <div className="flex items-center -space-x-1">
                {product.availableColors.slice(0, 4).map((c) => (
                  <span
                    key={c.id}
                    className="inline-block h-2.5 w-2.5 rounded-full border border-white shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Select Options Button */}
            <button
              type="button"
              onClick={() => onQuickSelect(product)}
              className="mt-2 sm:hidden w-full flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-1 rounded text-[11px] font-semibold transition-colors"
            >
              <ShoppingBag className="w-3 h-3 text-maroon-700" />
              <span>Select Options</span>
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section id={id} className="py-3 sm:py-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        
        {/* Section Header matching GSS */}
        <div className="flex items-center justify-between pb-2.5">
          <h2 className="font-display text-base font-bold tracking-tight text-stone-900 sm:text-xl md:text-2xl">
            <Link
              to={viewAllLink}
              className="transition-colors hover:text-maroon-800"
            >
              {title}
            </Link>
          </h2>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={viewAllLink}
              className="group flex items-center gap-1 text-xs font-semibold text-stone-800 transition-colors hover:text-maroon-700 sm:text-sm"
            >
              <span>View All</span>
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            {/* Desktop Left/Right Manual Controls */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label={`Scroll ${title} left`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:border-maroon-700 hover:text-maroon-700 transition-all shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label={`Scroll ${title} right`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:border-maroon-700 hover:text-maroon-700 transition-all shadow-2xs"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sliding Card Carousel with Gradient Fades on edges */}
        <div className="relative -mx-3 overflow-hidden sm:-mx-6">
          {/* Left Edge Gradient Fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#FAF5FC] to-transparent sm:w-12 md:w-16"
          />

          {/* Right Edge Gradient Fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#FAF5FC] to-transparent sm:w-12 md:w-16"
          />

          {/* Horizontal Track (Manual Swipe + Continuous Glide Marquee) */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto no-scrollbar scroll-smooth flex w-full"
          >
            <div className="group flex w-max gap-2.5 px-3 pb-2 pt-1 sm:gap-4 sm:px-6 md:gap-5 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
              {/* Primary Item Set */}
              <div
                style={enableAutoMarquee ? { animationDuration: '15s' } : undefined}
                className={`flex shrink-0 items-stretch gap-2.5 sm:gap-4 md:gap-5 ${
                  enableAutoMarquee
                    ? direction === 'right'
                      ? 'group-hover:[animation-play-state:paused] animate-marquee-reverse'
                      : 'group-hover:[animation-play-state:paused] animate-marquee'
                    : ''
                }`}
              >
                {products.map((product) => renderCard(product))}
              </div>

              {/* Duplicate Item Set for Infinite Seamless Loop */}
              {enableAutoMarquee && (
                <div
                  aria-hidden="true"
                  style={{ animationDuration: '15s' }}
                  className={`flex shrink-0 items-stretch gap-2.5 sm:gap-4 md:gap-5 ${
                    direction === 'right'
                      ? 'group-hover:[animation-play-state:paused] animate-marquee-reverse'
                      : 'group-hover:[animation-play-state:paused] animate-marquee'
                  }`}
                >
                  {products.map((product) => renderCard(product, '-loop'))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
