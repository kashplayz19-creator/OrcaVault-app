import React from 'react';
import { Box, Stack, Flex } from './StitchPrimitives';
import { FolderX } from 'lucide-react';
import NexusLogo from './NexusLogo';

export default function EmptyStateWorkspace({ onInit }: { onInit: () => void }) {
  return (
    <Box className="w-full h-screen border-none rounded-none bg-[#000000] flex items-center justify-center p-6 select-none overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,230,118,0.03),transparent_60%)] pointer-events-none"></div>

      <Box className="w-full max-w-3xl p-16 shadow-[0_0_30px_rgba(0,230,118,0.05)] border-[#1F2226] bg-[#0B0C0E]/90 z-10">
        <Stack gap="gap-10" className="items-center text-center">
          <Box className="w-24 h-24 rounded-full border border-[#1F2226] bg-[#000000] flex flex-col items-center justify-center">
            <FolderX className="w-10 h-10 text-slate-500" strokeWidth={1.5} />
          </Box>
          <Stack gap="gap-3" className="items-center w-full">
            <Flex gap="gap-3" justify="justify-center">
              <NexusLogo size={20} />
              <span className="text-white font-mono font-bold text-sm tracking-widest uppercase">Workspace Vacant</span>
            </Flex>
            <h2 className="text-2xl font-mono text-white tracking-widest mt-2">NO WATCHLIST MATRICES INDEXED</h2>
            <p className="text-slate-500 font-sans max-w-lg mt-2 leading-relaxed text-sm">
              Your portfolio matrix is currently empty. Allocate stock symbols to build your initial tracking cache in the Postgres Vector DB structure.
            </p>
          </Stack>
          <button 
            onClick={onInit} 
            className="mt-6 px-10 py-5 bg-[#00E676]/10 border border-[#00E676]/50 text-[#00E676] font-mono tracking-widest hover:bg-[#00E676]/20 hover:border-[#00E676] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95] flex gap-3 items-center group shadow-[0_0_15px_rgba(0,230,118,0.1)] hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]"
          >
            <span>[ INITIALIZE ASSET POSITION ]</span>
            <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-400 mb-1">+</span>
          </button>
        </Stack>
      </Box>
    </Box>
  );
}
