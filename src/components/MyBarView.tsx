import React, { useState } from 'react';
import { 
  Wine, 
  Plus, 
  Check, 
  Sparkles, 
  FlaskConical, 
  Trash2, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { UserBarItem } from '../types/cocktail';
import { sounds } from '../utils/audio';

interface MyBarViewProps {
  userBar: UserBarItem[];
  onToggleStock: (id: string) => void;
  onAddItem: (name: string, category: UserBarItem['category']) => void;
  onRemoveItem: (id: string) => void;
  onGenerateFromBar: (stockedBases: string[], stockedMixers: string[], stockedAromatics: string[]) => void;
}

export const MyBarView: React.FC<MyBarViewProps> = ({
  userBar,
  onToggleStock,
  onAddItem,
  onRemoveItem,
  onGenerateFromBar,
}) => {
  const [activeCategory, setActiveCategory] = useState<UserBarItem['category']>('alcool');
  const [newItemName, setNewItemName] = useState<string>('');

  const categories: { id: UserBarItem['category']; label: string }[] = [
    { id: 'alcool', label: 'Bases Alcoolisées' },
    { id: 'diluant', label: 'Diluants & Sodas' },
    { id: 'sirop', label: 'Sirops' },
    { id: 'garniture', label: 'Garnitures & Fruits' },
  ];

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    sounds.playTap();
    onAddItem(newItemName.trim(), activeCategory);
    setNewItemName('');
  };

  const stockedItems = userBar.filter((item) => item.inStock);
  const stockedBases = userBar.filter((i) => i.category === 'alcool' && i.inStock).map((i) => i.name);
  const stockedMixers = userBar.filter((i) => i.category === 'diluant' && i.inStock).map((i) => i.name);
  const stockedAromatics = userBar
    .filter((i) => (i.category === 'sirop' || i.category === 'garniture') && i.inStock)
    .map((i) => i.name);

  const filteredItems = userBar.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
            <Wine className="w-3.5 h-3.5" />
            <span>INVENTAIRE DU BAR</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Mon Bar Personnel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Coche les bouteilles et softs en réserve chez toi pour générer des recettes sans rien acheter de plus.
          </p>
        </div>

        {/* Generate with my bar button */}
        <button
          onClick={() => {
            sounds.playSuccessChime();
            onGenerateFromBar(stockedBases, stockedMixers, stockedAromatics);
          }}
          disabled={stockedBases.length === 0}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl font-display font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-300 hover:from-cyan-300 hover:to-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FlaskConical className="w-4 h-4" />
          <span>Créer avec mon bar ({stockedItems.length} en stock)</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const count = userBar.filter((i) => i.category === cat.id && i.inStock).length;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playTap();
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddNew} className="flex gap-2">
        <input
          type="text"
          placeholder={`Ajouter un ${activeCategory === 'alcool' ? 'alcool' : activeCategory === 'diluant' ? 'diluant' : 'ingrédient'} (ex. Cointreau, Sprite, Sirop de cerise)...`}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </form>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              sounds.playTap();
              onToggleStock(item.id);
            }}
            className={`cursor-pointer p-4 rounded-2xl transition-all flex items-center justify-between border ${
              item.inStock
                ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
                : 'glass-panel-subtle border-white/5 text-slate-400 hover:border-white/15'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  item.inStock
                    ? 'bg-cyan-400 text-slate-950'
                    : 'border border-white/20 bg-white/5'
                }`}
              >
                {item.inStock && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold truncate">{item.name}</div>
                <div className="text-[10px] font-mono text-slate-500">
                  {item.inStock ? 'Disponible' : 'Non possédé'}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playTap();
                onRemoveItem(item.id);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
