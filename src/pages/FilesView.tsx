import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  FileImage,
  Search,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';

interface FileItem {
  id: string;
  name: string;
  type: 'code' | 'doc' | 'image' | 'folder';
  size: string;
  path: string;
  modified: string;
}

export const FilesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const quickFolders = [
    { name: 'Projects', path: 'F:/WASHIM-PROJECT', count: '14 folders' },
    { name: 'Downloads', path: 'C:/Users/smart/Downloads', count: '48 items' },
    { name: 'Documents', path: 'C:/Users/smart/Documents', count: '29 items' },
    { name: 'Pictures', path: 'C:/Users/smart/Pictures/JARVIS', count: '12 screenshots' },
  ];

  const recentFiles: FileItem[] = [
    { id: '1', name: 'App.tsx', type: 'code', size: '4.2 KB', path: 'f:/WASHIM-PROJECT/AI JARVIC/src/App.tsx', modified: 'Just now' },
    { id: '2', name: 'CommandCenter.tsx', type: 'code', size: '5.8 KB', path: 'f:/WASHIM-PROJECT/AI JARVIC/src/pages/CommandCenter.tsx', modified: '2m ago' },
    { id: '3', name: 'jarvis_architecture.md', type: 'doc', size: '12.4 KB', path: 'f:/WASHIM-PROJECT/AI JARVIC/docs/architecture.md', modified: '1h ago' },
    { id: '4', name: 'screenshot_desktop.png', type: 'image', size: '1.8 MB', path: 'C:/Users/smart/Pictures/JARVIS/screenshot.png', modified: '3h ago' },
  ];

  const filteredFiles = recentFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.path.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenFolder = (folderName: string) => {
    playUiChime('click');
    speakResponse(`Opening ${folderName} directory in File Explorer.`);
  };

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    playUiChime('click');
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'code':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'doc':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'image':
        return <FileImage className="w-4 h-4 text-emerald-400" />;
      default:
        return <Folder className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Windows File Intelligence</h2>
            <p className="text-[11px] text-slate-400">Instant Project Search & Workspace Navigation</p>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-slate-900/80 border border-white/[0.08] focus:border-cyan-500/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Quick Folders */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Quick Access Directories</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickFolders.map((f, i) => (
            <button
              key={i}
              onClick={() => handleOpenFolder(f.name)}
              className="p-3 rounded-2xl bg-slate-900/40 border border-white/[0.05] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] text-left transition-all group"
            >
              <Folder className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300">{f.name}</div>
              <div className="text-[10px] text-slate-500">{f.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Recent Workstation Files</span>
          <span className="text-[10px] font-mono text-slate-500">{filteredFiles.length} files indexed</span>
        </div>

        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/[0.03] hover:border-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-white/[0.04]">
                  {getIcon(file.type)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate">{file.name}</div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">{file.path}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-[10px] font-mono text-slate-500">{file.size}</span>
                <button
                  onClick={() => handleCopyPath(file.path)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors"
                  title="Copy path"
                >
                  {copiedPath === file.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleOpenFolder(file.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors"
                  title="Open file"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
