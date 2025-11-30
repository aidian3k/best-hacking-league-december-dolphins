import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { convertDPPtoProduct, convertBackendProductToDPP } from '@/types/digitalProductPassport';
import {
  BackendSavedWardrobeResponseDTO,
  BackendWardrobeShareResponseDTO,
  BackendAddWardrobeShareRequestDTO,
  BackendSavedWardrobeItemDTO,
} from './backendTypes';

const API_BASE_URL = 'http://localhost:8080/api';

export interface SavedWardrobeItem {
  user: {
    id: string;
    email: string;
    name: string;
  };
  products: Product[];
}

async function fetchSavedWardrobes(userId: string): Promise<SavedWardrobeItem[]> {
  const response = await fetch(`${API_BASE_URL}/wardrobe-share/get-saved-wardrobes/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Błąd pobierania zapisanych szaf');
  }

  const data: BackendSavedWardrobeResponseDTO = await response.json();

  if (!data.savedWardrobeItems || data.savedWardrobeItems.length === 0) {
    return [];
  }

  return data.savedWardrobeItems.map((item: BackendSavedWardrobeItemDTO) => {
    const products = item.products.map(backendProduct => {
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

    return {
      user: {
        id: item.user.id,
        email: item.user.email,
        name: item.user.name,
      },
      products,
    };
  });
}

async function fetchShareCode(userId: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/wardrobe-share/share/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Błąd generowania kodu udostępnienia');
  }

  const data: BackendWardrobeShareResponseDTO = await response.json();
  return data.shareCode;
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    throw new Error('Nie udało się skopiować do schowka');
  }
}

async function addWardrobe(userId: string, shareCode: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/wardrobe-share/add-wardrobe/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shareCode,
    } as BackendAddWardrobeShareRequestDTO),
  });

  if (response.status === 404) {
    throw new Error('Szafa nie została znaleziona');
  }

  if (!response.ok) {
    throw new Error('Błąd dodawania szafy');
  }
}

export function useSavedWardrobesQuery() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['savedWardrobes', user?.id],
    queryFn: () => fetchSavedWardrobes(user!.id),
    enabled: user !== null,
  });
}

export function useShareWardrobeMutation() {
  const { user } = useUser();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const shareCode = await fetchShareCode(user!.id);
      await copyToClipboard(shareCode);
      toast({
        title: 'Kod skopiowany!',
        description: 'Kod udostępnienia został skopiowany do schowka.',
      });
      return shareCode;
    },
    onError: (error: Error) => {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useAddWardrobeMutation() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (shareCode: string) => addWardrobe(user!.id, shareCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWardrobes', user?.id] });
      toast({
        title: 'Szafa dodana!',
        description: 'Szafa została dodana do Twoich obserwowanych.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

