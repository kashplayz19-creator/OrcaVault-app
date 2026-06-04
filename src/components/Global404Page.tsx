import React from 'react';
import { Box, Flex, Stack } from './StitchPrimitives';
import { RouteOff, CornerDownLeft } from 'lucide-react';
import NexusLogo from './NexusLogo';

export default function Global404Page({ onBack }: { onBack: () => void }) {
  return (
    <Box className="w-full h-screen border-none rounded-none bg-[#000000] flex items-center justify-center select-none overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03),transparent_60%)] pointer-events-none"></div>
      
      <Stack gap="gap-12" className="items-center text-center z-10 max-w-3xl">
        <Box className="w-32 h-32 rounded-full border-[#1F2226] bg-[#0B0C0E] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.05)]">
            <RouteOff className="w-16 h-16 text-slate-500" strokeWidth={1} />
        </Box>

        <Stack gap="gap-4" className="w-full items-center">
          <Flex gap="gap-3" justify="justify-center">
            <NexusLogo size={24} />
            <span className="text-white font-mono font-bold text-sm tracking-widest uppercase">Nexus Fault Detection</span>
          </Flex>
          <h1 className="text-5xl font-mono font-bold text-[#00F0FF] tracking-tighter">ERROR 404</h1>
          <p className="font-mono text-slate-400 text-lg uppercase tracking-widest">
            VIRTUAL_ADDRESS_SPACE_NOT_FOUND // Lost in the Vault.
          </p>
        </Stack>

        <Box className="w-full p-6 text-left border-[#1F2226] bg-[#0B0C0E]/90 flex flex-col gap-2 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F0FF]/30"></div>
          <div className="font-mono text-slate-400 text-xs leading-relaxed pl-4">
            <span className="text-[#00F0FF]">{'>'}</span> Analyzing path request vectors...<br/>
            <span className="text-[#00F0FF]">{'>'}</span> Target block cluster unresolved.<br/>
            <span className="text-red-400 font-bold">{'>'} ABORTING_TRAVERSAL. PLEASE REDIRECT.</span>
          </div>
        </Box>

        <button 
          onClick={onBack} 
          className="group px-8 py-4 bg-[#0B0C0E] border border-[#1F2226] text-white font-mono uppercase tracking-widest hover:border-[#00F0FF] hover:text-[#00F0FF] hover:bg-[#00F0FF]/5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95] flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
          <CornerDownLeft className="w-4 h-4" />
          <span>[RETURN TO CORE SECTOR]</span>
        </button>
      </Stack>
    </Box>
  );
}
