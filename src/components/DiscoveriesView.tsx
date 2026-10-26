import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dice5, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  FlaskConical, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ALCOHOL_BASES, MIXERS, AROMATICS, FLAVOR_PROFILES, CURATED_PAIRINGS, PairingSuggestion } from '../data/ingredients';
import { sounds } from '../utils/audio';

interface DiscoveriesViewProps {
  onLaunchRouletteLab: (base: string, mixer: string, aromatic: string, profile: string) => void;
  onSelectPairing: (pairing: PairingSuggestion) => void;
}

export const DiscoveriesView: React.FC<DiscoveriesViewProps> = ({
  onLaunchRouletteLab,
  onSelectPairing,
}) => {
  // Roulette state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentBase, setCurrentBase] = useState<string>('Gin');
  const [currentMixer, setCurrentMixer] = useState<string>('Schweppes Pink Tonic');
  const [currentAromatic, setCurrentAromatic] = useState<string>('Sirop de mûre');
  const [currentProfile, setCurrentProfile] = useState<string>('Fruits noirs : mûre, cassis, myrtille');
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasSpun(true);

    let count = 0;
    const maxSpins = 24;
    const speed = 70;

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
    <div className="space-y-10 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>EXPLORATION MIXOLOGIQUE</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
          Espace Découvertes
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Laisse le hasard inspirer tes créations ou explore des associations gustatives d’exception.
        </p>
      </div>

      {/* ROULETTE DES SAVEURS */}
      <section className="relative rounded-3xl p-6 sm:p-10 glass-panel border border-cyan-400/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 text-center max-w-2xl mx-auto">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Dice5 className="w-4 h-4 text-cyan-300 animate-spin-slow" />
              <span>ROULETTE DES SAVEURS QUANTIQUE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Tire au sort ta prochaine signature
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Fais tourner la roulette pour obtenir une combinaison imprévue et harmonieuse.
            </p>
          </div>

          {/* Holographic Slot Reels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {/* Reel 1: Base */}
            <div
              className={`p-4 rounded-2xl glass-panel border transition-all text-center space-y-1 ${
                isSpinning ? 'border-cyan-400 shadow-[0_0_20px_#00f0ff]' : 'border-white/10'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                1. Base Alcoolisée
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-white h-12 flex items-center justify-center">
                {currentBase}
              </div>
            </div>

            {/* Reel 2: Mixer */}
            <div
              className={`p-4 rounded-2xl glass-panel border transition-all text-center space-y-1 ${
                isSpinning ? 'border-fuchsia-400 shadow-[0_0_20px_#ec4899]' : 'border-white/10'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-fuchsia-400 font-bold">
                2. Diluant & Bulles
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-white h-12 flex items-center justify-center">
                {currentMixer}
              </div>
            </div>

            {/* Reel 3: Aromatic */}
            <div
              className={`p-4 rounded-2xl glass-panel border transition-all text-center space-y-1 ${
                isSpinning ? 'border-purple-400 shadow-[0_0_20px_#a855f7]' : 'border-white/10'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                3. Note Aromatique
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-white h-12 flex items-center justify-center">
                {currentAromatic}
              </div>
            </div>
          </div>

          {/* Profile outcome tag */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 font-mono">
            Profil suggéré : <span className="text-cyan-300 font-bold">{currentProfile}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={spinRoulette}
              disabled={isSpinning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-300 hover:from-cyan-300 hover:to-white transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Dice5 className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Tirage en cours...' : 'Faire tourner la roulette'}</span>
            </button>

            {hasSpun && !isSpinning && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() =>
                  onLaunchRouletteLab(currentBase, currentMixer, currentAromatic, currentProfile)
                }
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-display font-semibold text-sm text-white bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-4 h-4 text-purple-300" />
                <span>Créer dans le Labo</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* DÉCOUVERTE QUOTIDIENNE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fuchsia-400" />
          <h2 className="font-display font-bold text-xl text-white">
            Découverte Quotidienne
          </h2>
        </div>

        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 rounded-2xl overflow-hidden aspect-video relative">
            <img
              src="https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80"
              alt="Découverte quotidienne"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Association du 26 octobre
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <div className="text-[11px] font-mono uppercase text-cyan-300">
              L’accord insolite du jour
            </div>
            <h3 className="font-display font-bold text-2xl text-white">
              Tequila Blanco × Ginger Beer × Sirop de Mûre
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              La vivacité végétale de l’agave rencontre le feu du gingembre fermenté, tout en étant adoucie par la rondeur veloutée de la mûre sauvage. Une alternative moderne et fruitée au Moscow Mule.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() =>
                  onLaunchRouletteLab(
                    'Tequila',
                    'Ginger Beer',
                    'Sirop de mûre',
                    'Fruits noirs : mûre, cassis, myrtille'
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Tester dans le labo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED PAIRINGS CATALOG */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="font-display font-bold text-xl text-white">
            Les Grands Accords de la Mixologie
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CURATED_PAIRINGS.map((pairing, index) => (
            <div
              key={index}
              className="rounded-2xl glass-panel p-5 space-y-4 border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                  {pairing.tagline}
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {pairing.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pairing.description}
                </p>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/20 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-cyan-300">
                    Pourquoi ça marche
                  </div>
                  <div className="text-xs text-slate-300">
                    {pairing.whyItWorks}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectPairing(pairing)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 transition-all"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Configurer ce cocktail</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
