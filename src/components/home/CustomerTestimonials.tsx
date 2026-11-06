import React from 'react';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../../data/reviews';

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-ivory-100/70 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Real Stories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary">
            Loved by 10,000+ Indian Mothers
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2">
            Read heartfelt experiences from mothers who found dignity, ease, and ethnic elegance in our collections.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-ink-primary leading-relaxed italic mb-4">
                  "{rev.review}"
                </p>
              </div>

              {/* Bottom Customer Info */}
              <div className="pt-3 border-t border-ivory-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-ink-primary">{rev.customerName}</h4>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-800 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-ink-muted mt-0.5">{rev.location}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-brand-700 font-medium">
                  <span className="truncate pr-1">{rev.productName}</span>
                  <span className="bg-brand-50 px-1.5 py-0.2 rounded shrink-0">
                    {rev.clothingType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
