import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bookmark, 
  ShoppingCart, 
  Share2, 
  Check, 
  Sparkles, 
  Wine, 
  AlertCircle, 
  Users, 
  Star, 
  ShieldCheck, 
  RefreshCw,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CocktailRecipe } from '../types/cocktail';
import { sounds } from '../utils/audio';

interface CocktailDetailModalProps {
  cocktail: CocktailRecipe | null;
  onClose: () => void;
  onToggleFavorite: (cocktail: CocktailRecipe) => void;
  isFavorite: boolean;
  onAddToShoppingList: (cocktail: CocktailRecipe) => void;
  onSaveRating: (recipeId: string, rating: number, tags: string[], notes: string) => void;
  onGenerateVariant?: (cocktail: CocktailRecipe) => void;
  onOpenCompare?: (cocktail: CocktailRecipe) => void;
}

export const CocktailDetailModal: React.FC<CocktailDetailModalProps> = ({
  cocktail,
  onClose,
  onToggleFavorite,
  isFavorite,
  onAddToShoppingList,
  onSaveRating,
  onGenerateVariant,
  onOpenCompare,
}) => {
  if (!cocktail) return null;

  const [servings, setServings] = useState<number>(1);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [userRating, setUserRating] = useState<number>(cocktail.userRating || 0);
  const [userTags, setUserTags] = useState<string[]>(cocktail.userTags || []);
  const [userNotes, setUserNotes] = useState<string>(cocktail.userNotes || '');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const availableTags = ['Parfait', 'Trop sucré', 'Trop amer', 'Original', 'À refaire', 'Coup de cœur'];

  const toggleStep = (index: number) => {
    sounds.playTap();
    if (checkedSteps.includes(index)) {
      setCheckedSteps(checkedSteps.filter((s) => s !== index));
    } else {
      setCheckedSteps([...checkedSteps, index]);
    }
  };

  const toggleTag = (tag: string) => {
    sounds.playTap();
    const updated = userTags.includes(tag)
      ? userTags.filter((t) => t !== tag)
      : [...userTags, tag];
    setUserTags(updated);
    onSaveRating(cocktail.id, userRating, updated, userNotes);
  };

  const handleRating = (score: number) => {
    sounds.playSuccessChime();
    setUserRating(score);
    onSaveRating(cocktail.id, score, userTags, userNotes);
  };

  const handleNotesChange = (notes: string) => {
    setUserNotes(notes);
    onSaveRating(cocktail.id, userRating, userTags, notes);
  };

  const handleShopping = () => {
    sounds.playTap();
    onAddToShoppingList(cocktail);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleShare = () => {
    sounds.playTap();
    const shareText = `Découvre le cocktail "${cocktail.name}" sur MIXLAB !`;
    if (navigator.share) {
      navigator.share({ title: cocktail.name, text: shareText, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${cocktail.name} - ${cocktail.tagline}\n${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Helper to scale dosage mathematically
  const scaleAmount = (amountStr: string, multiplier: number): string => {
    const match = amountStr.match(/^([\d.,]+)\s*(cl|ml|g|cuillère|tranche|quartier|feuille|trait)?(.*)$/i);
    if (!match) return amountStr;
    const num = parseFloat(match[1].replace(',', '.'));
    if (isNaN(num)) return amountStr;
    const scaled = (num * multiplier).toFixed(multiplier > 1 && num * multiplier % 1 !== 0 ? 1 : 0);
    const unit = match[2] || '';
    const rest = match[3] || '';
    return `${scaled} ${unit}${rest}`.trim();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex justify-center items-end sm:items-center p-0 sm:p-4">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl glass-panel border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 flex flex-col"
        >
          {/* Mobile Drag Handle */}
          <div className="sm:hidden w-12 h-1.5 rounded-full bg-white/30 mx-auto my-3 shrink-0" />

          {/* Sticky Header with Close button */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#090C16]/90 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {cocktail.type}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {cocktail.glassType}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
                title="Partager"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? 'Copié !' : 'Partager'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onToggleFavorite(cocktail);
                }}
                className={`p-2 rounded-xl transition-all ${
                  isFavorite
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_#a855f7]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Ajouter aux favoris"
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Hero Image & Title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden glass-panel border border-white/15 aspect-square shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <img
                  src={cocktail.imageUrl}
                  alt={cocktail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-cyan-300">
                  {cocktail.alcoholEstimate}
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {cocktail.name}
                </h2>
                <p className="text-sm text-cyan-300 font-medium italic">
                  « {cocktail.tagline} »
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {cocktail.description}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 font-mono text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.03] text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Temps</div>
                    <div className="font-bold text-slate-200">{cocktail.prepTimeMinutes} min</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Difficulté</div>
                    <div className="font-bold text-slate-200">{cocktail.difficulty}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Coût / verre</div>
                    <div className="font-bold text-emerald-300">
                      ~{cocktail.estimatedCost?.min ?? 2}€
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVINGS SCALER */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-white">Nombre de verres à préparer :</div>
                  <div className="text-[10px] text-slate-400">Les quantités sont automatiquement recalculées</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
                {[1, 2, 4, 8].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => {
                      sounds.playTap();
                      setServings(qty);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      servings === qty
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {qty} {qty > 1 ? 'verres' : 'verre'}
                  </button>
                ))}
              </div>
            </div>

            {/* INGREDIENTS LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Wine className="w-5 h-5 text-cyan-400" />
                  <span>Ingrédients requis ({cocktail.distinctIngredientsCount})</span>
                </h3>

                <button
                  onClick={handleShopping}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    addedToCart
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{addedToCart ? 'Ajouté à la liste !' : 'Ajouter aux courses'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cocktail.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{ing.name}</div>
                      {ing.formatAdvice && (
                        <div className="text-[10px] text-purple-300 font-mono">
                          Conseil : {ing.formatAdvice}
                        </div>
                      )}
                      {ing.estimatedPrice && (
                        <div className="text-[10px] text-slate-500">
                          {ing.estimatedPrice}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {scaleAmount(ing.amount, servings)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEPS PREPARATION */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Préparation étape par étape</span>
              </h3>

              <div className="space-y-2.5">
                {cocktail.steps.map((step, idx) => {
                  const isDone = checkedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400'
                          : 'glass-panel-interactive border-white/10 text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-white/10 text-cyan-300 border border-white/10'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through' : ''}`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WHY IT WORKS & ALTERNATIVES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aromatic Coherence */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="text-xs font-mono uppercase text-purple-300 font-bold">
                  Pourquoi l’association fonctionne
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cocktail.aromaticCoherence}
                </p>
              </div>

              {/* Mocktail Variant */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                <div className="text-xs font-mono uppercase text-cyan-300 font-bold">
                  Variante sans alcool (Mocktail)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cocktail.mocktailVariant}
                </p>
              </div>
            </div>

            {/* USER RATING & PERSONAL TAGS */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    Note ton cocktail
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ces retours affinent ton profil de mixologie signature.
                  </p>
                </div>

                {/* 5-Star Rating */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                      aria-label={`${star} étoiles`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= userRating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_#fbbf24]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Selector */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {availableTags.map((tag) => {
                  const isActive = userTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Notes Input */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Notes personnelles (ex. 'Testé avec du Schweppes Tonic classique, très réussi')..."
                  value={userNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
