import React from 'react';
import { Sparkles, Dice5, ShoppingCart, PartyPopper } from 'lucide-react';

interface HeaderProps {
  onSurpriseMe: () => void;
  onOpenRoulette: () => void;
  onOpenShopping: () => void;
  onOpenParty?: () => void;
  shoppingCount: number;
  isLoadingSurprise?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSurpriseMe,
  onOpenRoulette,
  onOpenShopping,
  onOpenParty,
  shoppingCount,
  isLoadingSurprise,
}) => {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/5 bg-[#0A0C14]/80 backdrop-blur-xl px-4 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-display font-black text-xs text-white">
            MX
          </div>
          <div>
            <span className="font-display font-semibold text-white text-sm tracking-wide">MIXLAB</span>
            <span className="hidden sm:inline text-xs text-slate-400 ml-2 font-normal">
              Atelier
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Party Planner Shortcut */}
          {onOpenParty && (
            <button
              onClick={onOpenParty}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 transition-all"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Soirée</span>
            </button>
          )}

          {/* Quick Surprise Me */}
          <button
            onClick={onSurpriseMe}
            disabled={isLoadingSurprise}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-300 ${isLoadingSurprise ? 'animate-spin' : ''}`} />
            <span>{isLoadingSurprise ? 'Création...' : 'Surprends-moi'}</span>
          </button>

          {/* Mobile Shopping Cart */}
          <button
            onClick={onOpenShopping}
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
            aria-label="Liste de courses"
          >
            <ShoppingCart className="w-4 h-4" />
            {shoppingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                {shoppingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
