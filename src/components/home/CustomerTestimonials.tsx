import React from 'react';
import { Sparkles, HelpCircle, Ruler, Shirt, MessageSquare } from 'lucide-react';

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-ivory-100/70 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Customer Assistance</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary">
            Fit, Sizing & Design Transparency
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2">
            Clear guidelines on choosing the right size, care instructions, and feeding features.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Sizing */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-ink-primary mb-2">
                Maternity & Relaxed Sizing
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Our silhouettes incorporate relaxed chest and waist ease to accommodate changes before and after pregnancy comfortably.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-ivory-200 text-[11px] text-brand-700 font-semibold">
              Standard Indian Sizing (S to XXL)
            </div>
          </div>

          {/* Card 2: Feeding selection */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-ink-primary mb-2">
                Feeding vs Regular Fits
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Styles with feeding options feature concealed side zips. If you prefer regular festive wear, choose the Non-Feeding option.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-ivory-200 text-[11px] text-brand-700 font-semibold">
              Option Available on Select Styles
            </div>
          </div>

          {/* Card 3: Fabric Care */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-ink-primary mb-2">
                Fabric Care & Handling
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Mulmul cotton frocks can be hand-washed cold. We recommend dry cleaning for embroidered and chanderi silk festive sets.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-ivory-200 text-[11px] text-brand-700 font-semibold">
              Care Instructions on Each Product
            </div>
          </div>

          {/* Card 4: Verified Reviews Placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-ink-primary mb-2">
                Verified Customer Reviews
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Customer ratings and genuine reviews will be published here directly as customers receive and review their orders.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-ivory-200 text-[11px] text-ink-muted font-medium">
              Authentic Feedback • Post-Launch
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
