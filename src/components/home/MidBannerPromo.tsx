import React from 'react';
import { ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

export const MidBannerPromo: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText('MOTHERHOOD');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-ivory-100 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-800 via-brand-700 to-brand-900 text-white shadow-xl">
          
          {/* Subtle background image overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop"
              alt="Ethnic Background Pattern"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Promo text */}
            <div className="max-w-xl text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-semibold uppercase tracking-wider border border-brand-gold/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Period Festive Celebration</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Embrace Festive Elegance with Flat 35% Off
              </h3>
              <p className="text-xs sm:text-sm text-ivory-100/90 leading-relaxed">
                Experience supreme nursing convenience wrapped in rich Chanderi silks, tiered frocks, and festive anarkalis.
              </p>
            </div>

            {/* Promo action / coupon */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {/* Coupon Box */}
              <div
                onClick={copyCode}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/10 border border-white/25 backdrop-blur-md cursor-pointer hover:bg-white/15 transition-all text-xs"
                title="Click to copy coupon code"
              >
                <div>
                  <span className="text-[10px] uppercase text-brand-200 block font-bold">Coupon Code</span>
                  <span className="font-mono font-bold text-base text-white tracking-wider">MOTHERHOOD</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-brand-gold">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>

              {/* Shop CTA */}
              <a
                href="#bestsellers"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-brand-800 font-bold text-xs sm:text-sm hover:bg-ivory-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>Shop Festive Edit</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

