import React from 'react';
import { Minus, Square, X } from 'lucide-react';

interface WindowHeaderProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  onMinimize,
  onMaximize,
  onClose,
}) => {
  return (
    <div data-tauri-drag-region className="h-9 px-4 flex items-center justify-between border-b border-white/[0.04] bg-[#07090E] select-none z-50">
      {/* Left branding */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400/90 shadow-[0_0_6px_#22d3ee]" />
        <span className="text-xs font-semibold tracking-wider text-slate-300">
          JARVIS
        </span>
      </div>

      {/* Right Desktop Window Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMinimize}
          className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
          title="Minimize"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          onClick={onMaximize}
          className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
          title="Maximize"
        >
          <Square className="w-2.5 h-2.5" />
        </button>
        <button
          onClick={onClose}
          className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          title="Close"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
