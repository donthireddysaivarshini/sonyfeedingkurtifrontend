import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ivory-200/90 text-ink-primary border-t border-ivory-300 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-ivory-300/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <Sparkles className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Concealed Zips</h5>
              <p className="text-[11px] text-ink-secondary">Dual invisible nursing openings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <ShieldCheck className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">100% Breathable</h5>
              <p className="text-[11px] text-ink-secondary">Baby-safe natural cottons & silks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <Heart className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Maternity & Beyond</h5>
              <p className="text-[11px] text-ink-secondary">Flattering pre & post baby fit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <Mail className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Free Shipping</h5>
              <p className="text-[11px] text-ink-secondary">All over India on orders ₹999+</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          
          {/* Column 1: Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-brand-700 block uppercase">
              SONY FEEDING KURTIS
            </span>
            <p className="text-xs text-ink-secondary leading-relaxed max-w-sm">
              Crafting premium Indian ethnic wear that lovingly embraces the journey of motherhood. 
              Our designs seamlessly blend handcrafted elegance with discreet feeding access, so every mother feels confident, dignified, and comfortable.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border border-ivory-300 flex items-center justify-center text-ink-secondary hover:text-brand-700 hover:border-brand-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white border border-ivory-300 flex items-center justify-center text-ink-secondary hover:text-brand-700 hover:border-brand-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white border border-ivory-300 flex items-center justify-center text-ink-secondary hover:text-brand-700 hover:border-brand-700 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div>
            <h4 className="font-serif text-sm font-bold text-ink-primary uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#category-${cat.slug}`}
                    className="hover:text-brand-700 transition-colors block py-0.5"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: More Collections */}
          <div>
            <h4 className="font-serif text-sm font-bold text-ink-primary uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#category-${cat.slug}`}
                    className="hover:text-brand-700 transition-colors block py-0.5"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="#feeding-highlight" className="text-brand-700 font-semibold hover:underline block py-0.5">
                  Feeding Innovations
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-sm font-bold text-ink-primary uppercase tracking-wider mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li className="flex items-center gap-1.5 text-ink-primary font-medium">
                <Phone className="w-3.5 h-3.5 text-brand-700" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-1.5 text-ink-muted">
                <MapPin className="w-3.5 h-3.5 text-brand-700" />
                <span>Hyderabad, India</span>
              </li>
              <li>
                <a href="#shipping-policy" className="hover:text-brand-700 transition-colors">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="#returns-policy" className="hover:text-brand-700 transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#size-guide" className="hover:text-brand-700 transition-colors">
                  Feeding Size Guide
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-brand-700 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 mt-8 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ink-muted">
          <div>
            © {new Date().getFullYear()} <strong>SONY FEEDING KURTIS</strong>. All rights reserved. Handcrafted with love in India.
          </div>
          
          {/* Payment Badges Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-ink-secondary mr-1">
              Secure Payments by
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-blue-800">
              Razorpay
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-indigo-700">
              UPI
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-amber-700">
              Cards
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-emerald-800">
              NetBanking
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
