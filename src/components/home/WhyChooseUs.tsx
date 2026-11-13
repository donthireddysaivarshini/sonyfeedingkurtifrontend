import React from 'react';
import { Truck, Heart, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section aria-label="Trust Badges" className="py-2.5 sm:py-4 border-b border-brand-200/70 bg-ivory-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6">
        <div className="grid grid-cols-3 divide-x divide-brand-200/70 text-center">
          
          {/* Pillar 1: Free Shipping */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 py-1 sm:py-0 px-1.5 sm:px-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm font-bold text-ink-primary tracking-tight uppercase leading-tight">
                Free Shipping
              </p>
              <p className="text-[9px] sm:text-xs text-ink-secondary leading-tight mt-0.5">
                All Over India
              </p>
            </div>
          </div>

          {/* Pillar 2: Customer Love */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 py-1 sm:py-0 px-1.5 sm:px-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-brand-800/20" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm font-bold text-ink-primary tracking-tight uppercase leading-tight">
                10,000+ Moms
              </p>
              <p className="text-[9px] sm:text-xs text-ink-secondary leading-tight mt-0.5">
                Happy Homes
              </p>
            </div>
          </div>

          {/* Pillar 3: Secure Payments */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 py-1 sm:py-0 px-1.5 sm:px-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm font-bold text-ink-primary tracking-tight uppercase leading-tight">
                Secure Pay
              </p>
              <p className="text-[9px] sm:text-xs text-ink-secondary leading-tight mt-0.5">
                UPI & Cards
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
