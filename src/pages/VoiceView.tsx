import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Sliders, Radio, Play } from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';

export const VoiceView: React.FC = () => {
  const [wakeWord, setWakeWord] = useState('Jarvis');
  const [speed, setSpeed] = useState(1.05);
  const [sensitivity, setSensitivity] = useState(75);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const testPhrases = [
    'Good day, Washim. All systems are operational.',
    'Opening Visual Studio Code for your project workspace.',
    'Workstation security protocols active. How may I help you?',
  ];

  const handleTestSpeech = (phrase: string) => {
    setIsPlayingTest(true);
    playUiChime('activate');
    speakResponse(phrase, () => setIsPlayingTest(false));
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Voice & Acoustic Engine</h2>
            <p className="text-[11px] text-slate-400">Calibration, Wake-Word Detection & Speech Synthesis</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Microphone Ready</span>
        </div>
      </div>

      {/* Main Grid: Acoustic Radar & Voice Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Acoustic Radar Visualizer */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-300 mb-4 self-start flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Live Audio Frequency Visualizer</span>
          </div>

          {/* Animated concentric rings */}
          <div className="relative w-40 h-40 flex items-center justify-center my-4">
            <motion.div
              animate={{ scale: isPlayingTest ? [1, 1.25, 1] : [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: isPlayingTest ? 1.2 : 2.5 }}
              className="absolute inset-0 rounded-full border border-cyan-500/30 bg-cyan-500/5"
            />
            <motion.div
              animate={{ scale: isPlayingTest ? [1, 1.15, 1] : [1, 1.04, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: isPlayingTest ? 0.9 : 2.0 }}
              className="absolute inset-4 rounded-full border border-cyan-500/40"
            />
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.3)]">
              <Mic className="w-8 h-8" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            {isPlayingTest ? 'Synthesizing voice response...' : 'Listening for wake phrase "Jarvis"'}
          </p>
        </div>

        {/* Right: Audio Tuner */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-4">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Voice Synthesis Customization</span>
          </div>

          {/* Wake Word Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-mono">Wake-Word Trigger</label>
            <div className="grid grid-cols-3 gap-2">
              {['Jarvis', 'Hey Jarvis', 'Computer'].map((w) => (
                <button
                  key={w}
                  onClick={() => setWakeWord(w)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-colors ${
                    wakeWord === w
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/[0.04]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Speed / Pitch Slider */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Speech Speed</span>
                <span className="font-mono text-cyan-400">{speed}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Microphone Sensitivity</span>
                <span className="font-mono text-cyan-400">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Voice Test Strip */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-3">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Interactive Speech Previews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {testPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleTestSpeech(phrase)}
              className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/[0.04] hover:border-cyan-500/30 hover:bg-cyan-500/10 text-left transition-colors group"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-slate-300 group-hover:text-cyan-200">"{phrase}"</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
