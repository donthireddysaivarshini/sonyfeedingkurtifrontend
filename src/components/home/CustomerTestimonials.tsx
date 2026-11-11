import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  garment: string;
  quote: string;
  image: string;
  rating: number;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Priya Sundaram',
    city: 'Chennai, Tamil Nadu',
    garment: 'Ananya Cotton Feeding Kurti',
    quote: 'The invisible dual zip placement is incredible. I can nurse comfortably at family events without having to change my entire outfit. The mulmul fabric is so soft and breathable.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Deepika Rao',
    city: 'Hyderabad, Telangana',
    garment: 'Royal Chanderi Anarkali Kurti',
    quote: 'Ordered this for my daughter’s naming ceremony. Elegant drape, rich embroidery, and completely discreet feeding zips. Received so many compliments!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Ananya Sharma',
    city: 'Bangalore, Karnataka',
    garment: 'Meera Floral Tiered Feeding Frock',
    quote: 'Finding stylish and authentic ethnic clothes felt impossible until I found Sony Collections. The fits are relaxed and flattering. Excellent stitch quality!',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Kavitha Ramaswamy',
    city: 'Coimbatore, Tamil Nadu',
    garment: 'Aarohi Festive Kurti & Dupatta Set',
    quote: 'Very comfortable pure cotton lining. Fast courier delivery and honest customer support. Truly designed thoughtfully for nursing mothers.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-cream-50 py-16 sm:py-20 md:py-24 border-b border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-saffron-600">
            ✦ Testimonials
          </p>
          <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl lg:text-[2.75rem] text-maroon-900 font-bold">
            Loved by <em className="italic text-maroon-600 font-serif font-normal">our women</em>
          </h2>
          <p className="mt-3 text-sm md:text-base text-stone-600">
            Customer feedback & styling stories from across India (Demonstration Reviews)
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Sliding Review Cards */}
      <div className="relative mt-10 sm:mt-14 w-full overflow-hidden">
        {/* Left Edge Gradient Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cream-50 to-transparent sm:w-24 md:w-36"
        />

        {/* Right Edge Gradient Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cream-50 to-transparent sm:w-24 md:w-36"
        />

        <div className="group flex w-max gap-4 sm:gap-6 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {/* Primary Set */}
          <div className="animate-marquee flex shrink-0 items-stretch gap-4 sm:gap-6 group-hover:[animation-play-state:paused]">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.id}
                className="relative flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-cream-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon-900/10 sm:p-6 w-[320px] sm:w-[460px] md:w-[520px]"
              >
                <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
                  {/* Photo Thumbnail */}
                  <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-cream-100">
                    <img
                      alt={item.name}
                      src={item.image}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Quote Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 text-saffron-500 mb-2">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-saffron-500 text-saffron-500" />
                        ))}
                      </div>

                      <blockquote className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        “{item.quote}”
                      </blockquote>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {item.city}
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-maroon-800 bg-cream-100 px-2.5 py-1 rounded-full border border-cream-200 truncate max-w-[150px]">
                        {item.garment}
                      </span>
                    </div>
                  </div>
                </div>
              </figure>
            ))}
          </div>

          {/* Duplicate Set for Seamless Marquee Loop */}
          <div
            aria-hidden="true"
            className="animate-marquee flex shrink-0 items-stretch gap-4 sm:gap-6 group-hover:[animation-play-state:paused]"
          >
            {TESTIMONIALS.map((item) => (
              <figure
                key={`${item.id}-loop`}
                className="relative flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-cream-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon-900/10 sm:p-6 w-[320px] sm:w-[460px] md:w-[520px]"
              >
                <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-cream-100">
                    <img
                      alt={item.name}
                      src={item.image}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-saffron-500 mb-2">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-saffron-500 text-saffron-500" />
                        ))}
                      </div>

                      <blockquote className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        “{item.quote}”
                      </blockquote>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {item.city}
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-maroon-800 bg-cream-100 px-2.5 py-1 rounded-full border border-cream-200 truncate max-w-[150px]">
                        {item.garment}
                      </span>
                    </div>
                  </div>
                </div>
              </figure>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
