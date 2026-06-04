import React from 'react';
import { Box, Flex, Stack } from './StitchPrimitives';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import NexusLogo from './NexusLogo';

export default function ErrorAPIFailurePage({ onRetry }: { onRetry: () => void }) {
  return (
    <Box className="w-full h-screen border-none rounded-none bg-[#000000] flex items-center justify-center select-none overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.05),transparent_60%)] pointer-events-none"></div>
      <Stack gap="gap-10" className="items-center max-w-3xl text-center z-10">
        <Box className="w-32 h-32 rounded-full border-red-500/30 bg-red-950/20 flex flex-col items-center justify-center animate-pulse">
            <ShieldAlert className="w-16 h-16 text-red-500" strokeWidth={1.5} />
        </Box>
        
        <Stack gap="gap-4">
          <Flex gap="gap-3" justify="justify-center">
            <NexusLogo size={24} />
            <h1 className="text-3xl font-mono font-bold text-white tracking-widest">UPLINK_SEVERED</h1>
          </Flex>
          <p className="font-mono text-slate-500 text-sm">
            Telemetry stream interrupted. Host refused connection or proxy timeout occurred.
          </p>
        </Stack>

        <Box className="w-full p-8 text-left border-red-900/50 bg-[#0B0C0E]/90 flex flex-col gap-2">
          <div className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2 border-b border-red-900/50 pb-2 flex justify-between">
            <span>Critical Register Exception Stack Trace</span>
            <span>MEM: 0x90A1FF</span>
          </div>
          <div className="font-mono text-red-400/80 text-xs leading-relaxed">
            {'> TRACE_ROUTE_INITIALIZED\n'}
            {'> NODE_01: OK (12ms)\n'}
            {'> NODE_02: OK (14ms)\n'}
            {'> NODE_04_GATEWAY: TIMEOUT_ERR\n'}
            <span className="text-red-500">{'> STITCH_NET_ERR: Failed to reach Alpha Vantage gateway stream.\n'}</span>
            <span className="animate-pulse">_</span>
          </div>
        </Box>

        <button 
          onClick={onRetry} 
          className="group px-8 py-4 bg-[#0B0C0E] border border-red-900 text-red-400 font-mono uppercase tracking-widest hover:border-red-500 hover:text-red-500 hover:bg-red-950/20 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95] flex items-center justify-center gap-3"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span>[RE-ESTABLISH HANDSHAKE / RETRY]</span>
        </button>
      </Stack>
    </Box>
  );
}
