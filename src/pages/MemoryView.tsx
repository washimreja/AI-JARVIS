import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Trash2,
} from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';

interface MemoryFact {
  id: string;
  category: 'Profile' | 'Preferences' | 'Projects' | 'Routines';
  key: string;
  value: string;
}

export const MemoryView: React.FC = () => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [memories, setMemories] = useState<MemoryFact[]>([
    { id: '1', category: 'Profile', key: 'Primary User', value: 'Washim' },
    { id: '2', category: 'Preferences', key: 'Primary Code Editor', value: 'Visual Studio Code' },
    { id: '3', category: 'Preferences', key: 'Default Web Browser', value: 'Google Chrome' },
    { id: '4', category: 'Projects', key: 'Active Repository', value: 'f:/WASHIM-PROJECT/AI JARVIC' },
    { id: '5', category: 'Routines', key: 'Focus Mode Trigger', value: 'Mutes notifications and maximizes IDE' },
  ]);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const newFact: MemoryFact = {
      id: Date.now().toString(),
      category: 'Preferences',
      key: newKey.trim(),
      value: newValue.trim(),
    };

    setMemories((prev) => [...prev, newFact]);
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
    playUiChime('success');
    speakResponse(`Memory saved: ${newFact.key} set to ${newFact.value}.`);
  };

  const handleDelete = (id: string, key: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    playUiChime('click');
    speakResponse(`Memory removed for ${key}.`);
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">JARVIS Persistent Memory Bank</h2>
            <p className="text-[11px] text-slate-400">Long-Term Context, User Preferences & Workstation Memory</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Fact</span>
        </button>
      </div>

      {/* Add Memory Form */}
      {isAdding && (
        <form
          onSubmit={handleAddMemory}
          className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3"
        >
          <div className="text-xs font-semibold text-cyan-300">Remember New User Fact</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Fact Topic (e.g. Favorite Python Framework)"
              className="bg-slate-900 border border-white/[0.08] focus:border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value / Detail (e.g. FastAPI)"
              className="bg-slate-900 border border-white/[0.08] focus:border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 transition-colors"
            >
              Save Memory
            </button>
          </div>
        </form>
      )}

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="p-4 rounded-2xl bg-slate-900/40 border border-white/[0.05] hover:border-cyan-500/20 transition-all flex items-start justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                {mem.category}
              </span>
              <div className="text-xs font-semibold text-white">{mem.key}</div>
              <p className="text-xs text-slate-300">{mem.value}</p>
            </div>

            <button
              onClick={() => handleDelete(mem.id, mem.key)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
              title="Delete memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
