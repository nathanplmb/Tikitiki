export type CocktailType = 'consensuelle' | 'signature' | 'audacieuse';

export interface IngredientItem {
  name: string;
  amount: string; // e.g. "5 cl", "10 cl", "2 cl", "1 tranche"
  unit?: string;
  category: 'alcool' | 'diluant' | 'sirop' | 'garniture' | 'autre';
  supermarketCommon: boolean; // readily found in French supermarkets
  estimatedPrice?: string;
  formatAdvice?: string; // e.g. "Préférer petit format 25cl"
  optional?: boolean;
}

export interface EstimatedCost {
  min: number;
  max: number;
  currency: string;
  status: 'estime' | 'a_verifier';
  note: string;
}

export interface CocktailRecipe {
  id: string;
  name: string;
  type: CocktailType;
  tagline: string;
  description: string;
  tasteProfile: {
    primaryNotes: string[];
    sweetness: number; // 1-5
    fruitiness: number; // 1-5
    originality: number; // 1-5
    profileName: string;
  };
  ingredients: IngredientItem[];
  steps: string[];
  glassType: string;
  prepTimeMinutes: number;
  difficulty: 'Très facile' | 'Facile' | 'Moyen';
  distinctIngredientsCount: number;
  estimatedCost: EstimatedCost;
  aromaticCoherence: string; // Why the combination works
  simplerAlternative: string; // Consensual or simplified fallback
  mocktailVariant: string; // Non-alcoholic version
  allergens: string[];
  alcoholEstimate: string; // e.g. "Modéré (~9% vol.)"
  imageUrl: string;
  isExample?: boolean;
  createdAt?: string;
  userRating?: number; // 1-5
  userTags?: string[]; // e.g. ["Parfait", "À refaire"]
  userNotes?: string;
}

export interface CreationConfig {
  selectedBases: string[];
  singleBottleOnly: boolean;
  selectedMixers: string[];
  selectedAromatics: string[];
  profileName: string;
  fruitiness: number; // 1-5
  sweetness: number; // 1-5
  originality: number; // 1-5
  crowdPleaser: boolean; // "Je veux que plusieurs personnes puissent aimer ce cocktail"
  advancedFilters: {
    budgetLimit: 'low' | 'medium' | 'any';
    servings: number;
    maxBottlesToCarry: number;
    useBarOnly: boolean;
    prepTimeMax: number; // in minutes, 0 = any
    frenchSupermarketOnly: boolean;
    noSyrup: boolean;
    noFreshFruits: boolean;
    noEnergyDrinks: boolean;
  };
}

export interface UserBarItem {
  id: string;
  name: string;
  category: 'alcool' | 'diluant' | 'sirop' | 'garniture';
  inStock: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'alcool' | 'diluant' | 'sirop' | 'garniture' | 'autre';
  recipesUsing: string[]; // cocktail names
  formatNote?: string;
  checked: boolean;
}
