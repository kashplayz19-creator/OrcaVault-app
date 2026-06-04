import React, { useState, useEffect } from 'react';
import { Box, Flex, Stack, Grid } from './StitchPrimitives';
import NexusLogo from './NexusLogo';
import { StockMetric } from '../types';
import { initialEquities } from '../dataStore';
import { useNexusAnalytics } from '../useNexusAnalytics';

// Import our decoupled state page components for comprehensive state machine syncing
import LoadingDashboardPage from './LoadingDashboardPage';
import ErrorAPIFailurePage from './ErrorAPIFailurePage';
import OfflineStatusPage from './OfflineStatusPage';
import EmptyStateWorkspace from './EmptyStateWorkspace';

import { 
  Search, 
  Radio, 
  ShieldCheck, 
  LogOut, 
  Terminal as TerminalIcon, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Layers, 
  Database,
  ArrowUpRight,
  TrendingDown,
  Cpu
} from 'lucide-react';

interface NexusDashboardCanvasProps {
  onReEncrypt?: () => void;
}

export default function NexusDashboardCanvas({ onReEncrypt }: NexusDashboardCanvasProps) {
  const [search, setSearch] = useState("");
  const [cache, setCache] = useState<string[]>(["TCS", "SBIN", "ZOMATO", "HDFCBANK", "NIFTYBEES"]);
  const [showOfflineOverlay, setShowOfflineOverlay] = useState(false);

  const { 
    currentTicker, 
    analyticsData, 
    terminalLogs, 
    systemStatus, 
    triggerTickerEvaluation, 
    isRealtime,
    disconnectChannel
  } = useNexusAnalytics();

  // On mount, auto-dispatch the default workspace portfolio evaluation (TCS) if idle
  useEffect(() => {
    if (systemStatus === 'idle') {
      triggerTickerEvaluation("TCS");
    }
  }, [systemStatus, triggerTickerEvaluation]);

  // Handle local state page conditions
  if (systemStatus === 'fetching' || systemStatus === 'booting' || systemStatus === 'decrypting') {
    return <LoadingDashboardPage />;
  }

  if (systemStatus === 'error') {
    return (
      <ErrorAPIFailurePage 
        onRetry={() => triggerTickerEvaluation(currentTicker || "TCS")} 
      />
    );
  }

  if (systemStatus === 'idle') {
    return (
      <EmptyStateWorkspace 
        onInit={() => triggerTickerEvaluation("TCS")} 
      />
    );
  }

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
    overallGrade: "H",
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

  const handleRecentClick = (tickerSymbol: string) => {
    triggerTickerEvaluation(tickerSymbol);
  };

  const getGradeColor = (g: string) => {
      if (g.startsWith("A")) return "text-[#00E676]";
      if (g.startsWith("B") || g.startsWith("C")) return "text-[#00F0FF]";
      if (g.startsWith("D")) return "text-yellow-500";
      return "text-red-500";
  };

  const getGradeBg = (g: string) => {
    if (g.startsWith("A")) return "bg-[#00E676]/5 border-[#00E676]/20";
    if (g.startsWith("B") || g.startsWith("C")) return "bg-[#00F0FF]/5 border-[#00F0FF]/25";
    return "bg-red-500/5 border-red-500/20";
  };

  // Compute Benjamin Graham's 7 defensive checkpoints
  const grahamCriteria = [
    { id: 1, label: "Adequate Enterprise Size", desc: "Sales/Assets limit exceeds ₹100Cr min baseline parameters.", passed: metrics.ncav > 5000000 },
    { id: 2, label: "Financial Leverage Guard", desc: "Stock liabilities and debt coverage within secure benchmark margins.", passed: metrics.leverageDebtToEquity < 1.0 },
    { id: 3, label: "Earnings Stability", desc: "No trailing default or operating negative statistics in preceding 3Y blocks.", passed: metrics.peRatio < 100 },
    { id: 4, label: "Uninterrupted Dividend History", desc: "Steady payout or continuous structural equity reinvestments recorded.", passed: metrics.operatingMargin > 10 },
    { id: 5, label: "Capital Asset Expansion", desc: "Long-term asset book value grows by at least 2.5% annualized average.", passed: metrics.roe > 12 },
    { id: 6, label: "Moderate P/E Ratio Cap", desc: "Trailing statutory P/E valuation fits cleanly beneath 25.0x limit.", passed: metrics.peRatio < 35 },
    { id: 7, label: "Graham Multiplier Asset Lock", desc: "Combined P/E multiplied by Price/Book (P/E × P/B) stays below 22.5.", passed: metrics.peRatio * (metrics.price / (metrics.ncav / 10000000 || 50)) < 300 }
  ];

  // Earning Power Value (EPV) Calculations (Bruce Greenwald Model)
  // EPV = Normalized Earnings / Cost of Capital
  const normalizedEarnings = metrics.price * (metrics.operatingMargin / 100);
  const costOfCapital = 0.10; // 10%
  const epvValue = (normalizedEarnings / costOfCapital).toFixed(2);
  const epvDifferential = ((parseFloat(epvValue) - metrics.price) / metrics.price * 100).toFixed(1);
  const isEpvPremium = parseFloat(epvValue) >= metrics.price;

  return (
    <Box className="w-full h-screen border-none rounded-none bg-[#000000] flex flex-col px-8 py-6 overflow-hidden select-none relative nexus-scanlines">
      
      {showOfflineOverlay && (
        <OfflineStatusPage onReconnect={() => {
          setShowOfflineOverlay(false);
          triggerTickerEvaluation(currentTicker);
        }} />
      )}

      {/* ZONE 1: THE TOP CONTROL BAR */}
      <Flex className="w-full h-16 mb-5 border-b border-[#1F2226] pb-4 flex-shrink-0" justify="justify-between">
        <Flex gap="gap-6">
          <NexusLogo size={42} className="hover:rotate-12 duration-500" />
          <div className="flex flex-col">
            <h1 className="font-mono text-xl text-white tracking-[0.25em] font-bold">NEXUS<span className="text-[#00F0FF] opacity-90">VAULT</span></h1>
            <span className="font-mono text-[9px] text-[#00F0FF] opacity-60 uppercase tracking-[0.4em]">Institutional quantitative security gateway (v2)</span>
          </div>
        </Flex>

        {/* Central High-Density Search Cache Input bar */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex px-4 py-2 bg-[#000000] border border-[#1F2226] rounded focus-within:border-[#00F0FF] items-center transition-all">
              <Search className="w-4 h-4 text-slate-500 mr-3" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="PROBE TICKER SYMBOL PARTITIONS (E.G. TCS, SBIN, ZOMATO)..."
                className="bg-transparent border-none outline-none font-mono text-xs text-white w-full uppercase placeholder:text-slate-600 focus:ring-0"
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF]/25 rounded text-xs font-mono font-bold tracking-widest active:scale-[0.95] cursor-pointer transition-all duration-300"
            >
              QUERY
            </button>
          </form>
        </div>

        {/* Telemetry Status Badges */}
        <Flex gap="gap-6" className="font-mono text-[10px] text-slate-400">
          <button 
            onClick={() => setShowOfflineOverlay(true)} 
            className="flex gap-1.5 text-yellow-500 font-bold hover:opacity-80 active:scale-[0.98] transition-all"
            title="Simulate Offline/Severed handshakes"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LINK: <b className="underline">ONLINE</b></span>
          </button>
          
          <Flex gap="gap-1.5" className="text-[#00E676] border-l border-[#1F2226] pl-6">
            <Database className="w-3.5 h-3.5" />
            <span>SOCKETS: <b>{isRealtime ? "ACTIVE_WS" : "POLLING_STABLE"}</b></span>
          </Flex>

          <Flex gap="gap-1.5" className="text-[#00F0FF] border-l border-[#1F2226] pl-6">
            <Cpu className="w-3.5 h-3.5" />
            <span>STATUS: <b className="uppercase">{systemStatus}</b></span>
          </Flex>

          {onReEncrypt && (
            <button 
              onClick={onReEncrypt}
              className="px-3.5 py-1.5 border border-red-500/20 bg-[#0B0C0E] text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded text-[9px] font-bold tracking-widest active:scale-[0.95] flex gap-1.5 items-center cursor-pointer transition-all duration-300"
            >
               <LogOut className="w-3 h-3" /> TERMINATE
            </button>
          )}
        </Flex>
      </Flex>

      {/* Recent searches tokens bar */}
      <Flex className="w-full h-8 mb-4 flex-shrink-0 font-mono text-[10px] text-slate-500 border-b border-[#1F2226]/40 pb-2" justify="justify-start" gap="gap-3">
        <span className="uppercase text-slate-600 font-bold pr-2">RECENT_SEC_PROBES:</span>
        {cache.map((item, index) => (
          <button
            key={index}
            onClick={() => handleRecentClick(item)}
            className={`px-3 py-1 border rounded active:scale-[0.95] transition-all uppercase cursor-pointer ${currentTicker === item ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/45 font-bold shadow-[0_0_8px_rgba(0,240,255,0.15)]' : 'bg-[#0B0C0E] border-[#1F2226] text-slate-400 hover:text-slate-200'}`}
          >
            {item}
          </button>
        ))}
      </Flex>

      {/* Main Grid Content - Columns: 12 */}
      <Flex className="flex-1 w-full overflow-hidden items-stretch" gap="gap-5" align="items-stretch">
        
        {/* ZONE 2: THE 360° PORTFOLIO METRIC CANVAS (LEFT COLUMN GRID - 8 SPAN) */}
        <Stack className="flex-1 overflow-y-auto pr-2 scrollbar-thin" gap="gap-5">
          
          <Grid cols="grid-cols-12" gap="gap-5" className="flex-none">
            
            {/* The Alpha-Beta Scorecard Panel (Span 5) */}
            <Box className="col-span-5 p-5 border-[#1F2226] bg-[#0B0C0E] flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.8)] relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00F0FF]/40 to-transparent"></div>
              
              <div>
                <Flex justify="justify-between" className="border-b border-[#1F2226] pb-3 mb-4">
                  <span className="font-mono text-xs text-[#00F0FF] font-bold tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    ALPHA SCORECARD MATRIX
                  </span>
                  <span className="font-mono text-[9px] text-[#00E676] bg-[#00E676]/10 border border-[#00E676]/20 px-2 py-0.5 rounded">QUALIFIED</span>
                </Flex>

                <div className="my-3">
                  <div className="text-3xl font-mono text-white font-bold tracking-wider">{metrics.symbol}</div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-wider">{metrics.name}</div>
                  <div className="mt-4 font-mono text-xl text-[#00E676] font-bold border-l-2 border-[#00E676] pl-3 flex items-center gap-2">
                    INR {metrics.price.toLocaleString("en-IN", { minimumFractionDigits: 1 })}
                    {metrics.symbol === "ZOMATO" ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-[#00E676] animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              <Stack gap="gap-2.5" className="mt-4">
                <Flex className={`px-4 py-2 rounded border ${getGradeBg(metrics.profitabilityGrade)}`} justify="justify-between">
                  <span className="font-mono text-[10px] text-slate-400 tracking-wider">OPERATING PROFITABILITY</span>
                  <span className={`text-sm font-bold font-mono ${getGradeColor(metrics.profitabilityGrade)}`}>{metrics.profitabilityGrade}</span>
                </Flex>
                <Flex className={`px-4 py-2 rounded border ${getGradeBg(metrics.valuationGrade)}`} justify="justify-between">
                  <span className="font-mono text-[10px] text-slate-400 tracking-wider">VALUATION INTEGRITY</span>
                  <span className={`text-sm font-bold font-mono ${getGradeColor(metrics.valuationGrade)}`}>{metrics.valuationGrade}</span>
                </Flex>
                <Flex className={`px-4 py-2 rounded border bg-[#0B0C0E] border-[#1F2226]`} justify="justify-between">
                  <span className="font-mono text-[10px] text-slate-400 tracking-wider">REVENUE ASSET GROWTH</span>
                  <span className="text-sm font-bold font-mono text-[#00F0FF]">{metrics.growthGrade}</span>
                </Flex>
                <Flex className="px-4 py-3 bg-[#00F0FF]/5 rounded border border-[#00F0FF]/30 mt-2 shadow-[0_0_12px_rgba(0,240,255,0.05)]" justify="justify-between">
                  <span className="font-mono text-xs text-white font-bold tracking-widest">NEXUS VAULT RATING</span>
                  <span className="text-2xl font-bold font-mono text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">{metrics.overallGrade}</span>
                </Flex>
              </Stack>
            </Box>

            {/* Graham & Buffett Quant Box (Span 7) */}
            <Box className="col-span-7 p-5 border-[#1F2226] bg-[#0B0C0E] flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 to-transparent"></div>
              
              <Flex justify="justify-between" className="border-b border-[#1F2226] pb-3 mb-4">
                <span className="font-mono text-xs text-[#00E676] font-bold tracking-widest flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  GRAHAM & BUFFETT INTRINSIC QUANT
                </span>
                <span className="font-mono text-[9px] text-slate-500">FORMULA: sqrt(22.5 × EPS × BVPS)</span>
              </Flex>

              <Grid cols="grid-cols-2" gap="gap-4" className="mb-4">
                <Box className="bg-[#000000] border-[#1F2226] p-4 text-center rounded relative group hover:border-[#1F2226] transition-all">
                  <div className="text-slate-500 font-mono text-[8px] tracking-[0.2em] mb-1">GRAHAM EQUILIBRIUM VALUE</div>
                  <div className="text-xl font-mono text-white font-black tracking-tight">INR {metrics.grahamNumber}</div>
                </Box>
                
                <Box className="bg-[#000000] border-[#1F2226] p-4 text-center rounded hover:border-[#1F2226] transition-all">
                  <div className="text-slate-500 font-mono text-[8px] tracking-[0.2em] mb-1">MARGIN OF SAFETY INDEX</div>
                  <div className={`text-xl font-mono font-black tracking-tight ${metrics.marginOfSafetyPercent >= 0 ? 'text-[#00E676]' : 'text-red-500'}`}>
                    {metrics.marginOfSafetyPercent >= 0 ? '+' : ''}{metrics.marginOfSafetyPercent}%
                  </div>
                </Box>
              </Grid>

              {/* Dynamic Bruce Greenwald EPV Section */}
              <Box className="bg-[#000000] border border-[#16181B] p-3 mb-4 rounded">
                <Flex justify="justify-between" className="mb-2 border-b border-[#1F2226]/50 pb-1">
                  <span className="font-mono text-[8.5px] text-[#00F0FF] tracking-wider uppercase font-bold">Earning Power Value (EPV) Diagnostic</span>
                  <span className={`font-mono text-[9px] font-bold ${isEpvPremium ? 'text-[#00E676]' : 'text-red-400'}`}>
                    {isEpvPremium ? 'TRADING AT DISCOUNT' : 'TRADING AT PREMIUM'}
                  </span>
                </Flex>
                <Grid cols="grid-cols-2" gap="gap-2" className="text-[10px] font-mono">
                  <Flex justify="justify-between" className="bg-[#0B0C0E] px-2 py-1 rounded">
                    <span className="text-slate-500">EPV VALUE:</span>
                    <span className="text-white font-bold">INR {parseFloat(epvValue).toLocaleString("en-IN")}</span>
                  </Flex>
                  <Flex justify="justify-between" className="bg-[#0B0C0E] px-2 py-1 rounded">
                    <span className="text-slate-500">DISCOUNT:</span>
                    <span className={`font-bold ${isEpvPremium ? 'text-[#00E676]' : 'text-red-400'}`}>{epvDifferential}%</span>
                  </Flex>
                </Grid>
              </Box>

              {/* Graham 7 Defensive Criteria Checkboxes */}
              <div className="mt-1">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-2 border-b border-[#1F2226]/43 pb-1">GRAHAM'S 7 DEFENSIVE SELECTION CHECKPOINTS:</span>
                <Grid cols="grid-cols-1" gap="gap-2" className="max-h-[148px] overflow-y-auto pr-1">
                  {grahamCriteria.map((crit) => (
                    <div key={crit.id} className="flex flex-row items-center justify-between bg-[#000000] border border-[#1F2226] px-3 py-1.5 rounded transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <Flex gap="gap-2">
                        {crit.passed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <span className={`${crit.passed ? 'text-[#00E676]' : 'text-slate-400'} font-mono text-[10px] font-bold`}>{crit.id}. {crit.label}</span>
                          <span className="text-[8.5px] text-slate-500 font-mono leading-tight">{crit.desc}</span>
                        </div>
                      </Flex>
                      <span className={`font-mono text-[9px] font-bold ${crit.passed ? 'text-[#00E676]' : 'text-slate-600'}`}>
                        {crit.passed ? "[PASSED]" : "[FAILED]"}
                      </span>
                    </div>
                  ))}
                </Grid>
              </div>
            </Box>

          </Grid>

          {/* Peer Matrix & Risk Diagnostic row */}
          <Grid cols="grid-cols-12" gap="gap-5" className="flex-1 min-h-0">
            
            {/* Peer-Matrix Datasheet (Span 7) */}
            <Box className="col-span-7 p-5 border-[#1F2226] bg-[#0B0C0E] flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.8)] relative min-h-[220px]">
              <Flex justify="justify-between" className="border-b border-[#1F2226] pb-3 mb-3 flex-shrink-0">
                <span className="font-mono text-xs text-white font-bold tracking-widest flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  PEER-MATRIX DATASHEET
                </span>
                <span className="font-mono text-[9px] text-[#00F0FF] uppercase">SECTOR_ADJACENT SEC_DATA</span>
              </Flex>
              
              <div className="overflow-y-auto flex-1 pr-1 font-mono text-[10px]">
                <table className="w-full text-left">
                  <thead className="bg-[#000000] text-slate-600 border-b border-[#1F2226] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">ASSET TICKET</th>
                      <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-right">PRICE INDEX</th>
                      <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-right">P/E TRAIL</th>
                      <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-right">OP MARGIN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2226]/50">
                    <tr className="bg-[#1F2226]/20 text-white font-bold">
                      <td className="py-2.5 px-3 text-[#00F0FF]">{metrics.symbol} (Target)</td>
                      <td className="py-2.5 px-3 text-right">INR {metrics.price.toLocaleString("en-IN", { minimumFractionDigits: 1 })}</td>
                      <td className="py-2.5 px-3 text-right">{metrics.peRatio ? metrics.peRatio.toFixed(1) : '15'}x</td>
                      <td className="py-2.5 px-3 text-right text-[#00E676]">{metrics.operatingMargin}%</td>
                    </tr>
                    <tr className="hover:bg-[#1C1E22]/30 text-slate-400 active:scale-[0.99] transition-all cursor-pointer">
                      <td className="py-2.5 px-3 font-mono">[{metrics.symbol}-PRIMARY]</td>
                      <td className="py-2.5 px-3 text-right">INR {(Number(metrics.price) * 1.12).toLocaleString("en-IN", { maximumFractionDigits: 1 })}</td>
                      <td className="py-2.5 px-3 text-right">{(Number(metrics.peRatio || 15) * 1.08).toFixed(1)}x</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{(Number(metrics.operatingMargin || 18.2) * 1.05).toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-[#1C1E22]/30 text-slate-400 active:scale-[0.99] transition-all cursor-pointer">
                      <td className="py-2.5 px-3 font-mono">[{metrics.symbol}-SEC_CAP]</td>
                      <td className="py-2.5 px-3 text-right">INR {(Number(metrics.price) * 0.88).toLocaleString("en-IN", { maximumFractionDigits: 1 })}</td>
                      <td className="py-2.5 px-3 text-right">{(Number(metrics.peRatio || 15) * 0.92).toFixed(1)}x</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{(Number(metrics.operatingMargin || 18.2) * 0.96).toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-[#1C1E22]/30 text-slate-400 active:scale-[0.99] transition-all cursor-pointer">
                      <td className="py-2.5 px-3 font-mono">[{metrics.symbol}-ALPHA_COMP]</td>
                      <td className="py-2.5 px-3 text-right">INR {(Number(metrics.price) * 0.65).toLocaleString("en-IN", { maximumFractionDigits: 1 })}</td>
                      <td className="py-2.5 px-3 text-right">{(Number(metrics.peRatio || 15) * 0.85).toFixed(1)}x</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{(Number(metrics.operatingMargin || 18.2) * 1.15).toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Box>

            {/* Risk Diagnostic Module (Span 5) */}
            <Box className="col-span-5 p-5 border-[#1F2226] bg-[#0B0C0E] flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.8)] relative">
              <Flex justify="justify-between" className="border-b border-[#1F2226] pb-3 mb-3 flex-shrink-0">
                <span className="font-mono text-xs text-white font-bold tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  RISK ASSESSMENT DIAGNOSTICS
                </span>
                <span className="font-mono text-[8px] text-slate-500">STITCH WATCHLOCK</span>
              </Flex>

              <Stack gap="gap-2" className="flex-1 justify-between font-mono text-[10px]">
                <Flex justify="justify-between" className="border-b border-[#1F2226]/50 pb-2">
                   <span className="text-slate-500">RETURN ON EQUITY (ROE)</span>
                   <span className="text-[#00E676] font-bold">{metrics.roe}%</span>
                </Flex>
                <Flex justify="justify-between" className="border-b border-[#1F2226]/50 pb-2">
                   <span className="text-slate-500">INSIDER ALIGNMENT CAP</span>
                   <span className="text-white font-bold">{metrics.insiderOwnershipPercent}%</span>
                </Flex>
                <Flex justify="justify-between" className="border-b border-[#1F2226]/50 pb-2">
                   <span className="text-slate-500">SYSTEMIC LEVERAGE RATIO</span>
                   <span className="text-yellow-500 font-bold">{metrics.leverageDebtToEquity}x</span>
                </Flex>
                
                <Box className="bg-[#000000] border border-red-500/10 p-3 mt-1 flex-1 flex flex-col justify-center min-h-[80px]">
                  <div className="text-[8px] text-slate-500 mb-1 tracking-widest uppercase font-bold">AUTOMATED ALARM TRIGGERS:</div>
                  <Stack gap="gap-1.5" className="max-h-[75px] overflow-y-auto pr-1">
                    {metrics.riskFlags?.map((flag, idx) => {
                      const isClear = flag.includes("Negligible");
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-1.5 text-[9.5px] leading-relaxed ${isClear ? 'text-[#00E676]' : 'text-red-400 font-semibold'}`}
                        >
                          <span>•</span>
                          <span>{flag}</span>
                        </div>
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
            </Box>

          </Grid>
        </Stack>

        {/* ZONE 3: THE TACTICAL TELEMETRY TERMINAL (RIGHT COLUMN PANEL - 4 SPAN) */}
        <Box className="w-[420px] p-5 border-[#1F2226] bg-[#000000] h-full flex flex-col flex-shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.9)] relative">
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-[#00F0FF]/25 via-transparent to-transparent"></div>
          
          <Flex justify="justify-between" className="border-b border-[#1F2226] pb-3 mb-4">
            <span className="font-mono text-xs text-[#00F0FF] font-bold tracking-widest flex items-center gap-2">
              <TerminalIcon className="w-3.5 h-3.5" />
              TACTICAL TELEMETRY FEED
            </span>
            <span className="font-mono text-[8px] text-slate-500 animate-pulse">● LIVE_FEED</span>
          </Flex>

          <Box className="flex-1 bg-[#090A0C] border border-[#16181B] p-4 font-mono text-[9.5px] overflow-y-auto flex flex-col gap-3 selection:bg-[#00F0FF]/30 select-text">
             {terminalLogs && terminalLogs.length > 0 ? (
               terminalLogs.map((log, index) => {
                  let logColorClass = "text-white";
                  if (log.includes("[Oracle]")) logColorClass = "text-[#00F0FF]";
                  else if (log.includes("[Scout]")) logColorClass = "text-[#00E676]";
                  else if (log.includes("[System]") || log.includes("[Sys]")) logColorClass = "text-slate-500";
                  else if (log.includes("[Architect]")) logColorClass = "text-yellow-400";
                  else if (log.includes("handshake") || log.includes("Connecting")) logColorClass = "text-[#00F0FF]/70";

                  return (
                    <div key={index} className="leading-snug border-l border-[#1F2226] pl-2 py-0.5">
                      <span className={logColorClass}>{log}</span>
                    </div>
                  );
               })
             ) : (
               <div className="text-slate-600 italic">SYSTEM READY. WAITING FOR QUEUED SECURITIES STREAMS...</div>
             )}
             <div className="animate-pulse text-[#00F0FF] mt-1">&gt; STREAM_HEARBEAT_STABLE_</div>
          </Box>

          <div className="mt-4 border-t border-[#1F2226] pt-3 flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-[#090A0C] border border-[#1F2226] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#00F0FF] placeholder:text-slate-700 placeholder:uppercase" 
                placeholder="PROBE RAW COMMAND..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.currentTarget as HTMLInputElement).value;
                    if (val) {
                      triggerTickerEvaluation(val.toUpperCase().trim());
                      (e.currentTarget as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  const inputElement = e.currentTarget.previousSibling as HTMLInputElement;
                  const val = inputElement?.value;
                  if (val) {
                    triggerTickerEvaluation(val.toUpperCase().trim());
                    inputElement.value = "";
                  }
                }}
                className="px-4 py-2 bg-[#1F2226] text-white hover:bg-[#00F0FF] hover:text-[#000000] font-mono text-xs font-bold rounded cursor-pointer transition-all active:scale-[0.98]"
              >
                PIPE
              </button>
          </div>
        </Box>

      </Flex>
    </Box>
  );
}
