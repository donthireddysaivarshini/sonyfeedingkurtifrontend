import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../data/banners';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      aria-label="Hero Promotion"
      className="relative w-full overflow-hidden bg-cream-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full min-h-[340px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[545px] flex items-center">
        
        {/* Background Image Carousel Slide */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
            <img
              src={slide.desktopImage}
              alt={slide.title}
              className="w-full h-full object-cover object-[50%_20%] transition-all duration-700 ease-in-out"
            />
          </picture>
          
          {/* Subtle Contrast Gradients Matching GSS Hero Style */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-900/40 to-transparent sm:w-3/4 md:w-3/5" />
          <div className="absolute inset-0 bg-stone-950/20" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16">
          <div className="max-w-xl space-y-3 sm:space-y-4 text-white">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/90 text-stone-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs animate-fade-in">
              <span>✦</span>
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
              {slide.title}{' '}
              <span className="text-saffron-300 font-serif italic block sm:inline font-normal">
                {slide.highlightText}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-cream-100/90 leading-relaxed max-w-lg font-normal line-clamp-2 sm:line-clamp-none">
              {slide.subtitle}
            </p>

            {/* CTAs matching GSS Button Styles */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-maroon-800 text-cream-50 font-bold text-xs sm:text-sm shadow-md hover:bg-maroon-700 transition-all hover:gap-3"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {slide.secondaryCtaText && (
                <Link
                  to={slide.secondaryCtaLink || '/shop'}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 text-stone-900 font-bold text-xs sm:text-sm hover:bg-white hover:text-maroon-800 transition-all shadow-xs"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all hover:scale-105 hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all hover:scale-105 hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators Dots */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? 'w-7 sm:w-8 h-2 bg-saffron-400 shadow-xs'
                  : 'w-2 h-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
