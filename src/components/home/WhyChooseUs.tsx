import React from 'react';
import { ShieldCheck, Sparkles, Truck, RotateCcw } from 'lucide-react';
import { VALUE_PROPOSITIONS } from '../../data/banners';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-brand-700" />,
  Sparkles: <Sparkles className="w-6 h-6 text-brand-700" />,
  Truck: <Truck className="w-6 h-6 text-brand-700" />,
  RotateCcw: <RotateCcw className="w-6 h-6 text-brand-700" />,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-ivory-50 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-1 block">
            The Sony Promise
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary">
            Why Mothers Love Sony Feeding Kurtis
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2">
            Every stitch, zip, and fold is designed to prioritize your peace of mind and newborn safety.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-card hover:shadow-card-hover transition-all text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                {ICON_MAP[prop.icon] || <Sparkles className="w-6 h-6 text-brand-700" />}
              </div>
              <h3 className="font-serif text-base font-bold text-ink-primary mb-2">
                {prop.title}
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

