export interface BackendProduct {
  id: string;
  productInformation: {
    gtin: string;
    productName: string;
    category: string;
    brand: string;
    model: string;
  };
  materialCompositions: Array<{
    materialName: string;
    compositionPercentage: number;
    certifications: string[];
  }>;
  productEnvironmentImpact: {
    carbonFootprintKgCO2e: number;
    waterUsageLiters: number;
    energyKwh: number;
    recycledContentPercentage: number;
    hazardousSubstances: string[];
  };
  manufacturing: {
    producer: {
      producerName: string;
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
    expectedLifetimeCycles: number;
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
      certificate: string | null;
    }>;
  };
  metadata: {
    passportCreated: string;
    passportLastUpdated: string;
    dataOwner: string;
  };
  image: number[] | null;
}

export interface BackendWardrobeItemsDTO {
  products: BackendProduct[];
}

