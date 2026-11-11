import React from 'react';
import { Star } from 'lucide-react';

export const SocialProofBanner: React.FC = () => {
  return (
    <section aria-label="Social Proof" className="py-4 md:py-6 bg-cream-50/70 border-b border-stone-200/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          
          {/* Avatar Circles Cluster */}
          <div className="flex items-center -space-x-2.5">
            <img
              alt="Happy Mother 1"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <img
              alt="Happy Mother 2"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <img
              alt="Happy Mother 3"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-xs"
            />
          </div>

          {/* Rating & Text */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-saffron-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-saffron-500 text-saffron-500" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-stone-900">
              Loved by 10,000+ Happy Mothers
            </span>
            <span className="text-xs text-stone-500 font-medium">
              (4.8 / 5.0 Rating Across India)
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
