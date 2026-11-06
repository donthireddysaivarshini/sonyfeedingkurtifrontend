import { Product, ProductVariant, ClothingType, FeedingConfiguration, ProductColor, ProductSize } from '../types/product';

// Helper to generate variants reflecting the optional feeding configuration
function generateVariants(
  skuPrefix: string,
  price: number,
  feedingConfig: FeedingConfiguration,
  colors: ProductColor[],
  sizes: ProductSize[],
  stockOverrides?: Record<string, number>
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
        const key = `${typeCode}-${color.id}-${size}`;
        // Support simulated stock levels (e.g. some size/color combinations out of stock)
        const stock = stockOverrides && stockOverrides[key] !== undefined ? stockOverrides[key] : 10;
        
        variants.push({
          id: `${skuPrefix}-${typeCode}-${color.id}-${size}`,
          sku: `${skuPrefix}-${typeCode}-${color.id.toUpperCase()}-${size}`,
          clothingType: type,
          color,
          size,
          price,
          originalPrice: null,
          stock,
          inStock: stock > 0,
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
    originalPrice: null,
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
      'both',
      [
        { id: 'rose', name: 'Vintage Rose', hex: '#C87D7D' },
        { id: 'wine', name: 'Royal Wine', hex: '#7A2832' },
        { id: 'teal', name: 'Peacock Teal', hex: '#205E61' },
      ],
      COMMON_SIZES,
      // Simulate real inventory: XXL in Teal is out of stock to test validation
      {
        'FD-teal-XXL': 0,
        'NF-teal-XXL': 0,
      }
    ),
    description: 'Flared maxi silhouette tailored from rayon-cotton blend featuring flared gathering and an airy organza dupatta.',
    fabric: 'Cotton Slub with Organza Dupatta',
    careInstructions: ['Dry clean first wash recommended', 'Gentle cold hand wash thereafter', 'Medium warm iron'],
    feedingDetails: {
      zipType: 'Dual invisible side zippers (12-inch vertical access)',
      zipPlacement: 'Both left and right chest seams for nursing access',
      description: 'Zippers are positioned under fabric plackets.'
    },
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
    originalPrice: null,
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
      'feeding-only',
      [
        { id: 'sage', name: 'Muted Sage', hex: '#879780' },
        { id: 'blush', name: 'Dusty Blush', hex: '#DDB3B3' },
        { id: 'navy', name: 'Midnight Navy', hex: '#1F2937' },
      ],
      COMMON_SIZES
    ),
    description: 'Tiered gathered frock designed with ample ease across the waist and hidden side nursing zippers. Dedicated feeding design.',
    fabric: 'Mulmul Cotton',
    careInstructions: ['Machine wash gentle cycle', 'Dry in shade', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed two-way nursing zippers',
      zipPlacement: 'Subtly nested along princess seams',
      description: 'Covered with soft inner lining.'
    },
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
    originalPrice: null,
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
      'none',
      [
        { id: 'indigo', name: 'Royal Indigo', hex: '#264653' },
        { id: 'rust', name: 'Earthy Rust', hex: '#A34828' },
      ],
      COMMON_SIZES
    ),
    description: 'Straight-cut tunic and tapered pant pairing with hand-block patterns. Standard ethnic wear without nursing zippers.',
    fabric: 'Printed Chanderi Cotton Blend',
    careInstructions: ['Dry clean recommended for initial washes', 'Cool iron inside out'],
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
    originalPrice: null,
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
      'both',
      [
        { id: 'emerald', name: 'Jewel Emerald', hex: '#1B4931' },
        { id: 'ruby', name: 'Garnet Ruby', hex: '#7A1C24' },
        { id: 'mustard', name: 'Haldi Mustard', hex: '#C28B1E' },
      ],
      COMMON_SIZES
    ),
    description: 'Three-piece set featuring an embroidered anarkali kurti, elasticated pants, and a coordinated festive dupatta.',
    fabric: 'Georgette with Inner Lining',
    careInstructions: ['Dry clean only', 'Store in cloth bag'],
    feedingDetails: {
      zipType: 'Concealed vertical dual-side zips',
      zipPlacement: 'Integrated along side seams',
      description: 'Allows feeding without disrupting the silhouette.'
    },
    isBestseller: true,
    isFeatured: true,
  },

  // 5. CONFIGURATION: 'both'
  {
    id: 'prod-5',
    title: 'Aadhya Georgette Festive Partywear Gown',
    slug: 'aadhya-georgette-festive-partywear-gown',
    skuPrefix: 'SFK-PTY-05',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 1699,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1617059063772-34532796cdb5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'plum', name: 'Royal Plum', hex: '#4A154B' },
      { id: 'champagne', name: 'Champagne', hex: '#D4AF37' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-05',
      1699,
      'both',
      [
        { id: 'plum', name: 'Royal Plum', hex: '#4A154B' },
        { id: 'champagne', name: 'Champagne', hex: '#D4AF37' },
      ],
      COMMON_SIZES
    ),
    description: 'Flared partywear gown adorned with tonal embroidery. Available in both Feeding and Non-Feeding options.',
    fabric: 'Georgette with Inner Lining',
    careInstructions: ['Specialist dry clean only'],
    feedingDetails: {
      zipType: 'Invisible dual side zippers',
      zipPlacement: 'Built along side princess seams',
      description: 'Concealed under side seam folds.'
    },
    isFeatured: true,
  },

  // 6. CONFIGURATION: 'none' (Standard Traditional Saree - Verified 200 URL)
  {
    id: 'prod-6',
    title: 'Kanchivaram Touch Traditional Silk Saree',
    slug: 'kanchivaram-touch-traditional-silk-saree',
    skuPrefix: 'SFK-SAR-06',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 1599,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'magenta', name: 'Rani Magenta', hex: '#A2165A' },
      { id: 'teal-gold', name: 'Teal & Antique Gold', hex: '#1C5B63' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-06',
      1599,
      'none',
      [
        { id: 'magenta', name: 'Rani Magenta', hex: '#A2165A' },
        { id: 'teal-gold', name: 'Teal & Antique Gold', hex: '#1C5B63' },
      ],
      ['Free Size']
    ),
    description: 'Soft silk saree woven with traditional zari border patterns and contrast pallu. Standard traditional 6-yard saree with blouse piece.',
    fabric: 'Soft Silk with Zari Border',
    careInstructions: ['Dry clean recommended', 'Iron on reverse on silk setting'],
  },

  // 7. CONFIGURATION: 'both'
  {
    id: 'prod-7',
    title: 'Jiyo Flared Festive Lehenga Set',
    slug: 'jiyo-flared-festive-lehenga-set',
    skuPrefix: 'SFK-LHG-07',
    category: 'lehengas',
    categoryName: 'Lehengas',
    price: 1999,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'maroon', name: 'Deep Maroon', hex: '#5E1914' },
      { id: 'navy', name: 'Imperial Navy', hex: '#1E293B' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-LHG-07',
      1999,
      'both',
      [
        { id: 'maroon', name: 'Deep Maroon', hex: '#5E1914' },
        { id: 'navy', name: 'Imperial Navy', hex: '#1E293B' },
      ],
      COMMON_SIZES
    ),
    description: 'Flared festive lehenga skirt with comfort waistband. Blouse available in both Feeding and Non-Feeding options.',
    fabric: 'Silk Blend with Inner Lining',
    careInstructions: ['Dry clean only'],
    feedingDetails: {
      zipType: 'Side concealed zippers in blouse',
      zipPlacement: 'Integrated along side seams of blouse',
      description: 'Allows nursing access while wearing festive attire.'
    },
    isFeatured: true,
  },

  // 8. CONFIGURATION: 'feeding-only'
  {
    id: 'prod-8',
    title: 'Avani Mom & Child Cotton Twinning Frock',
    slug: 'avani-mom-child-cotton-twinning-frock',
    skuPrefix: 'SFK-KID-08',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 999,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'yellow', name: 'Sunflower Yellow', hex: '#EAB308' },
      { id: 'powder-blue', name: 'Powder Blue', hex: '#93C5FD' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-KID-08',
      999,
      'feeding-only',
      [
        { id: 'yellow', name: 'Sunflower Yellow', hex: '#EAB308' },
        { id: 'powder-blue', name: 'Powder Blue', hex: '#93C5FD' },
      ],
      COMMON_SIZES
    ),
    description: 'Matching dress set crafted in breathable cotton. The mother outfit includes twin concealed side nursing zippers.',
    fabric: 'Soft Cambric Cotton',
    careInstructions: ['Machine wash gentle', 'Warm iron'],
    feedingDetails: {
      zipType: 'Soft nylon feeding zippers',
      zipPlacement: 'Dual side seam concealed openings',
      description: 'Lined with soft inner fabric flap.'
    },
    isNewArrival: true,
  }
];
