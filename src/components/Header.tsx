import React from 'react';
import { Sparkles, Dice5, ShoppingCart, Info, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onSurpriseMe: () => void;
  onOpenRoulette: () => void;
  onOpenShopping: () => void;
  shoppingCount: number;
  isLoadingSurprise?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSurpriseMe,
  onOpenRoulette,
  onOpenShopping,
  shoppingCount,
  isLoadingSurprise,
}) => {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/5 bg-[#08090E]/80 backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Title or Slogan */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-400/30 flex items-center justify-center">
              <span className="font-display font-black text-cyan-300 text-xs">MX</span>
            </div>
            <span className="font-display font-bold text-white text-base tracking-wide">MIXLAB</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-mono text-slate-300">Labo actif</span>
            <span className="text-slate-600">·</span>
            <span className="italic text-slate-400">« Mix your taste. Discover your signature. »</span>
          </div>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Roulette */}
          <button
            onClick={onOpenRoulette}
            title="Roulette des saveurs"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-500/30 hover:border-purple-400 transition-all shadow-[0_0_12px_rgba(168,85,247,0.15)]"
          >
            <Dice5 className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span className="hidden sm:inline">Roulette</span>
          </button>

          {/* Quick Surprise Me */}
          <button
            onClick={onSurpriseMe}
            disabled={isLoadingSurprise}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 hover:from-cyan-500/30 hover:to-fuchsia-500/30 text-cyan-100 border border-cyan-400/40 hover:border-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-cyan-300 ${isLoadingSurprise ? 'animate-spin' : ''}`} />
            <span>{isLoadingSurprise ? 'Génération...' : 'Surprends-moi'}</span>
          </button>

          {/* Mobile Shopping Cart trigger */}
          <button
            onClick={onOpenShopping}
            className="lg:hidden relative p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Liste de courses"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            {shoppingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-black flex items-center justify-center">
                {shoppingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
