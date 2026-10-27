import React from 'react';
import { 
  FlaskConical, 
  Compass, 
  Bookmark, 
  Wine, 
  ShoppingCart, 
  Home,
  PartyPopper
} from 'lucide-react';

export type ActiveTab = 'home' | 'lab' | 'discoveries' | 'collection' | 'bar' | 'party';

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
      id: 'home' as ActiveTab,
      label: 'Accueil',
      icon: Home,
    },
    {
      id: 'lab' as ActiveTab,
      label: 'Labo',
      icon: FlaskConical,
    },
    {
      id: 'discoveries' as ActiveTab,
      label: 'Découvertes',
      icon: Compass,
    },
    {
      id: 'collection' as ActiveTab,
      label: 'Collection',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      id: 'bar' as ActiveTab,
      label: 'Mon bar',
      icon: Wine,
    },
  ];

  return (
    <>
      {/* DESKTOP TOP/SIDEBAR NAVIGATION (SUBTLE & REFINED) */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30 p-5 border-r border-white/5 bg-[#0C0E18]/85 backdrop-blur-2xl">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center gap-3 px-2 py-3 mb-6 group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition-all">
            <FlaskConical className="w-4 h-4 text-slate-200" />
          </div>
          <div>
            <div className="font-display font-bold text-base tracking-wide text-white">
              MIXLAB
            </div>
            <p className="text-[11px] text-slate-400">
              Atelier de Mixologie
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="h-px bg-white/5 my-3" />

          {/* Party Planner Tab */}
          <button
            onClick={() => setActiveTab('party')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === 'party'
                ? 'bg-amber-500/15 text-amber-200 border border-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3">
              <PartyPopper className="w-4 h-4 text-amber-400" />
              <span>Organisateur de Soirée</span>
            </div>
          </button>
        </nav>

        {/* Bottom Actions: Shopping List */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={onOpenShopping}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-300 hover:text-white transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-slate-400" />
              <span>Liste de courses</span>
            </div>
            {shoppingCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {shoppingCount}
              </span>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center italic pt-2">
            « Mix your taste. Discover your signature. »
          </p>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION (APPLE TAB BAR DESIGN) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0C14]/90 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 pb-5">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center py-1 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white stroke-[2.2]' : 'text-slate-400 stroke-[1.7]'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-white mt-1" />
                )}
                {item.badge !== undefined && (
                  <span className="absolute top-0.5 right-3 w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
