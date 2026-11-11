import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200 bg-white pb-20 md:pb-8">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:px-8">
        
        {/* Column 1: Brand Info */}
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpeg"
              alt="Sony Collections Logo"
              className="h-11 w-11 rounded-full object-cover shadow-xs border border-amber-300/60 shrink-0"
            />
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900 uppercase">
                Sony Collections
              </span>
              <p className="text-[10px] tracking-wider text-stone-500 uppercase font-semibold">
                Elegant Wear for Every Moment
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-xs text-sm text-stone-500 leading-relaxed">
            Elegant women's and kids' ethnic fashion — designer kurtas, feeding wear, frocks, sarees, and suits, curated with love.
          </p>
        </div>

        {/* Column 2: Our Pages */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Our Pages
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to="/shop"
                className="text-stone-600 transition-colors hover:text-maroon-600 block"
              >
                All Collections
              </Link>
            </li>
            <li>
              <Link
                to="/shop?clothingType=Feeding"
                className="text-stone-600 transition-colors hover:text-maroon-600 block"
              >
                Feeding Friendly Kurtis
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="text-stone-600 transition-colors hover:text-maroon-600 block"
              >
                My Account & Orders
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-stone-600 transition-colors hover:text-maroon-600 block"
              >
                Shopping Bag
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Contact Us
          </p>
          <ul className="mt-3 space-y-2.5 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon-500" />
              <span>Boutique & Manufacturing units at Tamil Nadu & Surat</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-maroon-500" />
              <a href="tel:+919876543210" className="transition-colors hover:text-maroon-600">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-maroon-500" />
              <a href="mailto:support@sonycollection.in" className="transition-colors hover:text-maroon-600">
                support@sonycollection.in
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-maroon-500" />
              <span>Mon - Sat: 9:30 AM – 7:00 PM</span>
            </li>
          </ul>

          {/* WhatsApp Direct Link */}
          <div className="mt-4 flex items-center gap-3 pt-2">
            <a
              href="https://wa.me/919876543210?text=Hi%20Sony%20Collection"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white transition hover:bg-emerald-600"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">
        <p>© {new Date().getFullYear()} Sony Collections. Handcrafted with love in India.</p>
      </div>
    </footer>
  );
};
