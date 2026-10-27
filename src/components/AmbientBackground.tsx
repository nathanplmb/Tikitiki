import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type AmbientTheme = 
  | 'dark-berry' 
  | 'tropical' 
  | 'citrus-fresh' 
  | 'floral' 
  | 'botanical-bitter' 
  | 'spiced-warm' 
  | 'mystic-dark'
  | 'neutral';

interface AmbientBackgroundProps {
  theme?: AmbientTheme;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ theme = 'neutral' }) => {
  const getGlowColors = () => {
    switch (theme) {
      case 'dark-berry':
        return {
          c1: 'bg-purple-900/25',
          c2: 'bg-fuchsia-950/20',
          c3: 'bg-pink-900/15',
        };
      case 'tropical':
        return {
          c1: 'bg-amber-900/25',
          c2: 'bg-orange-950/25',
          c3: 'bg-yellow-900/15',
        };
      case 'citrus-fresh':
        return {
          c1: 'bg-emerald-900/20',
          c2: 'bg-teal-950/25',
          c3: 'bg-cyan-900/15',
        };
      case 'floral':
        return {
          c1: 'bg-indigo-900/20',
          c2: 'bg-purple-950/25',
          c3: 'bg-rose-900/15',
        };
      case 'botanical-bitter':
        return {
          c1: 'bg-emerald-950/30',
          c2: 'bg-teal-900/20',
          c3: 'bg-green-900/15',
        };
      case 'spiced-warm':
        return {
          c1: 'bg-orange-950/30',
          c2: 'bg-amber-900/20',
          c3: 'bg-red-950/15',
        };
      case 'neutral':
      default:
        return {
          c1: 'bg-slate-900/30',
          c2: 'bg-indigo-950/20',
          c3: 'bg-blue-950/20',
        };
    }
  };

  const colors = getGlowColors();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Deep luxury studio dark foundation */}
      <div className="absolute inset-0 bg-[#0A0C14]" />

      {/* Adaptive ambient lighting layers with subtle transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className={`absolute -top-32 -left-20 w-[30rem] h-[30rem] rounded-full ${colors.c1} blur-[140px] transition-colors duration-1000`} />
          <div className={`absolute top-1/4 -right-20 w-[34rem] h-[34rem] rounded-full ${colors.c2} blur-[160px] transition-colors duration-1000`} />
          <div className={`absolute bottom-0 left-1/4 w-[32rem] h-[32rem] rounded-full ${colors.c3} blur-[150px] transition-colors duration-1000`} />
        </motion.div>
      </AnimatePresence>

      {/* Apple-style subtle noise / micro-grain overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
