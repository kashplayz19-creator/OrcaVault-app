import React from 'react';

export const MarketDataSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[#0c0d0e] border border-zinc-800/60 rounded-xl p-5 space-y-4 animate-pulse select-none">
      <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3">
        <div className="h-4 w-36 bg-zinc-800 rounded-md" />
        <div className="h-3 w-20 bg-zinc-800/60 rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#121315] border border-zinc-800/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-zinc-800 rounded" />
              <div className="h-3 w-12 bg-zinc-800/80 rounded" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="h-6 w-20 bg-zinc-800/90 rounded" />
              <div className="h-4 w-16 bg-zinc-800/70 rounded" />
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-zinc-800/30">
              <div className="h-3 w-16 bg-zinc-800/50 rounded" />
              <div className="h-3 w-14 bg-zinc-800/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketDataSkeleton;
