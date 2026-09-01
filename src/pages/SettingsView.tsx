import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Keyboard,
  Cpu,
  Save,
  Check,
  Volume2,
  Play,
  Server,
  User,
  Sparkles,
} from 'lucide-react';
import { playUiChime } from '../utils/speech';
import type { VoiceGender } from '../services/voice/types';
import { GeminiLiveProvider } from '../services/voice/GeminiLiveProvider';
import { useAudioStream } from '../hooks/useAudioStream';

export const SettingsView: React.FC = () => {
  const [voiceEngine, setVoiceEngine] = useState<'gemini' | 'elevenlabs'>(() => {
    return (localStorage.getItem('jarvis_voice_engine') as 'gemini' | 'elevenlabs') || 'gemini';
  });

  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => {
    return (localStorage.getItem('jarvis_voice_gender') as VoiceGender) || 'male';
  });

  const [model, setModel] = useState('gemini-3.1-flash-live-preview');
  const [hotkey] = useState('Win + J');
  const [autoStart, setAutoStart] = useState(true);
  const [securityTier, setSecurityTier] = useState('Tier 2 (Confirm Destructive Actions)');
  const [saved, setSaved] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const { playAudioChunk } = useAudioStream();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'online') {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jarvis_voice_engine', voiceEngine);
    localStorage.setItem('jarvis_voice_gender', voiceGender);
    localStorage.setItem('jarvis_ai_model', model);
    setSaved(true);
    playUiChime('success');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    playUiChime('activate');

    if (voiceEngine === 'elevenlabs') {
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/tts/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: 'Greetings Washim, ElevenLabs neural voice synthesis is operational.',
            gender: voiceGender,
          }),
        });

        if (resp.ok) {
          const blob = await resp.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          audio.onended = () => setIsTestingVoice(false);
          audio.play();
          return;
        }
      } catch {
        console.warn('[Settings] ElevenLabs test fallback to Gemini Live');
      }
    }

    // Gemini 3.1 Live Provider test
    const provider = new GeminiLiveProvider();
    try {
      await provider.connect(
        { gender: voiceGender, voiceName: voiceGender === 'male' ? 'Puck' : 'Aoede' },
        {
          onAudioData: (pcmBase64) => {
            playAudioChunk(pcmBase64);
          },
          onTurnComplete: () => {
            setTimeout(() => {
              setIsTestingVoice(false);
              provider.disconnect();
            }, 1000);
          },
          onError: () => {
            setIsTestingVoice(false);
            provider.disconnect();
          },
        }
      );

      provider.sendTextPrompt('Say a 5-word greeting to Washim.');
    } catch (err) {
      console.error('[Settings] Voice test error:', err);
      setIsTestingVoice(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">JARVIS System Preferences</h2>
            <p className="text-[11px] text-slate-400">Gemini 3.1 Flash Live & ElevenLabs Dual Voice Architecture</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 transition-colors shadow-sm"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {/* 1. Voice Engine & Provider Selection */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Voice Engine Architecture</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Automated Dual Fallback Active</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setVoiceEngine('gemini');
                playUiChime('click');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                voiceEngine === 'gemini'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'bg-slate-900/60 border-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Google Gemini 3.1 Live</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Primary</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Real-Time Bidirectional Multimodal WebSocket</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setVoiceEngine('elevenlabs');
                playUiChime('click');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                voiceEngine === 'elevenlabs'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'bg-slate-900/60 border-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>ElevenLabs Neural</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Ultra-HD</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">High-Fidelity Studio Speech Synthesis</div>
            </button>
          </div>
        </div>

        {/* 2. JARVIS Voice Personality (Male / Female) */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>JARVIS Voice Selection</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Male & Female Profiles</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setVoiceGender('male');
                playUiChime('click');
              }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                voiceGender === 'male'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'bg-slate-900/60 border-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${voiceGender === 'male' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold">Male JARVIS</div>
                <div className="text-[10px] text-slate-400">Puck / George (Refined, Deep)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setVoiceGender('female');
                playUiChime('click');
              }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                voiceGender === 'female'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'bg-slate-900/60 border-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${voiceGender === 'female' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold">Female JARVIS</div>
                <div className="text-[10px] text-slate-400">Aoede / Rachel (Calm, Warm)</div>
              </div>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Test live speech synthesis with selected voice</span>
            <button
              type="button"
              onClick={handleTestVoice}
              disabled={isTestingVoice || backendStatus !== 'online'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-medium text-slate-200 hover:text-cyan-300 disabled:opacity-40 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isTestingVoice ? 'Streaming Voice...' : 'Test Voice'}</span>
            </button>
          </div>
        </div>

        {/* 3. Backend & Model Configuration */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Active Multimodal Reasoning Model</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <Server className="w-3 h-3 text-slate-400" />
              <span
                className={
                  backendStatus === 'online'
                    ? 'text-emerald-400'
                    : backendStatus === 'checking'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }
              >
                Backend Server: {backendStatus === 'online' ? 'Connected (Port 8000)' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Live Multimodal Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40 font-mono"
            >
              <option value="gemini-3.1-flash-live-preview">models/gemini-3.1-flash-live-preview (Current Live API)</option>
              <option value="gemini-2.0-flash-exp">models/gemini-2.0-flash-exp</option>
              <option value="gemini-2.5-flash">models/gemini-2.5-flash</option>
            </select>
          </div>

          <div className="text-[10px] text-slate-500 font-mono pt-1">
            API keys for Gemini & ElevenLabs are stored securely on the server-side environment.
          </div>
        </div>

        {/* 4. Global Hotkey & System Startup */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span>Desktop Integration & Shortcuts</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <div>
              <div className="text-xs text-white font-medium">Global Voice Activation Hotkey</div>
              <div className="text-[11px] text-slate-400">Summons JARVIS from any active Windows application</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-white/[0.06] font-mono text-xs text-cyan-300">
              {hotkey}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs text-white font-medium">Launch on Windows Startup</div>
              <div className="text-[11px] text-slate-400">Keeps JARVIS resident in background system tray</div>
            </div>
            <button
              type="button"
              onClick={() => setAutoStart(!autoStart)}
              className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                autoStart ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoStart ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 5. Security Tier */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Agent Security & Safety Guardian</span>
          </div>

          <select
            value={securityTier}
            onChange={(e) => setSecurityTier(e.target.value)}
            className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
          >
            <option>Tier 2 (Confirm Destructive Actions - Recommended)</option>
            <option>Tier 1 (Safe Autonomous - Standard Apps & Read Only)</option>
            <option>Tier 3 (Strict Two-Step Confirmation on all OS Tasks)</option>
          </select>
        </div>
      </form>
    </div>
  );
};
