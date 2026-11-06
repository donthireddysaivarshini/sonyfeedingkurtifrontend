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
    badge: 'NEW MATERNITY & ETHNIC COLLECTION 2026',
    title: 'Celebrate Motherhood in',
    highlightText: 'Pure Ethnic Grace',
    subtitle: 'Designer Feeding Kurtis, Co-ord Sets & Festive Maxis with discreet concealed nursing zippers crafted for effortless elegance.',
    ctaText: 'Shop Feeding Kurtis',
    ctaLink: '#bestsellers',
    secondaryCtaText: 'Explore All Categories',
    secondaryCtaLink: '#categories',
    desktopImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    tag: 'Feeding & Non-Feeding Available'
  },
  {
    id: 'slide-2',
    badge: 'FESTIVE EDIT',
    title: 'Grand Occasions,',
    highlightText: 'Comfort Guaranteed',
    subtitle: 'Step into weddings and poojas confidently with our 3-Piece Anarkali suits & Lehengas featuring invisible feeding access.',
    ctaText: 'Shop Partywear & Sets',
    ctaLink: '#categories',
    secondaryCtaText: 'View Bestsellers',
    secondaryCtaLink: '#bestsellers',
    desktopImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    tag: 'Pure Cotton & Soft Silks'
  },
  {
    id: 'slide-3',
    badge: 'MOM & BABY SPECIAL',
    title: 'Twinning Moments &',
    highlightText: 'Everyday Ease',
    subtitle: 'Breezy cotton frocks and matching mom-kid collections designed for sensitive postpartum skin and happy memories.',
    ctaText: 'Explore Kids & Twinning',
    ctaLink: '#categories',
    desktopImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
    tag: '100% Breathable Organic Cottons'
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
    title: 'Dual Invisible Feeding Zips',
    description: 'Smooth, covered 12-inch nursing zips on both sides with zero skin contact.'
  },
  {
    icon: 'Sparkles',
    title: '100% Breathable Fabrics',
    description: 'Mulmul cotton, breathable chanderi, and soft georgettes safe for newborn skin.'
  },
  {
    icon: 'Truck',
    title: 'Free Express Pan-India Shipping',
    description: 'Fast, trackable delivery to your doorstep on all orders above ₹999.'
  },
  {
    icon: 'RotateCcw',
    title: 'Easy Exchanges & Support',
    description: 'Hassle-free 7-day size exchange with dedicated WhatsApp care team.'
  }
];

export const ANNOUNCEMENT_MESSAGES = [
  '🌸 Special Offer: Flat 35% Off Across All Feeding Collections | Use Code: MOTHERHOOD',
  '✨ Free Express Pan-India Shipping on Orders Above ₹999',
  '🤱 Discreet Feeding & Non-Feeding Options Available in Every Design',
  '💫 SONY FEEDING KURTIS — Premium Handcrafted Ethnic Boutique'
];

