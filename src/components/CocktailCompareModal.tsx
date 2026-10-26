import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, Clock, Check, Sparkles, ArrowRight } from 'lucide-react';
import { CocktailRecipe } from '../types/cocktail';
import { sounds } from '../utils/audio';

interface CocktailCompareModalProps {
  cocktails: [CocktailRecipe, CocktailRecipe] | null;
  onClose: () => void;
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
}

export const CocktailCompareModal: React.FC<CocktailCompareModalProps> = ({
  cocktails,
  onClose,
  onSelectCocktail,
}) => {
  if (!cocktails) return null;
  const [c1, c2] = cocktails;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-cyan-400/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Scale className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Comparateur de Créations
                </h2>
                <p className="text-xs text-slate-400">
                  Compare les ingrédients, l’équilibre et le profil aromatique côte à côte.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid Side-by-Side Comparison */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[c1, c2].map((c, i) => (
              <div key={c.id} className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 aspect-video">
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur text-cyan-300 uppercase">
                    {c.type}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                    {c.name}
                  </h3>
                  <p className="text-xs text-cyan-300/80 italic mt-0.5 line-clamp-1">
                    {c.tagline}
                  </p>
                </div>

                {/* Metrics */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Temps :</span>
                    <span className="text-white font-bold">{c.prepTimeMinutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ingrédients :</span>
                    <span className="text-white font-bold">{c.distinctIngredientsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alcool estimé :</span>
                    <span className="text-cyan-300 font-bold">{c.alcoholEstimate}</span>
                  </div>
                </div>

                {/* Taste bars */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Équilibre gustatif
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Fruité</span>
                      <span className="text-cyan-300">{c.tasteProfile.fruitiness}/5</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${(c.tasteProfile.fruitiness / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Sucre</span>
                      <span className="text-fuchsia-300">{c.tasteProfile.sweetness}/5</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-fuchsia-400 rounded-full"
                        style={{ width: `${(c.tasteProfile.sweetness / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Originalité</span>
                      <span className="text-purple-300">{c.tasteProfile.originality}/5</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${(c.tasteProfile.originality / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Ingrédients list */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Composition :
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {c.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex justify-between p-1.5 rounded bg-white/[0.02]">
                        <span className="truncate pr-1">{ing.name}</span>
                        <span className="font-mono text-cyan-300 shrink-0">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    sounds.playGlassClink();
                    onClose();
                    onSelectCocktail(c);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Choisir cette recette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
