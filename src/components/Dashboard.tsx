import React from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  Dice5, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Wine, 
  BookmarkCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { CocktailRecipe, UserBarItem } from '../types/cocktail';
import { CURATED_PAIRINGS, PairingSuggestion } from '../data/ingredients';

interface DashboardProps {
  onStartLab: () => void;
  onSurpriseMe: () => void;
  onOpenRoulette: () => void;
  recentCocktails: CocktailRecipe[];
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
  userBar: UserBarItem[];
  onStartWithPairing: (pairing: PairingSuggestion) => void;
  isLoadingSurprise?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartLab,
  onSurpriseMe,
  onOpenRoulette,
  recentCocktails,
  onSelectCocktail,
  userBar,
  onStartWithPairing,
  isLoadingSurprise,
}) => {
  const inStockCount = userBar.filter((item) => item.inStock).length;
  const stockedAlcohols = userBar.filter((item) => item.category === 'alcool' && item.inStock);

  return (
    <div className="space-y-10 pb-16">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Ambient glow inside hero */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/20 via-purple-600/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-600/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 relative z-10">
          {/* Left Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>LABORATOIRE DE MIXOLOGIE IA</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Quel sera ton <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
                prochain mix ?
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Sélectionne tes alcools, diluants et arômes favoris. L’intelligence artificielle Gemini conçoit instantanément des recettes équilibrées, réalisables et adaptées à tes envies de soirée.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartLab}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-semibold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-200 hover:from-cyan-300 hover:to-white transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <FlaskConical className="w-5 h-5 text-slate-900" />
                <span>Créer mon cocktail</span>
                <ArrowRight className="w-4 h-4 ml-1 text-slate-900" />
              </button>

              <button
                onClick={onSurpriseMe}
                disabled={isLoadingSurprise}
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-display font-medium text-sm sm:text-base text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <Sparkles className={`w-4 h-4 text-purple-300 ${isLoadingSurprise ? 'animate-spin' : ''}`} />
                <span>{isLoadingSurprise ? 'Création en cours...' : 'Surprends-moi'}</span>
              </button>

              <button
                onClick={onOpenRoulette}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/[0.04] border border-white/5 hover:border-white/15 transition-all"
              >
                <Dice5 className="w-4 h-4 text-purple-400" />
                <span>Roulette des saveurs</span>
              </button>
            </div>

            {/* Quick stats / Features unboxed */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-white/5 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Supermarchés français</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>1 seule bouteille d’alcool</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dosages précis par verre</span>
              </div>
            </div>
          </div>

          {/* Right Immersive Cocktail Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden glass-panel border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
                  alt="Neon Cocktail Signature"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090C15] via-[#090C15]/40 to-transparent" />
                
                {/* Neon Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-panel border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                      Signature du jour
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">
                      ~2.20€ / verre
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Midnight Velvet Spritz
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Vodka, sirop de mûre sauvage, pink tonic et zeste de citron vert givré.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: TES DERNIÈRES CRÉATIONS */}
      {recentCocktails.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Tes dernières créations
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Retrouve les recettes récemment testées ou imaginées dans le laboratoire.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentCocktails.slice(0, 3).map((cocktail) => (
              <div
                key={cocktail.id}
                onClick={() => onSelectCocktail(cocktail)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden glass-panel-interactive border border-white/10 hover:border-cyan-400/40 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden relative">
                    <img
                      src={cocktail.imageUrl}
                      alt={cocktail.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                      {cocktail.type}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950/80 backdrop-blur-md text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{cocktail.prepTimeMinutes} min</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                      {cocktail.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {cocktail.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>{cocktail.distinctIngredientsCount} ingrédients</span>
                  <span className="text-cyan-300 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Voir la fiche <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION: ASSOCIATIONS À DÉCOUVRIR */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-fuchsia-400" />
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Associations à découvrir
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Des accords aromatiques éprouvés, harmonieux et facilement réalisables à la maison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CURATED_PAIRINGS.map((pairing, index) => (
            <div
              key={index}
              className="rounded-2xl glass-panel p-5 space-y-4 border border-white/10 hover:border-purple-400/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">
                  {pairing.tagline}
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  {pairing.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pairing.description}
                </p>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/20 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-purple-300">
                    Pourquoi ça marche
                  </div>
                  <div className="text-xs text-slate-300">
                    {pairing.whyItWorks}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartWithPairing(pairing)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-purple-500/20 text-purple-200 border border-purple-500/30 transition-all"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Tester cette combinaison</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: LES TENDANCES DE TON BAR */}
      <section className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <Wine className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                Les tendances de ton bar
              </h2>
              <p className="text-xs text-slate-400">
                Statistiques basées sur tes bouteilles en stock et tes préférences enregistrées.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {inStockCount} ingrédients disponibles
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Bases en réserve
            </div>
            <div className="text-2xl font-display font-bold text-white">
              {stockedAlcohols.length} bouteilles
            </div>
            <div className="text-xs text-slate-400 truncate">
              {stockedAlcohols.map((a) => a.name).join(', ') || 'Aucun alcool renseigné'}
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Profil dominant
            </div>
            <div className="text-2xl font-display font-bold text-cyan-300">
              Fruits & Bulles
            </div>
            <div className="text-xs text-slate-400">
              Favorise les associations rafraîchissantes et peu amères.
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Optimisation budget
            </div>
            <div className="text-2xl font-display font-bold text-emerald-300">
              Éco-responsable
            </div>
            <div className="text-xs text-slate-400">
              Recettes priorisant 1 seul alcool et petits formats de sirops.
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE DRINKING BANNER */}
      <div className="rounded-xl p-4 bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <p>
          <strong className="text-slate-300">Consommation responsable :</strong> L’alcool se savoure avec modération. Proposez toujours des alternatives sans alcool à vos invités et ne prenez jamais le volant après avoir bu.
        </p>
      </div>
    </div>
  );
};
