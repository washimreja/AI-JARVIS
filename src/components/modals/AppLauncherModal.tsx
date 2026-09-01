import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Code,
  Globe,
  Terminal,
  Folder,
  Music,
  FileText,
  MessageCircle,
  PlaySquare,
  Settings,
  Sparkles,
} from 'lucide-react';

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appName: string) => void;
}

interface AppItem {
  id: string;
  name: string;
  category: 'Dev' | 'Productivity' | 'Media' | 'System';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  path: string;
}

const APPS: AppItem[] = [
  { id: 'vscode', name: 'Visual Studio Code', category: 'Dev', icon: Code, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', path: 'C:/Program Files/VS Code/Code.exe' },
  { id: 'chrome', name: 'Google Chrome', category: 'Productivity', icon: Globe, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', path: 'C:/Program Files/Google/Chrome.exe' },
  { id: 'terminal', name: 'Windows Terminal', category: 'Dev', icon: Terminal, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', path: 'wt.exe' },
  { id: 'explorer', name: 'File Explorer', category: 'System', icon: Folder, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', path: 'explorer.exe' },
  { id: 'spotify', name: 'Spotify Music', category: 'Media', icon: Music, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', path: 'Spotify.exe' },
  { id: 'notepad', name: 'Notepad', category: 'Productivity', icon: FileText, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', path: 'notepad.exe' },
  { id: 'discord', name: 'Discord', category: 'Productivity', icon: MessageCircle, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', path: 'Discord.exe' },
  { id: 'youtube', name: 'YouTube', category: 'Media', icon: PlaySquare, color: 'text-red-400 bg-red-500/10 border-red-500/30', path: 'https://youtube.com' },
  { id: 'settings', name: 'Windows Settings', category: 'System', icon: Settings, color: 'text-slate-300 bg-slate-500/10 border-slate-500/30', path: 'ms-settings:' },
];

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filteredApps = APPS.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#0E131C] border border-cyan-500/20 shadow-2xl p-5 overflow-hidden"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Windows App Launcher
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mt-4 mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications (e.g. VS Code, Chrome)..."
              className="w-full bg-slate-900/90 border border-white/[0.08] focus:border-cyan-500/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {['All', 'Dev', 'Productivity', 'Media', 'System'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    onLaunchApp(app.name);
                    onClose();
                  }}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 border border-white/[0.04] hover:border-cyan-500/30 hover:bg-cyan-500/[0.06] transition-all text-center"
                >
                  <div className={`p-2.5 rounded-xl border ${app.color} mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate w-full">
                    {app.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {app.category}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredApps.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No applications found matching "{search}"
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
