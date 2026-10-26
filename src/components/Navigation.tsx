import React from 'react';
import { 
  FlaskConical, 
  Compass, 
  Bookmark, 
  Wine, 
  ShoppingCart, 
  Sparkles,
  Layers
} from 'lucide-react';

export type ActiveTab = 'home' | 'lab' | 'discoveries' | 'collection' | 'bar';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  shoppingCount: number;
  onOpenShopping: () => void;
  favoritesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  shoppingCount,
  onOpenShopping,
  favoritesCount,
}) => {
  const navItems = [
    {
      id: 'lab' as ActiveTab,
      label: 'Laboratoire',
      icon: FlaskConical,
      hint: 'Créer un cocktail',
    },
    {
      id: 'discoveries' as ActiveTab,
      label: 'Découvertes',
      icon: Compass,
      hint: 'Roulette & tendances',
    },
    {
      id: 'collection' as ActiveTab,
      label: 'Ma collection',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
      hint: 'Cocktails favoris',
    },
    {
      id: 'bar' as ActiveTab,
      label: 'Mon bar',
      icon: Wine,
      hint: 'Mes ingrédients',
    },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30 p-4 border-r border-white/5 bg-[#0A0D16]/80 backdrop-blur-2xl">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center gap-3 px-3 py-4 mb-6 group transition-all"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border border-cyan-400/30 flex items-center justify-center group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
            <FlaskConical className="w-5 h-5 text-cyan-300 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
              <span>MIXLAB</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Cocktail Studio
            </p>
          </div>
        </div>

        {/* Home Quick Button */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all mb-4 text-left ${
            activeTab === 'home'
              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-cyan-200 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Accueil & Tendance</span>
        </button>

        <div className="h-px bg-white/5 my-2" />

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 py-1">
            Espaces de création
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="leading-snug">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {item.hint}
                    </div>
                  </div>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions: Shopping List */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={onOpenShopping}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Liste de courses</span>
            </div>
            {shoppingCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {shoppingCount}
              </span>
            )}
          </button>

          {/* Signature motto */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/20 text-center">
            <p className="text-[11px] text-purple-300/80 italic font-display">
              « Mix your taste. Discover your signature. »
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D16]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-2">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'home'
                ? 'text-cyan-300 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>Accueil</span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'lab'
                ? 'text-cyan-300 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FlaskConical className="w-5 h-5 mb-0.5" />
            <span>Labo</span>
          </button>

          <button
            onClick={() => setActiveTab('discoveries')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'discoveries'
                ? 'text-cyan-300 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>Découvertes</span>
          </button>

          <button
            onClick={() => setActiveTab('collection')}
            className={`relative flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'collection'
                ? 'text-cyan-300 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-5 h-5 mb-0.5" />
            <span>Collection</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-purple-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('bar')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'bar'
                ? 'text-cyan-300 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wine className="w-5 h-5 mb-0.5" />
            <span>Mon bar</span>
          </button>
        </div>
      </nav>
    </>
  );
};
