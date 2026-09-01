import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Info, Terminal } from 'lucide-react';
import type { ActivityItem } from '../../types/jarvis';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  if (!activities.length) return null;

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'executing':
        return <Terminal className="w-3.5 h-3.5 text-jarvis-cyan shrink-0 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2 px-1">
        <Clock className="w-3 h-3 text-slate-500" />
        <span>Recent Agent Activity</span>
      </div>

      <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/30 border border-white/[0.03] text-xs hover:border-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getStatusIcon(item.status)}
              <span className="text-slate-300 truncate font-medium">{item.title}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
