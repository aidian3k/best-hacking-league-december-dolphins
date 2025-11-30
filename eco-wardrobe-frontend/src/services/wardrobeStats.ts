import { WardrobeStats, Category, Product } from '@/types/product';

export const emptyWardrobeStats: WardrobeStats = {
  totalItems: 0,
  avgEcoScore: 0,
  ecoProductsPercent: 0,
  naturalMaterialsPercent: 0,
  syntheticMaterialsPercent: 0,
  recyclablePercent: 0,
  repairablePercent: 0,
  avgDurability: 0,
  categoryStats: {} as Record<Category, { count: number; avgEcoScore: number }>,
};

export function calculateWardrobeStats(products: Product[]): WardrobeStats {
  if (products.length === 0) {
    return emptyWardrobeStats;
  }

  const totalItems = products.length;
  const avgEcoScore = Math.round(products.reduce((sum, p) => sum + p.ecoScore, 0) / totalItems);
  const ecoProductsPercent = Math.round((products.filter(p => p.ecoScore >= 60).length / totalItems) * 100);
  
  // Calculate natural vs synthetic materials percentage
  // For each product, calculate its natural percentage, then average across all products
  let totalNaturalPercent = 0;
  products.forEach(p => {
    let productNaturalPercent = 0;
    p.materials.forEach(m => {
      if (m.isNatural) {
        productNaturalPercent += m.percentage;
      }
    });
    totalNaturalPercent += productNaturalPercent;
  });

  const naturalMaterialsPercent = Math.round(totalNaturalPercent / totalItems);
  const syntheticMaterialsPercent = 100 - naturalMaterialsPercent;

  const recyclablePercent = Math.round((products.filter(p => p.recyclability !== 'none').length / totalItems) * 100);
  const repairablePercent = Math.round((products.filter(p => p.repairable).length / totalItems) * 100);
  const avgDurability = Math.round(products.reduce((sum, p) => sum + p.durability, 0) / totalItems);

  const categories: Category[] = ['koszulki', 'bluzy', 'spodnie', 'skarpety', 'inne'];
  const categoryStats = {} as Record<Category, { count: number; avgEcoScore: number }>;
  
  categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat);
    categoryStats[cat] = {
      count: catProducts.length,
      avgEcoScore: catProducts.length > 0 
        ? Math.round(catProducts.reduce((sum, p) => sum + p.ecoScore, 0) / catProducts.length)
        : 0,
    };
  });

  return {
    totalItems,
    avgEcoScore,
    ecoProductsPercent,
    naturalMaterialsPercent,
    syntheticMaterialsPercent,
    recyclablePercent,
    repairablePercent,
    avgDurability,
    categoryStats,
  };
}

