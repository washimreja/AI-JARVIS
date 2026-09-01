import React from 'react';
import { motion } from 'framer-motion';
import type { JarvisState } from '../../types/jarvis';

interface WaveformVisualizerProps {
  state: JarvisState;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ state }) => {
  const barCount = 11;
  const bars = Array.from({ length: barCount });

  const getBarHeight = (index: number) => {
    const distFromCenter = Math.abs(index - Math.floor(barCount / 2));
    switch (state) {
      case 'listening':
      case 'speaking':
        const peak = 28 - distFromCenter * 3.5;
        return [peak * 0.3, peak * 1.1, peak * 0.4, peak * 1.2, peak * 0.5];
      case 'thinking':
      case 'processing':
        return [6, 16, 8, 18, 6];
      case 'executing':
        return [10, 20, 10, 20, 10];
      case 'success':
        return [14, 14, 14, 14, 14];
      case 'error':
        return [6, 10, 6, 10, 6];
      case 'idle':
      default:
        const idleBase = 12 - distFromCenter * 1.5;
        return [idleBase * 0.6, idleBase * 1.1, idleBase * 0.7, idleBase * 1.0, idleBase * 0.6];
    }
  };

  const getDuration = (index: number) => {
    if (state === 'listening' || state === 'speaking') {
      return 0.5 + (index % 3) * 0.12;
    }
    if (state === 'thinking' || state === 'processing') {
      return 0.9 + (index % 2) * 0.2;
    }
    return 1.6;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 h-8 px-4">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: getBarHeight(i),
            opacity: state === 'idle' ? 0.35 : 0.9,
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: getDuration(i),
            ease: 'easeInOut',
            delay: i * 0.04,
          }}
          className={`w-1 rounded-full transition-colors duration-300 ${
            state === 'error'
              ? 'bg-rose-400'
              : state === 'success'
              ? 'bg-emerald-400'
              : state === 'thinking' || state === 'processing'
              ? 'bg-purple-400'
              : 'bg-cyan-400'
          }`}
          style={{ minHeight: '4px' }}
        />
      ))}
    </div>
  );
};
