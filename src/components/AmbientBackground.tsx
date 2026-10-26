import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Deep dark gradient foundation */}
      <div className="absolute inset-0 bg-[#08090E]" />

      {/* Atmospheric neon glowing orbs blurred across layers */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-700/15 blur-[120px]" />
      <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-cyan-600/12 blur-[140px]" />
      <div className="absolute top-2/3 left-1/5 w-[28rem] h-[28rem] rounded-full bg-fuchsia-600/10 blur-[130px]" />
      <div className="absolute -bottom-32 right-1/4 w-[36rem] h-[36rem] rounded-full bg-blue-700/12 blur-[150px]" />

      {/* Subtle futuristic micro-grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
