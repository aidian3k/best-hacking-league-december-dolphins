import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { convertDPPtoProduct, convertBackendProductToDPP, DigitalProductPassport } from '@/types/digitalProductPassport';
import { BackendWardrobeItemsDTO, BackendProduct } from './backendTypes';
import { convertBackendImageToBase64, base64ToByteArray } from '@/lib/utils';

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

  const products = data.products.map(backendProduct => {
    const dpp = convertBackendProductToDPP(backendProduct);
    const converted = convertDPPtoProduct(dpp); // Nie przekazuj obrazu tutaj

    const product = converted.product;

    // Convert image to base64 string
    product.image = convertBackendImageToBase64(backendProduct.image) || undefined;

    return product;
  });

  return products;
}

export function useProductsQuery(userId: string | null) {
  const query = useQuery({
    queryKey: ['products', userId],
    queryFn: async () => {
      const products = await fetchUserProducts(userId!);
      console.log(`🔥 REACT QUERY RESULT:`, products.map(p => ({
        name: p.name,
        image: p.image,
        hasImage: !!p.image,
        imageLength: p.image?.length,
        imagePrefix: p.image?.substring(0, 20)
      })));
      return products;
    },
    enabled: userId !== null,
  });

  // Log whenever data changes
  if (query.data) {
    console.log(`🎨 QUERY DATA IN HOOK:`, query.data.map(p => ({
      name: p.name,
      hasImage: !!p.image,
      imageLength: p.image?.length
    })));
  }

  return query;
}

function convertDPPtoBackendProduct(dpp: DigitalProductPassport, imageBase64?: string): Omit<BackendProduct, 'id'> {
  // Convert base64 image to number array if present
  let imageArray: number[] | null = null;
  if (imageBase64) {
    try {
      const base64WithoutPrefix = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      imageArray = base64ToByteArray(base64WithoutPrefix);
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

