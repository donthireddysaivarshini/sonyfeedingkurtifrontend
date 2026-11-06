export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImage: string;
  mobileImage: string;
  tag: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'ETHNIC & MATERNITY COLLECTION',
    title: 'Celebrate Motherhood in',
    highlightText: 'Ethnic Grace',
    subtitle: 'Designer Feeding Kurtis, Co-ord Sets & Festive Maxis with discreet concealed nursing zippers crafted for comfort and style.',
    ctaText: 'Shop Feeding Kurtis',
    ctaLink: '#bestsellers',
    secondaryCtaText: 'Explore All Categories',
    secondaryCtaLink: '#categories',
    desktopImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    tag: 'Feeding & Non-Feeding Options Available'
  },
  {
    id: 'slide-2',
    badge: 'FESTIVE COLLECTION',
    title: 'Traditional Occasions,',
    highlightText: 'Tailored Comfort',
    subtitle: 'Step into family gatherings with 3-Piece Anarkali sets and Lehengas designed with optional feeding access.',
    ctaText: 'Shop Partywear & Sets',
    ctaLink: '#categories',
    secondaryCtaText: 'View Collections',
    secondaryCtaLink: '#bestsellers',
    desktopImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    tag: 'Cotton & Silk Blends'
  },
  {
    id: 'slide-3',
    badge: 'FAMILY & KIDS EDIT',
    title: 'Coordinated Moments &',
    highlightText: 'Everyday Ease',
    subtitle: 'Breezy cotton frocks and matching mom-child outfits crafted with gentle fabrics for sensitive skin.',
    ctaText: 'Explore Kids Collections',
    ctaLink: '#categories',
    desktopImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
    tag: 'Breathable Natural Fabrics'
  }
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
  'Welcome to Sony Feeding Kurtis • Thoughtfully Designed Ethnic & Maternity Wear',
  'Concealed Feeding & Regular Ethnic Options Available on Selected Styles',
  'Explore Our Curated Collections of Frocks, Sarees, Sets & Kurtis',
  'Pan-India Delivery Service • Standard Courier Shipping'
];
