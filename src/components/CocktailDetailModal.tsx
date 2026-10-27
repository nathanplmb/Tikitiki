import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bookmark, 
  ShoppingCart, 
  Share2, 
  Check, 
  Sparkles, 
  Wine, 
  Users, 
  Star, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Edit3,
  Scale
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
  onRebalanceWithAI?: (cocktail: CocktailRecipe, tweak: string) => Promise<void>;
  onOpenCompare?: (cocktail: CocktailRecipe) => void;
}

export const CocktailDetailModal: React.FC<CocktailDetailModalProps> = ({
  cocktail,
  onClose,
  onToggleFavorite,
  isFavorite,
  onAddToShoppingList,
  onSaveRating,
  onRebalanceWithAI,
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

  // Preparation Timer
  const [timerDuration, setTimerDuration] = useState<number>(cocktail.timerSeconds || 15);
  const [timeLeft, setTimeLeft] = useState<number>(cocktail.timerSeconds || 15);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Edit / Rebalance mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rebalancePrompt, setRebalancePrompt] = useState<string>('');
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);

  const availableTags = ['Parfait', 'Trop sucré', 'Trop amer', 'Original', 'À refaire', 'Coup de cœur'];

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sounds.playSuccessChime();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => {
    sounds.playTap();
    if (timeLeft === 0) setTimeLeft(timerDuration);
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    sounds.playTap();
    setIsTimerRunning(false);
    setTimeLeft(timerDuration);
  };

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
    sounds.playGlassClink();
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
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = () => {
    sounds.playTap();
    if (navigator.share) {
      navigator.share({ title: cocktail.name, text: `${cocktail.name} sur MIXLAB`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${cocktail.name} - ${cocktail.tagline}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRebalanceSubmit = async () => {
    if (!rebalancePrompt.trim() || !onRebalanceWithAI) return;
    setIsRebalancing(true);
    sounds.playTap();
    try {
      await onRebalanceWithAI(cocktail, rebalancePrompt.trim());
      setIsEditing(false);
      setRebalancePrompt('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRebalancing(false);
    }
  };

  // Mathematical scaler
  const scaleAmount = (amountStr: string, multiplier: number): string => {
    const match = amountStr.match(/^([\d.,]+)\s*(cl|ml|g|cuillère|tranche|quartier|feuille|trait)?(.*)$/i);
    if (!match) return amountStr;
    const num = parseFloat(match[1].replace(',', '.'));
    if (isNaN(num)) return amountStr;
    const scaled = (num * multiplier).toFixed(multiplier > 1 && (num * multiplier) % 1 !== 0 ? 1 : 0);
    const unit = match[2] || '';
    const rest = match[3] || '';
    return `${scaled} ${unit}${rest}`.trim();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex justify-center items-end sm:items-center p-0 sm:p-4">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] glass-panel border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 flex flex-col"
        >
          {/* Mobile Drag Handle */}
          <div className="sm:hidden w-12 h-1 rounded-full bg-white/20 mx-auto my-3 shrink-0" />

          {/* Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#0A0C14]/90 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                {cocktail.glassType}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                {cocktail.alcoholEstimate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5"
                title="Partager"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copiedLink ? 'Copié' : 'Partager'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onToggleFavorite(cocktail);
                }}
                className={`p-2 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
                title="Favori"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Visual Header */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/40">
                <img
                  src={cocktail.imageUrl}
                  alt={cocktail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C14] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="font-display font-bold text-2xl text-white">
                    {cocktail.name}
                  </h2>
                  <p className="text-xs text-slate-300 italic mt-0.5">
                    « {cocktail.tagline} »
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {cocktail.description}
              </p>

              {/* Quick stats unboxed */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400 border-y border-white/5 py-3 font-mono">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Temps</span>
                  <span className="font-bold text-white">{cocktail.prepTimeMinutes} min</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Difficulté</span>
                  <span className="font-bold text-white">{cocktail.difficulty}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Coût indicatif</span>
                  <span className="font-bold text-white">~{cocktail.estimatedCost?.min ?? 2}€</span>
                </div>
              </div>
            </div>

            {/* SERVINGS SCALER */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Nombre de verres :</span>
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                {[1, 2, 4, 8].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => {
                      sounds.playTap();
                      setServings(qty);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      servings === qty
                        ? 'bg-white text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* INGREDIENTS LIST */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-base text-white flex items-center gap-2">
                  <Wine className="w-4 h-4 text-slate-400" />
                  <span>Ingrédients ({cocktail.distinctIngredientsCount})</span>
                </h3>

                <button
                  onClick={handleShopping}
                  className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                    addedToCart
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{addedToCart ? 'Ajouté !' : 'Ajouter aux courses'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {cocktail.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl glass-panel-subtle flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{ing.name}</div>
                      {ing.formatAdvice && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ing.formatAdvice}
                        </div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-white text-xs">
                      {scaleAmount(ing.amount, servings)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP-BY-STEP PREPARATION & TIMER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-base text-white">
                  Préparation
                </h3>

                {/* Minuteur Pill */}
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-xs font-mono text-slate-300 border border-white/5">
                  <Timer className="w-3.5 h-3.5 text-purple-300" />
                  <span>{timeLeft}s</span>
                  <button
                    onClick={toggleTimer}
                    className="p-0.5 rounded text-white hover:text-purple-300"
                    title={isTimerRunning ? 'Pause' : 'Démarrer le chrono'}
                  >
                    {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-0.5 rounded text-slate-400 hover:text-white"
                    title="Réinitialiser"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {cocktail.steps.map((step, idx) => {
                  const isDone = checkedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        isDone
                          ? 'bg-white/[0.02] border-white/5 text-slate-500'
                          : 'glass-panel-subtle border-white/5 text-slate-200 hover:border-white/15'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <p className={`text-xs leading-relaxed ${isDone ? 'line-through' : ''}`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AROMATIC COHERENCE & MOCKTAIL VARIANT */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Cohérence aromatique
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {cocktail.aromaticCoherence}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Variante sans alcool
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {cocktail.mocktailVariant}
                </p>
              </div>
            </div>

            {/* EDIT & REBALANCE WITH AI */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ajuster ou rééquilibrer la recette</span>
                </button>
              </div>

              {isEditing && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <p className="text-[11px] text-slate-400">
                    Demande à l’IA d’adapter cette recette (ex: « Remplacer le tonic par du ginger ale », « Version moins sucrée ») :
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ta consigne de rééquilibrage..."
                      value={rebalancePrompt}
                      onChange={(e) => setRebalancePrompt(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={handleRebalanceSubmit}
                      disabled={isRebalancing || !rebalancePrompt.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 disabled:opacity-50"
                    >
                      {isRebalancing ? 'Calcul...' : 'Rééquilibrer'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RATING & NOTES */}
            <div className="p-4 rounded-2xl glass-panel-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Note personnelle :</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleRating(s)}
                      className="p-1 text-slate-500 hover:text-amber-400"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                      userTags.includes(tag)
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Ajouter une note personnelle..."
                value={userNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
