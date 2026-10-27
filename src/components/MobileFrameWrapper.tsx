import React, { useState } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start">
      {/* Discreet Studio Top Bar for Desktop */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-5xl px-6 py-2.5 z-40 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-display font-medium text-slate-300">MIXLAB</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Atelier de Mixologie</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle sound toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all border ${
              !isMuted
                ? 'bg-white/10 text-slate-200 border-white/15'
                : 'bg-white/5 text-slate-500 border-white/5'
            }`}
            title="Effets sonores sensoriels"
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{!isMuted ? 'Audio actif' : 'Muet'}</span>
          </button>

          {/* Mobile vs Expanded Toggle */}
          <button
            onClick={() => {
              sounds.playTap();
              setViewMode(viewMode === 'mobile' ? 'expanded' : 'mobile');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>Vue large</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Vue mobile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          viewMode === 'mobile'
            ? 'max-w-md mx-auto sm:my-3 sm:rounded-[36px] sm:border sm:border-white/10 sm:shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:overflow-hidden bg-[#0A0C14]/90 backdrop-blur-3xl'
            : 'max-w-5xl mx-auto'
        }`}
      >
        <div className="w-full min-h-screen relative flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
