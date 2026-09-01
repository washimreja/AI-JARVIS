import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  MessageSquare,
  Mic,
  Sliders,
  Sparkles,
  Folder,
  Activity,
  Brain,
  Settings,
} from 'lucide-react';
import type { NavTab } from '../../types/jarvis';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'automation', label: 'Automation', icon: Sliders },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'files', label: 'Files', icon: Folder },
  { id: 'system', label: 'System', icon: Activity },
  { id: 'memory', label: 'Memory', icon: Brain },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ width: isHovered ? 220 : 64 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      className="relative h-full flex flex-col justify-between border-r border-white/[0.05] bg-[#0A0D14]/95 backdrop-blur-xl py-4 z-40 select-none shrink-0 overflow-hidden"
    >
      {/* Top Header: User / Jarvis Avatar & Profile */}
      <div>
        <div className="px-3 mb-5 flex items-center gap-3 overflow-hidden">
          {/* Avatar (Always clean and centered when collapsed) */}
          <div className="relative shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/20 flex items-center justify-center shadow-sm">
            <span className="text-cyan-400 font-bold text-sm">W</span>
            <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none" />
          </div>

          {/* Profile Name / Status (Only visible when auto-expanded on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col whitespace-nowrap min-w-0"
              >
                <span className="text-sm font-semibold tracking-wide text-white">
                  JARVIS
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Washim</span>
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  <span className="text-cyan-400 text-[10px]">Online</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items List */}
        <nav className="px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group relative w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
                title={!isHovered ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className="tracking-wide whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer: Settings button */}
      <div className="px-2 pt-3 border-t border-white/[0.05]">
        <button
          onClick={() => onSelectTab('settings')}
          className={`group w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
          title={!isHovered ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="tracking-wide whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
