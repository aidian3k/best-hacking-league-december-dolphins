import { DigitalProductPassport } from '@/types/digitalProductPassport';

export interface EcoScoreWeights {
  carbonFootprint: number;
  recycledContent: number;
  recyclability: number;
  hazardousSubstances: number;
  repairability: number;
  certifications: number;
  durability: number;
  naturalMaterials: number;
}

export const DEFAULT_WEIGHTS: EcoScoreWeights = {
  carbonFootprint: 1.0,
  recycledContent: 1.2,
  recyclability: 1.3,
  hazardousSubstances: 1.5,
  repairability: 0.8,
  certifications: 0.7,
  durability: 0.6,
  naturalMaterials: 1.1,
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
  materialComposition: Array<{ material: string; certifications: string[]; percentage: number }>
): number {
  let score = 0;
  
  // Calculate actual recycled content from material names
  let actualRecycledPercentage = 0;
  materialComposition.forEach(m => {
    const materialLower = m.material.toLowerCase();
    const isRecycled = m.certifications.some(c => {
      const certLower = c.toLowerCase();
      return certLower.includes('recycled') ||
             certLower.includes('rpet') ||
             certLower.includes('grs');
    }) || materialLower.includes('recykling') ||
         materialLower.includes('recycled');

    if (isRecycled) {
      actualRecycledPercentage += m.percentage;
    }
  });

  // Use the higher value between declared and calculated
  const effectiveRecycledPercentage = Math.max(recycledContentPercentage, actualRecycledPercentage);

  if (effectiveRecycledPercentage >= 80) score += 15;
  else if (effectiveRecycledPercentage >= 60) score += 12;
  else if (effectiveRecycledPercentage >= 40) score += 8;
  else if (effectiveRecycledPercentage >= 20) score += 4;
  else if (effectiveRecycledPercentage > 0) score += 2;
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

/**
 * Checks if a material is natural based on its name (supports both Polish and English)
 */
function isNaturalMaterial(materialName: string): boolean {
  const lowerName = materialName.toLowerCase();

  // Natural materials in English and Polish
  const naturalKeywords = [
    'cotton', 'bawełn',  // Cotton
    'wool', 'wełn',       // Wool
    'silk', 'jedwab',     // Silk
    'linen', 'len',       // Linen
    'hemp', 'konop',      // Hemp
    'bamboo', 'bambus',   // Bamboo
    'alpaca', 'alpaka',   // Alpaca
    'merino',             // Merino
    'leather', 'skór',    // Leather (animal-based, considered natural)
    'cashmere', 'kaszmir', // Cashmere
    'tencel', 'lyocell',  // Tencel/Lyocell (wood-based)
    'viscose', 'wiskoz',  // Viscose (wood-based)
    'modal',              // Modal (wood-based)
    'rayon',              // Rayon (wood-based)
    'jute', 'juta',       // Jute
    'ramie',              // Ramie
  ];

  // Synthetic materials that should NOT be considered natural
  const syntheticKeywords = [
    'polyester', 'poliester',
    'nylon', 'poliamid',
    'elastan', 'spandex', 'lycra',
    'acrylic', 'akryl',
    'polypropylene', 'polipropylen',
  ];

  // Check if it's synthetic first
  for (const keyword of syntheticKeywords) {
    if (lowerName.includes(keyword)) {
      return false;
    }
  }

  // Check if it's natural
  for (const keyword of naturalKeywords) {
    if (lowerName.includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate score based on natural material content
 * Higher percentage of natural materials = better score
 */
function calculateNaturalMaterialsScore(
  materialComposition: Array<{ material: string; percentage: number; certifications: string[] }>
): number {
  let naturalPercentage = 0;
  let organicPercentage = 0;

  materialComposition.forEach(m => {
    if (isNaturalMaterial(m.material)) {
      naturalPercentage += m.percentage;

      // Extra bonus for organic/certified natural materials
      const hasOrganicCert = m.certifications.some(c => {
        const certLower = c.toLowerCase();
        return certLower.includes('organic') ||
               certLower.includes('gots') ||
               certLower.includes('organiczn');
      }) || m.material.toLowerCase().includes('organiczn') ||
           m.material.toLowerCase().includes('organic');

      if (hasOrganicCert) {
        organicPercentage += m.percentage;
      }
    }
  });

  let score = 0;

  // Base score from natural materials
  if (naturalPercentage >= 95) score += 15;
  else if (naturalPercentage >= 80) score += 12;
  else if (naturalPercentage >= 60) score += 8;
  else if (naturalPercentage >= 40) score += 4;
  else if (naturalPercentage >= 20) score += 1;
  else if (naturalPercentage < 10) score -= 8;

  // Bonus for organic materials
  if (organicPercentage >= 50) score += 5;
  else if (organicPercentage >= 30) score += 3;
  else if (organicPercentage >= 10) score += 1;

  return score;
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
  // Start from 50 (neutral product), then add/subtract points based on characteristics
  // This ensures products need to earn their score
  let score = 50;

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
  
  const naturalMaterialsScore = calculateNaturalMaterialsScore(
    passport.materialComposition
  );
  score += naturalMaterialsScore * weights.naturalMaterials;

  const hasCertifications = passport.materialComposition.some(m => m.certifications.length > 0);
  if (hasCertifications) {
    score += 10 * weights.certifications;
  }
  
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Debug logging
  console.log('📊 Eco Score Breakdown for', passport.product.name, {
    baseScore: 50,
    carbonScore: carbonScore * weights.carbonFootprint,
    recycledScore: recycledScore * weights.recycledContent,
    recyclabilityScore: recyclabilityScore * weights.recyclability,
    synergyBonus: synergyBonus,
    hazardousSubstances: passport.environmentalImpact.hazardousSubstances.length > 0 ? -20 * weights.hazardousSubstances : 0,
    repairabilityScore: repairabilityScore * weights.repairability,
    durabilityScore: durabilityScore * weights.durability,
    naturalMaterialsScore: naturalMaterialsScore * weights.naturalMaterials,
    certificationsBonus: hasCertifications ? 10 * weights.certifications : 0,
    rawTotal: score,
    finalScore: finalScore
  });

  return finalScore;
}

