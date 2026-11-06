import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
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
      className="relative overflow-hidden bg-ivory-100 border-b border-ivory-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center">
        
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
            <img
              src={slide.desktopImage}
              alt={slide.title}
              className="w-full h-full object-cover object-top sm:object-center transition-opacity duration-700 ease-in-out"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-ivory-50/95 via-ivory-50/80 to-transparent sm:w-2/3 lg:w-1/2" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-xl space-y-4 sm:space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-700/90 text-ivory-50 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-xs shadow-xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{slide.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-ink-primary leading-[1.15] tracking-tight">
              {slide.title}{' '}
              <span className="text-brand-700 block italic font-normal sm:inline">
                {slide.highlightText}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-ink-secondary leading-relaxed max-w-lg">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-brand-800 transition-all hover:gap-3 hover:shadow-lg"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {slide.secondaryCtaText && (
                <a
                  href={slide.secondaryCtaLink || '#categories'}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 text-ink-primary font-semibold text-xs sm:text-sm border border-ivory-300 hover:bg-white hover:text-brand-700 transition-all shadow-xs"
                >
                  <span>{slide.secondaryCtaText}</span>
                </a>
              )}
            </div>

            {/* Micro Feature Callout */}
            <div className="flex items-center gap-2 text-[11px] text-ink-muted pt-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>{slide.tag}</span>
            </div>

          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-ink-primary flex items-center justify-center shadow-md transition-all hover:scale-105 hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-ink-primary flex items-center justify-center shadow-md transition-all hover:scale-105 hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-brand-700' : 'w-2 bg-ink-primary/30 hover:bg-ink-primary/50'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

