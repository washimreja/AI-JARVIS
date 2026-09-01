import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  Thermometer,
  RefreshCw,
} from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';

export const SystemView: React.FC = () => {
  const [cpu, setCpu] = useState(14);
  const [ram, setRam] = useState(24);
  const [gpu, setGpu] = useState(18);
  const [temp, setTemp] = useState(48);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu((prev) => Math.min(95, Math.max(6, prev + (Math.floor(Math.random() * 7) - 3))));
      setRam((prev) => Math.min(95, Math.max(20, prev + (Math.floor(Math.random() * 3) - 1))));
      setGpu((prev) => Math.min(95, Math.max(10, prev + (Math.floor(Math.random() * 5) - 2))));
      setTemp((prev) => Math.min(75, Math.max(42, prev + (Math.floor(Math.random() * 3) - 1))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    playUiChime('click');
    speakResponse(`Hardware telemetry updated: CPU is at ${cpu}%, RAM is at ${ram}%, temperature is ${temp} degrees Celsius.`);
  };

  const processes = [
    { name: 'code.exe', pid: '14280', cpu: '4.2%', ram: '482 MB', status: 'Running' },
    { name: 'chrome.exe', pid: '20492', cpu: '2.8%', ram: '620 MB', status: 'Running' },
    { name: 'node.exe', pid: '8924', cpu: '1.5%', ram: '140 MB', status: 'Running' },
    { name: 'spotify.exe', pid: '11204', cpu: '0.8%', ram: '210 MB', status: 'Background' },
  ];

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Hardware & Diagnostics Telemetry</h2>
            <p className="text-[11px] text-slate-400">Real-Time Performance Gauges & Core Resource Monitoring</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.06] hover:border-cyan-500/30 hover:text-cyan-300 text-xs text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>CPU Load</span>
            </div>
            <span className="font-mono text-cyan-400 font-semibold">{cpu}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#00E5FF]"
              animate={{ width: `${cpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono">8 Cores • 16 Threads</div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>RAM Used</span>
            </div>
            <span className="font-mono text-cyan-400 font-semibold">{ram}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#00E5FF]"
              animate={{ width: `${ram}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono">7.2 GB / 32 GB DDR5</div>
        </div>

        {/* GPU */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>GPU Load</span>
            </div>
            <span className="font-mono text-cyan-400 font-semibold">{gpu}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#00E5FF]"
              animate={{ width: `${gpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono">NVIDIA RTX • 46°C</div>
        </div>

        {/* Temperature */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>Package Temp</span>
            </div>
            <span className="font-mono text-emerald-400 font-semibold">{temp}°C</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              animate={{ width: `${(temp / 100) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Thermal State: Optimal</div>
        </div>
      </div>

      {/* Active Workstation Tasks */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Active Windows Tasks</span>
          <span className="text-[10px] font-mono text-slate-500">Live Process Table</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {processes.map((proc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-200 font-medium">{proc.name}</span>
                <span className="text-[10px] text-slate-500">PID: {proc.pid}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-xs">
                <span>CPU: <strong className="text-cyan-400">{proc.cpu}</strong></span>
                <span>RAM: <strong className="text-slate-200">{proc.ram}</strong></span>
                <span className="text-emerald-400 text-[10px]">{proc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
