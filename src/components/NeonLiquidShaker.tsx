import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FlaskConical, Atom } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NeonLiquidShakerProps {
  isGenerating: boolean;
}

export const NeonLiquidShaker: React.FC<NeonLiquidShakerProps> = ({ isGenerating }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    'Analyse des bases et des diluants...',
    'Calcul de l’équilibre acide/sucre...',
    'Simulation de la texture en bouche...',
    'Optimisation des coûts et ingrédients...',
    'Finalisation des 3 signatures MIXLAB...',
  ];

  // Cycle phases and play subtle shake bursts
  useEffect(() => {
    if (!isGenerating) return;

    setPhaseIndex(0);
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
      sounds.playShakeBurst();
    }, 1100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Canvas liquid particle and wave physics
  useEffect(() => {
    if (!isGenerating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    // Fluid particles
    const particles: { x: number; y: number; size: number; speedY: number; color: string; alpha: number }[] = [];
    const colors = ['#00f0ff', '#a855f7', '#ec4899', '#38bdf8'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 240,
        y: 120 + Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        speedY: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.08;

      const w = canvas.width;
      const h = canvas.height;

      // Draw glowing fluid wave 1 (cyan)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) {
        const y = h * 0.52 + Math.sin(x * 0.035 + step) * 16 + Math.cos(x * 0.02 + step * 0.7) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const grad1 = ctx.createLinearGradient(0, h * 0.4, 0, h);
      grad1.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      grad1.addColorStop(1, 'rgba(59, 130, 246, 0.7)');
      ctx.fillStyle = grad1;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // Draw glowing fluid wave 2 (purple / magenta)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) {
        const y = h * 0.58 + Math.cos(x * 0.04 + step * 1.2) * 14 + Math.sin(x * 0.015 - step) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const grad2 = ctx.createLinearGradient(0, h * 0.45, 0, h);
      grad2.addColorStop(0, 'rgba(236, 72, 153, 0.5)');
      grad2.addColorStop(1, 'rgba(168, 85, 247, 0.8)');
      ctx.fillStyle = grad2;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.restore();

      // Render effervescent neon bubbles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(step + p.y * 0.05) * 0.8;
        if (p.y < 80) {
          p.y = h - 20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060810]/85 backdrop-blur-2xl"
      >
        {/* Glowing backdrop halo */}
        <div className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-[130px] pointer-events-none" />
        <div className="absolute w-80 h-80 rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl glass-panel p-8 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center flex flex-col items-center overflow-hidden"
        >
          {/* Specular sheen reflection stripe */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Top Pill status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>MIXEUR QUANTIQUE IA</span>
          </div>

          {/* The Shaker Container with Vibrating Motion */}
          <motion.div
            animate={{
              rotate: [-2, 3, -3, 2, 0],
              y: [-3, 3, -2, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.55,
              ease: 'easeInOut',
            }}
            className="relative w-48 h-56 rounded-3xl border-2 border-white/30 bg-slate-900/60 overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.3)] flex flex-col items-center justify-end"
          >
            {/* Shaker Cap Glass */}
            <div className="absolute top-2 w-20 h-4 rounded-full bg-white/20 border border-white/30" />
            <div className="absolute top-5 w-28 h-6 rounded-t-xl bg-white/10 border-t border-x border-white/30" />

            {/* Canvas for liquid wave fluid */}
            <canvas
              ref={canvasRef}
              width={240}
              height={220}
              className="w-full h-full object-cover"
            />

            {/* Glass reflection overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
            <div className="absolute left-2 top-8 bottom-8 w-1 rounded-full bg-white/30 blur-[0.5px] pointer-events-none" />
          </motion.div>

          {/* Dynamic AI Status text */}
          <div className="mt-6 space-y-2 w-full">
            <div className="font-display font-bold text-lg text-white tracking-wide">
              Synthèse Mixologique
            </div>

            <div className="h-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-cyan-300 font-mono tracking-tight px-2"
                >
                  {phases[phaseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Glowing Neon Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden relative border border-white/10">
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
                className="w-1/2 h-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 rounded-full shadow-[0_0_15px_#00f0ff]"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
