import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const MidBannerPromo: React.FC = () => {
  return (
    <section className="py-12 bg-ivory-100 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-800 via-brand-700 to-brand-900 text-white shadow-xl">
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop"
              alt="Ethnic Texture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Promo text */}
            <div className="max-w-xl text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-semibold uppercase tracking-wider border border-brand-gold/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Ethnic Boutique</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Traditional Grace with Everyday Comfort
              </h3>
              <p className="text-xs sm:text-sm text-ivory-100/90 leading-relaxed">
                Discover our eight signature collections tailored for festive occasions, family celebrations, and relaxed everyday wear.
              </p>
            </div>

            {/* Action CTA */}
            <div className="shrink-0">
              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-brand-800 font-bold text-xs sm:text-sm hover:bg-ivory-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
