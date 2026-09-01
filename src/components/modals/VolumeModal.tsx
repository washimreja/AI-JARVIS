import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Headphones, Speaker, Check } from 'lucide-react';

interface VolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVolumeChange?: (vol: number) => void;
}

export const VolumeModal: React.FC<VolumeModalProps> = ({
  isOpen,
  onClose,
  onVolumeChange,
}) => {
  const [volume, setVolume] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('Realtek(R) Audio Speakers');

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    if (onVolumeChange) onVolumeChange(val);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && onVolumeChange) onVolumeChange(0);
    if (isMuted && onVolumeChange) onVolumeChange(volume);
  };

  const devices = [
    { id: '1', name: 'Realtek(R) Audio Speakers', type: Speaker, isDefault: true },
    { id: '2', name: 'Headphones (Realtek HD Audio)', type: Headphones, isDefault: false },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-sm rounded-2xl bg-[#0E131C] border border-cyan-500/20 shadow-2xl p-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Windows Audio Control
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Master Volume Gauge */}
          <div className="py-5 flex flex-col items-center">
            <button
              onClick={toggleMute}
              className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:scale-105 transition-transform mb-3 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-8 h-8 text-rose-400" />
              ) : (
                <Volume2 className="w-8 h-8 text-cyan-400" />
              )}
            </button>

            <div className="text-2xl font-bold font-mono text-white mb-1">
              {isMuted ? 'Muted' : `${volume}%`}
            </div>
            <span className="text-[11px] text-slate-400">Master System Volume</span>

            {/* Slider */}
            <div className="w-full px-2 mt-4">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleSliderChange}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Audio Output Devices */}
          <div className="mt-2 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Output Device
            </span>
            {devices.map((device) => {
              const Icon = device.type;
              const isSelected = selectedDevice === device.name;
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                      : 'bg-slate-900/40 border-white/[0.04] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="truncate">{device.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
