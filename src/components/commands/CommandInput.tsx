import React, { useState } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, disabled }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || disabled) return;
    onSubmit(query.trim());
    setQuery('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto px-4"
    >
      <div className="relative flex items-center bg-slate-900/60 border border-white/[0.06] focus-within:border-cyan-500/30 focus-within:bg-slate-900/90 rounded-xl px-3.5 py-2 transition-all duration-200 backdrop-blur-md">
        {/* Left search/prompt icon */}
        <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2.5" />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="Type a command..."
          className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none tracking-wide"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={!query.trim() || disabled}
          className={`shrink-0 p-1 rounded-lg transition-all ${
            query.trim() && !disabled
              ? 'text-cyan-400 hover:bg-cyan-500/10'
              : 'text-slate-600 opacity-40 cursor-not-allowed'
          }`}
          title="Send command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
