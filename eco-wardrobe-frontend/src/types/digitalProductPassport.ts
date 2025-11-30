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

export function convertBackendProductToDPP(backendProduct: any): DigitalProductPassport {
  return {
    version: '1.0',
    product: {
      productId: backendProduct.id,
      gtin: backendProduct.productInformation?.gtin || '',
      name: backendProduct.productInformation?.productName || '',
      category: backendProduct.productInformation?.category || '',
      brand: backendProduct.productInformation?.brand || '',
      model: backendProduct.productInformation?.model || '',
    },
    materialComposition: (backendProduct.materialCompositions || []).map((mc: any) => ({
      material: mc.materialName || '',
      percentage: mc.compositionPercentage || 0,
      certifications: mc.certifications || [],
    })),
    environmentalImpact: {
      carbonFootprint_kgCO2e: backendProduct.productEnvironmentImpact?.carbonFootprintKgCO2e || 0,
      waterUsage_liters: backendProduct.productEnvironmentImpact?.waterUsageLiters || 0,
      energy_kWh: backendProduct.productEnvironmentImpact?.energyKwh || 0,
      recycledContentPercentage: backendProduct.productEnvironmentImpact?.recycledContentPercentage || 0,
      hazardousSubstances: backendProduct.productEnvironmentImpact?.hazardousSubstances || [],
    },
    manufacturing: {
      producer: {
        name: backendProduct.manufacturing?.producer?.producerName || '',
        address: backendProduct.manufacturing?.producer?.address || '',
        contact: backendProduct.manufacturing?.producer?.contact || '',
      },
      productionSites: (backendProduct.manufacturing?.productionSites || []).map((ps: any) => ({
        country: ps.country || '',
        facilityId: ps.facilityId || '',
        processes: ps.processes || [],
      })),
      manufacturingDate: backendProduct.manufacturing?.manufacturingDate || '',
    },
    durabilityAndCare: {
      expectedLifetime_cycles: backendProduct.durabilityAndCare?.expectedLifetimeCycles || 0,
      washInstructions: backendProduct.durabilityAndCare?.washInstructions || '',
      repairability: {
        repairDifficulty: backendProduct.durabilityAndCare?.repairability?.repairDifficulty || 'medium',
        sparePartsAvailable: backendProduct.durabilityAndCare?.repairability?.sparePartsAvailable || false,
        repairGuidesURL: backendProduct.durabilityAndCare?.repairability?.repairGuidesURL || '',
      },
    },
    endOfLife: {
      recyclabilityPercentage: backendProduct.endOfLife?.recyclabilityPercentage || 0,
      disassemblyInstructionsURL: backendProduct.endOfLife?.disassemblyInstructionsURL || '',
      takeBackPrograms: (backendProduct.endOfLife?.takeBackPrograms || []).map((tbp: any) => ({
        programName: tbp.programName || '',
        url: tbp.url || '',
      })),
    },
    supplyChainTraceability: {
      chain: (backendProduct.supplyChainTraceability?.chain || []).map((scs: any) => ({
        stage: scs.stage || '',
        supplier: scs.supplier || '',
        country: scs.country || '',
        certificate: scs.certificate || undefined,
      })),
    },
    metadata: {
      passportCreated: backendProduct.metadata?.passportCreated || '',
      passportLastUpdated: backendProduct.metadata?.passportLastUpdated || '',
      dataOwner: backendProduct.metadata?.dataOwner || '',
    },
  };
}

import { calculateProductEcoScore } from '@/services/ecoScore';

export function convertDPPtoProduct(dpp: DigitalProductPassport | { productPassport: DigitalProductPassport }): any {
  const passport = 'productPassport' in dpp ? dpp.productPassport : dpp;
  
  const ecoScore = calculateProductEcoScore(passport);

  const materials = passport.materialComposition.map(m => ({
    name: m.material,
    percentage: m.percentage,
    isNatural: ['Cotton', 'Wool', 'Silk', 'Linen', 'Hemp', 'Bamboo', 'Alpaca'].includes(m.material),
    isRecycled: m.certifications.some(c => c.toLowerCase().includes('recycled'))
  }));

  const recyclability =
    passport.endOfLife.recyclabilityPercentage >= 80 ? 'full' :
    passport.endOfLife.recyclabilityPercentage >= 40 ? 'partial' : 'none';

  const repairable = passport.durabilityAndCare.repairability.repairDifficulty !== 'high';

  const environmentalImpact = Math.min(10, Math.max(1,
    Math.round(passport.environmentalImpact.carbonFootprint_kgCO2e / 2)
  ));

  return {
    passport,
    product: {
      id: passport.product.productId,
      name: passport.product.name,
      brand: passport.product.brand,
      category: mapCategory(passport.product.category),
      imageUrl: '',
      materials,
      ecoScore,
      ecoRating: getEcoRating(ecoScore),
      durability: passport.durabilityAndCare.expectedLifetime_cycles,
      environmentalImpact,
      recyclability,
      repairable,
      secondHand: false,
      careInstructions: [passport.durabilityAndCare.washInstructions],
      facts: generateFacts(passport),
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

