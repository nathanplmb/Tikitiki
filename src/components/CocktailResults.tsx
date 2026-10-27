import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, 
  ArrowRight, 
  Clock, 
  Scale, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { CocktailRecipe } from '../types/cocktail';
import { sounds } from '../utils/audio';

interface CocktailResultsProps {
  recipes: CocktailRecipe[];
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
  onToggleFavorite: (cocktail: CocktailRecipe) => void;
  favorites: CocktailRecipe[];
  onOpenCompare: (c1: CocktailRecipe, c2: CocktailRecipe) => void;
  onRestartLab: () => void;
  demoNotice?: string;
}

export const CocktailResults: React.FC<CocktailResultsProps> = ({
  recipes,
  onSelectCocktail,
  onToggleFavorite,
  favorites,
  onOpenCompare,
  onRestartLab,
  demoNotice,
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<CocktailRecipe[]>([]);

  const handleCompareClick = (recipe: CocktailRecipe, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    if (selectedForCompare.some((r) => r.id === recipe.id)) {
      setSelectedForCompare(selectedForCompare.filter((r) => r.id !== recipe.id));
    } else {
      if (selectedForCompare.length === 1) {
        onOpenCompare(selectedForCompare[0], recipe);
        setSelectedForCompare([]);
      } else {
        setSelectedForCompare([recipe]);
      }
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'consensuelle':
        return {
          label: 'La Consensuelle',
          badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
        };
      case 'signature':
        return {
          label: 'La Signature',
          badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
        };
      case 'audacieuse':
      default:
        return {
          label: 'L’Audacieuse',
          badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
        };
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="font-display font-bold text-2xl text-white">
            Créations MIXLAB
          </h1>
          <p className="text-xs text-slate-400">
            3 recettes équilibrées conçues selon tes critères.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            onRestartLab();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Modifier</span>
        </button>
      </div>

      {/* Notice if demo/fallback */}
      {demoNotice && (
        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{demoNotice}</span>
        </div>
      )}

      {/* Compare helper */}
      {selectedForCompare.length === 1 && (
        <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-300" />
            <span>Sélectionné : <strong>{selectedForCompare[0].name}</strong>. Choisis une 2e recette à comparer.</span>
          </div>
          <button
            onClick={() => setSelectedForCompare([])}
            className="text-[10px] text-slate-400 hover:text-white"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-4">
        {recipes.map((recipe, index) => {
          const style = getCardStyle(recipe.type);
          const isFav = favorites.some((f) => f.id === recipe.id);
          const isComparing = selectedForCompare.some((r) => r.id === recipe.id);

          return (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              onClick={() => {
                sounds.playGlassClink();
                onSelectCocktail(recipe);
              }}
              className={`cursor-pointer group rounded-3xl overflow-hidden glass-panel border transition-all ${
                isComparing
                  ? 'border-purple-400 ring-2 ring-purple-400/20 shadow-lg'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E18] via-[#0C0E18]/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-md ${style.badgeClass}`}>
                    {style.label}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playTap();
                      onToggleFavorite(recipe);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      isFav
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-black/40 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Bottom glass stats */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{recipe.prepTimeMinutes} min</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md font-mono text-[10px]">
                    {recipe.alcoholEstimate}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-200 transition-colors">
                    {recipe.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    « {recipe.tagline} »
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>

                {/* Ingredients summary */}
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-1.5 pt-1">
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">
                      {ing.name}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => handleCompareClick(recipe, e)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Sélectionné' : 'Comparer'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs text-white font-medium group-hover:translate-x-1 transition-transform">
                    <span>Fiche détaillée</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
