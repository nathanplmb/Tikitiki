import { CocktailRecipe, UserBarItem, ShoppingItem, UserTastePreferences, PartyPlan } from '../types/cocktail';
import { INITIAL_CURATED_COCKTAILS } from '../data/curatedCocktails';

const STORAGE_KEYS = {
  FAVORITES: 'mixlab_favorites_v2',
  HISTORY: 'mixlab_history_v2',
  BAR: 'mixlab_user_bar_v2',
  SHOPPING: 'mixlab_shopping_list_v2',
  PREFERENCES: 'mixlab_taste_preferences_v2',
  PARTY_PLAN: 'mixlab_party_plan_v2',
};

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

const DEFAULT_PREFERENCES: UserTastePreferences = {
  preferredSweetness: 3,
  preferredFruitiness: 4,
  preferredOriginality: 3,
  favoriteBases: ['Vodka classique', 'Gin'],
  dislikedIngredients: [],
  preferMocktails: false,
  lastUpdated: new Date().toISOString(),
};

// FAVORITES
export function getFavorites(): CocktailRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) {
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
    console.error('Failed to save favorites', e);
  }
}

// HISTORY
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
    const combined = [...recipes, ...current.filter((c) => !recipes.some((r) => r.id === c.id))];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(combined.slice(0, 20)));
  } catch (e) {
    console.error('Failed to append to history', e);
  }
}

// USER BAR
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

// SHOPPING LIST
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

export function addRecipeToShoppingList(recipe: CocktailRecipe, servingsMultiplier: number = 1): ShoppingItem[] {
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
        formatNote: ing.formatAdvice || (ing.category === 'sirop' ? 'Privilégier un petit format 25cl' : undefined),
        totalQuantity: ing.amount,
        checked: false,
      });
    }
  });

  saveShoppingList(updated);
  return updated;
}

// USER TASTE PREFERENCES
export function getTastePreferences(): UserTastePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveTastePreferences(prefs: UserTastePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save taste preferences', e);
  }
}

export function resetTastePreferences(): UserTastePreferences {
  saveTastePreferences(DEFAULT_PREFERENCES);
  return DEFAULT_PREFERENCES;
}

// PARTY PLAN
export function getPartyPlan(): PartyPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTY_PLAN);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePartyPlan(plan: PartyPlan): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTY_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save party plan', e);
  }
}

// EXPORT / BACKUP JSON FOR CLOUD SYNC READINESS
export function exportUserDataJSON(): string {
  const data = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    favorites: getFavorites(),
    history: getHistory(),
    userBar: getUserBar(),
    shoppingList: getShoppingList(),
    preferences: getTastePreferences(),
    partyPlan: getPartyPlan(),
  };
  return JSON.stringify(data, null, 2);
}

export function importUserDataJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.favorites && Array.isArray(data.favorites)) saveFavorites(data.favorites);
    if (data.userBar && Array.isArray(data.userBar)) saveUserBar(data.userBar);
    if (data.shoppingList && Array.isArray(data.shoppingList)) saveShoppingList(data.shoppingList);
    if (data.preferences) saveTastePreferences(data.preferences);
    if (data.partyPlan) savePartyPlan(data.partyPlan);
    return true;
  } catch (err) {
    console.error('Failed to import user data JSON:', err);
    return false;
  }
}
