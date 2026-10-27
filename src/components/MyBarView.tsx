import React, { useState } from 'react';
import { 
  Wine, 
  Plus, 
  Check, 
  Trash2, 
  FlaskConical,
  Edit2
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
    { id: 'alcool', label: 'Bases & Alcools' },
    { id: 'diluant', label: 'Diluants & Softs' },
    { id: 'sirop', label: 'Sirops' },
    { id: 'garniture', label: 'Fruits & Herbes' },
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="font-display font-bold text-2xl text-white">
            Mon Bar
          </h1>
          <p className="text-xs text-slate-400">
            {stockedItems.length} ingrédient{stockedItems.length > 1 ? 's' : ''} en réserve. Coche ceux que tu possèdes déjà.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playGlassClink();
            onGenerateFromBar(stockedBases, stockedMixers, stockedAromatics);
          }}
          disabled={stockedBases.length === 0}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-1.5"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Créer avec mon bar ({stockedItems.length})</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white/20 text-white font-semibold'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add input form */}
      <form onSubmit={handleAddNew} className="flex gap-2">
        <input
          type="text"
          placeholder={`Ajouter un ${activeCategory === 'alcool' ? 'alcool' : 'ingrédient'} (ex: Mezcal, Soda pamplemousse)...`}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </form>

      {/* Items list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              sounds.playTap();
              onToggleStock(item.id);
            }}
            className={`cursor-pointer p-3 rounded-2xl transition-all flex items-center justify-between border ${
              item.inStock
                ? 'bg-white/[0.08] border-white/20 text-white'
                : 'glass-panel-subtle border-white/5 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                  item.inStock
                    ? 'bg-emerald-500 text-slate-950'
                    : 'border border-white/20 bg-white/5'
                }`}
              >
                {item.inStock && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="truncate text-xs font-medium">{item.name}</div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playTap();
                onRemoveItem(item.id);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
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
