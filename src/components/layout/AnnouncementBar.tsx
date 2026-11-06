import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { ANNOUNCEMENT_MESSAGES } from '../../data/banners';

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const nextMessage = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
  };

  const prevMessage = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENT_MESSAGES.length) % ANNOUNCEMENT_MESSAGES.length);
  };

  return (
    <div className="bg-brand-700 text-ivory-50 text-xs sm:text-sm font-medium tracking-wide py-2 px-4 relative z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Arrow */}
        <button
          onClick={prevMessage}
          aria-label="Previous announcement"
          className="p-1 hover:text-brand-accent transition-colors hidden sm:block opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Message Content */}
        <div className="flex-1 text-center truncate px-2 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse shrink-0" />
          <span className="truncate">{ANNOUNCEMENT_MESSAGES[currentIndex]}</span>
        </div>

        {/* Right Arrow & Dismiss */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={nextMessage}
            aria-label="Next announcement"
            className="p-1 hover:text-brand-accent transition-colors hidden sm:block opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss banner"
            className="p-1 text-ivory-100 hover:text-white transition-colors opacity-75 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

