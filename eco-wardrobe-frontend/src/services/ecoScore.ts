import { DigitalProductPassport } from '@/types/digitalProductPassport';

export interface EcoScoreWeights {
  carbonFootprint: number;
  recycledContent: number;
  recyclability: number;
  hazardousSubstances: number;
  repairability: number;
  certifications: number;
  durability: number;
}

export const DEFAULT_WEIGHTS: EcoScoreWeights = {
  carbonFootprint: 1.0,
  recycledContent: 1.2,
  recyclability: 1.3,
  hazardousSubstances: 1.5,
  repairability: 0.8,
  certifications: 0.7,
  durability: 0.6,
};

function calculateRecyclabilityScore(recyclabilityPercentage: number): number {
  if (recyclabilityPercentage >= 90) return 15;
  if (recyclabilityPercentage >= 70) return 10;
  if (recyclabilityPercentage >= 50) return 5;
  if (recyclabilityPercentage >= 30) return -5;
  if (recyclabilityPercentage >= 10) return -15;
  return -25;
}

function calculateRecycledContentScore(
  recycledContentPercentage: number,
  materialComposition: Array<{ certifications: string[]; percentage: number }>
): number {
  let score = 0;
  
  if (recycledContentPercentage >= 80) score += 15;
  else if (recycledContentPercentage >= 60) score += 12;
  else if (recycledContentPercentage >= 40) score += 8;
  else if (recycledContentPercentage >= 20) score += 4;
  else if (recycledContentPercentage > 0) score += 2;
  else score -= 10;
  
  const certifiedRecycled = materialComposition.filter(m => 
    m.certifications.some(c => {
      const certLower = c.toLowerCase();
      return certLower.includes('recycled') || 
             certLower.includes('rpet') ||
             certLower.includes('grs');
    })
  );
  
  if (certifiedRecycled.length > 0) {
    const certifiedPercentage = certifiedRecycled.reduce((sum, m) => sum + m.percentage, 0);
    if (certifiedPercentage >= 50) score += 5;
  }
  
  return score;
}

function calculateRecyclingSynergyBonus(
  recyclabilityPercentage: number,
  recycledContentPercentage: number
): number {
  if (recyclabilityPercentage >= 70 && recycledContentPercentage >= 50) {
    return 8;
  }
  if (recyclabilityPercentage >= 50 && recycledContentPercentage >= 30) {
    return 4;
  }
  return 0;
}

function calculateDurabilityScore(expectedLifetimeCycles: number): number {
  if (expectedLifetimeCycles >= 100) return 8;
  if (expectedLifetimeCycles >= 70) return 5;
  if (expectedLifetimeCycles >= 50) return 2;
  if (expectedLifetimeCycles >= 30) return 0;
  if (expectedLifetimeCycles >= 15) return -5;
  return -10;
}

function mapCategory(category: string): string {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('t-shirt') || lowerCategory.includes('koszulka')) return 'koszulki';
  if (lowerCategory.includes('pants') || lowerCategory.includes('spodnie')) return 'spodnie';
  if (lowerCategory.includes('hoodie') || lowerCategory.includes('bluza')) return 'bluzy';
  if (lowerCategory.includes('sock') || lowerCategory.includes('skarpet')) return 'skarpety';
  return 'inne';
}

function calculateCarbonFootprintScore(
  carbonFootprint_kgCO2e: number,
  category: string
): number {
  const categoryThresholds: Record<string, number> = {
    'koszulki': 3.0,
    'skarpety': 2.0,
    'spodnie': 5.0,
    'bluzy': 6.0,
    'inne': 5.0,
  };
  
  const threshold = categoryThresholds[category] || 5.0;
  
  if (carbonFootprint_kgCO2e <= threshold * 0.5) return 10;
  if (carbonFootprint_kgCO2e <= threshold) return 5;
  if (carbonFootprint_kgCO2e <= threshold * 1.5) return 0;
  if (carbonFootprint_kgCO2e <= threshold * 2) return -10;
  if (carbonFootprint_kgCO2e <= threshold * 3) return -20;
  return -30;
}

export function calculateProductEcoScore(
  passport: DigitalProductPassport,
  weights: EcoScoreWeights = DEFAULT_WEIGHTS
): number {
  let score = 100;
  
  const category = mapCategory(passport.product.category);
  
  const carbonScore = calculateCarbonFootprintScore(
    passport.environmentalImpact.carbonFootprint_kgCO2e,
    category
  );
  score += carbonScore * weights.carbonFootprint;
  
  const recycledScore = calculateRecycledContentScore(
    passport.environmentalImpact.recycledContentPercentage,
    passport.materialComposition
  );
  score += recycledScore * weights.recycledContent;
  
  const recyclabilityScore = calculateRecyclabilityScore(
    passport.endOfLife.recyclabilityPercentage
  );
  score += recyclabilityScore * weights.recyclability;
  
  const synergyBonus = calculateRecyclingSynergyBonus(
    passport.endOfLife.recyclabilityPercentage,
    passport.environmentalImpact.recycledContentPercentage
  );
  score += synergyBonus;
  
  if (passport.environmentalImpact.hazardousSubstances.length > 0) {
    score -= 20 * weights.hazardousSubstances;
  }
  
  const repairabilityScore = passport.durabilityAndCare.repairability.repairDifficulty === 'high' 
    ? -10 
    : passport.durabilityAndCare.repairability.repairDifficulty === 'low' 
      ? 5 
      : 0;
  score += repairabilityScore * weights.repairability;
  
  const durabilityScore = calculateDurabilityScore(
    passport.durabilityAndCare.expectedLifetime_cycles
  );
  score += durabilityScore * weights.durability;
  
  const hasCertifications = passport.materialComposition.some(m => m.certifications.length > 0);
  if (hasCertifications) {
    score += 10 * weights.certifications;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

