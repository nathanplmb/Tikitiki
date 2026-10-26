import React, { useState } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, Sparkles, Wifi, Battery } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  // Mobile phone frame is enabled by default on desktop for that authentic phone experience!
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden">
      {/* Top Floating Control Bar for Frame Switch & Sound */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-6xl px-6 py-3 z-40">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300">
            MIXLAB STUDIO
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400">Expérience Mobile Immersion</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Synthesizer Mute Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              !isMuted
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
            title="Effets sonores de mixologie"
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{!isMuted ? 'Son Haptique : ON' : 'Muet'}</span>
          </button>

          {/* Phone Frame Toggle */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsPhoneFrame(!isPhoneFrame);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Passer en Plein Écran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>Vue Smartphone Native</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isPhoneFrame ? (
        <div className="relative my-0 lg:my-4 w-full max-w-[430px] min-h-screen lg:min-h-[880px] lg:max-h-[920px] flex flex-col rounded-none lg:rounded-[48px] border-0 lg:border-[8px] lg:border-[#1E2235] bg-[#08090E] lg:shadow-[0_0_60px_rgba(6,182,212,0.25),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500">
          {/* Ambient neon rim highlight */}
          <div className="hidden lg:block absolute inset-0 rounded-[40px] pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] z-30" />

          {/* Smartphone Status Bar (Dynamic Island & Native Time/Battery) */}
          <div className="hidden lg:flex items-center justify-between px-7 pt-3 pb-1 z-30 bg-[#08090E]/90 backdrop-blur-md select-none text-[11px] font-mono text-slate-300">
            <span>{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-300 font-bold tracking-tight">MIXLAB AI</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Wifi className="w-3 h-3 text-cyan-400" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Screen Content Container with inner scroll */}
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="hidden lg:block w-36 h-1 rounded-full bg-white/20 mx-auto my-2 z-30 shrink-0" />
        </div>
      ) : (
        <div className="w-full flex-1 max-w-7xl px-4 lg:px-8">
          {children}
        </div>
      )}
    </div>
  );
};
