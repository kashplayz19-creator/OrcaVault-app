import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Minus, Timer, ExternalLink } from 'lucide-react';

export interface NewsInsightProps {
  title: string;
  category: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  summary: string[];
  impactedTicker: string;
  timingSignal: string;
  sources: { name: string; url: string }[];
}

export default function IntelligenceCard({
  title,
  category,
  sentiment,
  confidence,
  summary,
  impactedTicker,
  timingSignal,
  sources,
}: NewsInsightProps) {
  
  const renderSentiment = () => {
    switch (sentiment) {
      case 'BULLISH':
        return (
          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            BULLISH {confidence}%
          </span>
        );
      case 'BEARISH':
        return (
          <span className="flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            BEARISH {confidence}%
          </span>
        );
      case 'NEUTRAL':
      default:
        return (
          <span className="flex items-center gap-1 bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-medium">
            <Minus className="w-3 h-3 text-zinc-400" />
            NEUTRAL {confidence}%
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0c0d0e] border border-zinc-800/60 hover:border-zinc-700/80 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] group h-full">
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              {category}
            </span>
          </div>
          <div>
            {renderSentiment()}
          </div>
        </div>

        {/* Content Section */}
        <h4 className="font-sans text-sm font-semibold text-zinc-100 tracking-tight mt-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h4>

        {/* AI Bulleted Summary */}
        <ul className="mt-3 space-y-2 text-xs text-zinc-400 list-disc list-inside">
          {summary.map((point, index) => (
            <li key={index} className="leading-relaxed">
              <span className="text-zinc-400">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer & Meta Info */}
      <div className="mt-4">
        {/* Timing & Asset Impact Strip */}
        <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
          <div className="text-zinc-300 font-medium flex items-center gap-1.5">
            <span>Impacts:</span>
            <span className="bg-zinc-900 px-2 py-1 rounded text-zinc-200 font-mono font-bold tracking-wider text-[11px]">
              {impactedTicker}
            </span>
          </div>
          <div className="text-zinc-400 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Signal:</span>
            <span className={`font-semibold ${sentiment === 'BULLISH' ? 'text-emerald-400' : sentiment === 'BEARISH' ? 'text-rose-400' : 'text-zinc-300'}`}>
              {timingSignal}
            </span>
          </div>
        </div>

        {/* Citation Badges */}
        <div className="flex flex-wrap gap-1 mt-3 justify-end items-center">
          <span className="text-[9px] text-zinc-600 mr-1 uppercase tracking-wider font-semibold">Verified Citations:</span>
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] bg-zinc-900 text-zinc-500 hover:text-zinc-300 px-2 py-0.5 rounded transition-colors flex items-center gap-1 hover:bg-zinc-800"
            >
              <span>{source.name}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
