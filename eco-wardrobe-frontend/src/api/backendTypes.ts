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
  image: string | number[] | null; // Backend może zwrócić base64 string lub byte array
}

export interface BackendWardrobeItemsDTO {
  products: BackendProduct[];
}

export interface BackendPreference {
  allergies?: Array<{ name: string }>;
  preferredMaterials?: Array<{ material: string }>;
}

export interface BackendUserDTO {
  id: string;
  email: string;
  name: string;
  profilePicture?: number[] | null;
  isInfluencer?: boolean;
  preference?: BackendPreference | null;
}

export interface BackendSavedWardrobeItemDTO {
  user: BackendUserDTO;
  products: BackendProduct[];
}

export interface BackendSavedWardrobeResponseDTO {
  savedWardrobeItems: BackendSavedWardrobeItemDTO[];
}

export interface BackendWardrobeShareResponseDTO {
  id: string;
  shareCode: string;
}

export interface BackendAddWardrobeShareRequestDTO {
  shareCode: string;
}

