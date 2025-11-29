import { DigitalProductPassport } from '@/types/digitalProductPassport';

// Mock Digital Product Passports dla różnych produktów
export const mockPassports: Record<string, DigitalProductPassport> = {
  '123456789': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:123456789",
        gtin: "5901234123457",
        name: "Koszulka bawełniana Basic",
        category: "Textiles > T-shirts",
        brand: "EcoWear",
        model: "Basic 01"
      },
      materialComposition: [
        {
          material: "Cotton",
          percentage: 95,
          certifications: ["GOTS", "Organic 100"]
        },
        {
          material: "Elastane",
          percentage: 5,
          certifications: []
        }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 2.4,
        waterUsage_liters: 1200,
        energy_kWh: 1.1,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: {
          name: "EcoWear Manufacturing Ltd.",
          address: "Via Industria 12, Milano, Italy",
          contact: "info@ecowear.com"
        },
        productionSites: [
          {
            country: "Italy",
            facilityId: "ECW-IT-001",
            processes: ["cutting", "sewing"]
          },
          {
            country: "Turkey",
            facilityId: "ECW-TR-007",
            processes: ["fabric weaving", "dyeing"]
          }
        ],
        manufacturingDate: "2025-02-10"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 50,
        washInstructions: "30°C, delikatne pranie",
        repairability: {
          repairDifficulty: "low",
          sparePartsAvailable: true,
          repairGuidesURL: "https://ecowear.com/repair/basic01"
        }
      },
      endOfLife: {
        recyclabilityPercentage: 90,
        disassemblyInstructionsURL: "https://ecowear.com/disassembly/basic01",
        takeBackPrograms: [
          {
            programName: "EcoWear Return",
            url: "https://ecowear.com/return"
          }
        ]
      },
      supplyChainTraceability: {
        chain: [
          {
            stage: "Raw material",
            supplier: "Organic Cotton Farms Co.",
            country: "Turkey",
            certificate: "GOTS-2025-44321"
          },
          {
            stage: "Fabric production",
            supplier: "TextileWeave Mills",
            country: "Turkey"
          },
          {
            stage: "Garment assembly",
            supplier: "EcoWear Manufacturing Ltd.",
            country: "Italy"
          }
        ]
      },
      metadata: {
        passportCreated: "2025-03-01T10:00:00Z",
        passportLastUpdated: "2025-03-01T10:00:00Z",
        dataOwner: "EcoWear"
      }
    }
  },
  'bad-product': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:987654321",
        gtin: "5901234999999",
        name: "Koszulka Syntetyczna Fast Fashion",
        category: "Textiles > T-shirts",
        brand: "FastWear",
        model: "Cheap 99"
      },
      materialComposition: [
        {
          material: "Polyester",
          percentage: 100,
          certifications: []
        }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 12.5,
        waterUsage_liters: 5000,
        energy_kWh: 8.3,
        recycledContentPercentage: 0,
        hazardousSubstances: ["Formaldehyde", "Azo dyes"]
      },
      manufacturing: {
        producer: {
          name: "FastWear Factory Co.",
          address: "Unknown location, Bangladesh",
          contact: "unknown@fastwear.com"
        },
        productionSites: [
          {
            country: "Bangladesh",
            facilityId: "UNKNOWN",
            processes: ["all"]
          }
        ],
        manufacturingDate: "2024-11-15"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 15,
        washInstructions: "40°C, nie prasować",
        repairability: {
          repairDifficulty: "high",
          sparePartsAvailable: false,
          repairGuidesURL: ""
        }
      },
      endOfLife: {
        recyclabilityPercentage: 10,
        disassemblyInstructionsURL: "",
        takeBackPrograms: []
      },
      supplyChainTraceability: {
        chain: [
          {
            stage: "Production",
            supplier: "Unknown Factory",
            country: "Bangladesh"
          }
        ]
      },
      metadata: {
        passportCreated: "2024-11-15T10:00:00Z",
        passportLastUpdated: "2024-11-15T10:00:00Z",
        dataOwner: "FastWear"
      }
    }
  }
};

export function getPassportById(id: string): DigitalProductPassport | null {
  return mockPassports[id] || null;
}

export const influencerProducts: Record<string, string[]> = {
  '11111111-1111-4111-8111-111111111111': ['123456789', 'user1-product-1', 'user1-product-2', 'user1-product-3'],
  '22222222-2222-4222-8222-222222222222': ['user2-product-1', 'user2-product-2', '123456789'],
  '33333333-3333-4333-8333-333333333333': ['user3-product-1', 'user3-product-2', 'user3-product-3', 'user3-product-4'],
  '44444444-4444-4444-8444-444444444444': ['bad-product', 'user4-product-1', 'user4-product-2', 'user4-product-3', 'user4-product-4'],
  '550e8400-e29b-41d4-a716-446655440000': ['123456789', 'user1-product-1', 'user1-product-2', 'user1-product-3'],
};

const additionalPassports: Record<string, DigitalProductPassport> = {
  'user1-product-1': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user1-001",
        gtin: "5901234111111",
        name: "Bluza z wełny merino",
        category: "Textiles > Hoodies",
        brand: "NatureFiber",
        model: "Merino Pro"
      },
      materialComposition: [
        { material: "Wool", percentage: 70, certifications: ["RWS"] },
        { material: "Cotton", percentage: 30, certifications: ["GOTS"] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.8,
        waterUsage_liters: 800,
        energy_kWh: 0.9,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "NatureFiber Ltd.", address: "Oslo, Norway", contact: "info@naturefiber.com" },
        productionSites: [{ country: "Norway", facilityId: "NF-NO-001", processes: ["knitting", "assembly"] }],
        manufacturingDate: "2024-12-01"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 60,
        washInstructions: "30°C, ręczne pranie",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://naturefiber.com/repair" }
      },
      endOfLife: { recyclabilityPercentage: 95, disassemblyInstructionsURL: "https://naturefiber.com/disassembly", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Raw material", supplier: "Merino Farms", country: "New Zealand", certificate: "RWS-2024-001" }]
      },
      metadata: { passportCreated: "2024-12-01T10:00:00Z", passportLastUpdated: "2024-12-01T10:00:00Z", dataOwner: "NatureFiber" }
    }
  },
  'user1-product-2': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user1-002",
        gtin: "5901234111112",
        name: "Spodnie z konopi",
        category: "Textiles > Pants",
        brand: "HempHeaven",
        model: "Cargo Hemp"
      },
      materialComposition: [
        { material: "Hemp", percentage: 55, certifications: ["Organic"] },
        { material: "Cotton", percentage: 45, certifications: ["GOTS"] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.2,
        waterUsage_liters: 600,
        energy_kWh: 0.7,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "HempHeaven Co.", address: "Warsaw, Poland", contact: "info@hempheaven.com" },
        productionSites: [{ country: "Poland", facilityId: "HH-PL-001", processes: ["weaving", "cutting", "sewing"] }],
        manufacturingDate: "2024-11-15"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 72,
        washInstructions: "30°C, bez zmiękczacza",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://hempheaven.com/repair" }
      },
      endOfLife: { recyclabilityPercentage: 100, disassemblyInstructionsURL: "https://hempheaven.com/disassembly", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Raw material", supplier: "Hemp Farms", country: "Poland" }]
      },
      metadata: { passportCreated: "2024-11-15T10:00:00Z", passportLastUpdated: "2024-11-15T10:00:00Z", dataOwner: "HempHeaven" }
    }
  },
  'user1-product-3': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user1-003",
        gtin: "5901234111113",
        name: "Skarpety z bambusa",
        category: "Textiles > Socks",
        brand: "BambooBasics",
        model: "Comfort Bamboo"
      },
      materialComposition: [
        { material: "Bamboo", percentage: 80, certifications: [] },
        { material: "Elastane", percentage: 15, certifications: [] },
        { material: "Polyamide", percentage: 5, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.5,
        waterUsage_liters: 400,
        energy_kWh: 0.5,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "BambooBasics Ltd.", address: "Berlin, Germany", contact: "info@bamboobasics.com" },
        productionSites: [{ country: "Germany", facilityId: "BB-DE-001", processes: ["knitting"] }],
        manufacturingDate: "2024-10-20"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 18,
        washInstructions: "40°C, można suszyć w suszarce",
        repairability: { repairDifficulty: "high", sparePartsAvailable: false, repairGuidesURL: "" }
      },
      endOfLife: { recyclabilityPercentage: 50, disassemblyInstructionsURL: "", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Raw material", supplier: "Bamboo Plantations", country: "China" }]
      },
      metadata: { passportCreated: "2024-10-20T10:00:00Z", passportLastUpdated: "2024-10-20T10:00:00Z", dataOwner: "BambooBasics" }
    }
  },
  'user2-product-1': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user2-001",
        gtin: "5901234222221",
        name: "Koszulka z bawełny z recyklingu",
        category: "Textiles > T-shirts",
        brand: "GreenStitch",
        model: "Recycled Tee"
      },
      materialComposition: [
        { material: "Cotton", percentage: 80, certifications: ["Recycled", "GOTS"] },
        { material: "Polyester", percentage: 18, certifications: ["Recycled"] },
        { material: "Elastane", percentage: 2, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 2.0,
        waterUsage_liters: 500,
        energy_kWh: 0.8,
        recycledContentPercentage: 98,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "GreenStitch Manufacturing", address: "Amsterdam, Netherlands", contact: "info@greenstitch.com" },
        productionSites: [{ country: "Netherlands", facilityId: "GS-NL-001", processes: ["recycling", "spinning", "knitting"] }],
        manufacturingDate: "2024-12-10"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 48,
        washInstructions: "40°C, prać na lewą stronę",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://greenstitch.com/repair" }
      },
      endOfLife: { recyclabilityPercentage: 85, disassemblyInstructionsURL: "https://greenstitch.com/disassembly", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Recycling", supplier: "Textile Recycling Co.", country: "Netherlands" }]
      },
      metadata: { passportCreated: "2024-12-10T10:00:00Z", passportLastUpdated: "2024-12-10T10:00:00Z", dataOwner: "GreenStitch" }
    }
  },
  'user2-product-2': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user2-002",
        gtin: "5901234222222",
        name: "Spodnie dżinsowe z recyklingu",
        category: "Textiles > Pants",
        brand: "GreenStitch",
        model: "Recycled Denim"
      },
      materialComposition: [
        { material: "Cotton", percentage: 80, certifications: ["Recycled"] },
        { material: "Polyester", percentage: 18, certifications: ["Recycled"] },
        { material: "Elastane", percentage: 2, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 2.5,
        waterUsage_liters: 800,
        energy_kWh: 1.0,
        recycledContentPercentage: 98,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "GreenStitch Manufacturing", address: "Amsterdam, Netherlands", contact: "info@greenstitch.com" },
        productionSites: [{ country: "Netherlands", facilityId: "GS-NL-001", processes: ["recycling", "dyeing", "cutting", "sewing"] }],
        manufacturingDate: "2024-11-20"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 48,
        washInstructions: "40°C, prać na lewą stronę, nie suszyć w suszarce",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://greenstitch.com/repair" }
      },
      endOfLife: { recyclabilityPercentage: 80, disassemblyInstructionsURL: "https://greenstitch.com/disassembly", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Recycling", supplier: "Textile Recycling Co.", country: "Netherlands" }]
      },
      metadata: { passportCreated: "2024-11-20T10:00:00Z", passportLastUpdated: "2024-11-20T10:00:00Z", dataOwner: "GreenStitch" }
    }
  },
  'user3-product-1': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user3-001",
        gtin: "5901234333331",
        name: "Koszulka organiczna Premium",
        category: "Textiles > T-shirts",
        brand: "EcoWear",
        model: "Premium Organic"
      },
      materialComposition: [
        { material: "Cotton", percentage: 100, certifications: ["GOTS", "Organic 100", "Fair Trade"] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.5,
        waterUsage_liters: 900,
        energy_kWh: 0.6,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "EcoWear Premium", address: "Milan, Italy", contact: "premium@ecowear.com" },
        productionSites: [{ country: "Italy", facilityId: "ECW-IT-PREMIUM", processes: ["cutting", "sewing"] }],
        manufacturingDate: "2024-12-15"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 55,
        washInstructions: "30°C, delikatne pranie, nie używać wybielacza",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://ecowear.com/repair/premium" }
      },
      endOfLife: { recyclabilityPercentage: 100, disassemblyInstructionsURL: "https://ecowear.com/disassembly/premium", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [
          { stage: "Raw material", supplier: "Organic Cotton Farms", country: "Italy", certificate: "GOTS-2024-001" },
          { stage: "Fabric production", supplier: "EcoWear Textiles", country: "Italy" }
        ]
      },
      metadata: { passportCreated: "2024-12-15T10:00:00Z", passportLastUpdated: "2024-12-15T10:00:00Z", dataOwner: "EcoWear" }
    }
  },
  'user3-product-2': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user3-002",
        gtin: "5901234333332",
        name: "Bluza z wełny alpaki",
        category: "Textiles > Hoodies",
        brand: "NatureFiber",
        model: "Alpaca Luxury"
      },
      materialComposition: [
        { material: "Alpaca", percentage: 85, certifications: ["RWS"] },
        { material: "Cotton", percentage: 15, certifications: ["GOTS"] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.2,
        waterUsage_liters: 700,
        energy_kWh: 0.5,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "NatureFiber Luxury", address: "Lima, Peru", contact: "luxury@naturefiber.com" },
        productionSites: [{ country: "Peru", facilityId: "NF-PE-LUX", processes: ["spinning", "knitting", "assembly"] }],
        manufacturingDate: "2024-11-25"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 70,
        washInstructions: "Ręczne pranie, suszyć na płasko",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://naturefiber.com/repair/luxury" }
      },
      endOfLife: { recyclabilityPercentage: 98, disassemblyInstructionsURL: "https://naturefiber.com/disassembly/luxury", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Raw material", supplier: "Alpaca Farms", country: "Peru", certificate: "RWS-2024-LUX" }]
      },
      metadata: { passportCreated: "2024-11-25T10:00:00Z", passportLastUpdated: "2024-11-25T10:00:00Z", dataOwner: "NatureFiber" }
    }
  },
  'user3-product-3': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user3-003",
        gtin: "5901234333333",
        name: "Spodnie z lnu",
        category: "Textiles > Pants",
        brand: "LinenCraft",
        model: "Linen Classic"
      },
      materialComposition: [
        { material: "Linen", percentage: 100, certifications: ["Organic", "GOTS"] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.0,
        waterUsage_liters: 500,
        energy_kWh: 0.4,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "LinenCraft", address: "Brussels, Belgium", contact: "info@linencraft.com" },
        productionSites: [{ country: "Belgium", facilityId: "LC-BE-001", processes: ["weaving", "cutting", "sewing"] }],
        manufacturingDate: "2024-10-30"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 65,
        washInstructions: "30°C, delikatne pranie",
        repairability: { repairDifficulty: "low", sparePartsAvailable: true, repairGuidesURL: "https://linencraft.com/repair" }
      },
      endOfLife: { recyclabilityPercentage: 100, disassemblyInstructionsURL: "https://linencraft.com/disassembly", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Raw material", supplier: "Linen Farms", country: "Belgium", certificate: "GOTS-2024-LINEN" }]
      },
      metadata: { passportCreated: "2024-10-30T10:00:00Z", passportLastUpdated: "2024-10-30T10:00:00Z", dataOwner: "LinenCraft" }
    }
  },
  'user3-product-4': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user3-004",
        gtin: "5901234333334",
        name: "Skarpety z wełny merino",
        category: "Textiles > Socks",
        brand: "NatureFiber",
        model: "Merino Socks"
      },
      materialComposition: [
        { material: "Wool", percentage: 75, certifications: ["RWS"] },
        { material: "Cotton", percentage: 20, certifications: ["GOTS"] },
        { material: "Elastane", percentage: 5, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 1.3,
        waterUsage_liters: 350,
        energy_kWh: 0.4,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "NatureFiber", address: "Oslo, Norway", contact: "info@naturefiber.com" },
        productionSites: [{ country: "Norway", facilityId: "NF-NO-002", processes: ["knitting"] }],
        manufacturingDate: "2024-12-05"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 25,
        washInstructions: "30°C, delikatne pranie",
        repairability: { repairDifficulty: "medium", sparePartsAvailable: false, repairGuidesURL: "" }
      },
      endOfLife: { recyclabilityPercentage: 90, disassemblyInstructionsURL: "", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Raw material", supplier: "Merino Farms", country: "New Zealand", certificate: "RWS-2024-002" }]
      },
      metadata: { passportCreated: "2024-12-05T10:00:00Z", passportLastUpdated: "2024-12-05T10:00:00Z", dataOwner: "NatureFiber" }
    }
  },
  'user4-product-1': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user4-001",
        gtin: "5901234444441",
        name: "Koszulka mieszana",
        category: "Textiles > T-shirts",
        brand: "MixedWear",
        model: "Basic Mix"
      },
      materialComposition: [
        { material: "Cotton", percentage: 60, certifications: [] },
        { material: "Polyester", percentage: 35, certifications: [] },
        { material: "Elastane", percentage: 5, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 4.5,
        waterUsage_liters: 2000,
        energy_kWh: 2.0,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "MixedWear Co.", address: "Unknown", contact: "info@mixedwear.com" },
        productionSites: [{ country: "China", facilityId: "MW-CN-001", processes: ["all"] }],
        manufacturingDate: "2024-09-10"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 30,
        washInstructions: "40°C",
        repairability: { repairDifficulty: "medium", sparePartsAvailable: false, repairGuidesURL: "" }
      },
      endOfLife: { recyclabilityPercentage: 40, disassemblyInstructionsURL: "", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Production", supplier: "MixedWear Factory", country: "China" }]
      },
      metadata: { passportCreated: "2024-09-10T10:00:00Z", passportLastUpdated: "2024-09-10T10:00:00Z", dataOwner: "MixedWear" }
    }
  },
  'user4-product-2': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user4-002",
        gtin: "5901234444442",
        name: "Bluza polarowa",
        category: "Textiles > Hoodies",
        brand: "SportMax",
        model: "Fleece Pro"
      },
      materialComposition: [
        { material: "Polyester", percentage: 100, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 8.0,
        waterUsage_liters: 3000,
        energy_kWh: 4.5,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "SportMax Factory", address: "Unknown", contact: "info@sportmax.com" },
        productionSites: [{ country: "Bangladesh", facilityId: "SM-BD-001", processes: ["all"] }],
        manufacturingDate: "2024-08-20"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 24,
        washInstructions: "30°C, nie prasować",
        repairability: { repairDifficulty: "high", sparePartsAvailable: false, repairGuidesURL: "" }
      },
      endOfLife: { recyclabilityPercentage: 20, disassemblyInstructionsURL: "", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Production", supplier: "SportMax Factory", country: "Bangladesh" }]
      },
      metadata: { passportCreated: "2024-08-20T10:00:00Z", passportLastUpdated: "2024-08-20T10:00:00Z", dataOwner: "SportMax" }
    }
  },
  'user4-product-3': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user4-003",
        gtin: "5901234444443",
        name: "Spodnie chino",
        category: "Textiles > Pants",
        brand: "QuickWear",
        model: "Chino Basic"
      },
      materialComposition: [
        { material: "Cotton", percentage: 50, certifications: [] },
        { material: "Polyester", percentage: 45, certifications: [] },
        { material: "Elastane", percentage: 5, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 5.5,
        waterUsage_liters: 2500,
        energy_kWh: 2.5,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "QuickWear Manufacturing", address: "Unknown", contact: "info@quickwear.com" },
        productionSites: [{ country: "Vietnam", facilityId: "QW-VN-001", processes: ["all"] }],
        manufacturingDate: "2024-07-15"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 36,
        washInstructions: "40°C",
        repairability: { repairDifficulty: "medium", sparePartsAvailable: false, repairGuidesURL: "" }
      },
      endOfLife: { recyclabilityPercentage: 30, disassemblyInstructionsURL: "", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Production", supplier: "QuickWear Factory", country: "Vietnam" }]
      },
      metadata: { passportCreated: "2024-07-15T10:00:00Z", passportLastUpdated: "2024-07-15T10:00:00Z", dataOwner: "QuickWear" }
    }
  },
  'user4-product-4': {
    productPassport: {
      version: "1.0",
      product: {
        productId: "urn:eprel:user4-004",
        gtin: "5901234444444",
        name: "Skarpety syntetyczne",
        category: "Textiles > Socks",
        brand: "FastSocks",
        model: "Basic Synthetic"
      },
      materialComposition: [
        { material: "Polyester", percentage: 70, certifications: [] },
        { material: "Polyamide", percentage: 25, certifications: [] },
        { material: "Elastane", percentage: 5, certifications: [] }
      ],
      environmentalImpact: {
        carbonFootprint_kgCO2e: 3.5,
        waterUsage_liters: 1500,
        energy_kWh: 1.8,
        recycledContentPercentage: 0,
        hazardousSubstances: []
      },
      manufacturing: {
        producer: { name: "FastSocks Co.", address: "Unknown", contact: "info@fastsocks.com" },
        productionSites: [{ country: "China", facilityId: "FS-CN-001", processes: ["all"] }],
        manufacturingDate: "2024-06-10"
      },
      durabilityAndCare: {
        expectedLifetime_cycles: 15,
        washInstructions: "40°C",
        repairability: { repairDifficulty: "high", sparePartsAvailable: false, repairGuidesURL: "" }
      },
      endOfLife: { recyclabilityPercentage: 10, disassemblyInstructionsURL: "", takeBackPrograms: [] },
      supplyChainTraceability: {
        chain: [{ stage: "Production", supplier: "FastSocks Factory", country: "China" }]
      },
      metadata: { passportCreated: "2024-06-10T10:00:00Z", passportLastUpdated: "2024-06-10T10:00:00Z", dataOwner: "FastSocks" }
    }
  }
};

Object.assign(mockPassports, additionalPassports);

