/**
 * SONY COLLECTIONS - Mock Catalog Data (Demonstration Preview)
 * 
 * NOTICE:
 * 1. Imagery: Sample photography for layout and responsive demonstration.
 *    These do NOT represent official Sony Collections product photos.
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
    title: 'Nayantara Magenta & Ombre Dupatta Kurti Set',
    slug: 'nayantara-rose-flared-maxi-dupatta-set',
    skuPrefix: 'SFK-MAX-01',
    category: 'kurti-dupatta',
    categoryName: 'Kurti + Dupatta',
    price: 1399,
    originalPrice: null,
    images: [
      '/images/kurti-dupatta/magenta-ombre-kurti-dupatta.jpg',
      '/images/kurti-dupatta/navy-zari-kurti-dupatta.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'rose', name: 'Rani Magenta', hex: '#B5174D' },
      { id: 'wine', name: 'Royal Wine', hex: '#7A2832' },
      { id: 'teal', name: 'Peacock Teal', hex: '#205E61' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-MAX-01',
      1399,
      'both',
      [
        { id: 'rose', name: 'Rani Magenta', hex: '#B5174D' },
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
    description: 'Layered georgette flared kurti set highlighted with a hand-beaded scoop neckline and an airy ombre tangerine-coral dupatta finished with mirror-work lace.',
    fabric: 'Georgette with Embellished Dupatta',
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
    title: 'Kalyani Peacock-Teal Zari-Border Tiered Feeding Frock',
    slug: 'kalyani-tiered-gathered-feeding-frock',
    skuPrefix: 'SFK-FRK-02',
    category: 'frocks',
    categoryName: 'Frocks',
    price: 1149,
    originalPrice: null,
    images: [
      '/images/frocks/teal-zari-tiered-frock.jpg',
      '/images/frocks/terracotta-tiered-frock.jpg',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'sage', name: 'Peacock Emerald Teal', hex: '#0B4A42' },
      { id: 'blush', name: 'Terracotta Rust', hex: '#B33A22' },
      { id: 'navy', name: 'Midnight Navy', hex: '#1F2937' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-FRK-02',
      1149,
      'feeding-only',
      [
        { id: 'sage', name: 'Peacock Emerald Teal', hex: '#0B4A42' },
        { id: 'blush', name: 'Terracotta Rust', hex: '#B33A22' },
        { id: 'navy', name: 'Midnight Navy', hex: '#1F2937' },
      ],
      COMMON_SIZES,
      {
        'FD-blush-S': 0, // Out of stock size for test
      }
    ),
    description: 'Peacock-teal silk-cotton tiered frock with front mock button placket, puffed half sleeves, and woven antique gold zari border. Dedicated feeding design.',
    fabric: 'Silk-Cotton with Zari Border',
    careInstructions: ['Dry clean first wash recommended', 'Dry in shade', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed dual nursing zippers',
      zipPlacement: 'Discreet side torso openings',
      description: 'Dedicated nursing access integrated cleanly into the gathered frock design.'
    },
    isFeatured: true,
  },

  // 3. CO-ORD SETS (Configuration: 'none')
  {
    id: 'prod-3',
    title: 'Ira Crimson Botanical-Print Linen Co-ord Set',
    slug: 'ira-indigo-hand-block-chanderi-co-ord-set',
    skuPrefix: 'SFK-CRD-03',
    category: 'co-ord-sets',
    categoryName: 'Co-ord Sets',
    price: 1499,
    originalPrice: null,
    images: [
      '/images/co-ords/crimson-botanical-coord.jpg',
      '/images/co-ords/wine-floral-coord.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'indigo', name: 'Crimson Leaf Print', hex: '#A41D35' },
      { id: 'rust', name: 'Wine Floral', hex: '#68192A' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-CRD-03',
      1499,
      'none',
      [
        { id: 'indigo', name: 'Crimson Leaf Print', hex: '#A41D35' },
        { id: 'rust', name: 'Wine Floral', hex: '#68192A' },
      ],
      COMMON_SIZES
    ),
    description: 'Band-collar notched V-neck tunic and relaxed wide-leg trousers in crimson botanical foliage print. Standard everyday ethnic co-ord set.',
    fabric: 'Breathable Cotton-Linen Blend',
    careInstructions: ['Dry clean recommended for initial washes', 'Cool iron inside out'],
    isNewArrival: true,
  },

  // 4. 3-PIECE DRESSES (Configuration: 'both')
  {
    id: 'prod-4',
    title: 'Madhavi Indigo Block-Print 3-Piece Palazzo Set',
    slug: 'madhavi-heritage-3-piece-anarkali-festive-set',
    skuPrefix: 'SFK-3PC-04',
    category: '3-piece-dresses',
    categoryName: '3-Piece Dresses',
    price: 1899,
    originalPrice: null,
    images: [
      '/images/3pc-sets/indigo-blockprint-3pc-set.jpg',
      '/images/3pc-sets/maroon-ajrakh-3pc-set.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'emerald', name: 'Deep Indigo', hex: '#1E2D4C' },
      { id: 'ruby', name: 'Royal Maroon', hex: '#6D1B28' },
      { id: 'mustard', name: 'Midnight Blue', hex: '#162038' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-3PC-04',
      1899,
      'both',
      [
        { id: 'emerald', name: 'Deep Indigo', hex: '#1E2D4C' },
        { id: 'ruby', name: 'Royal Maroon', hex: '#6D1B28' },
        { id: 'mustard', name: 'Midnight Blue', hex: '#162038' },
      ],
      COMMON_SIZES
    ),
    description: 'Sleeveless indigo straight kurti paired with relaxed wide-leg palazzo trousers and an artisanal hand-block printed tassel dupatta. Available with discreet feeding zippers.',
    fabric: 'Cotton Slub with Block-Print Dupatta',
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
      '/images/dresses/maroon-anarkali.jpg',
      '/images/dresses/mauve-anarkali.jpg',
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
    title: 'Kanchivaram Checked Emerald & Crimson Pattu Saree',
    slug: 'kanchivaram-touch-traditional-silk-saree',
    skuPrefix: 'SFK-SAR-06',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 1599,
    originalPrice: null,
    images: [
      '/images/sarees/emerald-checked-kanchivaram-saree.jpg',
      '/images/sarees/bottle-green-maroon-zari-saree.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'emerald-crimson', name: 'Emerald Green & Crimson', hex: '#0B462B' },
      { id: 'bottle-maroon', name: 'Bottle Green & Maroon', hex: '#173E2D' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-06',
      1599,
      'none',
      [
        { id: 'emerald-crimson', name: 'Emerald Green & Crimson', hex: '#0B462B' },
        { id: 'bottle-maroon', name: 'Bottle Green & Maroon', hex: '#173E2D' },
      ],
      ['Free Size']
    ),
    description: 'Traditional Kanchivaram checked silk saree in emerald green woven with golden zari checks and a grand crimson-gold contrast pallu. Includes unstitched contrast blouse piece.',
    fabric: 'Kanchivaram Pure Silk Blend',
    careInstructions: ['Dry clean recommended', 'Iron on reverse on silk setting'],
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
      '/images/kidswear/yellow-embroidered-frock.jpg',
      '/images/kidswear/ikat-blue-frock.jpg',
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
    title: 'Ananya Terracotta Ruffle-Shoulder Tiered Frock',
    slug: 'ananya-block-print-tiered-maxi-frock',
    skuPrefix: 'SFK-FRK-09',
    category: 'frocks',
    categoryName: 'Frocks',
    price: 1299,
    originalPrice: null,
    images: [
      '/images/frocks/terracotta-tiered-frock.jpg',
      '/images/frocks/teal-zari-tiered-frock.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'terracotta', name: 'Terracotta Rust', hex: '#B33A22' },
      { id: 'olive', name: 'Peacock Emerald Teal', hex: '#0B4A42' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-FRK-09',
      1299,
      'both',
      [
        { id: 'terracotta', name: 'Terracotta Rust', hex: '#B33A22' },
        { id: 'olive', name: 'Peacock Emerald Teal', hex: '#0B4A42' },
      ],
      COMMON_SIZES
    ),
    description: 'Breezy terracotta georgette tiered long frock accented with delicate ruffle straps and subtle hand-embroidered bodice motifs. Available in Feeding or regular fit.',
    fabric: 'Georgette with Soft Mulmul Lining',
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
    title: 'Vaidehi Wine Floral-Hem Tunic & Palazzo Co-ord Set',
    slug: 'vaidehi-linen-tunic-pant-co-ord-set',
    skuPrefix: 'SFK-CRD-10',
    category: 'co-ord-sets',
    categoryName: 'Co-ord Sets',
    price: 1599,
    originalPrice: null,
    images: [
      '/images/co-ords/wine-floral-coord.jpg',
      '/images/co-ords/crimson-botanical-coord.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'beige', name: 'Wine Floral', hex: '#68192A' },
      { id: 'slate', name: 'Crimson Botanical', hex: '#A41D35' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-CRD-10',
      1599,
      'both',
      [
        { id: 'beige', name: 'Wine Floral', hex: '#68192A' },
        { id: 'slate', name: 'Crimson Botanical', hex: '#A41D35' },
      ],
      COMMON_SIZES
    ),
    description: 'Deep wine tunic and flared palazzo co-ord set detailed with soft blush-pink floral motifs along the hem and sleeves.',
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
    title: 'Gayathri Midnight Navy Zari-Weave Kurti & Dupatta',
    slug: 'gayathri-rayon-slub-anarkali-kurti-dupatta',
    skuPrefix: 'SFK-KRT-11',
    category: 'kurti-dupatta',
    categoryName: 'Kurti + Dupatta',
    price: 1249,
    originalPrice: null,
    images: [
      '/images/kurti-dupatta/navy-zari-kurti-dupatta.jpg',
      '/images/kurti-dupatta/magenta-ombre-kurti-dupatta.jpg',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'navy-zari', name: 'Midnight Navy & Gold Zari', hex: '#1B2845' },
      { id: 'forest', name: 'Deep Forest Green', hex: '#1C3B2B' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-KRT-11',
      1249,
      'feeding-only',
      [
        { id: 'navy-zari', name: 'Midnight Navy & Gold Zari', hex: '#1B2845' },
        { id: 'forest', name: 'Deep Forest Green', hex: '#1C3B2B' },
      ],
      COMMON_SIZES
    ),
    description: 'Handloom-textured midnight navy straight kurti woven with tiny antique gold motifs and paired with a matching zari-border dupatta. Dedicated feeding construction.',
    fabric: 'Handloom Cotton-Silk with Zari Dupatta',
    careInstructions: ['Gentle cold wash', 'Medium iron'],
    feedingDetails: {
      zipType: 'Concealed dual-side nursing zips',
      zipPlacement: 'Left and right vertical side seams',
      description: 'Dedicated nursing access integrated cleanly into straight-cut kurti.'
    },
    isNewArrival: true,
  },

  // 12. 3-PIECE DRESSES (Configuration: 'both')
  {
    id: 'prod-12',
    title: 'Sharanya Maroon Ajrakh Yoke 3-Piece Kurti Set',
    slug: 'sharanya-silk-chanderi-3-piece-ensemble',
    skuPrefix: 'SFK-3PC-12',
    category: '3-piece-dresses',
    categoryName: '3-Piece Dresses',
    price: 2199,
    originalPrice: null,
    images: [
      '/images/3pc-sets/maroon-ajrakh-3pc-set.jpg',
      '/images/3pc-sets/indigo-blockprint-3pc-set.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'maroon-ajrakh', name: 'Maroon & Black Ajrakh', hex: '#6D1B28' },
      { id: 'deep-indigo', name: 'Deep Indigo', hex: '#1E2D4C' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-3PC-12',
      2199,
      'both',
      [
        { id: 'maroon-ajrakh', name: 'Maroon & Black Ajrakh', hex: '#6D1B28' },
        { id: 'deep-indigo', name: 'Deep Indigo', hex: '#1E2D4C' },
      ],
      COMMON_SIZES
    ),
    description: 'Royal maroon A-line straight kurti framed with hand-block Ajrakh yoke & cuff trim, matching straight trousers, and a black-and-maroon Ajrakh dupatta.',
    fabric: 'Modal Cotton with Ajrakh Dupatta',
    careInstructions: ['Dry clean only'],
    feedingDetails: {
      zipType: 'Concealed dual-side zippers',
      zipPlacement: 'Discreet side placement',
      description: 'Discreet vertical nursing access designed for festive 3-piece set.'
    },
    isFeatured: true,
    isNewArrival: true,
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
      '/images/dresses/ruby-floral-frock.jpg',
      '/images/dresses/rust-kalamkari-frock.jpg',
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
    title: 'Vasundhara Bottle-Green & Maroon Zari Border Saree',
    slug: 'vasundhara-handloom-linen-zari-border-saree',
    skuPrefix: 'SFK-SAR-14',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 1899,
    originalPrice: null,
    images: [
      '/images/sarees/bottle-green-maroon-zari-saree.jpg',
      '/images/sarees/emerald-checked-kanchivaram-saree.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'bottle-maroon', name: 'Bottle Green & Maroon', hex: '#173E2D' },
      { id: 'deep-burgundy', name: 'Antique Burgundy Border', hex: '#691D2A' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-14',
      1899,
      'none',
      [
        { id: 'bottle-maroon', name: 'Bottle Green & Maroon', hex: '#173E2D' },
        { id: 'deep-burgundy', name: 'Antique Burgundy Border', hex: '#691D2A' },
      ],
      ['Free Size']
    ),
    description: 'Handloom cotton-silk saree in deep bottle green paired with woven copper-maroon temple zari borders and delicate tasseled pallu. Includes unstitched maroon contrast blouse piece.',
    fabric: 'Handloom Cotton-Silk with Zari Border',
    careInstructions: ['Dry clean for initial washes', 'Gentle cold hand wash'],
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
      '/images/kidswear/ikat-blue-frock.jpg',
      '/images/kidswear/yellow-embroidered-frock.jpg',
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
  },

  // 17. SAREES (Configuration: 'none')
  {
    id: 'prod-17',
    title: 'Meenakshi Wine-Maroon Banarasi Tissue Silk Saree',
    slug: 'meenakshi-banarasi-brocade-bridal-silk-saree',
    skuPrefix: 'SFK-SAR-17',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 2299,
    originalPrice: null,
    images: [
      '/images/sarees/wine-banarasi-tissue-saree.jpg',
      '/images/sarees/crimson-magenta-butti-saree.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'wine-gold', name: 'Deep Wine & Antique Gold', hex: '#4C1520' },
      { id: 'crimson-gold', name: 'Crimson & Gold Zari', hex: '#8B0029' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-17',
      2299,
      'none',
      [
        { id: 'wine-gold', name: 'Deep Wine & Antique Gold', hex: '#4C1520' },
        { id: 'crimson-gold', name: 'Crimson & Gold Zari', hex: '#8B0029' },
      ],
      ['Free Size']
    ),
    description: 'Opulent deep wine-maroon Banarasi tissue silk saree finished with luminous antique-gold woven borders and a grand bridal zari pallu. Includes matching unstitched blouse piece.',
    fabric: 'Banarasi Tissue Silk',
    careInstructions: ['Dry clean only', 'Store wrapped in muslin cloth'],
    isFeatured: true,
  },

  // 18. SAREES (Configuration: 'none')
  {
    id: 'prod-18',
    title: 'Padmini Crimson Zari-Butti Banarasi Chanderi Saree',
    slug: 'padmini-pure-chanderi-tissue-pattu-saree',
    skuPrefix: 'SFK-SAR-18',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 1999,
    originalPrice: null,
    images: [
      '/images/sarees/crimson-magenta-butti-saree.jpg',
      '/images/sarees/wine-banarasi-tissue-saree.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'crimson-butti', name: 'Crimson Magenta & Gold', hex: '#A61C3C' },
      { id: 'rose-gold', name: 'Rose Mauve & Gold', hex: '#8E4B63' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-18',
      1999,
      'none',
      [
        { id: 'crimson-butti', name: 'Crimson Magenta & Gold', hex: '#A61C3C' },
        { id: 'rose-gold', name: 'Rose Mauve & Gold', hex: '#8E4B63' },
      ],
      ['Free Size']
    ),
    description: 'Festive crimson-magenta Banarasi Chanderi saree sprinkled with delicate golden zari polka buttis, a traditional woven border, and tasseled zari pallu.',
    fabric: 'Banarasi Chanderi Silk Blend',
    careInstructions: ['Dry clean recommended', 'Cool iron reverse'],
    isNewArrival: true,
  },

  // 19. KIDS COLLECTIONS (Configuration: 'none')
  {
    id: 'prod-19',
    title: 'Janaki Traditional Silk Pattu Pavadai Set',
    slug: 'janaki-traditional-silk-pattu-pavadai-set',
    skuPrefix: 'SFK-KID-19',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 1099,
    originalPrice: null,
    images: [
      '/images/kidswear/green-pattu-pavadai.jpg',
      '/images/kidswear/maroon-pattu-frock.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'peacock-green', name: 'Peacock Green & Purple', hex: '#0A5C36' },
      { id: 'rani-gold', name: 'Rani Pink & Gold', hex: '#C2185B' },
    ],
    availableSizes: ['S', 'M', 'L'],
    variants: generateVariants(
      'SFK-KID-19',
      1099,
      'none',
      [
        { id: 'peacock-green', name: 'Peacock Green & Purple', hex: '#0A5C36' },
        { id: 'rani-gold', name: 'Rani Pink & Gold', hex: '#C2185B' },
      ],
      ['S', 'M', 'L']
    ),
    description: 'Traditional South Indian Pattu Pavadai lehenga and blouse set tailored for festive family occasions with soft lining.',
    fabric: 'Art Silk with Cotton Lining',
    careInstructions: ['Dry clean first wash', 'Gentle hand wash cold'],
    isFeatured: true,
  },

  // 20. KIDS COLLECTIONS (Configuration: 'none')
  {
    id: 'prod-20',
    title: 'Vedika Maroon Scallop Temple-Border Pattu Frock',
    slug: 'vedika-maroon-temple-border-pattu-frock',
    skuPrefix: 'SFK-KID-20',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 1199,
    originalPrice: null,
    images: [
      '/images/kidswear/maroon-pattu-frock.jpg',
      '/images/kidswear/green-pattu-pavadai.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'wine-maroon', name: 'Wine Maroon & Gold', hex: '#6D1336' },
      { id: 'bottle-green', name: 'Bottle Green & Zari', hex: '#134E3A' },
    ],
    availableSizes: ['S', 'M', 'L'],
    variants: generateVariants(
      'SFK-KID-20',
      1199,
      'none',
      [
        { id: 'wine-maroon', name: 'Wine Maroon & Gold', hex: '#6D1336' },
        { id: 'bottle-green', name: 'Bottle Green & Zari', hex: '#134E3A' },
      ],
      ['S', 'M', 'L']
    ),
    description: 'Traditional South Indian Pattu long frock featuring a scalloped neckline, tiered flare, and woven elephant zari temple border.',
    fabric: 'Art Silk with Cotton Lining',
    careInstructions: ['Dry clean first wash', 'Gentle hand wash cold'],
    isNewArrival: true,
  },

  // 21. KIDS COLLECTIONS (Configuration: 'none')
  {
    id: 'prod-21',
    title: 'Meenakshi Royal Plum Silk Angrakha Kurti Set',
    slug: 'meenakshi-royal-plum-silk-angrakha-set',
    skuPrefix: 'SFK-KID-21',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 1299,
    originalPrice: null,
    images: [
      '/images/kidswear/purple-angrakha-set.jpg',
      '/images/kidswear/maroon-pattu-frock.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'royal-plum', name: 'Royal Plum', hex: '#4A154B' },
      { id: 'deep-wine', name: 'Deep Wine', hex: '#6D1336' },
    ],
    availableSizes: ['S', 'M', 'L'],
    variants: generateVariants(
      'SFK-KID-21',
      1299,
      'none',
      [
        { id: 'royal-plum', name: 'Royal Plum', hex: '#4A154B' },
        { id: 'deep-wine', name: 'Deep Wine', hex: '#6D1336' },
      ],
      ['S', 'M', 'L']
    ),
    description: 'Festive silk angrakha peplum kurti paired with matching gota-trimmed straight pants and dainty tassel tie detailing.',
    fabric: 'Silk Blend with Inner Lining',
    careInstructions: ['Dry clean recommended', 'Cool steam iron'],
  },

  // 22. KIDS COLLECTIONS (Configuration: 'none')
  {
    id: 'prod-22',
    title: 'Diya Champagne Tissue Organza Kids Party Gown',
    slug: 'diya-champagne-organza-kids-party-gown',
    skuPrefix: 'SFK-KID-22',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 1399,
    originalPrice: null,
    images: [
      '/images/kidswear/golden-organza-gown.jpg',
      '/images/kidswear/peacock-silk-frock.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'champagne-gold', name: 'Champagne Gold', hex: '#C69254' },
      { id: 'soft-peach', name: 'Soft Peach', hex: '#E6B8A2' },
    ],
    availableSizes: ['S', 'M', 'L'],
    variants: generateVariants(
      'SFK-KID-22',
      1399,
      'none',
      [
        { id: 'champagne-gold', name: 'Champagne Gold', hex: '#C69254' },
        { id: 'soft-peach', name: 'Soft Peach', hex: '#E6B8A2' },
      ],
      ['S', 'M', 'L']
    ),
    description: 'Shimmering organza tissue floor-length festive gown with embroidered neckline, soft inner lining, and sheer zari-bordered dupatta.',
    fabric: 'Georgette with Inner Lining',
    careInstructions: ['Dry clean only', 'Store hanging or folded gently'],
    isFeatured: true,
  },

  // 23. KIDS COLLECTIONS (Configuration: 'none')
  {
    id: 'prod-23',
    title: 'Kavya Peacock Blue Ruffled Silk Kids Frock',
    slug: 'kavya-peacock-blue-ruffled-silk-kids-frock',
    skuPrefix: 'SFK-KID-23',
    category: 'kids-collections',
    categoryName: 'Kids Collections',
    price: 1049,
    originalPrice: null,
    images: [
      '/images/kidswear/peacock-silk-frock.jpg',
      '/images/kidswear/golden-organza-gown.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'peacock-emerald', name: 'Peacock Blue & Emerald', hex: '#0A5470' },
      { id: 'royal-teal', name: 'Royal Teal', hex: '#115E59' },
    ],
    availableSizes: ['S', 'M', 'L'],
    variants: generateVariants(
      'SFK-KID-23',
      1049,
      'none',
      [
        { id: 'peacock-emerald', name: 'Peacock Blue & Emerald', hex: '#0A5470' },
        { id: 'royal-teal', name: 'Royal Teal', hex: '#115E59' },
      ],
      ['S', 'M', 'L']
    ),
    description: 'Sleeveless festive silk frock crafted in rich peacock blue with subtle metallic motifs and a layered emerald green ruffle hem.',
    fabric: 'Silk Blend with Inner Lining',
    careInstructions: ['Dry clean first wash', 'Cool iron on reverse'],
  },

  // 24. SAREES (Configuration: 'none')
  {
    id: 'prod-24',
    title: 'Arundhati Rose-Mauve & Forest Green Kanjeevaram Saree',
    slug: 'arundhati-rose-mauve-forest-green-kanjeevaram-saree',
    skuPrefix: 'SFK-SAR-24',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 2149,
    originalPrice: null,
    images: [
      '/images/sarees/rose-mauve-kanjeevaram-saree.jpg',
      '/images/sarees/emerald-checked-kanchivaram-saree.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'rose-forest', name: 'Rose Mauve & Forest Green', hex: '#8E4B63' },
      { id: 'antique-gold', name: 'Forest Green & Gold Zari', hex: '#1B4332' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-24',
      2149,
      'none',
      [
        { id: 'rose-forest', name: 'Rose Mauve & Forest Green', hex: '#8E4B63' },
        { id: 'antique-gold', name: 'Forest Green & Gold Zari', hex: '#1B4332' },
      ],
      ['Free Size']
    ),
    description: 'Lustrous rose-mauve soft Kanjeevaram silk saree woven with gold scalloped temple borders and an heirloom forest-green peacock-motif zari pallu. Includes contrast green brocade blouse piece.',
    fabric: 'Soft Kanjeevaram Silk with Zari Pallu',
    careInstructions: ['Dry clean recommended', 'Iron on reverse on silk setting'],
    isNewArrival: true,
  },

  // 25. SAREES (Configuration: 'none')
  {
    id: 'prod-25',
    title: 'Nandini Royal Violet Lotus-Pallu Paithani Silk Saree',
    slug: 'nandini-royal-violet-paithani-silk-saree',
    skuPrefix: 'SFK-SAR-25',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 2499,
    originalPrice: null,
    images: [
      '/images/sarees/royal-violet-paithani-saree.jpg',
      '/images/sarees/rose-mauve-kanjeevaram-saree.jpg',
    ],
    feedingConfig: 'none',
    supportedClothingTypes: [],
    availableColors: [
      { id: 'royal-violet', name: 'Royal Violet & Lavender Zari', hex: '#4A1C6F' },
      { id: 'plum-silver', name: 'Plum & Pastel Rose', hex: '#6D3B7E' },
    ],
    availableSizes: ['Free Size'],
    variants: generateVariants(
      'SFK-SAR-25',
      2499,
      'none',
      [
        { id: 'royal-violet', name: 'Royal Violet & Lavender Zari', hex: '#4A1C6F' },
        { id: 'plum-silver', name: 'Plum & Pastel Rose', hex: '#6D3B7E' },
      ],
      ['Free Size']
    ),
    description: 'Signature royal violet Paithani silk saree adorned with tiny silver-gold zari dots, traditional geometric border, and an artisanal floral Paithani pallu. Includes matching contrast blouse piece.',
    fabric: 'Artisanal Paithani Silk Blend',
    careInstructions: ['Dry clean only', 'Store wrapped in muslin cloth'],
    isFeatured: true,
  },

  // 26. PARTYWEAR DRESSES (Configuration: 'both')
  {
    id: 'prod-26',
    title: 'Chandni Vintage Mauve Zari-Embroidered Anarkali Gown',
    slug: 'chandni-vintage-mauve-zari-anarkali-gown',
    skuPrefix: 'SFK-PTY-26',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 2299,
    originalPrice: null,
    images: [
      '/images/dresses/mauve-anarkali.jpg',
      '/images/dresses/maroon-anarkali.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'vintage-mauve', name: 'Vintage Mauve Rose', hex: '#B47B84' },
      { id: 'deep-maroon', name: 'Deep Maroon', hex: '#63141F' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-26',
      2299,
      'both',
      [
        { id: 'vintage-mauve', name: 'Vintage Mauve Rose', hex: '#B47B84' },
        { id: 'deep-maroon', name: 'Deep Maroon', hex: '#63141F' },
      ],
      COMMON_SIZES
    ),
    description: 'Full-flared vintage mauve silk-cotton anarkali dress finished with heavy antique-gold zari hem embroidery and a sheer tasselled organza dupatta.',
    fabric: 'Chanderi Silk-Cotton with Zari Hem',
    careInstructions: ['Dry clean only', 'Cool iron on reverse'],
    feedingDetails: {
      zipType: 'Concealed dual-side vertical zips',
      zipPlacement: 'Integrated smoothly into side seams',
      description: 'Festive flared anarkali styling with discreet nursing access when Feeding option is selected.'
    },
    isFeatured: true,
  },

  // 27. PARTYWEAR DRESSES (Configuration: 'both')
  {
    id: 'prod-27',
    title: 'Anviksha Olive Block-Print Flared Anarkali Dress',
    slug: 'anviksha-olive-block-print-flared-anarkali-dress',
    skuPrefix: 'SFK-PTY-27',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 1899,
    originalPrice: null,
    images: [
      '/images/dresses/olive-anarkali-set.jpg',
      '/images/dresses/maroon-anarkali.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'olive-moss', name: 'Earthy Olive Green', hex: '#4F5832' },
      { id: 'emerald', name: 'Forest Emerald', hex: '#1B4931' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-27',
      1899,
      'both',
      [
        { id: 'olive-moss', name: 'Earthy Olive Green', hex: '#4F5832' },
        { id: 'emerald', name: 'Forest Emerald', hex: '#1B4931' },
      ],
      COMMON_SIZES
    ),
    description: 'Flowy olive-green hand-block flared anarkali dress finished with sheer printed dupatta and subtle gold border accents. Available in Feeding & Non-Feeding.',
    fabric: 'Printed Chanderi Silk-Cotton Blend',
    careInstructions: ['Dry clean first wash', 'Gentle cold hand wash thereafter'],
    feedingDetails: {
      zipType: 'Concealed vertical dual-side zips',
      zipPlacement: 'Integrated smoothly into side seams',
      description: 'Graceful gathered flare with discreet nursing access.'
    },
    isNewArrival: true,
    isFeatured: true,
  },

  // 28. PARTYWEAR DRESSES (Configuration: 'both')
  {
    id: 'prod-28',
    title: 'Devika Crimson Floral-Print Tiered Long Dress',
    slug: 'devika-crimson-floral-tiered-long-frock',
    skuPrefix: 'SFK-PTY-28',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 1399,
    originalPrice: null,
    images: [
      '/images/dresses/crimson-floral-maxi.jpg',
      '/images/dresses/ruby-floral-frock.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'crimson-floral', name: 'Crimson Botanical', hex: '#A61C3C' },
      { id: 'rust-bloom', name: 'Rust Kalamkari', hex: '#8B3A2B' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-28',
      1399,
      'both',
      [
        { id: 'crimson-floral', name: 'Crimson Botanical', hex: '#A61C3C' },
        { id: 'rust-bloom', name: 'Rust Kalamkari', hex: '#8B3A2B' },
      ],
      COMMON_SIZES
    ),
    description: 'Vibrant crimson floral tiered ethnic maxi dress featuring flared pleats, soft breathable cotton drape, and concealed side nursing zippers when selected.',
    fabric: 'Pure Mulmul Cotton',
    careInstructions: ['Machine wash gentle', 'Dry in shade'],
    feedingDetails: {
      zipType: 'Concealed dual-side vertical zips',
      zipPlacement: 'Integrated into upper bodice side seams',
      description: 'Relaxed tiered flare suitable for maternity, feeding, and everyday wear.'
    },
    isNewArrival: true,
  },

  // 29. PARTYWEAR DRESSES (Configuration: 'feeding-only')
  {
    id: 'prod-29',
    title: 'Suhani Lavender Heart-Weave Mulmul Feeding Dress',
    slug: 'suhani-lavender-heart-weave-feeding-dress',
    skuPrefix: 'SFK-PTY-29',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 1149,
    originalPrice: null,
    images: [
      '/images/dresses/lavender-feeding-frock.jpg',
      '/images/dresses/rust-kalamkari-frock.jpg',
    ],
    feedingConfig: 'feeding-only',
    supportedClothingTypes: ['Feeding'],
    availableColors: [
      { id: 'lavender-heart', name: 'Lavender Heart Weave', hex: '#7E6598' },
      { id: 'vintage-mauve', name: 'Vintage Mauve', hex: '#B47B84' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-29',
      1149,
      'feeding-only',
      [
        { id: 'lavender-heart', name: 'Lavender Heart Weave', hex: '#7E6598' },
        { id: 'vintage-mauve', name: 'Vintage Mauve', hex: '#B47B84' },
      ],
      COMMON_SIZES
    ),
    description: 'Soft lavender pure cotton puff-sleeve feeding dress with discreet horizontal nursing overlap flap and roomy gathered skirt.',
    fabric: 'Pure Mulmul Cotton',
    careInstructions: ['Machine wash gentle cycle', 'Dry in shade', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed front-flap dual zippers',
      zipPlacement: 'Integrated cleanly beneath vertical pleat overlap',
      description: 'Dedicated nursing access tailored for everyday maternal comfort.'
    },
  },

  // 30. PARTYWEAR DRESSES (Configuration: 'both')
  {
    id: 'prod-30',
    title: 'Meghna Rust Kalamkari Tiered Maxi Dress',
    slug: 'meghna-rust-kalamkari-tiered-maxi-dress',
    skuPrefix: 'SFK-PTY-30',
    category: 'partywear-dresses',
    categoryName: 'Partywear Dresses',
    price: 1299,
    originalPrice: null,
    images: [
      '/images/dresses/rust-kalamkari-frock.jpg',
      '/images/dresses/ruby-floral-frock.jpg',
    ],
    feedingConfig: 'both',
    supportedClothingTypes: ['Feeding', 'Non-Feeding'],
    availableColors: [
      { id: 'rust-kalamkari', name: 'Rust Kalamkari', hex: '#8B3A2B' },
      { id: 'ruby-floral', name: 'Ruby Botanical', hex: '#9B1B30' },
    ],
    availableSizes: COMMON_SIZES,
    variants: generateVariants(
      'SFK-PTY-30',
      1299,
      'both',
      [
        { id: 'rust-kalamkari', name: 'Rust Kalamkari', hex: '#8B3A2B' },
        { id: 'ruby-floral', name: 'Ruby Botanical', hex: '#9B1B30' },
      ],
      COMMON_SIZES
    ),
    description: 'Hand-block Kalamkari tiered ankle-length dress in earthy rust cotton with gathered waist and puff sleeves.',
    fabric: 'Mulmul Cotton',
    careInstructions: ['Hand wash cold separately', 'Dry in shade', 'Warm iron'],
    feedingDetails: {
      zipType: 'Concealed dual-side nursing access',
      zipPlacement: 'Left and right vertical side openings',
      description: 'Available in both discreet Feeding and Non-Feeding fits.'
    },
    isNewArrival: true,
  }
];
