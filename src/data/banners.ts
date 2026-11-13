export interface HeroSlide {
  id: string;
  title: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage: string;
  preserveArtwork?: boolean;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Sony Feeding Kurtis — Trendy Dresses for Every You',
    ctaLink: '/shop',
    desktopImage: '/images/banners/hero-sony-feeding-kurtis.jpg',
    mobileImage: '/images/banners/hero-sony-feeding-kurtis.jpg',
    preserveArtwork: true,
  },
  {
    id: 'slide-2',
    title: 'Feeding Dress — Easy Feeding Access & Nursing Friendly',
    ctaLink: '/shop?clothingType=Feeding',
    desktopImage: '/images/banners/hero-feeding-dress.jpg',
    mobileImage: '/images/banners/hero-feeding-dress.jpg',
    preserveArtwork: true,
  },
];

export interface ValueProp {
  icon: string;
  title: string;
  description: string;
}

export const VALUE_PROPOSITIONS: ValueProp[] = [
  {
    icon: 'ShieldCheck',
    title: 'Concealed Feeding Access',
    description: 'Discreet twin side zippers integrated along side seams on select feeding styles.'
  },
  {
    icon: 'Sparkles',
    title: 'Comfortable Fabrics',
    description: 'Soft mulmul cotton, chanderi, and lightweight festive blends selected for all-day wear.'
  },
  {
    icon: 'Truck',
    title: 'Pan-India Shipping',
    description: 'Courier delivery service available across Indian postal codes.'
  },
  {
    icon: 'RotateCcw',
    title: 'Customer Care & Sizing',
    description: 'Personalized size assistance and customer support for all order inquiries.'
  }
];

export const ANNOUNCEMENT_MESSAGES = [
  'Welcome to Sony Collections • Thoughtfully Designed Ethnic & Festive Wear',
  'Concealed Feeding & Regular Ethnic Options Available on Selected Styles',
  'Explore Our Curated Collections of Frocks, Sarees, Sets & Kurtis',
  'Pan-India Delivery Service • Standard Courier Shipping'
];
