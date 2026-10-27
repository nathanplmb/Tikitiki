import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NeonLiquidShakerProps {
  isGenerating: boolean;
  colorTone?: 'amber' | 'ruby' | 'emerald' | 'violet' | 'neutral';
}

const PHASES = [
  {
    title: 'Extraction & Botaniques',
    detail: 'Analyse aromatique des spiritueux et des infusions...',
  },
  {
    title: 'Équilibre & Acidité',
    detail: 'Harmonisation des densités et ajustement du profil sucré...',
  },
  {
    title: 'Précision du Jigger',
    detail: 'Dosage rigoureux des portions et calcul de dilution...',
  },
  {
    title: 'Mise en Scène',
    detail: 'Dressement de la verrerie, glaçons taillés et garniture...',
  },
];

export const NeonLiquidShaker: React.FC<NeonLiquidShakerProps> = ({ 
  isGenerating, 
  colorTone = 'ruby' 
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setPhaseIndex(0);
      return;
    }

    // Play a gentle clink on start
    sounds.playGlassClink();

    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 1600);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  const currentPhase = PHASES[phaseIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090D]/85 backdrop-blur-2xl"
      >
        {/* Ambient Backlight Glow tailored to studio cocktail lighting */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-purple-900/30 via-pink-900/20 to-amber-900/20 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl glass-panel p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-center flex flex-col items-center overflow-hidden"
        >
          {/* Subtle Studio Specular Light Rim on Top */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* STUDIO MIXING VESSEL SCENE */}
          <div className="relative w-44 h-56 my-2 flex items-center justify-center">
            {/* Ambient liquid lighting halo */}
            <div className="absolute inset-4 rounded-full bg-purple-600/15 blur-2xl animate-pulse" />

            {/* Sculpted Mixing Glass Silhouette */}
            <div className="relative w-32 h-48 rounded-b-3xl rounded-t-lg border border-white/20 bg-white/[0.03] backdrop-blur-md overflow-hidden shadow-2xl flex flex-col justify-end p-2.5">
              {/* Glass Rim highlight */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-white/10 via-white/40 to-white/10 border-b border-white/15" />

              {/* Vertical Crystal Fluting lines */}
              <div className="absolute inset-y-0 left-6 w-px bg-white/[0.06]" />
              <div className="absolute inset-y-0 right-6 w-px bg-white/[0.06]" />
              <div className="absolute inset-y-0 left-12 w-px bg-white/[0.04]" />
              <div className="absolute inset-y-0 right-12 w-px bg-white/[0.04]" />

              {/* Condensation droplets (subtle dots on exterior) */}
              <div className="absolute top-8 left-3 w-1 h-1 rounded-full bg-white/30" />
              <div className="absolute top-14 left-4 w-1.5 h-1.5 rounded-full bg-white/25" />
              <div className="absolute top-24 right-4 w-1 h-1 rounded-full bg-white/30" />
              <div className="absolute top-10 right-3 w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="absolute top-28 left-5 w-1 h-1.5 rounded-full bg-white/35" />

              {/* Crystal Ice Cube 1 */}
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="absolute bottom-14 left-5 w-10 h-10 rounded-md border border-white/25 bg-white/10 backdrop-blur-sm transform rotate-12 shadow-sm z-10 flex items-center justify-center pointer-events-none"
              >
                <div className="w-5 h-5 rounded-sm border border-white/15" />
              </motion.div>

              {/* Crystal Ice Cube 2 */}
              <motion.div
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.4 }}
                className="absolute bottom-20 right-5 w-9 h-9 rounded-md border border-white/20 bg-white/10 backdrop-blur-sm transform -rotate-6 shadow-sm z-10 flex items-center justify-center pointer-events-none"
              >
                <div className="w-4 h-4 rounded-sm border border-white/15" />
              </motion.div>

              {/* Living Rising Liquid Fill */}
              <motion.div
                initial={{ height: '35%' }}
                animate={{ height: ['40%', '72%', '58%', '70%'] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                className="relative w-full rounded-b-2xl bg-gradient-to-t from-purple-900/80 via-pink-800/60 to-purple-500/40 overflow-hidden shadow-inner flex flex-col justify-between"
              >
                {/* Liquid meniscus caustic surface */}
                <div className="w-full h-2 bg-gradient-to-r from-pink-300/40 via-white/50 to-pink-300/40 rounded-full blur-[0.5px]" />

                {/* Micro effervescence bubbles */}
                <div className="relative w-full h-full">
                  <motion.div
                    animate={{ y: [20, -10], opacity: [0, 0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                    className="absolute left-3 bottom-1 w-1 h-1 rounded-full bg-white/60"
                  />
                  <motion.div
                    animate={{ y: [30, -5], opacity: [0, 0.9, 0] }}
                    transition={{ repeat: Infinity, duration: 2.3, ease: 'easeOut', delay: 0.6 }}
                    className="absolute right-4 bottom-2 w-1.5 h-1.5 rounded-full bg-white/70"
                  />
                  <motion.div
                    animate={{ y: [25, -8], opacity: [0, 0.7, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut', delay: 1.1 }}
                    className="absolute left-8 bottom-3 w-1 h-1 rounded-full bg-white/50"
                  />
                </div>
              </motion.div>

              {/* Specular glass reflection diagonal sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* STUDIO STATUS & SOMMELIER PROGRESSION */}
          <div className="w-full mt-3 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>Élaboration du Mix</span>
            </div>

            <div className="space-y-1">
              <AnimatePresence mode="wait">
                <motion.h4
                  key={currentPhase.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-display font-semibold text-base text-white tracking-tight"
                >
                  {currentPhase.title}
                </motion.h4>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhase.detail}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs text-slate-400 min-h-[32px] px-2 leading-relaxed"
                >
                  {currentPhase.detail}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Stepped progress indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {PHASES.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === phaseIndex
                      ? 'w-6 bg-white'
                      : idx < phaseIndex
                      ? 'w-2 bg-white/50'
                      : 'w-2 bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
