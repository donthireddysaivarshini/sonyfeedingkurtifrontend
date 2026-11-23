import { Product } from '../types/product';
import { FilterState } from '../components/shop/FilterSidebar';

export function filterAndSortProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  // 1. Filter
  const filtered = products.filter((product) => {
    // Section Filter (Homepage Sections)
    if (filters.section) {
      const sec = filters.section.toLowerCase();
      if (sec === 'feeding-collection' || sec === 'feeding') {
        if (!product.isFeedingCollection && product.feedingConfig !== 'both' && product.feedingConfig !== 'feeding-only') {
          return false;
        }
      } else if (sec === 'handstock' || sec === 'handstocks') {
        if (!product.isHandstock) return false;
      } else if (sec === 'sarees') {
        if (!product.isSareesCollection && product.category !== 'sarees') return false;
      } else if (sec === 'kids-wear' || sec === 'kidswear') {
        if (!product.isKidswearCollection && product.category !== 'kids-collections') return false;
      } else if (sec === 'new-arrivals') {
        if (!product.isNewArrival) return false;
      } else if (sec === 'best-sellers') {
        if (!product.isBestseller && !product.isFeatured) return false;
      }
    }

    // Handstock Filter
    if (filters.handstockOnly && !product.isHandstock) {
      return false;
    }

    // Category Filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Feeding Type Filter
    if (filters.feedingType === 'Feeding') {
      const supportsFeeding =
        product.feedingConfig === 'feeding-only' ||
        (product.feedingConfig === 'both' && product.supportedClothingTypes.includes('Feeding'));
      if (!supportsFeeding) return false;
    } else if (filters.feedingType === 'Non-Feeding') {
      const supportsNonFeeding =
        product.feedingConfig === 'none' ||
        (product.feedingConfig === 'both' && product.supportedClothingTypes.includes('Non-Feeding'));
      if (!supportsNonFeeding) return false;
    }

    // Sizes Filter: Product must have an in-stock variant in at least one of the selected sizes
    if (filters.sizes.length > 0) {
      const hasMatchingInStockSize = product.variants.some((v) => {
        if (!v.inStock || v.stock <= 0) return false;
        if (!filters.sizes.includes(v.size)) return false;
        // Also check if variant matches the feeding type filter
        if (filters.feedingType === 'Feeding' && v.clothingType === 'Non-Feeding') return false;
        if (filters.feedingType === 'Non-Feeding' && v.clothingType === 'Feeding') return false;
        return true;
      });
      if (!hasMatchingInStockSize) return false;
    }

    // Colors Filter: Product must have an in-stock variant in at least one of the selected colors
    if (filters.colors.length > 0) {
      const hasMatchingColor = product.variants.some((v) => {
        if (!v.inStock || v.stock <= 0) return false;
        if (!filters.colors.includes(v.color.id)) return false;
        if (filters.feedingType === 'Feeding' && v.clothingType === 'Non-Feeding') return false;
        if (filters.feedingType === 'Non-Feeding' && v.clothingType === 'Feeding') return false;
        return true;
      });
      if (!hasMatchingColor) return false;
    }

    // Fabric Filter
    if (filters.fabrics.length > 0) {
      if (!product.fabric || !filters.fabrics.includes(product.fabric)) {
        return false;
      }
    }

    // Price Range Filter
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    return true;
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest': {
        const aScore = a.isNewArrival ? 1 : 0;
        const bScore = b.isNewArrival ? 1 : 0;
        return bScore - aScore;
      }
      case 'bestseller': {
        const aScore = (a.isFeatured ? 4 : 0) + (a.isHandstock ? 2 : 0) + (a.isNewArrival ? 1 : 0);
        const bScore = (b.isFeatured ? 4 : 0) + (b.isHandstock ? 2 : 0) + (b.isNewArrival ? 1 : 0);
        return bScore - aScore;
      }
      case 'featured':
      default: {
        const aScore = (a.isFeatured ? 2 : 0) + (a.isNewArrival ? 1 : 0);
        const bScore = (b.isFeatured ? 2 : 0) + (b.isNewArrival ? 1 : 0);
        return bScore - aScore;
      }
    }
  });

  return sorted;
}

