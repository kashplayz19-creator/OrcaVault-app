import React from 'react';

export default function OrcavaultLogo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center justify-center transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-80 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(30,144,255,0.8)] cursor-pointer">
        {/* Outer shield representing the vault */}
        <path d="M50 5L90 25V65C90 80 70 92 50 95C30 92 10 80 10 65V25L50 5Z" stroke="#00F0FF" strokeWidth="4" strokeLinejoin="round" fill="rgba(0,240,255,0.05)" className="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:fill-[rgba(0,240,255,0.15)]" />
        {/* Sleek Orca dorsal-fin geometric lines representing the whale force */}
        <path d="M30 40C30 40 45 42 55 30C65 18 68 8 68 8C68 8 66 22 58 35C50 48 40 55 30 58V40Z" fill="#00F0FF" stroke="#00F0FF" strokeWidth="1" />
        {/* Inner matrix core node */}
        <circle cx="50" cy="65" r="8" fill="#00E676" className="animate-[pulse_2s_infinite]" />
        {/* Futuristic alignment pins */}
        <path d="M25 70L35 75" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M75 70L65 75" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
