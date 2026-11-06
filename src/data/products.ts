import { Product, ProductVariant, ClothingType, FeedingConfiguration, ProductColor, ProductSize } from '../types/product';

// Helper to generate variants reflecting the optional feeding configuration
function generateVariants(
  skuPrefix: string,
  price: number,
  originalPrice: number | null,
  feedingConfig: FeedingConfiguration,
  colors: ProductColor[],
  sizes: ProductSize[]
): ProductVariant[] {
  const variants: ProductVariant[] = [];

  const typesToGenerate: (ClothingType | null)[] =
    feedingConfig === 'both'
      ? ['Feeding', 'Non-Feeding']
      : feedingConfig === 'feeding-only'
      ? ['Feeding']
      : [null];

  typesToGenerate.forEach((type) => {
    colors.forEach((color) => {
      sizes.forEach((size) => {
        const typeCode = type === 'Feeding' ? 'FD' : type === 'Non-Feeding' ? 'NF' : 'STD';
        variants.push({
          id: `${skuPrefix}-${typeCode}-${color.id}-${size}`,
          sku: `${skuPrefix}-${typeCode}-${color.id.toUpperCase()}-${size}`,
          clothingType: type,
          color,
          size,
          price,
          originalPrice,
          stock: 12,
          inStock: true,
        });
      });
    });
  });

  return variants;
}

const COMMON_SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCTS: Product[] = [
  // 1. CONFIGURATION: 'both' (Customer selects Feeding or Non-Feeding -> Colour -> Size)
  {
    id: 'prod-1',
    title: 'Nayantara Rose Flared Maxi Dupatta Set',
    slug: 'nayantara-rose-flared-maxi-dupatta-set',
    skuPrefix: 'SFK-MAX-01',
    category: 'kurti-dupatta',
    categoryName: 'Kurti + Dupatta',
    price: 1399,
    originalPrice: 2199,
    discountPercentage: 36,
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'rose', name: 'Vintage Rose', hex: '#C87D7D' },
      { id: 'wine', name: 'Royal Wine', hex: '#7A2832' },
      { id: 'teal', name: 'Peacock Teal', hex: '#205E61' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-MAX-01',
      1399,
      2199,
      'both',
      [
        { id: 'rose', name: 'Vintage Rose', hex: '#C87D7D' },
        { id: 'wine', name: 'Royal Wine', hex: '#7A2832' },
        { id: 'teal', name: 'Peacock Teal', hex: '#205E61' },
      ],
      COMMON_SIZES
    ),
    description: 'A timeless silhouette crafted from breathable premium rayon-cotton blend featuring flared gathering, delicate zari yoke highlights, and an airy organza dupatta.',
    fabric: 'Pure Cotton Slub with Organza Dupatta',
    careInstructions: ['Dry clean first wash recommended', 'Gentle cold hand wash thereafter', 'Medium warm iron'],
    feedingDetails: {
      zipType: 'Dual invisible side zippers (12-inch discreet vertical access)',
      zipPlacement: 'Both left and right chest seams for easy, confident nursing anywhere',
      description: 'Zippers are completely covered under soft fabric plackets to prevent skin irritation for both mother and infant.'
    },
    rating: 4.9,
    reviewCount: 128,
    isBestseller: true,
    isFeatured: true,
  },

  // 2. CONFIGURATION: 'feeding-only' (Dedicated Nursing Wear - Inherently Feeding with built-in zips)
  {
    id: 'prod-2',
    title: 'Kalyani Tiered Gathered Pure Mulmul Feeding Frock',
    slug: 'kalyani-tiered-gathered-feeding-frock',
    skuPrefix: 'SFK-FRK-02',
    category: 'frocks',
    categoryName: 'Frocks',
    price: 1149,
    originalPrice: 1799,
    discountPercentage: 36,
    badge: 'Feeding Essential',
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'sage', name: 'Muted Sage', hex: '#879780' },
      { id: 'blush', name: 'Dusty Blush', hex: '#DDB3B3' },
      { id: 'navy', name: 'Midnight Navy', hex: '#1F2937' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-FRK-02',
      1149,
      1799,
      'feeding-only',
      [
        { id: 'sage', name: 'Muted Sage', hex: '#879780' },
        { id: 'blush', name: 'Dusty Blush', hex: '#DDB3B3' },
        { id: 'navy', name: 'Midnight Navy', hex: '#1F2937' },
      ],
      COMMON_SIZES
    ),
    description: 'Effortless tiered dress offering ample room for bump growth during pregnancy and hidden feeding zippers for postpartum nursing days. Exclusively tailored for feeding convenience.',
    fabric: '100% Breathable Mulmul Cotton',
    careInstructions: ['Machine wash gentle cycle', 'Dry in shade to preserve natural dyes', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed two-way nursing zippers',
      zipPlacement: 'Subtly nested along princess seams',
      description: 'Zero metallic touch against tender postpartum skin.'
    },
    rating: 4.8,
    reviewCount: 94,
    isBestseller: true,
  },

  // 3. CONFIGURATION: 'none' (Standard Ethnic Wear - No Feeding Selection Needed)
  {
    id: 'prod-3',
    title: 'Ira Indigo Hand-Block Chanderi Co-ord Set',
    slug: 'ira-indigo-hand-block-chanderi-co-ord-set',
    skuPrefix: 'SFK-CRD-03',
    category: 'co-ord-sets',
    categoryName: 'Co-ord Sets',
    price: 1499,
    originalPrice: 2299,
    discountPercentage: 35,
    badge: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'indigo', name: 'Royal Indigo', hex: '#264653' },
      { id: 'rust', name: 'Earthy Rust', hex: '#A34828' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-CRD-03',
      1499,
      2299,
      'none',
      [
        { id: 'indigo', name: 'Royal Indigo', hex: '#264653' },
        { id: 'rust', name: 'Earthy Rust', hex: '#A34828' },
      ],
      COMMON_SIZES
    ),
    description: 'Contemporary straight-cut tunic and tapered cigarette pant pairing, designed for modern elegance. Standard relaxed fit without nursing access.',
    fabric: 'Hand-block Printed Chanderi Cotton Blend',
    careInstructions: ['Dry clean only for initial washes', 'Do not soak', 'Cool iron inside out'],
    rating: 4.7,
    reviewCount: 67,
    isNewArrival: true,
  },

  // 4. CONFIGURATION: 'both'
  {
    id: 'prod-4',
    title: 'Madhavi Heritage 3-Piece Anarkali Festive Set',
    slug: 'madhavi-heritage-3-piece-anarkali-festive-set',
    skuPrefix: 'SFK-3PC-04',
    category: '3-piece-dresses',
    categoryName: '3-Piece Dresses',
    price: 1899,
    originalPrice: 2899,
    discountPercentage: 34,
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'emerald', name: 'Jewel Emerald', hex: '#1B4931' },
      { id: 'ruby', name: 'Garnet Ruby', hex: '#7A1C24' },
      { id: 'mustard', name: 'Haldi Mustard', hex: '#C28B1E' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-3PC-04',
      1899,
      2899,
      'both',
      [
        { id: 'emerald', name: 'Jewel Emerald', hex: '#1B4931' },
        { id: 'ruby', name: 'Garnet Ruby', hex: '#7A1C24' },
        { id: 'mustard', name: 'Haldi Mustard', hex: '#C28B1E' },
      ],
      COMMON_SIZES
    ),
    description: 'An elegant 3-piece set comprising an intricately embroidered anarkali kurti, comfortable stretch pants, and a rich jaal-worked dupatta.',
    fabric: 'Silk Georgette with Cotton Lining',
    careInstructions: ['Dry clean only', 'Store in cotton garment bag'],
    feedingDetails: {
      zipType: 'Concealed vertical dual-side zips',
      zipPlacement: 'Hidden under festive zari border trims',
      description: 'Allows feeding without disrupting the royal anarkali drape.'
    },
    rating: 4.9,
    reviewCount: 153,
    isBestseller: true,
    isFeatured: true,
  },

  // 5. CONFIGURATION: 'both'
  {
    id: 'prod-5',
    title: 'Aadhya Georgette Shimmer Partywear Gown',
    slug: 'aadhya-georgette-shimmer-partywear-gown',
    skuPrefix: 'SFK-PTY-05',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 1699,
    originalPrice: 2499,
    discountPercentage: 32,
    badge: 'Festive Special',
    images: [
      'https://images.unsplash.com/photo-1617059063772-34532796cdb5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'plum', name: 'Royal Plum', hex: '#4A154B' },
      { id: 'champagne', name: 'Champagne Shimmer', hex: '#D4AF37' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-05',
      1699,
      2499,
      'both',
      [
        { id: 'plum', name: 'Royal Plum', hex: '#4A154B' },
        { id: 'champagne', name: 'Champagne Shimmer', hex: '#D4AF37' },
      ],
      COMMON_SIZES
    ),
    description: 'Floor-length flared party gown adorned with sequins and tone-on-tone embroidery, with optional discreet dual breast openings for hassle-free nursing.',
    fabric: 'Georgette with Soft Shantoon Inner Lining',
    careInstructions: ['Specialist dry clean only'],
    feedingDetails: {
      zipType: 'Invisible dual side zippers',
      zipPlacement: 'Built smoothly into side princess seams',
      description: 'No one will ever know it is a nursing gown!'
    },
    rating: 4.9,
    reviewCount: 88,
    isFeatured: true,
  },

  // 6. CONFIGURATION: 'none' (Standard Saree - No feeding zips needed)
  {
    id: 'prod-6',
    title: 'Kanchivaram Touch Soft Silk Saree',
    slug: 'kanchivaram-touch-soft-silk-saree',
    skuPrefix: 'SFK-SAR-06',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 1599,
    originalPrice: 2599,
    discountPercentage: 38,
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1610030469830-ec38c4f2bb75?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'magenta', name: 'Rani Magenta', hex: '#A2165A' },
      { id: 'teal-gold', name: 'Teal & Antique Gold', hex: '#1C5B63' },
    ],
    availableSizes: ['M', 'L', 'XL'],
    variants: generateVariants(
      'SFK-SAR-06',
      1599,
      2599,
      'none',
      [
        { id: 'magenta', name: 'Rani Magenta', hex: '#A2165A' },
        { id: 'teal-gold', name: 'Teal & Antique Gold', hex: '#1C5B63' },
      ],
      ['M', 'L', 'XL']
    ),
    description: 'Feather-light soft silk saree woven with antique gold zari motifs and contrast rich pallu. Classic standard drape without zipper modifications.',
    fabric: 'Art Soft Silk with Zari Border',
    careInstructions: ['Dry clean recommended', 'Iron on reverse on silk setting'],
    rating: 4.8,
    reviewCount: 112,
  },

  // 7. CONFIGURATION: 'both'
  {
    id: 'prod-7',
    title: 'Jiyo Hit-Selling Flared Festive Lehenga Set',
    slug: 'jiyo-hit-selling-flared-festive-lehenga-set',
    skuPrefix: 'SFK-LHG-07',
    category: 'lehengas',
    categoryName: 'Lehengas',
    price: 1999,
    originalPrice: 3199,
    discountPercentage: 37,
    badge: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'maroon', name: 'Bridal Maroon', hex: '#5E1914' },
      { id: 'navy', name: 'Imperial Navy', hex: '#1E293B' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-LHG-07',
      1999,
      3199,
      'both',
      [
        { id: 'maroon', name: 'Bridal Maroon', hex: '#5E1914' },
        { id: 'navy', name: 'Imperial Navy', hex: '#1E293B' },
      ],
      COMMON_SIZES
    ),
    description: 'Super flared ethnic lehenga skirt with elasticated comfort waistband and blouse available in both Feeding and Non-Feeding tailored options.',
    fabric: 'Taffeta Silk Skirt with Raw Silk Embroidered Blouse',
    careInstructions: ['Dry clean only'],
    feedingDetails: {
      zipType: 'Front/Side concealed zippers in blouse',
      zipPlacement: 'Strategically integrated under decorative embroidery folds',
      description: 'Allows festive participation while nursing your newborn comfortably.'
    },
    rating: 4.9,
    reviewCount: 79,
    isFeatured: true,
  },

  // 8. CONFIGURATION: 'feeding-only'
  {
    id: 'prod-8',
    title: 'Avani Mom & Daughter Twinning Pure Cotton Frock',
    slug: 'avani-mom-daughter-twinning-cotton-frock',
    skuPrefix: 'SFK-KID-08',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 999,
    originalPrice: 1599,
    discountPercentage: 37,
    badge: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'yellow', name: 'Sunshine Yellow', hex: '#EAB308' },
      { id: 'powder-blue', name: 'Powder Blue', hex: '#93C5FD' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-KID-08',
      999,
      1599,
      'feeding-only',
      [
        { id: 'yellow', name: 'Sunshine Yellow', hex: '#EAB308' },
        { id: 'powder-blue', name: 'Powder Blue', hex: '#93C5FD' },
      ],
      COMMON_SIZES
    ),
    description: 'Adorable twinning dress set made with baby-safe organic cotton. Dedicated nursing wear featuring twin soft-nylon feeding zippers.',
    fabric: '100% Organic Soft Cambric Cotton',
    careInstructions: ['Machine wash with mild baby detergent', 'Warm iron'],
    feedingDetails: {
      zipType: 'Ultra-soft nylon feeding zips',
      zipPlacement: 'Dual side seam concealed openings',
      description: 'No harsh seams or metallic edges.'
    },
    rating: 4.9,
    reviewCount: 52,
    isNewArrival: true,
  }
];
