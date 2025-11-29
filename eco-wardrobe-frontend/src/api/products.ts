import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { mockPassports, influencerProducts } from '@/data/mockPassports';
import { convertDPPtoProduct } from '@/types/digitalProductPassport';

async function fetchUserProducts(userId: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const productIds = influencerProducts[userId] || [];
  const passports = productIds
    .map(id => mockPassports[id])
    .filter((passport): passport is typeof mockPassports[string] => passport !== undefined);

  return passports.map(dpp => {
    const converted = convertDPPtoProduct(dpp);
    return converted.product;
  });
}

export function useProductsQuery(userId: string | null) {
  return useQuery({
    queryKey: ['products', userId],
    queryFn: () => fetchUserProducts(userId!),
    enabled: userId !== null,
  });
}

