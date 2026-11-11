import React from 'react';

const TICKER_ITEMS = [
  { icon: '✨', text: 'Welcome to Sony Collections' },
  { icon: '🚚', text: 'Free Shipping All Over India' },
  { icon: '◆', text: 'Dresses, Kids Wear & Sarees' },
  { icon: '🌸', text: 'Elegant Wear for Every Moment' },
  { icon: '✨', text: 'Welcome to Sony Collections' },
  { icon: '🚚', text: 'Free Shipping All Over India' },
  { icon: '◆', text: 'Dresses, Kids Wear & Sarees' },
  { icon: '🌸', text: 'Elegant Wear for Every Moment' },
];

export const AnnouncementBar: React.FC = () => {
  return (
    <aside aria-label="Announcement" className="border-b border-maroon-900/20 bg-maroon-800 py-1.5 text-cream-50 overflow-hidden select-none">
      <div className="group overflow-hidden">
        <div className="flex w-max items-center group-hover:[animation-play-state:paused] animate-marquee [animation-duration:28s]">
          {/* Track 1 (Visible) */}
          <div aria-hidden="false" className="flex shrink-0 items-center">
            {TICKER_ITEMS.map((item, idx) => (
              <span
                key={`track1-${idx}`}
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-cream-100 flex items-center gap-2 whitespace-nowrap"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span aria-hidden="true" className="mx-6 text-saffron-300 md:mx-10">
                  ✦
                </span>
              </span>
            ))}
          </div>

          {/* Track 2 (Duplicate for Seamless Infinite Marquee Loop) */}
          <div aria-hidden="true" className="flex shrink-0 items-center">
            {TICKER_ITEMS.map((item, idx) => (
              <span
                key={`track2-${idx}`}
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-cream-100 flex items-center gap-2 whitespace-nowrap"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span aria-hidden="true" className="mx-6 text-saffron-300 md:mx-10">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
