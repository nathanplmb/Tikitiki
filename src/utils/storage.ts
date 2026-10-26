import { CocktailRecipe, UserBarItem, ShoppingItem } from '../types/cocktail';
import { INITIAL_CURATED_COCKTAILS } from '../data/curatedCocktails';
import { ALCOHOL_BASES, MIXERS, AROMATICS } from '../data/ingredients';

const STORAGE_KEYS = {
  FAVORITES: 'mixlab_favorites_v1',
  HISTORY: 'mixlab_history_v1',
  BAR: 'mixlab_user_bar_v1',
  SHOPPING: 'mixlab_shopping_list_v1',
};

// Initial default bar items
const DEFAULT_BAR_ITEMS: UserBarItem[] = [
  { id: 'vodka-classique', name: 'Vodka classique', category: 'alcool', inStock: true },
  { id: 'rhum-blanc', name: 'Rhum blanc', category: 'alcool', inStock: true },
  { id: 'gin', name: 'Gin', category: 'alcool', inStock: false },
  { id: 'limonade', name: 'Limonade artisanale', category: 'diluant', inStock: true },
  { id: 'schweppes-tonic', name: 'Schweppes Indian Tonic', category: 'diluant', inStock: true },
  { id: 'jus-cranberry', name: 'Jus de Cranberry', category: 'diluant', inStock: false },
  { id: 'sirop-mure', name: 'Sirop de mûre', category: 'sirop', inStock: true },
  { id: 'sirop-grenadine', name: 'Sirop de grenadine', category: 'sirop', inStock: true },
  { id: 'citron-vert', name: 'Citron vert frais', category: 'garniture', inStock: true },
  { id: 'menthe-fraiche', name: 'Feuilles de menthe', category: 'garniture', inStock: true },
];

export function getFavorites(): CocktailRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) {
      // Seed with curated cocktails on first run
      saveFavorites(INITIAL_CURATED_COCKTAILS);
      return INITIAL_CURATED_COCKTAILS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CURATED_COCKTAILS;
  }
}

export function saveFavorites(favorites: CocktailRecipe[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
}

export function getHistory(): CocktailRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return INITIAL_CURATED_COCKTAILS.slice(0, 2);
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendHistory(recipes: CocktailRecipe[]): void {
  try {
    const current = getHistory();
    // Prepend new recipes, deduplicate by id, keep max 20
    const combined = [...recipes, ...current.filter((c) => !recipes.some((r) => r.id === c.id))];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(combined.slice(0, 20)));
  } catch (e) {
    console.error('Failed to append to history', e);
  }
}

export function getUserBar(): UserBarItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BAR);
    if (!raw) {
      saveUserBar(DEFAULT_BAR_ITEMS);
      return DEFAULT_BAR_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BAR_ITEMS;
  }
}

export function saveUserBar(items: UserBarItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BAR, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save bar items', e);
  }
}

export function getShoppingList(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHOPPING);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveShoppingList(items: ShoppingItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save shopping list', e);
  }
}

export function addRecipeToShoppingList(recipe: CocktailRecipe): ShoppingItem[] {
  const current = getShoppingList();
  const updated = [...current];

  recipe.ingredients.forEach((ing) => {
    const existingIndex = updated.findIndex((item) => item.name.toLowerCase() === ing.name.toLowerCase());
    if (existingIndex >= 0) {
      if (!updated[existingIndex].recipesUsing.includes(recipe.name)) {
        updated[existingIndex].recipesUsing.push(recipe.name);
      }
    } else {
      updated.push({
        id: `shop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: ing.name,
        category: ing.category,
        recipesUsing: [recipe.name],
        formatNote: ing.formatAdvice || (ing.category === 'sirop' ? 'Privilégier un petit format' : undefined),
        checked: false,
      });
    }
  });

  saveShoppingList(updated);
  return updated;
}
