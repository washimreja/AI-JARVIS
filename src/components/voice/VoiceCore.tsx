import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import type { JarvisState } from '../../types/jarvis';

interface VoiceCoreProps {
  state: JarvisState;
  onClick?: () => void;
}

export const VoiceCore: React.FC<VoiceCoreProps> = ({ state, onClick }) => {
  // Determine state-specific soft accent colors & glows
  const getStateStyle = () => {
    switch (state) {
      case 'listening':
        return {
          glow: 'rgba(0, 229, 255, 0.35)',
          border: 'rgba(0, 229, 255, 0.45)',
          bgGradient: 'from-cyan-950/50 via-slate-900/90 to-slate-950/95',
          coreColor: '#00E5FF',
          shadow: '0 0 45px rgba(0, 229, 255, 0.25), inset 0 0 20px rgba(0, 229, 255, 0.15)',
        };
      case 'processing':
      case 'thinking':
        return {
          glow: 'rgba(168, 85, 247, 0.3)',
          border: 'rgba(168, 85, 247, 0.4)',
          bgGradient: 'from-purple-950/50 via-slate-900/90 to-slate-950/95',
          coreColor: '#C084FC',
          shadow: '0 0 40px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.12)',
        };
      case 'executing':
        return {
          glow: 'rgba(56, 189, 248, 0.3)',
          border: 'rgba(56, 189, 248, 0.4)',
          bgGradient: 'from-sky-950/50 via-slate-900/90 to-slate-950/95',
          coreColor: '#38BDF8',
          shadow: '0 0 40px rgba(56, 189, 248, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.12)',
        };
      case 'speaking':
        return {
          glow: 'rgba(0, 229, 255, 0.45)',
          border: 'rgba(0, 229, 255, 0.5)',
          bgGradient: 'from-cyan-900/50 via-slate-900/90 to-slate-950/95',
          coreColor: '#00E5FF',
          shadow: '0 0 50px rgba(0, 229, 255, 0.3), inset 0 0 25px rgba(0, 229, 255, 0.2)',
        };
      case 'success':
        return {
          glow: 'rgba(52, 211, 153, 0.3)',
          border: 'rgba(52, 211, 153, 0.4)',
          bgGradient: 'from-emerald-950/50 via-slate-900/90 to-slate-950/95',
          coreColor: '#34D399',
          shadow: '0 0 35px rgba(52, 211, 153, 0.2), inset 0 0 15px rgba(52, 211, 153, 0.12)',
        };
      case 'error':
        return {
          glow: 'rgba(244, 63, 94, 0.3)',
          border: 'rgba(244, 63, 94, 0.4)',
          bgGradient: 'from-rose-950/50 via-slate-900/90 to-slate-950/95',
          coreColor: '#F43F5E',
          shadow: '0 0 35px rgba(244, 63, 94, 0.2), inset 0 0 15px rgba(244, 63, 94, 0.12)',
        };
      case 'idle':
      default:
        return {
          glow: 'rgba(0, 229, 255, 0.15)',
          border: 'rgba(0, 229, 255, 0.18)',
          bgGradient: 'from-cyan-950/30 via-slate-900/80 to-slate-950/90',
          coreColor: '#00E5FF',
          shadow: '0 0 30px rgba(0, 229, 255, 0.1), inset 0 0 15px rgba(0, 229, 255, 0.06)',
        };
    }
  };

  const style = getStateStyle();

  return (
    <div className="relative flex items-center justify-center select-none py-4">
      {/* Soft Ambient Breathing Ring (Outer halo) */}
      <motion.div
        animate={{
          scale: state === 'listening' || state === 'speaking' ? [1, 1.12, 1] : [1, 1.05, 1],
          opacity: state === 'idle' ? [0.25, 0.4, 0.25] : [0.4, 0.7, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: state === 'listening' ? 2.2 : 4,
          ease: 'easeInOut',
        }}
        className="absolute w-48 h-48 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle Concentric Glass Halo */}
      <div
        className="absolute w-44 h-44 rounded-full border pointer-events-none transition-all duration-500"
        style={{
          borderColor: style.border,
          opacity: state === 'idle' ? 0.35 : 0.65,
        }}
      />

      {/* Main Circular/Softly-Rounded JARVIS Voice Core Button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative z-10 w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(8, 11, 16, 0.95) 100%)`,
          border: `1px solid ${style.border}`,
          boxShadow: style.shadow,
        }}
        title="Talk to JARVIS (Click to toggle voice)"
      >
        {/* Soft Radial Core Illumination */}
        <div
          className="absolute inset-3 rounded-full opacity-60 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle, ${style.glow} 0%, transparent 68%)`,
          }}
        />

        {/* State Content inside Core */}
        <div className="relative z-10 flex items-center justify-center">
          {state === 'thinking' || state === 'processing' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Loader2 className="w-10 h-10 text-purple-400" />
            </motion.div>
          ) : state === 'success' ? (
            <Check className="w-10 h-10 text-emerald-400" />
          ) : state === 'error' ? (
            <AlertCircle className="w-10 h-10 text-rose-400" />
          ) : (
            // Elegant audio wave symbol inside the core
            <div className="flex items-center gap-1.5 h-10 px-2">
              <motion.span
                animate={{
                  height: state === 'listening' ? [10, 28, 10] : state === 'speaking' ? [12, 32, 12] : [8, 14, 8],
                  opacity: state === 'idle' ? 0.7 : 1,
                }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                className="w-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: style.coreColor }}
              />
              <motion.span
                animate={{
                  height: state === 'listening' ? [16, 42, 16] : state === 'speaking' ? [18, 44, 18] : [12, 22, 12],
                  opacity: state === 'idle' ? 0.85 : 1,
                }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'easeInOut', delay: 0.1 }}
                className="w-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: style.coreColor }}
              />
              <motion.span
                animate={{
                  height: state === 'listening' ? [22, 50, 22] : state === 'speaking' ? [24, 52, 24] : [16, 28, 16],
                  opacity: 1,
                }}
                transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut', delay: 0.2 }}
                className="w-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: style.coreColor }}
              />
              <motion.span
                animate={{
                  height: state === 'listening' ? [16, 42, 16] : state === 'speaking' ? [18, 44, 18] : [12, 22, 12],
                  opacity: state === 'idle' ? 0.85 : 1,
                }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'easeInOut', delay: 0.3 }}
                className="w-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: style.coreColor }}
              />
              <motion.span
                animate={{
                  height: state === 'listening' ? [10, 28, 10] : state === 'speaking' ? [12, 32, 12] : [8, 14, 8],
                  opacity: state === 'idle' ? 0.7 : 1,
                }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut', delay: 0.4 }}
                className="w-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: style.coreColor }}
              />
            </div>
          )}
        </div>
      </motion.button>
    </div>
  );
};
