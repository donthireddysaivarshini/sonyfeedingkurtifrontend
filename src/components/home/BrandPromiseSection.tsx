import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const BrandPromiseSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-maroon-800 text-cream-50 select-none">
      {/* Background Decorative Rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-cream-50/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-cream-50/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-display text-8xl italic text-cream-50/5"
      >
        ✦
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 md:px-8 md:py-24">
        {/* Eyebrow */}
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-saffron-300">
          The Sony Collections Promise
        </p>

        {/* Headline */}
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-2xl sm:text-4xl md:text-5xl font-medium leading-snug text-cream-50">
          Fashion for Every Stage of Womanhood
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-cream-200/80 leading-relaxed">
          Crafting elegant ethnic kurtis, frocks, sarees, and suits — celebrating Indian heritage, exquisite craftsmanship, and timeless grace.
        </p>

        {/* 4 Stat Metrics Grid */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 md:mt-14 md:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-bold text-saffron-300 md:text-5xl">
              5,000+
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-200/70">
              Orders delivered
            </p>
          </div>

          <div>
            <p className="font-display text-3xl font-bold text-saffron-300 md:text-5xl">
              4.8★
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-200/70">
              Average rating
            </p>
          </div>

          <div>
            <p className="font-display text-3xl font-bold text-saffron-300 md:text-5xl">
              36
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-200/70">
              States & UTs served
            </p>
          </div>

          <div>
            <p className="font-display text-3xl font-bold text-saffron-300 md:text-5xl">
              100%
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-200/70">
              Handpicked fabrics
            </p>
          </div>
        </div>

        {/* CTA Button matching GSS */}
        <div className="mt-10 md:mt-14">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-8 py-3.5 sm:py-4 font-bold text-stone-950 shadow-lg transition-transform hover:scale-105 hover:bg-saffron-400 text-xs sm:text-sm"
          >
            <span>Start shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
