export interface DigitalProductPassport {
  version: string;
  product: {
    productId: string;
    gtin: string;
    name: string;
    category: string;
    brand: string;
    model: string;
  };
  materialComposition: Array<{
    material: string;
    percentage: number;
    certifications: string[];
  }>;
  environmentalImpact: {
    carbonFootprint_kgCO2e: number;
    waterUsage_liters: number;
    energy_kWh: number;
    recycledContentPercentage: number;
    hazardousSubstances: string[];
  };
  manufacturing: {
    producer: {
      name: string;
      address: string;
      contact: string;
    };
    productionSites: Array<{
      country: string;
      facilityId: string;
      processes: string[];
    }>;
    manufacturingDate: string;
  };
  durabilityAndCare: {
    expectedLifetime_cycles: number;
    washInstructions: string;
    repairability: {
      repairDifficulty: string;
      sparePartsAvailable: boolean;
      repairGuidesURL: string;
    };
  };
  endOfLife: {
    recyclabilityPercentage: number;
    disassemblyInstructionsURL: string;
    takeBackPrograms: Array<{
      programName: string;
      url: string;
    }>;
  };
  supplyChainTraceability: {
    chain: Array<{
      stage: string;
      supplier: string;
      country: string;
      certificate?: string;
    }>;
  };
  metadata: {
    passportCreated: string;
    passportLastUpdated: string;
    dataOwner: string;
  };
}

// Funkcja do konwersji Digital Product Passport na Product
export function convertDPPtoProduct(dpp: DigitalProductPassport): any {
  // Obliczanie eco score na podstawie różnych czynników
  let ecoScore = 100;

  // Impact śladu węglowego (maks -30 punktów)
  if (dpp.environmentalImpact.carbonFootprint_kgCO2e > 5) {
    ecoScore -= Math.min(30, (dpp.environmentalImpact.carbonFootprint_kgCO2e - 5) * 5);
  }

  // Recycled content (+10 punktów jeśli > 50%)
  if (dpp.environmentalImpact.recycledContentPercentage > 50) {
    ecoScore += 10;
  } else if (dpp.environmentalImpact.recycledContentPercentage === 0) {
    ecoScore -= 15;
  }

  // Substancje niebezpieczne (-20 punktów)
  if (dpp.environmentalImpact.hazardousSubstances.length > 0) {
    ecoScore -= 20;
  }

  // Recyklowalność
  if (dpp.endOfLife.recyclabilityPercentage < 50) {
    ecoScore -= 20;
  }

  // Naprawialność
  if (dpp.durabilityAndCare.repairability.repairDifficulty === 'high') {
    ecoScore -= 10;
  } else if (dpp.durabilityAndCare.repairability.repairDifficulty === 'low') {
    ecoScore += 5;
  }

  // Certyfikaty materiałów
  const hasCertifications = dpp.materialComposition.some(m => m.certifications.length > 0);
  if (hasCertifications) {
    ecoScore += 10;
  }

  ecoScore = Math.max(0, Math.min(100, ecoScore));

  const materials = dpp.materialComposition.map(m => ({
    name: m.material,
    percentage: m.percentage,
    isNatural: ['Cotton', 'Wool', 'Silk', 'Linen', 'Hemp'].includes(m.material),
    isRecycled: m.certifications.some(c => c.toLowerCase().includes('recycled'))
  }));

  const recyclability =
    dpp.endOfLife.recyclabilityPercentage >= 80 ? 'full' :
    dpp.endOfLife.recyclabilityPercentage >= 40 ? 'partial' : 'none';

  const repairable = dpp.durabilityAndCare.repairability.repairDifficulty !== 'high';

  // Environmental impact score (1-10, lower is better)
  const environmentalImpact = Math.min(10, Math.max(1,
    Math.round(dpp.environmentalImpact.carbonFootprint_kgCO2e / 2)
  ));

  return {
    passport: dpp,
    product: {
      id: dpp.product.productId,
      name: dpp.product.name,
      brand: dpp.product.brand,
      category: mapCategory(dpp.product.category),
      imageUrl: '', // Brak zdjęcia - użytkownik może dodać własne
      materials,
      ecoScore,
      ecoRating: getEcoRating(ecoScore),
      durability: dpp.durabilityAndCare.expectedLifetime_cycles,
      environmentalImpact,
      recyclability,
      repairable,
      secondHand: false,
      careInstructions: [dpp.durabilityAndCare.washInstructions],
      facts: generateFacts(dpp),
      addedAt: new Date()
    }
  };
}

function mapCategory(category: string): string {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('t-shirt') || lowerCategory.includes('koszulka')) return 'koszulki';
  if (lowerCategory.includes('pants') || lowerCategory.includes('spodnie')) return 'spodnie';
  if (lowerCategory.includes('hoodie') || lowerCategory.includes('bluza')) return 'bluzy';
  if (lowerCategory.includes('sock') || lowerCategory.includes('skarpet')) return 'skarpety';
  return 'inne';
}

function getEcoRating(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'poor';
  return 'bad';
}

function generateFacts(passport: any): string[] {
  const facts: string[] = [];

  const env = passport.environmentalImpact;
  facts.push(`Ślad węglowy: ${env.carbonFootprint_kgCO2e.toFixed(1)} kg CO₂e`);
  facts.push(`Zużycie wody: ${env.waterUsage_liters} litrów`);
  facts.push(`Zużycie energii: ${env.energy_kWh.toFixed(1)} kWh`);

  if (env.recycledContentPercentage > 0) {
    facts.push(`Zawiera ${env.recycledContentPercentage}% materiałów z recyklingu`);
  }

  if (passport.durabilityAndCare.repairability.sparePartsAvailable) {
    facts.push('Dostępne części zamienne');
  }

  const certifications = passport.materialComposition
    .flatMap((m: any) => m.certifications)
    .filter((c: string, i: number, arr: string[]) => arr.indexOf(c) === i);

  if (certifications.length > 0) {
    facts.push(`Certyfikaty: ${certifications.join(', ')}`);
  }

  facts.push(`Wyprodukowano w: ${passport.manufacturing.productionSites.map((s: any) => s.country).join(', ')}`);

  return facts;
}

