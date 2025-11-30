import { DigitalProductPassport } from './digitalProductPassport';

export type Category = 'koszulki' | 'bluzy' | 'spodnie' | 'skarpety' | 'inne';

export type EcoRating = 'excellent' | 'good' | 'medium' | 'poor' | 'bad';

export interface Material {
  name: string;
  percentage: number;
  isNatural: boolean;
  isRecycled: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  imageUrl: string;
  image?: string; // base64 string (bez prefiksu data:image/...)
  materials: Material[];
  ecoScore: number; // 0-100
  ecoRating: EcoRating;
  durability: number; // months
  environmentalImpact: number; // 1-10, lower is better
  recyclability: 'full' | 'partial' | 'none';
  repairable: boolean;
  secondHand: boolean;
  previousOwners?: number;
  careInstructions: string[];
  facts: string[];
  addedAt: Date;
  passport?: DigitalProductPassport;
}

export interface WardrobeStats {
  totalItems: number;
  avgEcoScore: number;
  ecoProductsPercent: number;
  naturalMaterialsPercent: number;
  syntheticMaterialsPercent: number;
  recyclablePercent: number;
  repairablePercent: number;
  avgDurability: number;
  categoryStats: Record<Category, {
    count: number;
    avgEcoScore: number;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  allergies: string[];
  preferences: string[];
  badges: Badge[];
  ecoPoints: number;
  joinedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  followers: number;
  wardrobeEcoScore: number;
  itemCount: number;
  verified: boolean;
}

export const categoryLabels: Record<Category, string> = {
  koszulki: 'Koszulki',
  bluzy: 'Bluzy',
  spodnie: 'Spodnie',
  skarpety: 'Skarpety',
  inne: 'Inne',
};

export const ecoRatingLabels: Record<EcoRating, string> = {
  excellent: 'Doskonały',
  good: 'Dobry',
  medium: 'Średni',
  poor: 'Słaby',
  bad: 'Zły',
};

export function getEcoRating(score: number): EcoRating {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'poor';
  return 'bad';
}
