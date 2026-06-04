import React from 'react';

export default function NexusLogo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center justify-center transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-80 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(0,240,255,0.8)] cursor-pointer">
        <path d="M50 10L10 30V70L50 90L90 70V30L50 10Z" stroke="#00F0FF" strokeWidth="4" strokeLinejoin="round" fill="rgba(0,240,255,0.05)" className="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:fill-[rgba(0,240,255,0.15)]" />
        <path d="M50 25L25 40V60L50 75L75 60V40L50 25Z" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" fill="rgba(0,240,255,0.15)" />
        <circle cx="50" cy="50" r="10" fill="#00E676" className="animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        <line x1="50" y1="10" x2="50" y2="25" stroke="#00F0FF" strokeWidth="2" />
        <line x1="50" y1="75" x2="50" y2="90" stroke="#00F0FF" strokeWidth="2" />
        <line x1="10" y1="30" x2="25" y2="40" stroke="#00F0FF" strokeWidth="2" />
        <line x1="90" y1="30" x2="75" y2="40" stroke="#00F0FF" strokeWidth="2" />
        <line x1="10" y1="70" x2="25" y2="60" stroke="#00F0FF" strokeWidth="2" />
        <line x1="90" y1="70" x2="75" y2="60" stroke="#00F0FF" strokeWidth="2" />
      </svg>
    </div>
  );
}
