import React from 'react';
import { Sparkles, Heart, Award, ArrowRight } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  return (
    <section id="about-us" className="py-16 sm:py-24 bg-white border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Visual Collage */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-ivory-200">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop"
                alt="Sony Collections Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Highlight Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-ivory-50/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-ivory-300 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold font-serif text-lg">
                  S
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                    Artisanal Heritage
                  </h4>
                  <p className="text-[11px] text-ink-secondary">
                    Handcrafted traditional Indian fashion
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-widest border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Our Brand Ethos</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-primary leading-tight">
              Where Royal Heritage Meets Everyday Elegance
            </h2>

            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              At <strong>Sony Collections</strong>, our mission is to offer thoughtfully curated women's and kids' ethnic wear that celebrates traditional Indian aesthetics, fine embroidery, and breathable comfort.
            </p>

            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Our feeding-friendly designs incorporate twin concealed side zippers integrated along seams for discreet nursing convenience, while our standard ethnic wear collections offer classic tailored elegance for festive and everyday occasions.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-ink-primary">Comfortable Silhouettes</h5>
                  <p className="text-[11px] text-ink-muted">Tailored to drape comfortably for daily wear.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-ink-primary">Gentle Fabrics</h5>
                  <p className="text-[11px] text-ink-muted">Soft mulmul cotton, chanderi, and georgette blends.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#feeding-highlight"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-brand-800 transition-all"
              >
                <span>Discover the Feeding Difference</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

