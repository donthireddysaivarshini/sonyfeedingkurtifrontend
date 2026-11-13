import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FAF5FC] via-[#F2E6F7] to-[#EADAF2]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full">
        <Link
          to={slide.ctaLink}
          aria-label={slide.title}
          className="block w-full focus:outline-none"
        >
          {slide.preserveArtwork ? (
            <div className="mx-auto max-w-6xl">
              <picture>
                <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                <img
                  src={slide.desktopImage}
                  alt={slide.title}
                  className="w-full h-[260px] sm:h-[420px] md:h-[480px] lg:h-[520px] object-contain mx-auto transition-opacity duration-500"
                />
              </picture>
            </div>
          ) : (
            <picture>
              <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
              <img
                src={slide.desktopImage}
                alt={slide.title}
                className="w-full h-[280px] sm:h-[440px] md:h-[500px] lg:h-[540px] object-cover object-[50%_20%] transition-opacity duration-500"
              />
            </picture>
          )}
        </Link>

        {/* Previous Button */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-brand-900 flex items-center justify-center shadow-md transition-all hover:scale-105 hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-brand-900 flex items-center justify-center shadow-md transition-all hover:scale-105 hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators Dots */}
        <div className="absolute bottom-2.5 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? 'w-7 sm:w-8 h-2 bg-brand-700 shadow-xs'
                  : 'w-2 h-2 bg-brand-900/30 hover:bg-brand-700/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
