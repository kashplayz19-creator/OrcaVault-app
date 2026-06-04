import React, { useState, useEffect } from 'react';
import { Box, Flex, Stack, Grid } from './StitchPrimitives';
import NexusLogo from './NexusLogo';
import { StockMetric } from '../types';
import { initialEquities } from '../dataStore';
import { useNexusAnalytics } from '../useNexusAnalytics';
import { Search, Radio, ShieldCheck, LogOut, Terminal as TerminalIcon } from 'lucide-react';

interface CommandShellProps {
  onReEncrypt?: () => void;
}

export default function CommandShell({ onReEncrypt }: CommandShellProps) {
  const [search, setSearch] = useState("");
  const [cache, setCache] = useState<string[]>(["TCS", "SBIN", "ZOMATO", "HDFCBANK", "NIFTYBEES"]);
  
  const { 
    currentTicker, 
    analyticsData, 
    terminalLogs, 
    systemStatus, 
    triggerTickerEvaluation, 
    isRealtime 
  } = useNexusAnalytics();

  // On mount, auto-dispatch the default workspace portfolio evaluation (TCS)
  useEffect(() => {
    if (systemStatus === 'idle') {
      triggerTickerEvaluation("TCS");
    }
  }, [systemStatus, triggerTickerEvaluation]);

  // Merge loaded analytics with baseline static fallbacks to guarantee absolute UI structural safety
  const metrics: StockMetric = analyticsData || initialEquities.find(e => e.symbol === currentTicker) || {
    symbol: currentTicker,
    name: `${currentTicker} Consolidated Corp`,
    price: 500,
    peRatio: 15.4,
    operatingMargin: 18.2,
    ncav: 12000000,
    profitabilityGrade: "B",
    valuationGrade: "B",
    growthGrade: "A-",
    overallGrade: "B+",
    grahamNumber: "580.00",
    marginOfSafetyPercent: 16.0,
    roe: 18.5,
    insiderOwnershipPercent: 12.4,
    leverageDebtToEquity: 0.45,
    riskFlags: ["Stable Assets Configured: Baseline telemetry verified."]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) {
       const term = search.toUpperCase().trim();
       if (!cache?.includes(term)) {
           setCache(p => [term, ...p].slice(0, 5));
       }
       triggerTickerEvaluation(term);
       setSearch("");
    }
  };

  const getGradeColor = (g: string) => {
      if (g.startsWith("A")) return "text-[#00E676]";
      if (g.startsWith("B") || g.startsWith("C")) return "text-[#00F0FF]";
      return "text-slate-400";
  };

  return (
    <Box className="w-full h-screen border-none rounded-none bg-[#000000] flex flex-col px-8 py-6 overflow-hidden select-none">
      
      {/* Top Header - Master Widescreen Layout Container requirement */}
      <Flex className="w-full h-16 mb-6 border-b border-[#1F2226] pb-4 flex-shrink-0" justify="justify-between">
        <Flex gap="gap-6">
          <NexusLogo size={36} />
          <div className="flex flex-col">
            <h1 className="font-mono text-xl text-white tracking-[0.2em] font-bold">NEXUS<span className="text-[#00F0FF] opacity-80">VAULT</span></h1>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">360° Securities Intelligence Hub</span>
          </div>
        </Flex>
        <Flex gap="gap-8" className="font-mono text-xs text-slate-400">
          <Flex gap="gap-2" className="text-[#00E676] items-center">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>SUPABASE_LINK: <b className="text-[#00E676]">{isRealtime ? "REALTIME_WS" : "POLLING_FALLBACK"}</b></span>
          </Flex>
          <Flex gap="gap-2" className="text-[#00F0FF] border-l border-[#1F2226] pl-8 items-center">
            <ShieldCheck className="w-4 h-4" />
            <span>WORKFLOW_STATUS: <b className="text-[#00F0FF] uppercase">{systemStatus}</b></span>
          </Flex>
          {onReEncrypt && (
            <button 
              onClick={onReEncrypt}
              className="px-4 py-2 border border-[#1F2226] rounded bg-[#0B0C0E] hover:bg-[#1F2226] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex gap-2 items-center text-slate-300 cursor-pointer"
            >
               <LogOut className="w-3.5 h-3.5" /> RE-ENCRYPT
            </button>
          )}
        </Flex>
      </Flex>

      <Flex className="flex-1 overflow-hidden w-full h-full items-stretch" gap="gap-6" align="items-stretch">
        
        {/* Main 360 Institutional Matrix Area */}
        <Stack className="flex-1 overflow-y-auto pr-2" gap="gap-6">
          
          {/* Global Ticker Head */}
          <Box className="p-5 border-[#1F2226] flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F0FF]/30"></div>
            <Flex>
              <form onSubmit={handleSearch} className="flex-1 flex gap-4 pr-8">
                <Box className="flex-1 flex px-4 border border-[#1F2226] rounded-full focus-within:border-[#00F0FF] py-3 bg-[#000000] items-center">
                  <Search className="w-5 h-5 text-slate-600 mr-4" />
                  <input 
                    type="text" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="ENTER CORE SYMBOL PARSE QUERY..." 
                    className="bg-transparent border-none outline-none text-white font-mono w-full text-sm" 
                  />
                </Box>
                <button type="submit" className="px-10 bg-[#00F0FF]/5 text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 rounded-full font-mono text-xs font-bold transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95] tracking-widest cursor-pointer">PARSE</button>
              </form>
              <Flex gap="gap-2" className="font-mono text-xs text-slate-500 items-center">
                <span className="mr-2">QUEUE_CACHE:</span>
                {cache.map((c, i) => (
                  <button 
                    onClick={() => triggerTickerEvaluation(c)} 
                    key={i} 
                    className={`px-3 py-1.5 rounded transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex gap-1 items-center border ${metrics.symbol === c ? 'bg-[#1F2226] text-white border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]' : 'bg-[#0B0C0E] text-slate-500 hover:text-slate-300 border-[#1F2226]'}`}
                  >
                     {c}
                  </button>
                ))}
              </Flex>
            </Flex>
          </Box>

          <Grid cols="grid-cols-12" className="flex-1 min-h-0" gap="gap-6">
            
            {/* Alpha-Beta Scorecard */}
            <Box className="col-span-4 p-8 border-[#1F2226] flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <h2 className="text-[#00F0FF] font-mono text-xs font-bold tracking-widest mb-6 flex gap-2 items-center border-b border-[#1F2226] pb-4">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></span>
                 ALPHA-BETA SCORECARD
              </h2>
              
              <div className="mb-8">
                 <span className="text-3xl font-bold text-white font-mono tracking-tighter">{metrics.symbol}</span>
                 <span className="block text-xs text-slate-500 font-mono mt-1 uppercase">{metrics.name}</span>
                 <span className="block text-xl text-[#00E676] font-mono mt-4 font-bold border-l-2 border-[#00E676] pl-3">INR {typeof metrics.price === 'number' ? metrics.price.toLocaleString("en-IN") : metrics.price}</span>
              </div>

              <Stack gap="gap-4" className="flex-1 justify-center">
                <Flex className="bg-[#000000] px-6 py-4 rounded-lg border border-[#1F2226]" justify="justify-between">
                  <span className="font-mono text-slate-400 text-xs">PROFITABILITY</span>
                  <span className={`text-xl font-bold font-mono ${getGradeColor(metrics.profitabilityGrade)}`}>{metrics.profitabilityGrade}</span>
                </Flex>
                <Flex className="bg-[#000000] px-6 py-4 rounded-lg border border-[#1F2226]" justify="justify-between">
                  <span className="font-mono text-slate-400 text-xs">VALUATION</span>
                  <span className={`text-xl font-bold font-mono ${getGradeColor(metrics.valuationGrade)}`}>{metrics.valuationGrade}</span>
                </Flex>
                <Flex className="bg-[#000000] px-6 py-4 rounded-lg border border-[#1F2226]" justify="justify-between">
                  <span className="font-mono text-slate-400 text-xs">ASSET GROWTH</span>
                  <span className={`text-xl font-bold font-mono ${getGradeColor(metrics.growthGrade)}`}>{metrics.growthGrade}</span>
                </Flex>
                
                <Flex className="bg-[#00F0FF]/5 px-6 py-5 rounded-lg mt-4 border border-[#00F0FF]/30 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]" justify="justify-between">
                  <span className="font-mono text-white text-xs font-bold tracking-widest">OVERALL ALPHA</span>
                  <span className="text-3xl font-bold font-mono text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">{metrics.overallGrade}</span>
                </Flex>
              </Stack>
            </Box>

            {/* Graham & Buffett Quant Engine & Diagnostic */}
            <Stack className="col-span-8 flex flex-col h-full" gap="gap-6">
              
              <Grid cols="grid-cols-2" gap="gap-6" className="flex-none">
                <Box className="p-6 border-[#1F2226] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <h2 className="text-[#00F0FF] font-mono text-xs font-bold tracking-widest mb-6 border-b border-[#1F2226] pb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></span>
                     DEFENSIVE QUANT ENGINE
                  </h2>
                  <Stack gap="gap-4">
                    <Box className="bg-[#000000] border-[#1F2226] p-5 text-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#00E676]/50">
                      <div className="text-slate-500 font-mono text-[10px] tracking-widest mb-2">INTRINSIC GRAHAM NUMBER</div>
                      <div className="text-2xl font-mono text-white font-bold">INR {metrics.grahamNumber}</div>
                    </Box>
                    <Grid cols="grid-cols-2" gap="gap-4">
                       <Box className="bg-[#000000] border-[#1F2226] p-4 text-center">
                          <div className="text-slate-500 font-mono text-[10px] tracking-widest mb-2">MARGIN OF SAFETY</div>
                          <div className={`text-xl font-mono font-bold ${metrics.marginOfSafetyPercent >= 0 ? 'text-[#00E676]' : 'text-red-500'}`}>
                            {metrics.marginOfSafetyPercent >= 0 ? '+' : ''}{metrics.marginOfSafetyPercent}%
                          </div>
                       </Box>
                       <Box className="bg-[#000000] border-[#1F2226] p-4 text-center">
                          <div className="text-slate-500 font-mono text-[10px] tracking-widest mb-2">NCAV NET ASSET VALUE</div>
                          <div className="text-xl font-mono text-white font-bold">INR {typeof metrics.ncav === 'number' ? metrics.ncav.toLocaleString("en-IN") : metrics.ncav}</div>
                       </Box>
                    </Grid>
                  </Stack>
                </Box>
                
                <Box className="p-6 border-[#1F2226] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <h2 className="text-white font-mono text-xs font-bold tracking-widest mb-6 border-b border-[#1F2226] pb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    RISK DIAGNOSTIC MODULE
                  </h2>
                  <Stack gap="gap-3 font-mono text-[11px] text-slate-300">
                    <Flex justify="justify-between" className="border-b border-[#1F2226] pb-2">
                       <span className="text-slate-500">RETURN ON EQUITY (ROE)</span><span className="text-[#00E676] font-bold">{metrics.roe}%</span>
                    </Flex>
                    <Flex justify="justify-between" className="border-b border-[#1F2226] pb-2">
                       <span className="text-slate-500">INSIDER ALIGNMENT</span><span className="text-white font-bold">{metrics.insiderOwnershipPercent}%</span>
                    </Flex>
                    <Flex justify="justify-between" className="border-b border-[#1F2226] pb-2">
                       <span className="text-slate-500">SYSTEMIC LEVERAGE (D/E)</span><span className="text-white font-bold">{metrics.leverageDebtToEquity}x</span>
                    </Flex>
                    <Box className="bg-[#000000] border-[#1F2226] p-4 mt-2">
                      <div className="text-slate-600 mb-2 tracking-widest font-bold">DIAGNOSTIC_RISK_FLAGS:</div>
                      {metrics.riskFlags?.map((flag, idx) => (
                        <div key={idx} className={`${flag?.includes("Negligible") || flag?.includes("Stable Balance Sheet") ? "text-slate-500" : "text-red-400"} mt-1 line-clamp-2`}>- {flag}</div>
                      ))}
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Peer Matrix */}
              <Box className="p-6 border-[#1F2226] flex-1 flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.5)] min-h-0">
                <h2 className="text-white font-mono text-xs font-bold tracking-widest mb-4 border-b border-[#1F2226] pb-4 flex items-center gap-2 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    PEER-MATRIX DATASHEET
                </h2>
                <div className="overflow-y-auto flex-1 pr-2 scrollbar-none font-mono">
                  <table className="w-full text-left text-[11px] text-slate-400">
                    <thead className="bg-[#000000] sticky top-0 z-10 text-slate-600 border-b border-[#1F2226]">
                      <tr>
                        <th className="py-3 px-4 font-normal tracking-widest">ASSET</th>
                        <th className="py-3 px-4 font-normal tracking-widest">PRICE</th>
                        <th className="py-3 px-4 font-normal tracking-widest">TRAIL P/E</th>
                        <th className="py-3 px-4 font-normal tracking-widest">OP MARGIN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1F2226]/50 bg-[#1F2226]/20 transition-all duration-400">
                        <td className="py-3 px-4 font-bold text-[#00F0FF] tracking-wider">{metrics.symbol}</td>
                        <td className="py-3 px-4 text-white font-bold">INR {typeof metrics.price === 'number' ? metrics.price.toLocaleString("en-IN") : metrics.price}</td>
                        <td className="py-3 px-4 font-bold">{metrics.peRatio ? metrics.peRatio.toFixed(1) : '15'}x</td>
                        <td className="py-3 px-4 font-bold">{metrics.operatingMargin}%</td>
                      </tr>
                      {/* Synthetic Peers mapping based on selected index */}
                      <tr className="border-b border-[#1F2226]/50 hover:bg-[#1F2226]/20 transition-all duration-400 cursor-pointer">
                        <td className="py-3 px-4 text-white">[{metrics.symbol}-PEER1]</td>
                        <td className="py-3 px-4 text-slate-300">INR {(Number(metrics.price) * 0.85).toFixed(1)}</td>
                        <td className="py-3 px-4">{(Number(metrics.peRatio || 15) * 0.9).toFixed(1)}x</td>
                        <td className="py-3 px-4">{(Number(metrics.operatingMargin || 18.2) * 0.95).toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b border-[#1F2226]/50 hover:bg-[#1F2226]/20 transition-all duration-400 cursor-pointer">
                        <td className="py-3 px-4 text-white">[{metrics.symbol}-PEER2]</td>
                        <td className="py-3 px-4 text-slate-300">INR {(Number(metrics.price) * 1.15).toFixed(1)}</td>
                        <td className="py-3 px-4">{(Number(metrics.peRatio || 15) * 1.1).toFixed(1)}x</td>
                        <td className="py-3 px-4">{(Number(metrics.operatingMargin || 18.2) * 1.05).toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b border-[#1F2226]/50 hover:bg-[#1F2226]/20 transition-all duration-400 cursor-pointer">
                        <td className="py-3 px-4 text-white">[{metrics.symbol}-PEER3]</td>
                        <td className="py-3 px-4 text-slate-300">INR {(Number(metrics.price) * 0.95).toFixed(1)}</td>
                        <td className="py-3 px-4">{(Number(metrics.peRatio || 15) * 1.05).toFixed(1)}x</td>
                        <td className="py-3 px-4">{(Number(metrics.operatingMargin || 18.2) * 1.1).toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Box>

            </Stack>

          </Grid>
        </Stack>

        {/* Tactical Terminal Sidebar - Realtime Streaming Feed and interactive commands input */}
        <Box className="w-[420px] p-6 border-[#1F2226] h-full flex flex-col flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <h2 className="text-[#00F0FF] font-mono text-xs font-bold tracking-widest mb-6 border-b border-[#1F2226] pb-4 flex items-center gap-2">
            <TerminalIcon className="w-4 h-4" />
            TACTICAL TERMINAL_
          </h2>
          <Box className="flex-1 bg-[#000000] border-[#1F2226] p-5 overflow-y-auto font-mono text-[10px] flex flex-col gap-4">
             {terminalLogs.length > 0 ? (
               terminalLogs.map((L, i) => (
                  <div key={i} className="leading-relaxed border-l-2 border-[#1F2226] pl-3 py-0.5">
                    <span className={L?.includes("Oracle") || L?.includes("Architect") ? "text-[#00F0FF]" : L?.includes("Sys") || L?.includes("Vault") ? "text-slate-400" : L?.includes("Scout") ? "text-[#00E676]" : "text-white"}>{L}</span>
                  </div>
               ))
             ) : (
               <div className="text-slate-600 italic">No terminal feeds loaded yet. Awaiting initialization...</div>
             )}
             <div className="animate-pulse text-[#00F0FF]">&gt; _</div>
          </Box>
          <div className="mt-6 border-t border-[#1F2226] pt-4 flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-[#000000] border border-[#1F2226] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#00F0FF]" 
                placeholder="EXEC PARSE [TICKER]..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.currentTarget as HTMLInputElement).value;
                    if (val) {
                      triggerTickerEvaluation(val);
                      (e.currentTarget as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  const siblingInput = (e.currentTarget.previousSibling as HTMLInputElement);
                  const val = siblingInput?.value;
                  if (val) {
                    triggerTickerEvaluation(val);
                    siblingInput.value = "";
                  }
                }}
                className="px-4 bg-[#1F2226] text-white hover:bg-[#00F0FF] hover:text-[#000000] font-mono text-xs rounded transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
              >
                EXEC
              </button>
          </div>
        </Box>

      </Flex>
    </Box>
  );
}
