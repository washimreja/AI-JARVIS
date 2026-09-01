import React from 'react';
import type { NavTab } from '../types/jarvis';
import { Sparkles } from 'lucide-react';

interface PlaceholderViewProps {
  tab: NavTab;
  title: string;
  description: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  tab,
  title,
  description,
}) => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 select-none">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl flex flex-col items-center text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-jarvis-cyan/10 border border-jarvis-cyan/30 flex items-center justify-center text-jarvis-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)]">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase font-mono">
            {title}
          </h2>
          <span className="text-[11px] font-mono text-jarvis-cyan uppercase">
            Module: {tab}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
        <div className="pt-2">
          <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-white/[0.05] text-[10px] font-mono text-slate-400">
            Phase 1 UI Ready • Phase Integration Pending
          </span>
        </div>
      </div>
    </div>
  );
};
