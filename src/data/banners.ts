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
    badge: 'DESIGNER ETHNIC COLLECTION',
    title: 'Celebrate Every Moment in',
    highlightText: 'Ethnic Grace',
    subtitle: 'Designer Flared Dresses, Frocks & Festive Kurti Sets crafted for timeless grace, comfort, and style.',
    ctaText: 'Shop Dresses & Frocks',
    ctaLink: '/category/frocks',
    secondaryCtaText: 'Explore All Collections',
    secondaryCtaLink: '/shop',
    desktopImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    tag: 'Dresses, Kids Wear & Sarees'
  },
  {
    id: 'slide-2',
    badge: 'HERITAGE SAREE COLLECTION',
    title: 'Traditional Splendour,',
    highlightText: 'Pure Silk Elegance',
    subtitle: 'Step into grand celebrations with handcrafted Kanchivaram silk, Banarasi brocades, and festive sarees.',
    ctaText: 'Shop Sarees',
    ctaLink: '/category/sarees',
    secondaryCtaText: 'View Collections',
    secondaryCtaLink: '/shop',
    desktopImage: 'https://images.unsplash.com/photo-1753981031189-27bb7bd1c079?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1753981031189-27bb7bd1c079?q=80&w=800&auto=format&fit=crop',
    tag: 'Handloom & Pure Silk Weaves'
  },
  {
    id: 'slide-3',
    badge: 'FAMILY & KIDS EDIT',
    title: 'Coordinated Moments &',
    highlightText: 'Festive Joy',
    subtitle: 'Breezy cotton frocks, matching mom-child twinning, and traditional kids wear crafted in gentle breathable fabrics.',
    ctaText: 'Explore Kids Wear',
    ctaLink: '/category/kids-collections',
    desktopImage: 'https://images.unsplash.com/photo-1774437896047-e2480d12f7b8?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1774437896047-e2480d12f7b8?q=80&w=800&auto=format&fit=crop',
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
  'Welcome to Sony Collections • Thoughtfully Designed Ethnic & Festive Wear',
  'Concealed Feeding & Regular Ethnic Options Available on Selected Styles',
  'Explore Our Curated Collections of Frocks, Sarees, Sets & Kurtis',
  'Pan-India Delivery Service • Standard Courier Shipping'
];
