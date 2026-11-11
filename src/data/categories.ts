import { Category } from '../types/product';

export const CATEGORIES: Category[] = [
  {
    id: 'frocks',
    name: 'Frocks',
    slug: 'frocks',
    image: '/images/frocks/teal-zari-tiered-frock.jpg',
    itemCount: 'Tiered & Flared',
    description: 'Flared tiered frocks designed for ease of movement and everyday comfort.',
    tagline: 'Effortless Flow & Comfort'
  },
  {
    id: 'co-ord-sets',
    name: 'Co-ord Sets',
    slug: 'co-ord-sets',
    image: '/images/co-ords/crimson-botanical-coord.jpg',
    itemCount: 'Matching Sets',
    description: 'Matching ethnic top and trouser pairs tailored for contemporary wear.',
    tagline: 'Modern Coordinated Style'
  },
  {
    id: 'kurti-dupatta',
    name: 'Kurti + Dupatta',
    slug: 'kurti-dupatta',
    image: '/images/kurti-dupatta/magenta-ombre-kurti-dupatta.jpg',
    itemCount: 'Kurti Sets',
    description: 'Straight-cut and anarkali kurtis paired with matching lightweight dupattas.',
    tagline: 'Timeless Everyday Grace'
  },
  {
    id: '3-piece-dresses',
    name: '3-Piece Dresses',
    slug: '3-piece-dresses',
    image: '/images/3pc-sets/indigo-blockprint-3pc-set.jpg',
    itemCount: 'Complete Sets',
    description: 'Coordinated three-piece ethnic ensembles including kurti, bottoms, and dupatta.',
    tagline: 'Curated 3-Piece Ensembles'
  },
  {
    id: 'partywear-dresses',
    name: 'Partywear Dresses',
    slug: 'partywear-dresses',
    image: '/images/dresses/crimson-floral-maxi.jpg',
    itemCount: 'Gowns & Maxis',
    description: 'Floor-length maxis and flared gowns crafted for festive and celebration wear.',
    tagline: 'Celebration Ready Silhouettes'
  },
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    image: '/images/sarees/emerald-checked-kanchivaram-saree.jpg',
    itemCount: 'Traditional Weaves',
    description: 'Soft silk, linen, and handloom sarees suited for traditional occasions.',
    tagline: 'Draped in Traditional Heritage'
  },
  {
    id: 'kids-collections',
    name: 'Kids Collections',
    slug: 'kids-collections',
    image: '/images/kidswear/maroon-pattu-frock.jpg',
    itemCount: 'Kids & Twinning',
    description: 'Comfortable ethnic dresses for little ones and matching mom-child pairs.',
    tagline: 'Cherished Family Moments'
  }
];

export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  dresses: 'partywear-dresses',
  'kids-wear': 'kids-collections',
  kidswear: 'kids-collections',
  'co-ords': 'co-ord-sets',
  '3pc-sets': '3-piece-dresses',
};

/** Resolves friendly route/section slugs (e.g. "dresses", "kids-wear") to canonical category slugs. */
export function resolveCategorySlug(slug?: string | null): string | null {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  return CATEGORY_SLUG_ALIASES[normalized] || normalized;
}
