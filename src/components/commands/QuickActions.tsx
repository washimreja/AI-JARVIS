import React from 'react';
import { LayoutGrid, Info, Camera, Lock, Volume2 } from 'lucide-react';

export interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickActionsProps {
  onTriggerAction: (actionId: string) => void;
}

const ACTIONS: QuickActionItem[] = [
  { id: 'open_app', label: 'Open App', icon: LayoutGrid },
  { id: 'system_info', label: 'System Info', icon: Info },
  { id: 'screenshot', label: 'Screenshot', icon: Camera },
  { id: 'lock_pc', label: 'Lock PC', icon: Lock },
  { id: 'volume', label: 'Volume', icon: Volume2 },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onTriggerAction }) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 px-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onTriggerAction(action.id)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/[0.05] hover:border-cyan-500/30 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 text-xs font-medium tracking-wide transition-all duration-150 active:scale-95 shadow-sm"
          >
            <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};
