import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ShieldCheck, KeyRound } from 'lucide-react';

interface LockScreenModalProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export const LockScreenModal: React.FC<LockScreenModalProps> = ({
  isLocked,
  onUnlock,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLocked) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPin('');
    onUnlock();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#05070B]/95 backdrop-blur-3xl select-none"
      >
        {/* Top Time and Date */}
        <div className="text-center pt-8 space-y-1">
          <h1 className="text-6xl font-light tracking-tight text-white font-mono">
            {currentTime}
          </h1>
          <p className="text-sm font-medium text-slate-400">{currentDate}</p>
        </div>

        {/* Center User Profile & Unlock Deck */}
        <div className="flex flex-col items-center max-w-xs w-full space-y-4">
          {/* Avatar with lock badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-2xl shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              W
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-cyan-500/50 text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center space-y-0.5">
            <h2 className="text-base font-semibold text-white">Washim</h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>JARVIS Security Guard</span>
            </div>
          </div>

          {/* Unlock Form */}
          <form onSubmit={handleUnlockSubmit} className="w-full space-y-3 pt-2">
            <div className="relative flex items-center bg-slate-900/80 border border-white/[0.1] focus-within:border-cyan-500/50 rounded-xl px-3 py-2">
              <KeyRound className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN or press Unlock"
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)] active:scale-95"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock Workstation</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-600 font-mono">
          JARVIS PROTECTED WORKSPACE • PRESS UNLOCK TO RESUME
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
