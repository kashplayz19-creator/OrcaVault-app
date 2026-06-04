import React from 'react';
import { Box, Stack, Flex } from './StitchPrimitives';
import { WifiOff, ShieldCheck, RefreshCw } from 'lucide-react';

export default function OfflineStatusPage({ onReconnect }: { onReconnect: () => void }) {
  return (
    <div className="w-full h-screen bg-[#000000]/60 backdrop-blur-md flex items-center justify-center p-8 absolute inset-0 z-50 select-none overflow-hidden">
      
      {/* Background container previewing the app slightly blurred */}
      <div className="absolute inset-0 bg-[#0B0C0E]/40 pointer-events-none">
         <div className="grid grid-cols-12 h-screen p-6 gap-6 grayscale opacity-20">
             <div className="col-span-12 h-16 border border-[#1F2226] rounded-xl flex items-center px-8 justify-between">
                <div className="w-32 h-6 bg-[#1F2226] rounded"></div>
                <div className="w-8 h-8 rounded-full bg-[#1F2226]"></div>
             </div>
             <div className="col-span-9 border border-[#1F2226] rounded-xl flex-1"></div>
             <div className="col-span-3 border border-[#1F2226] rounded-xl"></div>
         </div>
      </div>

      <Box className="w-[600px] p-12 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)] border-[#1F2226] bg-[#0B0C0E]/95 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500/50"></div>
        <Stack gap="gap-8" className="items-center">
          <div className="relative p-6 rounded-full border border-yellow-500/30 bg-yellow-950/20">
             <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-500 animate-pulse border-2 border-[#0B0C0E]"></div>
             <WifiOff className="w-12 h-12 text-yellow-500" strokeWidth={1.5} />
          </div>
          
          <Stack gap="gap-2" className="items-center w-full">
            <h2 className="text-2xl font-mono text-white tracking-widest font-bold">CONNECTION LOST</h2>
            <div className="mt-2 font-mono text-yellow-500 text-xs tracking-widest px-4 py-1.5 border border-yellow-500/30 bg-yellow-500/10 rounded uppercase">
              LOCAL_FALLBACK_ACTIVE
            </div>
          </Stack>

          <p className="font-sans text-slate-400 text-sm leading-relaxed max-w-sm mt-2">
            The primary uplink is currently unreachable. System is operating in restricted local mode. Modifications will be synced upon connection restoration.
          </p>
          
          <Box className="w-full h-2 rounded-full overflow-hidden border-[#1F2226] bg-[#000000] p-0 flex justify-start">
             <div className="h-full bg-yellow-500/80 w-1/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
          </Box>

          <button 
            onClick={onReconnect} 
            className="w-full mt-4 px-8 py-4 bg-[#000000] border border-[#1F2226] text-slate-300 font-mono tracking-widest hover:border-slate-500 hover:text-white hover:bg-[#1F2226]/50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] uppercase flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-4 h-4" />
            MANUAL RETRY / FORCE SYNC
          </button>
        </Stack>
      </Box>
    </div>
  );
}
