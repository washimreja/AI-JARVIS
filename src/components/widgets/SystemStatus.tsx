import React from 'react';
import { Cpu, HardDrive, Zap, BatteryCharging } from 'lucide-react';
import type { SystemMetrics } from '../../types/jarvis';

interface SystemStatusProps {
  metrics: SystemMetrics;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto w-full px-4 py-2">
      {/* CPU */}
      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-white/[0.04]">
        <Cpu className="w-3.5 h-3.5 text-jarvis-cyan shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>CPU</span>
            <span className="text-jarvis-cyan">{metrics.cpu}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-jarvis-cyan rounded-full transition-all duration-500"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>
      </div>

      {/* RAM */}
      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-white/[0.04]">
        <HardDrive className="w-3.5 h-3.5 text-jarvis-cyan shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>RAM</span>
            <span className="text-jarvis-cyan">{metrics.ram}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-jarvis-cyan rounded-full transition-all duration-500"
              style={{ width: `${metrics.ram}%` }}
            />
          </div>
        </div>
      </div>

      {/* GPU */}
      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-white/[0.04]">
        <Zap className="w-3.5 h-3.5 text-jarvis-cyan shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>GPU</span>
            <span className="text-jarvis-cyan">{metrics.gpu ?? 18}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-jarvis-cyan rounded-full transition-all duration-500"
              style={{ width: `${metrics.gpu ?? 18}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battery / Power */}
      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-white/[0.04]">
        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>PWR</span>
            <span className="text-emerald-400">{metrics.battery ?? 96}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.battery ?? 96}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
