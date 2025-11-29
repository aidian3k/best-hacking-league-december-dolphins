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

// Funkcja do pobrania paszportu po ID
export function getPassportById(id: string): DigitalProductPassport | null {
  return mockPassports[id] || null;
}

