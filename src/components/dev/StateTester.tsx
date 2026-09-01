import React, { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import type { JarvisState } from '../../types/jarvis';

interface StateTesterProps {
  currentState: JarvisState;
  onSetState: (state: JarvisState) => void;
}

const STATES: JarvisState[] = [
  'idle',
  'listening',
  'processing',
  'thinking',
  'executing',
  'speaking',
  'success',
  'error',
];

export const StateTester: React.FC<StateTesterProps> = ({ currentState, onSetState }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50">
      <div className="flex flex-col items-end">
        {open && (
          <div className="mb-2 p-2 rounded-2xl bg-slate-950/90 border border-jarvis-cyan/30 shadow-[0_0_25px_rgba(0,229,255,0.2)] backdrop-blur-xl flex flex-wrap gap-1.5 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="w-full text-[10px] uppercase font-mono tracking-widest text-jarvis-cyan font-bold px-1 mb-1">
              Test Voice State
            </div>
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => onSetState(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                  currentState === s
                    ? 'bg-jarvis-cyan text-slate-950 font-bold shadow-[0_0_8px_#00E5FF]'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.08] hover:border-jarvis-cyan/40 text-slate-400 hover:text-jarvis-cyan text-xs font-mono backdrop-blur-md shadow-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-jarvis-cyan" />
          <span>State: <strong className="text-jarvis-cyan uppercase">{currentState}</strong></span>
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
