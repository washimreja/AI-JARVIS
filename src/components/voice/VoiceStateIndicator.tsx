import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JarvisState } from '../../types/jarvis';

interface VoiceStateIndicatorProps {
  state: JarvisState;
  customMessage?: string;
}

export const VoiceStateIndicator: React.FC<VoiceStateIndicatorProps> = ({
  state,
  customMessage,
}) => {
  const getStateInfo = () => {
    switch (state) {
      case 'listening':
        return {
          pill: 'Listening...',
          color: 'text-cyan-400',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
          actionText: customMessage || 'Listening to your command...',
        };
      case 'processing':
        return {
          pill: 'Processing...',
          color: 'text-purple-400',
          dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
          actionText: customMessage || 'Processing audio stream...',
        };
      case 'thinking':
        return {
          pill: 'Thinking...',
          color: 'text-purple-400',
          dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
          actionText: customMessage || 'JARVIS is deciding the best action...',
        };
      case 'executing':
        return {
          pill: 'Executing...',
          color: 'text-sky-400',
          dot: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
          actionText: customMessage || 'Opening application...',
        };
      case 'speaking':
        return {
          pill: 'Speaking...',
          color: 'text-cyan-400',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
          actionText: customMessage || 'Responding to Washim...',
        };
      case 'success':
        return {
          pill: 'Done',
          color: 'text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
          actionText: customMessage || 'Action completed successfully.',
        };
      case 'error':
        return {
          pill: 'Error',
          color: 'text-rose-400',
          dot: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]',
          actionText: customMessage || 'I could not complete that request.',
        };
      case 'idle':
      default:
        return {
          pill: 'Ready',
          color: 'text-slate-400',
          dot: 'bg-cyan-400/80',
          actionText: customMessage || 'Ready for your command',
        };
    }
  };

  const info = getStateInfo();

  return (
    <div className="flex flex-col items-center justify-center space-y-2 select-none">
      {/* Subtle State Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 border border-white/[0.06] backdrop-blur-md">
        <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
        <span className={`text-xs font-medium tracking-wide ${info.color}`}>
          {info.pill}
        </span>
      </div>

      {/* Response / Current Action */}
      <AnimatePresence mode="wait">
        <motion.p
          key={state + (customMessage || '')}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium text-slate-300 tracking-wide text-center max-w-md px-4"
        >
          {info.actionText}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
