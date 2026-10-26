import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Bookmark, 
  ArrowRight, 
  Clock, 
  Scale, 
  Info, 
  Flame, 
  Share2, 
  ShoppingBag,
  RotateCcw,
  Check
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

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'consensuelle':
        return {
          label: 'La Consensuelle',
          border: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          gradient: 'from-emerald-500/15 via-transparent to-transparent',
        };
      case 'signature':
        return {
          label: 'La Signature',
          border: 'border-cyan-400/50 hover:border-cyan-300',
          glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
          badge: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
          gradient: 'from-cyan-500/20 via-transparent to-transparent',
        };
      case 'audacieuse':
      default:
        return {
          label: 'L’Audacieuse',
          border: 'border-purple-500/50 hover:border-purple-400',
          glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
          badge: 'bg-purple-500/25 text-purple-200 border-purple-500/40',
          gradient: 'from-purple-500/20 via-transparent to-transparent',
        };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MIXOLOGIE IA TERMINÉE</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Tes 3 Créations Personnalisées
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Chaque recette explore une facette aromatique différente : consensuelle, équilibrée ou audacieuse.
          </p>
        </div>

        <button
          onClick={onRestartLab}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>Modifier les paramètres</span>
        </button>
      </div>

      {/* Demo notice if active */}
      {demoNotice && (
        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{demoNotice}</span>
        </div>
      )}

      {/* Comparison Helper Bar */}
      {selectedForCompare.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-between text-xs text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-300" />
            <span>
              1er cocktail sélectionné : <strong>{selectedForCompare[0].name}</strong>. Clique sur un 2e pour comparer côte à côte !
            </span>
          </div>
          <button
            onClick={() => setSelectedForCompare([])}
            className="px-2 py-1 rounded-md text-[10px] bg-white/10 hover:bg-white/20 text-white font-mono"
          >
            Annuler
          </button>
        </motion.div>
      )}

      {/* 3 Prominent Glassmorphic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => {
          const style = getBadgeStyle(recipe.type);
          const isFav = favorites.some((f) => f.id === recipe.id);
          const isComparing = selectedForCompare.some((r) => r.id === recipe.id);

          return (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.4 }}
              onClick={() => {
                sounds.playGlassClink();
                onSelectCocktail(recipe);
              }}
              className={`cursor-pointer group relative rounded-3xl overflow-hidden glass-panel border transition-all duration-300 flex flex-col justify-between ${
                isComparing
                  ? 'border-2 border-cyan-400 ring-4 ring-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.4)]'
                  : `${style.border} ${style.glow}`
              }`}
            >
              {/* Subtle gradient sheen behind top image */}
              <div
                className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${style.gradient} pointer-events-none`}
              />

              <div>
                {/* Visual Image container with glass specular reflection */}
                <div className="aspect-[16/10] overflow-hidden relative rounded-t-3xl">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090C15] via-[#090C15]/30 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border backdrop-blur-md font-bold ${style.badge}`}
                    >
                      {style.label}
                    </span>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playTap();
                        onToggleFavorite(recipe);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-purple-600 text-white shadow-[0_0_15px_#a855f7]'
                          : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/70'
                      }`}
                      aria-label="Sauvegarder dans ma collection"
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Glass type & prep time pills unboxed */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs font-mono text-slate-200">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{recipe.prepTimeMinutes} min</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px]">
                      {recipe.difficulty}
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-white group-hover:text-cyan-200 transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-xs font-medium text-cyan-300/90 italic mt-0.5">
                      {recipe.tagline}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Taste Sliders Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Profil :</span>
                      <span className="text-slate-200 font-bold truncate max-w-[180px]">
                        {recipe.tasteProfile.profileName}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>Fruité</span>
                          <span className="text-cyan-300">{recipe.tasteProfile.fruitiness}/5</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${(recipe.tasteProfile.fruitiness / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>Sucre</span>
                          <span className="text-fuchsia-300">{recipe.tasteProfile.sweetness}/5</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-fuchsia-400 rounded-full"
                            style={{ width: `${(recipe.tasteProfile.sweetness / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>Audace</span>
                          <span className="text-purple-300">{recipe.tasteProfile.originality}/5</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-full"
                            style={{ width: `${(recipe.tasteProfile.originality / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key ingredients preview */}
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-500">
                      Ingrédients ({recipe.distinctIngredientsCount}) :
                    </div>
                    <div className="text-xs text-slate-300 flex flex-wrap gap-1.5">
                      {recipe.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-slate-200">
                          {ing.name}
                          {i < Math.min(recipe.ingredients.length, 3) - 1 ? ' ·' : ''}
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="text-slate-400">
                          +{recipe.ingredients.length - 3} autre(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCompareClick(recipe, e)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isComparing
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Sélectionné' : 'Comparer'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playGlassClink();
                      onSelectCocktail(recipe);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                  >
                    <span>Fiche complète</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center text-[10px] font-mono text-slate-400">
                  {recipe.estimatedCost?.status === 'estime'
                    ? `Coût estimé : ${recipe.estimatedCost.min}€ - ${recipe.estimatedCost.max}€ / verre`
                    : 'Prix indicatif à vérifier'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
