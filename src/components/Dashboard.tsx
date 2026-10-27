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
  PartyPopper,
  CheckCircle2
} from 'lucide-react';
import { CocktailRecipe, UserBarItem } from '../types/cocktail';
import { CURATED_PAIRINGS, PairingSuggestion } from '../data/ingredients';
import { sounds } from '../utils/audio';

interface DashboardProps {
  onStartLab: () => void;
  onSurpriseMe: () => void;
  onOpenRoulette: () => void;
  onOpenParty?: () => void;
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
  onOpenParty,
  recentCocktails,
  onSelectCocktail,
  userBar,
  onStartWithPairing,
  isLoadingSurprise,
}) => {
  const inStockCount = userBar.filter((item) => item.inStock).length;
  const stockedAlcohols = userBar.filter((item) => item.category === 'alcool' && item.inStock);

  return (
    <div className="space-y-8 pb-20">
      {/* HERO SECTION (APPLE-GRADE FROSTED GLASS & IMMERSIVE PHOTO) */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
              MIXLAB STUDIO
            </span>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Quel sera ton <br className="hidden sm:inline" />
              prochain mix ?
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
              Sélectionne tes alcools, softs et arômes préférés. L’intelligence artificielle Gemini conçoit instantanément des recettes équilibrées, accessibles et élégantes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartLab();
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-display font-semibold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-[0.98]"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Créer mon cocktail</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onSurpriseMe();
                }}
                disabled={isLoadingSurprise}
                className="flex items-center gap-2 px-4 py-3 rounded-full font-display font-medium text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-purple-300 ${isLoadingSurprise ? 'animate-spin' : ''}`} />
                <span>{isLoadingSurprise ? 'Création...' : 'Surprends-moi'}</span>
              </button>

              {onOpenParty && (
                <button
                  onClick={() => {
                    sounds.playTap();
                    onOpenParty();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-full text-xs font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                  <span>Soirée</span>
                </button>
              )}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 border-t border-white/5">
              <span>Supermarchés français</span>
              <span>·</span>
              <span>1 seule bouteille</span>
              <span>·</span>
              <span>Option sans alcool</span>
            </div>
          </div>

          {/* Right Spotlight Cocktail */}
          <div className="md:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] glass-panel border border-white/10 group shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80"
                alt="Signature Cocktail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C14] via-[#0A0C14]/30 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl glass-panel-subtle space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Signature recommandée
                </div>
                <div className="font-display font-bold text-sm text-white">
                  Midnight Velvet Spritz
                </div>
                <div className="text-[11px] text-slate-300">
                  Vodka, mûre sauvage, pink tonic et zeste de citron vert.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT CREATIONS */}
      {recentCocktails.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-white">
              Tes dernières créations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentCocktails.slice(0, 2).map((cocktail) => (
              <div
                key={cocktail.id}
                onClick={() => {
                  sounds.playGlassClink();
                  onSelectCocktail(cocktail);
                }}
                className="cursor-pointer group p-3.5 rounded-2xl glass-panel-interactive border border-white/10 flex items-center gap-3.5"
              >
                <img
                  src={cocktail.imageUrl}
                  alt={cocktail.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 uppercase">
                      {cocktail.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cocktail.prepTimeMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-purple-200 truncate">
                    {cocktail.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {cocktail.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CURATED PAIRINGS SPOTLIGHT */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Accords Aromatiques à Explorer</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CURATED_PAIRINGS.map((pairing, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {pairing.tagline}
                </span>
                <h3 className="font-display font-bold text-sm text-white">
                  {pairing.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {pairing.description}
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playTap();
                  onStartWithPairing(pairing);
                }}
                className="w-full py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white transition-all text-center"
              >
                Tester cette association
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MON BAR TRENDS PREVIEW */}
      <section className="p-5 rounded-3xl glass-panel border border-white/10 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xs text-slate-400">Inventaire personnel</div>
          <div className="font-display font-bold text-base text-white">
            {inStockCount} ingrédients disponibles dans ton bar
          </div>
          <div className="text-[11px] text-slate-400">
            {stockedAlcohols.map((a) => a.name).join(', ') || 'Aucune bouteille déclarée'}
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            onStartLab();
          }}
          className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white"
        >
          Ouvrir le bar
        </button>
      </section>

      {/* Moderation Reminder */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 px-2">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
        <p>L’alcool est à consommer avec modération. Pensez à proposer des mocktails sans alcool.</p>
      </div>
    </div>
  );
};
