import React, { useState } from 'react';
import { 
  PartyPopper, 
  Users, 
  Euro, 
  Sparkles, 
  ShoppingCart, 
  Clock, 
  Check, 
  Leaf, 
  Wine,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PartyPlan, CocktailRecipe } from '../types/cocktail';
import { INITIAL_CURATED_COCKTAILS } from '../data/curatedCocktails';
import { sounds } from '../utils/audio';

interface PartyPlannerViewProps {
  onAddAllToShoppingList: (plan: PartyPlan) => void;
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
}

export const PartyPlannerView: React.FC<PartyPlannerViewProps> = ({
  onAddAllToShoppingList,
  onSelectCocktail,
}) => {
  const [guests, setGuests] = useState<number>(8);
  const [budget, setBudget] = useState<number>(60);
  const [theme, setTheme] = useState<string>('Apéro estival & Convivial');
  const [includeMocktail, setIncludeMocktail] = useState<boolean>(true);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [partyPlan, setPartyPlan] = useState<PartyPlan | null>(null);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const calculatePlan = () => {
    sounds.playGlassClink();
    const guestMultiplier = Math.max(1, Math.ceil(guests / 4));
    const selectedRecipes = INITIAL_CURATED_COCKTAILS.slice(0, 3);

    // Consolidated shopping items with real bottle packages
    const shopping = [
      {
        item: 'Vodka classique ou Rhum blanc (70cl)',
        bottlesNeeded: `${Math.max(1, Math.ceil((guests * 8) / 70))} bouteille(s) de 70cl`,
        category: 'alcool',
      },
      {
        item: 'Schweppes Pink Tonic ou Indian Tonic',
        bottlesNeeded: `${Math.max(2, Math.ceil((guests * 20) / 100))} bouteille(s) d'1L`,
        category: 'diluant',
      },
      {
        item: 'Limonade artisanale ou Ginger beer',
        bottlesNeeded: `${Math.max(1, Math.ceil((guests * 15) / 100))} bouteille(s) d'1L`,
        category: 'diluant',
      },
      {
        item: 'Sirop de mûre ou fruit de la passion (25cl)',
        bottlesNeeded: '1 flacon 25cl',
        category: 'sirop',
      },
      {
        item: 'Citrons verts frais entiers',
        bottlesNeeded: `${Math.ceil(guests * 0.75)} citrons`,
        category: 'garniture',
      },
      {
        item: 'Bouquet de menthe fraîche',
        bottlesNeeded: '1 bouquet',
        category: 'garniture',
      },
      {
        item: 'Sacs de glaçons pleins (2kg)',
        bottlesNeeded: `${Math.max(1, Math.ceil(guests / 5))} sac(s)`,
        category: 'autre',
      },
    ];

    const timeline = [
      'J-1 : Réserver les glaçons et placer tous les diluants au réfrigérateur pour garantir une effervescence parfaite.',
      'H-2 : Tailler les quartiers de citron vert et effeuiller la menthe dans des récipients hermétiques fermés au frais.',
      'H-30 min : Disposer les verres, les pailles réutilisables, le doseur (jigger) et la glace sur le plan de travail.',
      'Début de soirée : Proposer d’abord la version mocktail rafraîchissante ou le cocktail signature en guise d’accueil.',
    ];

    const plan: PartyPlan = {
      guestCount: guests,
      budgetTotalEur: budget,
      theme,
      recipes: selectedRecipes,
      mocktailRecipe: {
        ...selectedRecipes[0],
        id: 'party-virgin-1',
        name: 'Virgin Berry Sunset',
        tagline: 'Alternative festive 0.0% d’alcool',
        alcoholEstimate: '0.0% Sans alcool',
        isMocktailOnly: true,
      },
      consolidatedShopping: shopping,
      prepTimeline: timeline,
    };

    setPartyPlan(plan);
    setIsCalculated(true);
  };

  const handleTransferToCart = () => {
    if (!partyPlan) return;
    sounds.playTap();
    onAddAllToShoppingList(partyPlan);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-medium border border-amber-500/20">
          <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
          <span>PLANIFICATEUR D’ÉVÉNEMENT</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Organisateur de Soirée
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Compose un menu de cocktails harmonieux et calcule automatiquement la liste de courses globale.
        </p>
      </div>

      {/* Input Parameters Card */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guests */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Nombre de participants :</span>
              </span>
              <strong className="text-white font-mono text-sm">{guests} personnes</strong>
            </label>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5 text-slate-400" />
                <span>Budget indicatif total :</span>
              </span>
              <strong className="text-emerald-300 font-mono text-sm">~{budget} €</strong>
            </label>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMocktail}
              onChange={(e) => setIncludeMocktail(e.target.checked)}
              className="rounded accent-purple-400"
            />
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>Inclure un mocktail signature équivalent</span>
            </span>
          </label>

          <button
            onClick={calculatePlan}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Générer le menu & les courses</span>
          </button>
        </div>
      </div>

      {/* RESULTING PARTY PLAN */}
      {isCalculated && partyPlan && (
        <div className="space-y-6">
          {/* Menu Cocktails */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <Wine className="w-4 h-4 text-purple-400" />
              <span>Menu de Soirée Suggéré</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partyPlan.recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onSelectCocktail(recipe)}
                  className="cursor-pointer p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all flex items-center gap-3"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-purple-300 uppercase">
                      {recipe.type}
                    </span>
                    <h3 className="font-display font-bold text-sm text-white truncate">
                      {recipe.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {recipe.tagline}
                    </p>
                  </div>
                </div>
              ))}

              {includeMocktail && partyPlan.mocktailRecipe && (
                <div
                  onClick={() => onSelectCocktail(partyPlan.mocktailRecipe!)}
                  className="cursor-pointer p-4 rounded-2xl glass-panel border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center gap-3"
                >
                  <img
                    src={partyPlan.mocktailRecipe.imageUrl}
                    alt={partyPlan.mocktailRecipe.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-emerald-300 uppercase">
                      Option Mocktail 0.0%
                    </span>
                    <h3 className="font-display font-bold text-sm text-white truncate">
                      {partyPlan.mocktailRecipe.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {partyPlan.mocktailRecipe.tagline}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consolidated Shopping List */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Achats Consolidés ({guests} personnes)
                </h3>
                <p className="text-xs text-slate-400">
                  Calcul en bouteilles réelles et flacons pour éviter les restes inutiles.
                </p>
              </div>

              <button
                onClick={handleTransferToCart}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-slate-950 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{addedNotice ? 'Courses ajoutées !' : 'Tout ajouter'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {partyPlan.consolidatedShopping.map((shop, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/[0.03] flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200">{shop.item}</span>
                  <span className="font-mono font-bold text-white text-xs shrink-0">
                    {shop.bottlesNeeded}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Timeline */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="font-display font-semibold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Planning de Préparation</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              {partyPlan.prepTimeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02]">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
