import { Product, Category, Influencer, UserProfile, Badge, getEcoRating } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Cotton Tee',
    brand: 'EcoWear',
    category: 'koszulki',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    materials: [
      { name: 'Bawełna organiczna', percentage: 95, isNatural: true, isRecycled: false },
      { name: 'Elastan', percentage: 5, isNatural: false, isRecycled: false },
    ],
    ecoScore: 85,
    ecoRating: 'excellent',
    durability: 36,
    environmentalImpact: 2,
    recyclability: 'full',
    repairable: true,
    secondHand: false,
    careInstructions: ['Prać w 30°C', 'Nie używać wybielacza', 'Suszyć na płasko'],
    facts: ['Certyfikat GOTS', 'Wyprodukowano w Polsce', 'Zero zużycia wody w procesie barwienia'],
    addedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Recycled Denim Jeans',
    brand: 'GreenStitch',
    category: 'spodnie',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    materials: [
      { name: 'Bawełna z recyklingu', percentage: 80, isNatural: true, isRecycled: true },
      { name: 'Poliester z recyklingu', percentage: 18, isNatural: false, isRecycled: true },
      { name: 'Elastan', percentage: 2, isNatural: false, isRecycled: false },
    ],
    ecoScore: 78,
    ecoRating: 'good',
    durability: 48,
    environmentalImpact: 3,
    recyclability: 'partial',
    repairable: true,
    secondHand: false,
    careInstructions: ['Prać w 40°C', 'Prać na lewą stronę', 'Nie suszyć w suszarce'],
    facts: ['Oszczędność 10000L wody', 'Materiał z recyklingu PET', 'Fair Trade'],
    addedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Merino Wool Hoodie',
    brand: 'NatureFiber',
    category: 'bluzy',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    materials: [
      { name: 'Wełna merino', percentage: 70, isNatural: true, isRecycled: false },
      { name: 'Bawełna organiczna', percentage: 30, isNatural: true, isRecycled: false },
    ],
    ecoScore: 92,
    ecoRating: 'excellent',
    durability: 60,
    environmentalImpact: 2,
    recyclability: 'full',
    repairable: true,
    secondHand: false,
    careInstructions: ['Prać ręcznie', 'Nie wyżymać', 'Suszyć na płasko'],
    facts: ['Wełna z certyfikowanych farm', 'Naturalnie antybakteryjna', 'Biodegradowalna'],
    addedAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Bamboo Socks Set',
    brand: 'BambooBasics',
    category: 'skarpety',
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400',
    materials: [
      { name: 'Bambus', percentage: 80, isNatural: true, isRecycled: false },
      { name: 'Elastan', percentage: 15, isNatural: false, isRecycled: false },
      { name: 'Poliamid', percentage: 5, isNatural: false, isRecycled: false },
    ],
    ecoScore: 72,
    ecoRating: 'good',
    durability: 18,
    environmentalImpact: 3,
    recyclability: 'partial',
    repairable: false,
    secondHand: false,
    careInstructions: ['Prać w 40°C', 'Można suszyć w suszarce'],
    facts: ['Bambus rośnie bez pestycydów', 'Naturalnie antybakteryjne', 'Szybkoschnące'],
    addedAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    name: 'Vintage Band Tee',
    brand: 'SecondLife',
    category: 'koszulki',
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400',
    materials: [
      { name: 'Bawełna', percentage: 100, isNatural: true, isRecycled: false },
    ],
    ecoScore: 88,
    ecoRating: 'excellent',
    durability: 24,
    environmentalImpact: 1,
    recyclability: 'full',
    repairable: true,
    secondHand: true,
    previousOwners: 2,
    careInstructions: ['Prać w 30°C', 'Prasować na lewą stronę'],
    facts: ['Second-hand = zero nowej produkcji', 'Vintage z lat 90.', 'Unikalna sztuka'],
    addedAt: new Date('2024-05-12'),
  },
  {
    id: '6',
    name: 'Fast Fashion Polo',
    brand: 'QuickWear',
    category: 'koszulki',
    imageUrl: 'https://images.unsplash.com/photo-1625910513413-5fc5dc9a7a0a?w=400',
    materials: [
      { name: 'Poliester', percentage: 65, isNatural: false, isRecycled: false },
      { name: 'Bawełna', percentage: 35, isNatural: true, isRecycled: false },
    ],
    ecoScore: 28,
    ecoRating: 'poor',
    durability: 12,
    environmentalImpact: 8,
    recyclability: 'none',
    repairable: false,
    secondHand: false,
    careInstructions: ['Prać w 40°C'],
    facts: ['Zawiera mikroplastik', 'Wyprodukowano w Azji', 'Brak certyfikatów ekologicznych'],
    addedAt: new Date('2024-06-01'),
  },
  {
    id: '7',
    name: 'Hemp Cargo Pants',
    brand: 'HempHeaven',
    category: 'spodnie',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    materials: [
      { name: 'Konopie', percentage: 55, isNatural: true, isRecycled: false },
      { name: 'Bawełna organiczna', percentage: 45, isNatural: true, isRecycled: false },
    ],
    ecoScore: 94,
    ecoRating: 'excellent',
    durability: 72,
    environmentalImpact: 1,
    recyclability: 'full',
    repairable: true,
    secondHand: false,
    careInstructions: ['Prać w 30°C', 'Nie używać zmiękczacza'],
    facts: ['Konopie nie wymagają pestycydów', 'Wzmacnia się z czasem', 'Pochłania CO2'],
    addedAt: new Date('2024-07-20'),
  },
  {
    id: '8',
    name: 'Fleece Zip Hoodie',
    brand: 'SportMax',
    category: 'bluzy',
    imageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400',
    materials: [
      { name: 'Poliester', percentage: 100, isNatural: false, isRecycled: false },
    ],
    ecoScore: 22,
    ecoRating: 'poor',
    durability: 24,
    environmentalImpact: 9,
    recyclability: 'none',
    repairable: false,
    secondHand: false,
    careInstructions: ['Prać w 30°C', 'Nie prasować'],
    facts: ['Uwalnia mikroplastik przy praniu', 'Nie biodegradowalna', 'Wyprodukowano tanio'],
    addedAt: new Date('2024-08-15'),
  },
];

export const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Anna Kowalska',
    handle: '@anna_eco_style',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    followers: 125000,
    wardrobeEcoScore: 89,
    itemCount: 45,
    verified: true,
  },
  {
    id: '2',
    name: 'Piotr Zielony',
    handle: '@piotr_sustainable',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    followers: 89000,
    wardrobeEcoScore: 92,
    itemCount: 32,
    verified: true,
  },
  {
    id: '3',
    name: 'Maja Natura',
    handle: '@maja_natura_pl',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    followers: 210000,
    wardrobeEcoScore: 95,
    itemCount: 28,
    verified: true,
  },
  {
    id: '4',
    name: 'Tomek EcoWarrior',
    handle: '@tomek_eco',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    followers: 56000,
    wardrobeEcoScore: 87,
    itemCount: 52,
    verified: false,
  },
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Eco Hero',
    description: 'Średnia ekologiczność szafy powyżej 80%',
    icon: '🌿',
    earnedAt: new Date('2024-05-01'),
  },
  {
    id: '2',
    name: 'Zero Waste Rookie',
    description: 'Pierwszy produkt second-hand w szafie',
    icon: '♻️',
    earnedAt: new Date('2024-05-12'),
  },
  {
    id: '3',
    name: 'Świadomy Konsument',
    description: 'Zeskanowano 10 produktów przed zakupem',
    icon: '🔍',
    earnedAt: new Date('2024-06-15'),
  },
];

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Jan Testowy',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  allergies: ['Wełna', 'Lateks'],
  preferences: ['Bawełna organiczna', 'Materiały z recyklingu'],
  badges: mockBadges,
  ecoPoints: 1250,
  joinedAt: new Date('2024-01-01'),
};

export function calculateWardrobeStats(products: Product[]) {
  if (products.length === 0) {
    return {
      totalItems: 0,
      avgEcoScore: 0,
      ecoProductsPercent: 0,
      naturalMaterialsPercent: 0,
      syntheticMaterialsPercent: 0,
      recyclablePercent: 0,
      repairablePercent: 0,
      avgDurability: 0,
      categoryStats: {} as Record<Category, { count: number; avgEcoScore: number }>,
    };
  }

  const totalItems = products.length;
  const avgEcoScore = Math.round(products.reduce((sum, p) => sum + p.ecoScore, 0) / totalItems);
  const ecoProductsPercent = Math.round((products.filter(p => p.ecoScore >= 60).length / totalItems) * 100);
  
  let totalNatural = 0;
  let totalSynthetic = 0;
  products.forEach(p => {
    p.materials.forEach(m => {
      if (m.isNatural) totalNatural += m.percentage;
      else totalSynthetic += m.percentage;
    });
  });
  const totalMaterials = totalNatural + totalSynthetic;
  const naturalMaterialsPercent = Math.round((totalNatural / totalMaterials) * 100);
  const syntheticMaterialsPercent = 100 - naturalMaterialsPercent;

  const recyclablePercent = Math.round((products.filter(p => p.recyclability !== 'none').length / totalItems) * 100);
  const repairablePercent = Math.round((products.filter(p => p.repairable).length / totalItems) * 100);
  const avgDurability = Math.round(products.reduce((sum, p) => sum + p.durability, 0) / totalItems);

  const categories: Category[] = ['koszulki', 'bluzy', 'spodnie', 'skarpety', 'inne'];
  const categoryStats = {} as Record<Category, { count: number; avgEcoScore: number }>;
  
  categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat);
    categoryStats[cat] = {
      count: catProducts.length,
      avgEcoScore: catProducts.length > 0 
        ? Math.round(catProducts.reduce((sum, p) => sum + p.ecoScore, 0) / catProducts.length)
        : 0,
    };
  });

  return {
    totalItems,
    avgEcoScore,
    ecoProductsPercent,
    naturalMaterialsPercent,
    syntheticMaterialsPercent,
    recyclablePercent,
    repairablePercent,
    avgDurability,
    categoryStats,
  };
}

export function generateMockScannedProduct(): Product {
  const names = ['Koszulka Polo', 'Bluza Oversize', 'Spodnie Chino', 'T-shirt Basic'];
  const brands = ['H&M', 'Zara', 'Reserved', 'Patagonia', 'EcoWear'];
  const categories: Category[] = ['koszulki', 'bluzy', 'spodnie', 'skarpety'];
  
  const ecoScore = Math.floor(Math.random() * 100);
  
  return {
    id: `scanned-${Date.now()}`,
    name: names[Math.floor(Math.random() * names.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    materials: [
      { name: 'Bawełna', percentage: 60, isNatural: true, isRecycled: false },
      { name: 'Poliester', percentage: 35, isNatural: false, isRecycled: false },
      { name: 'Elastan', percentage: 5, isNatural: false, isRecycled: false },
    ],
    ecoScore,
    ecoRating: getEcoRating(ecoScore),
    durability: Math.floor(Math.random() * 48) + 12,
    environmentalImpact: Math.floor(Math.random() * 10) + 1,
    recyclability: ['full', 'partial', 'none'][Math.floor(Math.random() * 3)] as 'full' | 'partial' | 'none',
    repairable: Math.random() > 0.5,
    secondHand: Math.random() > 0.8,
    careInstructions: ['Prać w 30°C', 'Nie używać wybielacza'],
    facts: ['Produkt masowy', 'Wyprodukowano w Azji'],
    addedAt: new Date(),
  };
}
