import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mic,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Volume2,
  Trash2,
  Loader2,
} from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';
import { askJarvisAI } from '../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
}

export const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'jarvis',
      text: 'Good day, Washim. I am powered by Google Gemini and connected to your Windows workstation. How may I assist you?',
      timestamp: '12:00 PM',
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    playUiChime('click');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const responseText = await askJarvisAI(query);

      const jarvisMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      playUiChime('success');
      speakResponse(responseText);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: 'I encountered an error connecting to the neural network, Washim.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceSpeak = (text: string) => {
    speakResponse(text);
  };

  const samplePrompts = [
    'Explain how AI works in a few words',
    'Write a fast Python async file watcher',
    'What are the best practices for React 19?',
    'Give me a 3-step daily developer productivity routine',
  ];

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-hidden bg-[#080B10] p-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">JARVIS Conversational Intelligence</h2>
            <p className="text-[11px] text-slate-400">Powered by Google Gemini 2.5 • Live Neural Reasoning</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-semibold ${
                msg.sender === 'user'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-cyan-400 border border-white/[0.08]'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500/15 text-cyan-100 border border-cyan-500/30 rounded-tr-none'
                  : 'bg-slate-900/80 text-slate-200 border border-white/[0.06] rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {msg.sender === 'user' ? 'Washim' : 'JARVIS (Gemini)'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
              </div>

              <p className="whitespace-pre-wrap">{msg.text}</p>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                  title="Copy text"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {msg.sender === 'jarvis' && (
                  <button
                    onClick={() => handleVoiceSpeak(msg.text)}
                    className="p-1 rounded-md text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Speak response"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 border border-white/[0.08] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.06] text-xs text-cyan-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>JARVIS is reasoning with Google Gemini...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2 flex gap-2 overflow-x-auto">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-xl bg-slate-900/60 border border-white/[0.04] hover:border-cyan-500/30 hover:bg-cyan-500/10 text-[11px] text-slate-400 hover:text-cyan-300 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Deck */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900/80 border border-white/[0.08] focus-within:border-cyan-500/40 rounded-2xl px-4 py-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask JARVIS anything (powered by Google Gemini)..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleSend('Explain how AI works in a few words')}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            title="Voice query"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
