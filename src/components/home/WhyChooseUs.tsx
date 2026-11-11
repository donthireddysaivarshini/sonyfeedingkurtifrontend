import React from 'react';
import { Truck, Heart, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section aria-label="Trust Badges" className="py-2.5 sm:py-4 border-b border-stone-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="grid grid-cols-1 divide-y divide-stone-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 text-center">
          
          {/* Pillar 1: Free Shipping */}
          <div className="flex items-center justify-center gap-3 py-2 sm:py-0 px-2 sm:px-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-maroon-800">
              <Truck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight uppercase">
                Free Shipping
              </p>
              <p className="text-[11px] sm:text-xs text-stone-500">
                All Over India (Postal Delivery)
              </p>
            </div>
          </div>

          {/* Pillar 2: Customer Love */}
          <div className="flex items-center justify-center gap-3 py-2 sm:py-0 px-2 sm:px-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-maroon-800">
              <Heart className="h-5 w-5 fill-maroon-800/20" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight uppercase">
                10,000+ Happy Mothers
              </p>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Loved & Trusted Across 28 States
              </p>
            </div>
          </div>

          {/* Pillar 3: Secure Payments */}
          <div className="flex items-center justify-center gap-3 py-2 sm:py-0 px-2 sm:px-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-maroon-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight uppercase">
                100% Secure Payments
              </p>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Safe & Trusted UPI, Cards & NetBanking
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
