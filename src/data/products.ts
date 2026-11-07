/**
 * SONY FEEDING KURTIS - Mock Catalog Data (Demonstration Preview)
 * 
 * NOTICE:
 * 1. Imagery: Sample photography sourced from Unsplash for layout and responsive demonstration.
 *    These do NOT represent official Sony Feeding Kurtis product photos.
 * 2. Pricing & Sizing: Sample price figures and standard sizing are placeholders for interface validation.
 * 3. Construction details: Zipper placements and silhouettes are illustrative models reflecting the
 *    required feeding configurations (both, feeding-only, none) pending final client manufacturing specifications.
 */

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
        // Support simulated stock levels
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
  // 1. KURTI + DUPATTA (Configuration: 'both')
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
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
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
      zipType: 'Concealed dual-side nursing access',
      zipPlacement: 'Discreet side openings',
      description: 'Concealed vertical openings designed for practical nursing access.'
    },
    isFeatured: true,
  },

  // 2. FROCKS (Configuration: 'feeding-only')
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
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
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
      COMMON_SIZES,
      {
        'FD-blush-S': 0, // Out of stock size for test
      }
    ),
    description: 'Tiered gathered frock designed with ample ease across the waist and hidden side nursing zippers. Dedicated feeding design.',
    fabric: 'Mulmul Cotton',
    careInstructions: ['Machine wash gentle cycle', 'Dry in shade', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed dual nursing zippers',
      zipPlacement: 'Discreet side torso openings',
      description: 'Dedicated nursing access integrated cleanly into the gathered frock design.'
    },
  },

  // 3. CO-ORD SETS (Configuration: 'none')
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

  // 4. 3-PIECE DRESSES (Configuration: 'both')
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
    isFeatured: true,
  },

  // 5. PARTYWEAR DRESSES (Configuration: 'both')
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
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
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
      zipType: 'Concealed dual-side zippers',
      zipPlacement: 'Integrated discreetly into side seams',
      description: 'Hidden nursing openings tailored into festive partywear gown.'
    },
    isFeatured: true,
  },

  // 6. SAREES (Configuration: 'none')
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

  // 7. LEHENGAS (Configuration: 'both')
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
      zipPlacement: 'Side seams of blouse',
      description: 'Allows nursing access while wearing festive attire.'
    },
    isFeatured: true,
  },

  // 8. KIDS COLLECTIONS (Configuration: 'feeding-only')
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
      zipType: 'Concealed nursing zippers',
      zipPlacement: 'Dual side seam openings',
      description: 'Mother outfit includes discreet side nursing access.'
    },
    isNewArrival: true,
  },

  // 9. FROCKS (Configuration: 'both')
  {
    id: 'prod-9',
    title: 'Ananya Block-Print Tiered Maxi Frock',
    slug: 'ananya-block-print-tiered-maxi-frock',
    skuPrefix: 'SFK-FRK-09',
    category: 'frocks',
    categoryName: 'Frocks',
    price: 1299,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'terracotta', name: 'Terracotta Rust', hex: '#C05A3E' },
      { id: 'olive', name: 'Earthy Olive', hex: '#556B2F' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-FRK-09',
      1299,
      'both',
      [
        { id: 'terracotta', name: 'Terracotta Rust', hex: '#C05A3E' },
        { id: 'olive', name: 'Earthy Olive', hex: '#556B2F' },
      ],
      COMMON_SIZES
    ),
    description: 'Tiered silhouette with handcrafted block print motifs and an elasticated waist. Choose feeding-friendly or regular festive fit.',
    fabric: 'Mulmul Cotton',
    careInstructions: ['Hand wash cold separately', 'Dry in shade', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed dual-side nursing access',
      zipPlacement: 'Left and right side openings',
      description: 'Discreet feeding feature designed for nursing access.'
    },
    isNewArrival: true,
  },

  // 10. CO-ORD SETS (Configuration: 'both')
  {
    id: 'prod-10',
    title: 'Vaidehi Linen Tunic & Pant Co-ord Set',
    slug: 'vaidehi-linen-tunic-pant-co-ord-set',
    skuPrefix: 'SFK-CRD-10',
    category: 'co-ord-sets',
    categoryName: 'Co-ord Sets',
    price: 1599,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'beige', name: 'Natural Sand Beige', hex: '#D2B48C' },
      { id: 'slate', name: 'Slate Teal', hex: '#3E6B75' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-CRD-10',
      1599,
      'both',
      [
        { id: 'beige', name: 'Natural Sand Beige', hex: '#D2B48C' },
        { id: 'slate', name: 'Slate Teal', hex: '#3E6B75' },
      ],
      COMMON_SIZES
    ),
    description: 'Contemporary coordinated tunic and cropped trouser pair tailored in breathable linen-cotton blend.',
    fabric: 'Linen Cotton Blend',
    careInstructions: ['Gentle cycle wash', 'Do not bleach', 'Warm iron when slightly damp'],
    feedingDetails: {
      zipType: 'Concealed vertical side zippers',
      zipPlacement: 'Integrated into side seams',
      description: 'Seamless integration into tunic styling.'
    },
    isFeatured: true,
  },

  // 11. KURTI + DUPATTA (Configuration: 'feeding-only')
  {
    id: 'prod-11',
    title: 'Gayathri Rayon Slub Anarkali Kurti & Dupatta',
    slug: 'gayathri-rayon-slub-anarkali-kurti-dupatta',
    skuPrefix: 'SFK-KRT-11',
    category: 'kurti-dupatta',
    categoryName: 'Kurti + Dupatta',
    price: 1249,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'coral', name: 'Festive Coral', hex: '#E06D53' },
      { id: 'forest', name: 'Deep Forest Green', hex: '#1C3B2B' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-KRT-11',
      1249,
      'feeding-only',
      [
        { id: 'coral', name: 'Festive Coral', hex: '#E06D53' },
        { id: 'forest', name: 'Deep Forest Green', hex: '#1C3B2B' },
      ],
      COMMON_SIZES
    ),
    description: 'Flared anarkali kurti featuring floral boota prints and paired with a crinkled mulmul dupatta. Dedicated feeding construction.',
    fabric: 'Cotton Slub with Organza Dupatta',
    careInstructions: ['Gentle cold wash', 'Medium iron'],
    feedingDetails: {
      zipType: 'Concealed dual-side nursing zips',
      zipPlacement: 'Left and right vertical side seams',
      description: 'Dedicated nursing access integrated into anarkali silhouette.'
    },
  },

  // 12. 3-PIECE DRESSES (Configuration: 'both')
  {
    id: 'prod-12',
    title: 'Sharanya Silk Chanderi 3-Piece Festive Ensemble',
    slug: 'sharanya-silk-chanderi-3-piece-ensemble',
    skuPrefix: 'SFK-3PC-12',
    category: '3-piece-dresses',
    categoryName: '3-Piece Dresses',
    price: 2199,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617059063772-34532796cdb5?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'maroon', name: 'Royal Maroon', hex: '#63141F' },
      { id: 'bottle-green', name: 'Bottle Green', hex: '#0B3B24' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-3PC-12',
      2199,
      'both',
      [
        { id: 'maroon', name: 'Royal Maroon', hex: '#63141F' },
        { id: 'bottle-green', name: 'Bottle Green', hex: '#0B3B24' },
      ],
      COMMON_SIZES
    ),
    description: 'Regal Chanderi three-piece dress ensemble with zari embroidery, matching straight trousers, and banarasi weave border dupatta.',
    fabric: 'Printed Chanderi Cotton Blend',
    careInstructions: ['Dry clean only'],
    feedingDetails: {
      zipType: 'Concealed dual-side zippers',
      zipPlacement: 'Discreet side placement',
      description: 'Discreet vertical nursing access designed for festive ensemble.'
    },
    isFeatured: true,
  },

  // 13. PARTYWEAR DRESSES (Configuration: 'both')
  {
    id: 'prod-13',
    title: 'Tarini Embroidered Tissue Festive Maxi Gown',
    slug: 'tarini-embroidered-tissue-festive-maxi-gown',
    skuPrefix: 'SFK-PTY-13',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 2499,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'copper', name: 'Antique Copper', hex: '#9C5134' },
      { id: 'ivory-gold', name: 'Ivory Gold', hex: '#D6C7A1' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-13',
      2499,
      'both',
      [
        { id: 'copper', name: 'Antique Copper', hex: '#9C5134' },
        { id: 'ivory-gold', name: 'Ivory Gold', hex: '#D6C7A1' },
      ],
      COMMON_SIZES
    ),
    description: 'Floor-sweeping partywear gown crafted in shimmering tissue georgette, accented with thread work and santoon inner lining.',
    fabric: 'Georgette with Inner Lining',
    careInstructions: ['Dry clean only'],
    feedingDetails: {
      zipType: 'Concealed dual-side vertical zippers',
      zipPlacement: 'Integrated into side seams',
      description: 'Discreet side access for nursing mothers.'
    },
    isNewArrival: true,
  },

  // 14. SAREES (Configuration: 'none')
  {
    id: 'prod-14',
    title: 'Vasundhara Handloom Linen Zari Border Saree',
    slug: 'vasundhara-handloom-linen-zari-border-saree',
    skuPrefix: 'SFK-SAR-14',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 1899,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'mustard', name: 'Earthy Mustard', hex: '#D49B28' },
      { id: 'olive-silver', name: 'Olive with Silver Zari', hex: '#5E6646' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-14',
      1899,
      'none',
      [
        { id: 'mustard', name: 'Earthy Mustard', hex: '#D49B28' },
        { id: 'olive-silver', name: 'Olive with Silver Zari', hex: '#5E6646' },
      ],
      ['Free Size']
    ),
    description: 'Handcrafted pure linen saree highlighted by silver and gold zari borders. Includes running unstitched blouse fabric.',
    fabric: 'Linen Cotton Blend',
    careInstructions: ['Dry clean for initial washes', 'Gentle cold hand wash'],
  },

  // 15. LEHENGAS (Configuration: 'both')
  {
    id: 'prod-15',
    title: 'Meera Chanderi Semi-Stitched Festive Lehenga',
    slug: 'meera-chanderi-semi-stitched-festive-lehenga',
    skuPrefix: 'SFK-LHG-15',
    category: 'lehengas',
    categoryName: 'Lehengas',
    price: 2699,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'peacock-blue', name: 'Peacock Blue', hex: '#114B5F' },
      { id: 'crimson', name: 'Deep Crimson', hex: '#7A131A' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-LHG-15',
      2699,
      'both',
      [
        { id: 'peacock-blue', name: 'Peacock Blue', hex: '#114B5F' },
        { id: 'crimson', name: 'Deep Crimson', hex: '#7A131A' },
      ],
      COMMON_SIZES
    ),
    description: 'Festive twirl lehenga set adorned with gota patti detailing and net dupatta. Blouse features feeding-friendly option.',
    fabric: 'Silk Blend with Inner Lining',
    careInstructions: ['Dry clean only'],
    feedingDetails: {
      zipType: 'Concealed dual-side zips in blouse',
      zipPlacement: 'Discreet side placement in blouse',
      description: 'Enables comfortable nursing during celebrations.'
    },
    isNewArrival: true,
  },

  // 16. KIDS COLLECTIONS (Configuration: 'none')
  {
    id: 'prod-16',
    title: 'Aarohi Pure Cotton Festive Toddler Frock',
    slug: 'aarohi-pure-cotton-festive-toddler-frock',
    skuPrefix: 'SFK-KID-16',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 849,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'rani-pink', name: 'Rani Pink', hex: '#D63384' },
      { id: 'mint', name: 'Mint Green', hex: '#6EE7B7' },
    ],
    availableSizes: ['S', 'M', 'L'],
    variants: generateVariants(
      'SFK-KID-16',
      849,
      'none',
      [
        { id: 'rani-pink', name: 'Rani Pink', hex: '#D63384' },
        { id: 'mint', name: 'Mint Green', hex: '#6EE7B7' },
      ],
      ['S', 'M', 'L']
    ),
    description: 'Gentle, breathable cotton frock designed for little ones with soft lining and back zipper closure. Standard kids ethnic wear.',
    fabric: 'Soft Cambric Cotton',
    careInstructions: ['Machine wash gentle in cold water', 'Warm iron'],
  }
];
