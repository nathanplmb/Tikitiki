import React from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Wine, 
  PartyPopper,
  Compass,
  Clock
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
    <div className="space-y-8 pb-24 pt-2">
      {/* EDITORIAL STUDIO HERO COVER */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl">
        {/* Specular hairline top bevel */}
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="tracking-widest uppercase text-[11px] text-slate-300 font-semibold">Atelier de Mixologie</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Intelligence</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-[1.12] text-balance">
              Quel sera votre <br className="hidden sm:inline" />
              prochain mix ?
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Combinez vos spiritueux, vos diluants et vos arômes préférés. L’intelligence artificielle compose instantanément des recettes équilibrées, précises et prêtes à être servies.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartLab();
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full font-display font-semibold text-sm text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]"
              >
                <FlaskConical className="w-4 h-4 text-slate-900" />
                <span>Créer mon cocktail</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onSurpriseMe();
                }}
                disabled={isLoadingSurprise}
                className="flex items-center gap-2 px-5 py-3.5 rounded-full font-display font-medium text-sm text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-purple-300 ${isLoadingSurprise ? 'animate-spin' : ''}`} />
                <span>{isLoadingSurprise ? 'Composition...' : 'Surprends-moi'}</span>
              </button>

              {onOpenParty && (
                <button
                  onClick={() => {
                    sounds.playTap();
                    onOpenParty();
                  }}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-full text-xs font-semibold text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 backdrop-blur-md transition-all"
                >
                  <PartyPopper className="w-4 h-4 text-amber-400" />
                  <span>Soirée</span>
                </button>
              )}
            </div>

            {/* Quiet Unboxed Editorial Metadata */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-white/5">
              <span>Ingrédients de supermarché</span>
              <span aria-hidden="true">·</span>
              <span>1 seule bouteille d’alcool</span>
              <span aria-hidden="true">·</span>
              <span>Option 0.0% sans alcool</span>
            </div>
          </div>

          {/* STUDIO SPOTLIGHT CARD: Midnight Velvet Spritz */}
          <div className="lg:col-span-5 relative">
            <div 
              onClick={() => {
                if (recentCocktails[0]) {
                  sounds.playGlassClink();
                  onSelectCocktail(recentCocktails[0]);
                } else {
                  onStartLab();
                }
              }}
              className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/5] glass-panel border border-white/15 shadow-2xl flex flex-col justify-end p-5 transition-transform duration-500 hover:scale-[1.01]"
            >
              {/* Studio Cocktail Graphic with Liquid & Specular Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C14] via-[#0A0C14]/60 to-purple-950/20 flex items-center justify-center overflow-hidden">
                {/* Backlight Aura */}
                <div className="absolute w-56 h-56 rounded-full bg-purple-700/20 blur-[80px]" />
                
                {/* Studio Glass Silhouette SVG */}
                <svg className="w-56 h-72 opacity-90 transition-transform duration-700 group-hover:scale-105" viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="glassStem" x1="100" y1="140" x2="100" y2="240" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" stopOpacity="0.5"/>
                      <stop offset="1" stopColor="white" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="liquidGrad" x1="100" y1="70" x2="100" y2="155" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F472B6" stopOpacity="0.8"/>
                      <stop offset="0.4" stopColor="#C026D3" stopOpacity="0.9"/>
                      <stop offset="1" stopColor="#581C87" stopOpacity="0.95"/>
                    </linearGradient>
                    <radialGradient id="highlightReflect" cx="70" cy="90" r="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" stopOpacity="0.45"/>
                      <stop offset="1" stopColor="white" stopOpacity="0"/>
                    </radialGradient>
                  </defs>

                  {/* Foot / Base */}
                  <ellipse cx="100" cy="242" rx="46" ry="6" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="white" fillOpacity="0.05" />
                  
                  {/* Stem */}
                  <line x1="100" y1="155" x2="100" y2="240" stroke="url(#glassStem)" strokeWidth="3" strokeLinecap="round" />

                  {/* Balloon Bowl */}
                  <path d="M 50 65 Q 40 120 100 155 Q 160 120 150 65 C 145 60 55 60 50 65 Z" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                  
                  {/* Liquid Body */}
                  <path d="M 54 85 Q 48 122 100 153 Q 152 122 146 85 C 132 88 68 88 54 85 Z" fill="url(#liquidGrad)" />

                  {/* Ice Cubes in Liquid */}
                  <rect x="74" y="92" width="22" height="22" rx="3" transform="rotate(15 74 92)" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                  <rect x="104" y="102" width="20" height="20" rx="3" transform="rotate(-10 104 102)" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.35" strokeWidth="1" />

                  {/* Garnishes: Blackberries & Lime Twist */}
                  <circle cx="70" cy="74" r="7" fill="#3B0764" stroke="#701A75" strokeWidth="1" />
                  <circle cx="76" cy="69" r="6" fill="#4A044E" stroke="#701A75" strokeWidth="1" />
                  <path d="M 125 55 Q 148 65 140 85" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />

                  {/* Specular curved reflection on glass */}
                  <path d="M 58 75 Q 52 110 80 142" stroke="url(#highlightReflect)" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="62" cy="70" rx="2" ry="1.2" fill="white" fillOpacity="0.7" />
                  <ellipse cx="138" cy="70" rx="2" ry="1.2" fill="white" fillOpacity="0.7" />
                </svg>
              </div>

              {/* Bottom Spotlight Info */}
              <div className="relative z-10 p-4 rounded-xl glass-panel-subtle space-y-1.5 border border-white/10 backdrop-blur-xl">
                <div className="text-[10px] font-mono tracking-wider uppercase text-purple-300">
                  Création Vedette
                </div>
                <div className="font-display font-bold text-lg text-white">
                  Midnight Velvet Spritz
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Vodka noble, infusion de mûre sauvage, pink tonic pétillant et zeste de citron vert.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Grand verre ballon</span>
                  <span className="font-mono text-purple-200">~2 min de préparation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT CREATIONS */}
      {recentCocktails.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-xl text-white">
                Dernières créations
              </h2>
              <p className="text-xs text-slate-400">
                Vos recettes récemment formulées dans le laboratoire.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentCocktails.slice(0, 2).map((cocktail) => (
              <div
                key={cocktail.id}
                onClick={() => {
                  sounds.playGlassClink();
                  onSelectCocktail(cocktail);
                }}
                className="cursor-pointer group p-4 rounded-2xl glass-panel-interactive border border-white/10 flex items-center gap-4 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-purple-950/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                  <Wine className="w-8 h-8 text-purple-300 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent pointer-events-none" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px] font-mono text-purple-300 uppercase">
                      {cocktail.type}
                    </span>
                    <span className="font-mono text-[11px]">
                      {cocktail.prepTimeMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-white group-hover:text-purple-200 truncate">
                    {cocktail.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {cocktail.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CURATED AROMATIC PAIRINGS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>Accords aromatiques recommandés</span>
            </h2>
            <p className="text-xs text-slate-400">
              Des combinaisons vérifiées par des sommeliers pour des saveurs équilibrées.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CURATED_PAIRINGS.map((pairing, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                  {pairing.tagline}
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  {pairing.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pairing.description}
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playTap();
                  onStartWithPairing(pairing);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white transition-all text-center"
              >
                Tester cet accord
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MON BAR SUMMARY CARD */}
      <section className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-400">Inventaire personnel</div>
          <div className="font-display font-bold text-lg text-white">
            {inStockCount} ingrédient{inStockCount > 1 ? 's' : ''} disponible{inStockCount > 1 ? 's' : ''} dans votre bar
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            {stockedAlcohols.map((a) => a.name).join(', ') || 'Aucun spiritueux actuellement déclaré en stock.'}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            onStartLab();
          }}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all shrink-0"
        >
          Ouvrir le bar
        </button>
      </section>

      {/* Moderation Notice */}
      <div className="flex items-center gap-2.5 text-xs text-slate-400 px-1">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
        <p>L’abus d’alcool est dangereux pour la santé. MIXLAB encourage la dégustation responsable et propose des options 0.0% sans alcool.</p>
      </div>
    </div>
  );
};
