import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, 
  Star, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Scale, 
  Sparkles, 
  Filter, 
  Search,
  Zap,
  Award
} from 'lucide-react';
import { CocktailRecipe } from '../types/cocktail';
import { sounds } from '../utils/audio';

interface MyCollectionViewProps {
  favorites: CocktailRecipe[];
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
  onRemoveFavorite: (id: string) => void;
  onOpenCompare: (c1: CocktailRecipe, c2: CocktailRecipe) => void;
  onStartLab: () => void;
}

export const MyCollectionView: React.FC<MyCollectionViewProps> = ({
  favorites,
  onSelectCocktail,
  onRemoveFavorite,
  onOpenCompare,
  onStartLab,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [compareList, setCompareList] = useState<CocktailRecipe[]>([]);

  const allTags = ['all', 'Parfait', 'À refaire', 'Original', 'Coup de cœur', 'Trop sucré', 'Trop amer'];

  const filteredFavorites = favorites.filter((item) => {
    if (selectedTag !== 'all') {
      if (!item.userTags?.includes(selectedTag)) return false;
    }
    if (searchQuery.trim()) {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tasteProfile.profileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleCompareClick = (recipe: CocktailRecipe, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    if (compareList.some((r) => r.id === recipe.id)) {
      setCompareList(compareList.filter((r) => r.id !== recipe.id));
    } else {
      if (compareList.length === 1) {
        onOpenCompare(compareList[0], recipe);
        setCompareList([]);
      } else {
        setCompareList([recipe]);
      }
    }
  };

  // Compute User Signature Cocktail DNA based on 4-star and 5-star likes
  const highlyRated = favorites.filter((f) => (f.userRating || 0) >= 4);
  const preferredProfiles = highlyRated.map((f) => f.tasteProfile.profileName);
  const topProfile = preferredProfiles.length > 0 ? preferredProfiles[0] : 'Fruits & Bulles Fraîches';

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
            <Bookmark className="w-3.5 h-3.5" />
            <span>CAVE PERSONNELLE</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Ma Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Retrouve tes cocktails favoris, tes notes et l’évolution de ton profil gustatif.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
          {favorites.length} {favorites.length > 1 ? 'cocktails enregistrés' : 'cocktail enregistré'}
        </span>
      </div>

      {/* SIGNATURE COCKTAIL PROGRESSION WIDGET */}
      <div className="p-6 rounded-3xl glass-panel border border-fuchsia-500/30 shadow-[0_0_35px_rgba(236,72,153,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-fuchsia-300" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-300 font-bold">
                ADN Mixologique Signature
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Ton profil dominant : <span className="text-cyan-300">{topProfile}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculé à partir de tes {favorites.length} cocktails favoris et avis enregistrés.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-300 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
            {highlyRated.length} créations notées ★ 4-5
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher dans mes favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                sounds.playTap();
                setSelectedTag(tag);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {tag === 'all' ? 'Tous' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-4">
          <Bookmark className="w-10 h-10 text-slate-500 mx-auto stroke-1" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-white">
              Aucun cocktail trouvé
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ajoute des cocktails à ta collection depuis le laboratoire ou modifie tes filtres de recherche.
            </p>
          </div>
          <button
            onClick={onStartLab}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            Créer un cocktail maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((cocktail) => {
            const isComparing = compareList.some((r) => r.id === cocktail.id);
            return (
              <motion.div
                key={cocktail.id}
                layout
                onClick={() => {
                  sounds.playGlassClink();
                  onSelectCocktail(cocktail);
                }}
                className={`cursor-pointer group relative rounded-3xl overflow-hidden glass-panel border transition-all flex flex-col justify-between ${
                  isComparing
                    ? 'border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                    : 'border-white/10 hover:border-cyan-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={cocktail.imageUrl}
                      alt={cocktail.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                        {cocktail.type}
                      </span>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          onRemoveFavorite(cocktail.id);
                        }}
                        className="p-1.5 rounded-full bg-black/60 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition-colors"
                        title="Supprimer des favoris"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Star Rating preview */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= (cocktail.userRating || 0)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-200 transition-colors">
                        {cocktail.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {cocktail.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {cocktail.userTags && cocktail.userTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {cocktail.userTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* User Notes if any */}
                    {cocktail.userNotes && (
                      <p className="text-[11px] text-slate-300 italic bg-white/[0.02] p-2 rounded-lg border border-white/5 line-clamp-2">
                        « {cocktail.userNotes} »
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={(e) => handleCompareClick(cocktail, e)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isComparing
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Sélectionné' : 'Comparer'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playGlassClink();
                      onSelectCocktail(cocktail);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Fiche</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
