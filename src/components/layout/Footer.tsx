import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, Youtube, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ivory-200/90 text-ink-primary border-t border-ivory-300 pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-ivory-300/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <Sparkles className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Concealed Zips</h5>
              <p className="text-[11px] text-ink-secondary">Dual invisible nursing openings on select styles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <ShieldCheck className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Selected Fabrics</h5>
              <p className="text-[11px] text-ink-secondary">Soft mulmul cotton & festive silk blends</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <Heart className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Maternity Ease</h5>
              <p className="text-[11px] text-ink-secondary">Relaxed cuts for pre & postpartum wear</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700">
              <Mail className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary">Pan-India Delivery</h5>
              <p className="text-[11px] text-ink-secondary">Courier delivery across Indian postal codes</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-brand-700 block uppercase hover:text-brand-900 transition-colors">
              SONY FEEDING KURTIS
            </Link>
            <p className="text-xs text-ink-secondary leading-relaxed max-w-sm">
              Indian women's ethnic wear boutique specializing in frocks, co-ord sets, sarees, and maternity-friendly feeding kurtis designed for traditional grace and everyday ease.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#"
                aria-label="Instagram placeholder"
                className="w-9 h-9 rounded-full bg-white border border-ivory-300 flex items-center justify-center text-ink-secondary hover:text-brand-700 hover:border-brand-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook placeholder"
                className="w-9 h-9 rounded-full bg-white border border-ivory-300 flex items-center justify-center text-ink-secondary hover:text-brand-700 hover:border-brand-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube placeholder"
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
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-brand-700 transition-colors block py-0.5"
                  >
                    {cat.name}
                  </Link>
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
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-brand-700 transition-colors block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#feeding-highlight" className="text-brand-700 font-semibold hover:underline block py-0.5">
                  Feeding Features
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-sm font-bold text-ink-primary uppercase tracking-wider mb-4">
              Customer Account
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link to="/account" className="hover:text-brand-700 transition-colors block py-0.5">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-brand-700 transition-colors block py-0.5">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-700 transition-colors block py-0.5">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/account/addresses" className="hover:text-brand-700 transition-colors block py-0.5">
                  Delivery Addresses
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-ink-muted leading-snug">
                Official support contact and policies will follow client approval upon launch.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ink-muted">
          <div>
            © {new Date().getFullYear()} <strong>SONY FEEDING KURTIS</strong>. All rights reserved.
          </div>
          
          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2">
            <span className="text-[10px] uppercase font-semibold text-ink-secondary mr-1">
              Planned Payments:
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-blue-800">
              Razorpay
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-indigo-700">
              UPI
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-bold text-gray-700">
              Cards
            </span>
            <span className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-medium text-amber-800">
              COD (Provisional)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
