import React, { useState } from 'react';
import { ArrowUpRight, MessageSquare, ShieldAlert, CheckCircle2, HelpCircle, ExternalLink } from 'lucide-react';

export interface SourceCitation {
  name: string;
  url: string;
}

export interface IntelligenceCardProps {
  title: string;
  category: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  summary: string[];
  impactedTicker: string;
  timingSignal: string;
  sources: SourceCitation[];
}

export type NewsInsightProps = IntelligenceCardProps;

export const IntelligenceCard: React.FC<IntelligenceCardProps> = ({
  title,
  category,
  sentiment,
  confidence,
  summary,
  impactedTicker,
  timingSignal,
  sources,
}) => {
  const [showSources, setShowSources] = useState(false);

  // Accessible Indian Market Accent Mapping (Enforcing the UI/UX rules)
  const sentimentStyles = {
    BULLISH: {
      bg: 'bg-[#00B074]/10',
      text: 'text-[#00B074]',
      border: 'border-[#00B074]/20',
      icon: <CheckCircle2 className="w-3 h-3 text-[#00B074]" />
    },
    BEARISH: {
      bg: 'bg-[#EF4444]/10',
      text: 'text-[#EF4444]',
      border: 'border-[#EF4444]/20',
      icon: <ShieldAlert className="w-3 h-3 text-[#EF4444]" />
    },
    NEUTRAL: {
      bg: 'bg-zinc-800/50',
      text: 'text-zinc-400',
      border: 'border-zinc-800',
      icon: <HelpCircle className="w-3 h-3 text-zinc-400" />
    }
  };

  const currentStyle = sentimentStyles[sentiment] || sentimentStyles.NEUTRAL;

  return (
    <div className="bg-[#0c0d0e] border border-zinc-800/60 hover:border-zinc-700/80 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] group w-full">
      {/* Top Metadata Header Segment */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-widest fs-test">
          {category}
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}>
            {currentStyle.icon}
            {sentiment}
          </div>
          <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800/40">
            {confidence}% Clarity
          </span>
        </div>
      </div>

      {/* Main Core Synthesis Core */}
      <div className="flex-1 text-left">
        <h4 className="font-sans text-sm font-semibold text-zinc-100 tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-150">
          {title}
        </h4>
        
        {/* Gestalt Grouping Bullet points */}
        <ul className="mt-3.5 space-y-2 text-xs text-zinc-400 list-none pl-0">
          {summary.map((point, index) => (
            <li key={index} className="flex items-start gap-2 leading-relaxed">
              <span className="text-zinc-600 mt-1 flex-shrink-0">▪</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Spacing Rule Asset Impact & Action Footer Row */}
      <div className="mt-5 pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs w-full">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] text-zinc-500 font-medium">Impacted Asset:</span>
          <span className="font-mono text-[11px] font-bold bg-zinc-900 text-zinc-200 border border-zinc-800 px-2 py-0.5 rounded">
            {impactedTicker}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium bg-zinc-900/30 pl-2 pr-1 py-0.5 rounded border border-zinc-800/30">
          <span>Signal: {timingSignal}</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
        </div>
      </div>

      {/* Micro-Interaction Source Citation Accordion Drawer */}
      <div className="mt-3 w-full text-left">
        <button 
          onClick={() => setShowSources(!showSources)}
          className="text-[10px] font-sans font-medium text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors outline-none cursor-pointer"
        >
          <MessageSquare className="w-2.5 h-2.5" />
          {showSources ? 'Hide Verified Citations' : `View Sources (${sources.length})`}
        </button>

        {showSources && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-zinc-900/40 animate-fade-in">
            {sources.map((src, i) => (
              <a 
                key={i}
                href={src.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-sans bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded flex items-center gap-1 transition-all duration-150 active:scale-95"
              >
                {src.name}
                <ExternalLink className="w-2 h-2 text-zinc-600" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligenceCard;
