import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { convertDPPtoProduct, convertBackendProductToDPP } from '@/types/digitalProductPassport';
import { BackendWardrobeItemsDTO } from './backendTypes';

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

