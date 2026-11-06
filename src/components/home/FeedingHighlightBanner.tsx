import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, EyeOff } from 'lucide-react';

export const FeedingHighlightBanner: React.FC = () => {
  return (
    <section id="feeding-highlight" className="py-16 sm:py-20 bg-brand-900 text-ivory-50 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-800/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-700/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800/80 text-brand-gold text-xs font-semibold uppercase tracking-widest mb-3 border border-brand-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Patented Feeding Innovation</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Designed for Motherhood,{' '}
            <span className="italic font-normal text-brand-200">Crafted with Grace</span>
          </h2>
          <p className="text-xs sm:text-sm text-ivory-200/80 mt-3 leading-relaxed">
            Every garment in our feeding collection features intelligent engineering that allows you to nurse your baby comfortably, privately, and with total peace of mind.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              100% Invisible Zips
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              12-inch twin zippers nested along the side seams, completely hidden under festive borders and pleats.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Soft Skin-Guard Placket
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Gentle fabric flap separates the zipper teeth from your skin and prevents baby cheek chafing during feeds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Pre & Postpartum Fit
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Specialized flared silhouettes and relaxed gathers that accommodate pregnancy bumps and flatter postpartum curves.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Pure Natural Cottons
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Breathable Mulmul, airy Chanderi, and soft georgettes woven to keep mom and newborn cool across all Indian seasons.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

