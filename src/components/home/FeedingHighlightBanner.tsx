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
            <span>Design Details</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Thoughtfully Designed Feeding Access,{' '}
            <span className="italic font-normal text-brand-200">Crafted with Care</span>
          </h2>
          <p className="text-xs sm:text-sm text-ivory-200/80 mt-3 leading-relaxed">
            Our feeding-friendly ethnic styles integrate discreet side zippers to support nursing convenience while maintaining the drape and elegance of traditional clothing.
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
              Concealed Side Zippers
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Discreet vertical zippers integrated along the side seams, hidden beneath pleats and natural fabric folds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Protective Inner Lining
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Soft fabric placket designed to separate zipper teeth from sensitive skin for greater wearing comfort.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Comfort Silhouette
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Flared cuts and relaxed gathering designed to drape comfortably and provide ease during different stages.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-brand-800/60 backdrop-blur-xs p-6 rounded-2xl border border-brand-700/60 hover:border-brand-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-700/80 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Selected Fabrics
            </h3>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Lightweight cottons, soft chanderi, and flowing georgette blends chosen for breathability and drape.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
