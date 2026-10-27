import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FlaskConical } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NeonLiquidShakerProps {
  isGenerating: boolean;
}

export const NeonLiquidShaker: React.FC<NeonLiquidShakerProps> = ({ isGenerating }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    'Équilibre des saveurs et des alcools...',
    'Harmonisation de la texture et de la dilution...',
    'Calcul des dosages et des alternatives...',
    'Élaboration des signatures sur-mesure...',
  ];

  useEffect(() => {
    if (!isGenerating) return;

    setPhaseIndex(0);
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
      sounds.playShakeBurst();
    }, 1200);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Subtle liquid wave physics
  useEffect(() => {
    if (!isGenerating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.05;

      const w = canvas.width;
      const h = canvas.height;

      // Soft wave layer 1
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) {
        const y = h * 0.52 + Math.sin(x * 0.03 + step) * 12 + Math.cos(x * 0.015 + step * 0.6) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const grad1 = ctx.createLinearGradient(0, h * 0.4, 0, h);
      grad1.addColorStop(0, 'rgba(216, 180, 254, 0.4)');
      grad1.addColorStop(1, 'rgba(147, 51, 234, 0.6)');
      ctx.fillStyle = grad1;
      ctx.fill();
      ctx.restore();

      // Soft wave layer 2
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) {
        const y = h * 0.58 + Math.cos(x * 0.035 + step * 1.1) * 10 + Math.sin(x * 0.02 - step) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const grad2 = ctx.createLinearGradient(0, h * 0.45, 0, h);
      grad2.addColorStop(0, 'rgba(244, 114, 182, 0.35)');
      grad2.addColorStop(1, 'rgba(219, 39, 119, 0.55)');
      ctx.fillStyle = grad2;
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-xs rounded-3xl glass-panel p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center flex flex-col items-center"
        >
          {/* Subtle Shaker silhouette */}
          <div className="relative w-36 h-44 rounded-2xl border border-white/20 bg-white/[0.04] overflow-hidden flex flex-col items-center justify-end shadow-inner mb-5">
            <div className="absolute top-2 w-14 h-3 rounded-full bg-white/15" />
            <canvas
              ref={canvasRef}
              width={200}
              height={180}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="space-y-2 w-full">
            <h4 className="font-display font-semibold text-base text-white">
              Création en cours
            </h4>

            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-slate-300"
                >
                  {phases[phaseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Subtle progress bar */}
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: 'easeInOut',
                }}
                className="w-1/2 h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
