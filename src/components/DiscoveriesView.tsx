import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dice5, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  FlaskConical, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { 
  ALCOHOL_BASES, 
  MIXERS, 
  AROMATICS, 
  FLAVOR_PROFILES, 
  CURATED_PAIRINGS, 
  PairingSuggestion 
} from '../data/ingredients';
import { sounds } from '../utils/audio';

interface DiscoveriesViewProps {
  onLaunchRouletteLab: (base: string, mixer: string, aromatic: string, profile: string) => void;
  onSelectPairing: (pairing: PairingSuggestion) => void;
}

export const DiscoveriesView: React.FC<DiscoveriesViewProps> = ({
  onLaunchRouletteLab,
  onSelectPairing,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentBase, setCurrentBase] = useState<string>('Gin');
  const [currentMixer, setCurrentMixer] = useState<string>('Schweppes Pink Tonic');
  const [currentAromatic, setCurrentAromatic] = useState<string>('Sirop de mûre');
  const [currentProfile, setCurrentProfile] = useState<string>('Fruits noirs : mûre, cassis, myrtille');
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  const [activeUniverse, setActiveUniverse] = useState<string>('all');

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasSpun(true);

    let count = 0;
    const maxSpins = 20;
    const speed = 75;

    const interval = setInterval(() => {
      count++;
      sounds.playTick();

      const randomBase = ALCOHOL_BASES[Math.floor(Math.random() * ALCOHOL_BASES.length)].name;
      const randomMixer = MIXERS[Math.floor(Math.random() * MIXERS.length)].name;
      const randomAromatic = AROMATICS[Math.floor(Math.random() * AROMATICS.length)].name;
      const randomProfile = FLAVOR_PROFILES[Math.floor(Math.random() * FLAVOR_PROFILES.length)].name;

      setCurrentBase(randomBase);
      setCurrentMixer(randomMixer);
      setCurrentAromatic(randomAromatic);
      setCurrentProfile(randomProfile);

      if (count >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        sounds.playSuccessChime();
      }
    }, speed);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-0.5">
        <h1 className="font-display font-bold text-2xl text-white">
          Espace Découvertes
        </h1>
        <p className="text-xs text-slate-400">
          Roulette des saveurs et univers aromatiques de la mixologie moderne.
        </p>
      </div>

      {/* ROULETTE DES SAVEURS */}
      <section className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5 text-center">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono">
            <Dice5 className="w-3.5 h-3.5 text-purple-300" />
            <span>Roulette Aléatoire</span>
          </div>
          <h2 className="font-display font-bold text-xl text-white">
            Tire au sort une association
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Génère une combinaison inattendue et lance sa formulation dans le laboratoire.
          </p>
        </div>

        {/* Reels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Base</span>
            <div className="font-display font-bold text-sm text-white h-10 flex items-center justify-center">
              {currentBase}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Diluant</span>
            <div className="font-display font-bold text-sm text-white h-10 flex items-center justify-center">
              {currentMixer}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Arôme</span>
            <div className="font-display font-bold text-sm text-white h-10 flex items-center justify-center">
              {currentAromatic}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={spinRoulette}
            disabled={isSpinning}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Dice5 className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Tirage...' : 'Faire tourner la roulette'}</span>
          </button>

          {hasSpun && !isSpinning && (
            <button
              onClick={() =>
                onLaunchRouletteLab(currentBase, currentMixer, currentAromatic, currentProfile)
              }
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-all flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-300" />
              <span>Créer dans le labo</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </section>

      {/* DÉCOUVERTE QUOTIDIENNE */}
      <section className="space-y-3">
        <h2 className="font-display font-semibold text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Découverte du Jour</span>
        </h2>

        <div className="p-5 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80"
              alt="Cocktail du jour"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
              className="w-full h-full object-cover"
            />
            <div 
              style={{ display: 'none' }}
              className="w-full h-full bg-gradient-to-tr from-amber-950/60 via-[#0A0C14] to-black items-center justify-center"
            >
              <Compass className="w-10 h-10 text-amber-300/40" />
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <span className="text-[10px] font-mono text-purple-300 uppercase">
              Accord Signature
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              Tequila Blanco × Ginger Beer × Mûre
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              L’agave végétale rencontre la chaleur du gingembre et la profondeur de la mûre sauvage pour un résultat à la fois piquant et gourmand.
            </p>

            <button
              onClick={() =>
                onLaunchRouletteLab(
                  'Tequila',
                  'Ginger Beer',
                  'Sirop de mûre',
                  'Fruits noirs : mûre, cassis, myrtille'
                )
              }
              className="text-xs text-slate-200 hover:text-white font-medium inline-flex items-center gap-1 pt-1"
            >
              <span>Configurer ce cocktail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* UNIVERS AROMATIQUES */}
      <section className="space-y-3">
        <h2 className="font-display font-semibold text-base text-white">
          Explorer par Univers Aromatique
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FLAVOR_PROFILES.slice(0, 6).map((profile) => (
            <div
              key={profile.id}
              onClick={() =>
                onLaunchRouletteLab('Vodka classique', 'Schweppes Pink Tonic', 'Citron vert frais (quartiers ou jus)', profile.name)
              }
              className="cursor-pointer p-3.5 rounded-2xl glass-panel-interactive border border-white/5 hover:border-white/20 transition-all space-y-1"
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                {profile.shortTag}
              </div>
              <div className="font-display font-bold text-sm text-white">
                {profile.name}
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2">
                {profile.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
