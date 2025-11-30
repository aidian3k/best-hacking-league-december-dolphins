import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { convertDPPtoProduct, convertBackendProductToDPP, DigitalProductPassport } from '@/types/digitalProductPassport';
import { BackendWardrobeItemsDTO, BackendProduct } from './backendTypes';

const API_BASE_URL = 'http://localhost:8080/api';

async function fetchUserProducts(userId: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Błąd pobierania produktów');
  }

  const data: BackendWardrobeItemsDTO = await response.json();
  
  if (!data.products || data.products.length === 0) {
    return [];
  }

  return data.products.map(backendProduct => {
    const dpp = convertBackendProductToDPP(backendProduct);
    const converted = convertDPPtoProduct(dpp);
    
    const product = converted.product;
    
    if (backendProduct.image && Array.isArray(backendProduct.image) && backendProduct.image.length > 0) {
      try {
        const bytes = new Uint8Array(backendProduct.image);
        const binary = String.fromCharCode(...bytes);
        const base64Image = btoa(binary);
        product.image = base64Image;
      } catch (error) {
        console.warn('Błąd konwersji obrazu:', error);
      }
    }
    
    return product;
  });
}

export function useProductsQuery(userId: string | null) {
  return useQuery({
    queryKey: ['products', userId],
    queryFn: () => fetchUserProducts(userId!),
    enabled: userId !== null,
  });
}

function convertDPPtoBackendProduct(dpp: DigitalProductPassport, imageBase64?: string): Omit<BackendProduct, 'id'> {
  // Convert base64 image to number array if present
  let imageArray: number[] | null = null;
  if (imageBase64) {
    try {
      const binaryString = atob(imageBase64);
      imageArray = Array.from(binaryString, char => char.charCodeAt(0));
    } catch (error) {
      console.warn('Błąd konwersji obrazu do formatu backendu:', error);
    }
  }

  return {
    productInformation: {
      gtin: dpp.product.gtin,
      productName: dpp.product.name,
      category: dpp.product.category,
      brand: dpp.product.brand,
      model: dpp.product.model,
    },
    materialCompositions: dpp.materialComposition.map(mc => ({
      materialName: mc.material,
      compositionPercentage: mc.percentage,
      certifications: mc.certifications,
    })),
    productEnvironmentImpact: {
      carbonFootprintKgCO2e: dpp.environmentalImpact.carbonFootprint_kgCO2e,
      waterUsageLiters: dpp.environmentalImpact.waterUsage_liters,
      energyKwh: dpp.environmentalImpact.energy_kWh,
      recycledContentPercentage: dpp.environmentalImpact.recycledContentPercentage,
      hazardousSubstances: dpp.environmentalImpact.hazardousSubstances,
    },
    manufacturing: {
      producer: {
        producerName: dpp.manufacturing.producer.name,
        address: dpp.manufacturing.producer.address,
        contact: dpp.manufacturing.producer.contact,
      },
      productionSites: dpp.manufacturing.productionSites.map(ps => ({
        country: ps.country,
        facilityId: ps.facilityId,
        processes: ps.processes,
      })),
      manufacturingDate: dpp.manufacturing.manufacturingDate,
    },
    durabilityAndCare: {
      expectedLifetimeCycles: dpp.durabilityAndCare.expectedLifetime_cycles,
      washInstructions: dpp.durabilityAndCare.washInstructions,
      repairability: {
        repairDifficulty: dpp.durabilityAndCare.repairability.repairDifficulty,
        sparePartsAvailable: dpp.durabilityAndCare.repairability.sparePartsAvailable,
        repairGuidesURL: dpp.durabilityAndCare.repairability.repairGuidesURL,
      },
    },
    endOfLife: {
      recyclabilityPercentage: dpp.endOfLife.recyclabilityPercentage,
      disassemblyInstructionsURL: dpp.endOfLife.disassemblyInstructionsURL,
      takeBackPrograms: dpp.endOfLife.takeBackPrograms.map(tbp => ({
        programName: tbp.programName,
        url: tbp.url,
      })),
    },
    supplyChainTraceability: {
      chain: dpp.supplyChainTraceability.chain.map(scs => ({
        stage: scs.stage,
        supplier: scs.supplier,
        country: scs.country,
        certificate: scs.certificate || null,
      })),
    },
    metadata: {
      passportCreated: dpp.metadata.passportCreated,
      passportLastUpdated: dpp.metadata.passportLastUpdated,
      dataOwner: dpp.metadata.dataOwner,
    },
    image: imageArray,
  };
}

export async function addProductToWardrobe(
  userId: string,
  dpp: DigitalProductPassport,
  imageBase64?: string
): Promise<BackendProduct> {
  const backendProduct = convertDPPtoBackendProduct(dpp, imageBase64);
  console.log("imageBase64 length:", imageBase64 ? imageBase64.length : 'no image');
  const response = await fetch(`${API_BASE_URL}/products/create/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendProduct),
  });

  if (!response.ok) {
    throw new Error('Błąd dodawania produktu do szafy');
  }

  return await response.json();
}

