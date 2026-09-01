import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, X } from 'lucide-react';

interface ScreenshotToastProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ScreenshotToast: React.FC<ScreenshotToastProps> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3.5 rounded-2xl bg-[#0E131C] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl max-w-sm w-full"
      >
        {/* Thumbnail Preview */}
        <div className="w-12 h-10 rounded-lg bg-gradient-to-tr from-cyan-950 to-slate-800 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Camera className="w-5 h-5 text-cyan-400" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-xs font-semibold text-white">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Screenshot Captured</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            Saved to Pictures/JARVIS & Clipboard
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
