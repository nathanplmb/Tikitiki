import React, { useState, useEffect } from 'react';
import { AmbientBackground, AmbientTheme } from './components/AmbientBackground';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { Navigation, ActiveTab } from './components/Navigation';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LabConfigurator } from './components/LabConfigurator';
import { CocktailResults } from './components/CocktailResults';
import { CocktailDetailModal } from './components/CocktailDetailModal';
import { CocktailCompareModal } from './components/CocktailCompareModal';
import { DiscoveriesView } from './components/DiscoveriesView';
import { MyCollectionView } from './components/MyCollectionView';
import { MyBarView } from './components/MyBarView';
import { ShoppingListModal } from './components/ShoppingListModal';
import { PartyPlannerView } from './components/PartyPlannerView';
import { NeonLiquidShaker } from './components/NeonLiquidShaker';
import { 
  CocktailRecipe, 
  CreationConfig, 
  UserBarItem, 
  ShoppingItem,
  UserTastePreferences,
  PartyPlan
} from './types/cocktail';
import { 
  getFavorites, 
  saveFavorites, 
  getHistory, 
  appendHistory, 
  getUserBar, 
  saveUserBar, 
  getShoppingList, 
  saveShoppingList,
  addRecipeToShoppingList,
  getTastePreferences,
  saveTastePreferences,
  resetTastePreferences,
  exportUserDataJSON,
  importUserDataJSON
} from './utils/storage';
import { INITIAL_CURATED_COCKTAILS } from './data/curatedCocktails';
import { PairingSuggestion } from './data/ingredients';
import { sounds } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [favorites, setFavorites] = useState<CocktailRecipe[]>([]);
  const [history, setHistory] = useState<CocktailRecipe[]>([]);
  const [userBar, setUserBar] = useState<UserBarItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [tastePrefs, setTastePrefs] = useState<UserTastePreferences>(getTastePreferences());
  
  // Active Generated Recipes
  const [currentRecipes, setCurrentRecipes] = useState<CocktailRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [demoNotice, setDemoNotice] = useState<string | undefined>(undefined);

  // Modals state
  const [selectedCocktail, setSelectedCocktail] = useState<CocktailRecipe | null>(null);
  const [compareCocktails, setCompareCocktails] = useState<[CocktailRecipe, CocktailRecipe] | null>(null);
  const [isShoppingOpen, setIsShoppingOpen] = useState<boolean>(false);

  // Pre-filled config for lab
  const [labConfig, setLabConfig] = useState<Partial<CreationConfig> | undefined>(undefined);

  // Load from local storage on mount
  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getHistory());
    setUserBar(getUserBar());
    setShoppingList(getShoppingList());
    setTastePrefs(getTastePreferences());
  }, []);

  // Compute adaptive ambient theme
  const getActiveAmbientTheme = (): AmbientTheme => {
    if (selectedCocktail?.tasteProfile?.colorTheme) {
      return selectedCocktail.tasteProfile.colorTheme;
    }
    if (currentRecipes.length > 0 && currentRecipes[0].tasteProfile?.colorTheme) {
      return currentRecipes[0].tasteProfile.colorTheme;
    }
    if (activeTab === 'party') return 'tropical';
    return 'neutral';
  };

  // Handler: Generate Cocktails from Lab
  const handleGenerate = async (config: CreationConfig) => {
    setIsGenerating(true);
    setDemoNotice(undefined);
    try {
      const res = await fetch('/api/cocktails/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        setCurrentRecipes(data.recipes);
        appendHistory(data.recipes);
        setHistory(getHistory());
        if (data.notice) {
          setDemoNotice(data.notice);
        }
        sounds.playSuccessChime();
        setActiveTab('lab');
      }
    } catch (err) {
      console.error('Failed to generate cocktails:', err);
      setCurrentRecipes(INITIAL_CURATED_COCKTAILS);
      setDemoNotice('Exemple prédéfini de référence (serveurs IA occupés).');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Surprise Me
  const handleSurpriseMe = async () => {
    setIsGenerating(true);
    setDemoNotice(undefined);
    try {
      const stockedBases = userBar.filter((i) => i.category === 'alcool' && i.inStock).map((i) => i.name);
      const res = await fetch('/api/cocktails/surprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredBases: stockedBases }),
      });

      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        setCurrentRecipes(data.recipes);
        appendHistory(data.recipes);
        setHistory(getHistory());
        sounds.playSuccessChime();
        setActiveTab('lab');
      }
    } catch (err) {
      console.error('Surprise generation failed', err);
      setCurrentRecipes(INITIAL_CURATED_COCKTAILS);
      setActiveTab('lab');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Rebalance recipe with AI
  const handleRebalanceWithAI = async (recipe: CocktailRecipe, tweak: string) => {
    try {
      const res = await fetch('/api/cocktails/rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalRecipe: recipe, userTweak: tweak }),
      });
      const data = await res.json();
      if (data.recipe) {
        setSelectedCocktail(data.recipe);
        // update in favorites or history
        setFavorites((prev) => prev.map((f) => (f.id === recipe.id ? data.recipe : f)));
        sounds.playSuccessChime();
      }
    } catch (err) {
      console.error('Rebalance error:', err);
    }
  };

  // Handler: From Roulette
  const handleLaunchRouletteLab = (base: string, mixer: string, aromatic: string, profile: string) => {
    setLabConfig({
      selectedBases: [base],
      singleBottleOnly: true,
      selectedMixers: [mixer],
      selectedAromatics: [aromatic],
      profileName: profile,
    });
    setCurrentRecipes([]);
    setActiveTab('lab');
    sounds.playTap();
  };

  // Handler: From Pairing Suggestion
  const handleStartWithPairing = (pairing: PairingSuggestion) => {
    setLabConfig({
      selectedBases: [pairing.base],
      singleBottleOnly: true,
      selectedMixers: [pairing.mixer],
      selectedAromatics: [pairing.aromatic],
      profileName: 'Très original, mais facile à apprécier',
    });
    setCurrentRecipes([]);
    setActiveTab('lab');
    sounds.playTap();
  };

  // Handler: Create from Bar
  const handleGenerateFromBar = (stockedBases: string[], stockedMixers: string[], stockedAromatics: string[]) => {
    setLabConfig({
      selectedBases: stockedBases.slice(0, 2),
      singleBottleOnly: true,
      selectedMixers: stockedMixers.length > 0 ? stockedMixers.slice(0, 3) : ['Eau pétillante'],
      selectedAromatics: stockedAromatics.slice(0, 3),
      crowdPleaser: true,
    });
    setCurrentRecipes([]);
    setActiveTab('lab');
  };

  // Toggle Favorite
  const handleToggleFavorite = (cocktail: CocktailRecipe) => {
    const exists = favorites.some((f) => f.id === cocktail.id);
    let updated: CocktailRecipe[];
    if (exists) {
      updated = favorites.filter((f) => f.id !== cocktail.id);
    } else {
      updated = [cocktail, ...favorites];
    }
    setFavorites(updated);
    saveFavorites(updated);
  };

  // Save rating / personal notes
  const handleSaveRating = (recipeId: string, rating: number, tags: string[], notes: string) => {
    const updateCocktail = (c: CocktailRecipe) => {
      if (c.id === recipeId) {
        return { ...c, userRating: rating, userTags: tags, userNotes: notes, testedByUser: true };
      }
      return c;
    };

    const updatedFavs = favorites.map(updateCocktail);
    setFavorites(updatedFavs);
    saveFavorites(updatedFavs);

    if (selectedCocktail && selectedCocktail.id === recipeId) {
      setSelectedCocktail({ ...selectedCocktail, userRating: rating, userTags: tags, userNotes: notes, testedByUser: true });
    }
  };

  // Taste preferences update
  const handleUpdateTastePrefs = (prefs: UserTastePreferences) => {
    setTastePrefs(prefs);
    saveTastePreferences(prefs);
  };

  const handleResetTastePrefs = () => {
    const reset = resetTastePreferences();
    setTastePrefs(reset);
  };

  // Export / Import JSON for Cloud Sync Readiness
  const handleExportData = () => {
    const jsonStr = exportUserDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mixlab_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playTap();
  };

  const handleImportData = async (file: File) => {
    try {
      const text = await file.text();
      const success = importUserDataJSON(text);
      if (success) {
        setFavorites(getFavorites());
        setUserBar(getUserBar());
        setShoppingList(getShoppingList());
        setTastePrefs(getTastePreferences());
        sounds.playSuccessChime();
      }
    } catch (e) {
      console.error('Import error:', e);
    }
  };

  // Bar inventory actions
  const handleToggleBarStock = (id: string) => {
    const updated = userBar.map((item) =>
      item.id === id ? { ...item, inStock: !item.inStock } : item
    );
    setUserBar(updated);
    saveUserBar(updated);
  };

  const handleAddBarItem = (name: string, category: UserBarItem['category']) => {
    const newItem: UserBarItem = {
      id: `custom-bar-${Date.now()}`,
      name,
      category,
      inStock: true,
    };
    const updated = [newItem, ...userBar];
    setUserBar(updated);
    saveUserBar(updated);
  };

  const handleRemoveBarItem = (id: string) => {
    const updated = userBar.filter((item) => item.id !== id);
    setUserBar(updated);
    saveUserBar(updated);
  };

  // Shopping list actions
  const handleAddToShopping = (cocktail: CocktailRecipe) => {
    const updated = addRecipeToShoppingList(cocktail);
    setShoppingList(updated);
  };

  const handleAddPartyPlanToShopping = (plan: PartyPlan) => {
    const current = getShoppingList();
    const updated = [...current];

    plan.consolidatedShopping.forEach((s) => {
      const existing = updated.find((item) => item.name.toLowerCase() === s.item.toLowerCase());
      if (existing) {
        existing.totalQuantity = s.bottlesNeeded;
      } else {
        updated.push({
          id: `party-shop-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          name: s.item,
          category: s.category as any,
          recipesUsing: [`Soirée (${plan.guestCount} invités)`],
          formatNote: s.bottlesNeeded,
          checked: false,
        });
      }
    });

    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const handleToggleShoppingItem = (id: string) => {
    const updated = shoppingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const handleClearShopping = () => {
    setShoppingList([]);
    saveShoppingList([]);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      {/* Dynamic Adaptive Ambient Lighting */}
      <AmbientBackground theme={getActiveAmbientTheme()} />

      {/* Refined Liquid Mixology Loader */}
      <NeonLiquidShaker isGenerating={isGenerating} />

      {/* Mobile-First Studio Wrapper */}
      <MobileFrameWrapper>
        {/* Navigation for Desktop sidebar & Mobile bottom tab bar */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            sounds.playTap();
            setActiveTab(tab);
          }}
          shoppingCount={shoppingList.filter((i) => !i.checked).length}
          onOpenShopping={() => setIsShoppingOpen(true)}
          favoritesCount={favorites.length}
        />

        {/* Content Container */}
        <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
          <Header
            onSurpriseMe={handleSurpriseMe}
            onOpenRoulette={() => {
              sounds.playTap();
              setActiveTab('discoveries');
            }}
            onOpenShopping={() => setIsShoppingOpen(true)}
            onOpenParty={() => {
              sounds.playTap();
              setActiveTab('party');
            }}
            shoppingCount={shoppingList.filter((i) => !i.checked).length}
            isLoadingSurprise={isGenerating}
          />

          <main className="flex-1 px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full">
            {activeTab === 'home' && (
              <Dashboard
                onStartLab={() => {
                  sounds.playTap();
                  setCurrentRecipes([]);
                  setActiveTab('lab');
                }}
                onSurpriseMe={handleSurpriseMe}
                onOpenRoulette={() => {
                  sounds.playTap();
                  setActiveTab('discoveries');
                }}
                onOpenParty={() => {
                  sounds.playTap();
                  setActiveTab('party');
                }}
                recentCocktails={history}
                onSelectCocktail={(c) => setSelectedCocktail(c)}
                userBar={userBar}
                onStartWithPairing={handleStartWithPairing}
                isLoadingSurprise={isGenerating}
              />
            )}

            {activeTab === 'lab' && (
              <>
                {currentRecipes.length > 0 ? (
                  <CocktailResults
                    recipes={currentRecipes}
                    onSelectCocktail={(c) => setSelectedCocktail(c)}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                    onOpenCompare={(c1, c2) => setCompareCocktails([c1, c2])}
                    onRestartLab={() => setCurrentRecipes([])}
                    demoNotice={demoNotice}
                  />
                ) : (
                  <LabConfigurator
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    userBar={userBar}
                    initialConfig={labConfig}
                  />
                )}
              </>
            )}

            {activeTab === 'discoveries' && (
              <DiscoveriesView
                onLaunchRouletteLab={handleLaunchRouletteLab}
                onSelectPairing={handleStartWithPairing}
              />
            )}

            {activeTab === 'collection' && (
              <MyCollectionView
                favorites={favorites}
                onSelectCocktail={(c) => setSelectedCocktail(c)}
                onRemoveFavorite={(id) => {
                  const updated = favorites.filter((f) => f.id !== id);
                  setFavorites(updated);
                  saveFavorites(updated);
                }}
                onOpenCompare={(c1, c2) => setCompareCocktails([c1, c2])}
                onStartLab={() => {
                  setCurrentRecipes([]);
                  setActiveTab('lab');
                }}
                tastePrefs={tastePrefs}
                onUpdateTastePrefs={handleUpdateTastePrefs}
                onResetTastePrefs={handleResetTastePrefs}
                onExportData={handleExportData}
                onImportData={handleImportData}
              />
            )}

            {activeTab === 'bar' && (
              <MyBarView
                userBar={userBar}
                onToggleStock={handleToggleBarStock}
                onAddItem={handleAddBarItem}
                onRemoveItem={handleRemoveBarItem}
                onGenerateFromBar={handleGenerateFromBar}
              />
            )}

            {activeTab === 'party' && (
              <PartyPlannerView
                onAddAllToShoppingList={handleAddPartyPlanToShopping}
                onSelectCocktail={(c) => setSelectedCocktail(c)}
              />
            )}
          </main>
        </div>
      </MobileFrameWrapper>

      {/* Detail Modal */}
      <CocktailDetailModal
        cocktail={selectedCocktail}
        onClose={() => setSelectedCocktail(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={Boolean(selectedCocktail && favorites.some((f) => f.id === selectedCocktail.id))}
        onAddToShoppingList={handleAddToShopping}
        onSaveRating={handleSaveRating}
        onRebalanceWithAI={handleRebalanceWithAI}
        onOpenCompare={(c) => {
          if (favorites.length > 0 && favorites[0].id !== c.id) {
            setCompareCocktails([c, favorites[0]]);
          }
        }}
      />

      {/* Compare Modal */}
      <CocktailCompareModal
        cocktails={compareCocktails}
        onClose={() => setCompareCocktails(null)}
        onSelectCocktail={(c) => {
          setCompareCocktails(null);
          setSelectedCocktail(c);
        }}
      />

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingOpen}
        onClose={() => setIsShoppingOpen(false)}
        items={shoppingList}
        onToggleItem={handleToggleShoppingItem}
        onClearList={handleClearShopping}
      />
    </div>
  );
}
