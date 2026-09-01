import { useState } from 'react';
import { WindowHeader } from './components/layout/WindowHeader';
import { Sidebar } from './components/layout/Sidebar';
import { CommandCenter } from './pages/CommandCenter';
import { ChatView } from './pages/ChatView';
import { VoiceView } from './pages/VoiceView';
import { AutomationView } from './pages/AutomationView';
import { SkillsView } from './pages/SkillsView';
import { FilesView } from './pages/FilesView';
import { SystemView } from './pages/SystemView';
import { MemoryView } from './pages/MemoryView';
import { SettingsView } from './pages/SettingsView';
import type { NavTab } from './types/jarvis';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <CommandCenter
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'chat':
        return <ChatView />;
      case 'voice':
        return <VoiceView />;
      case 'automation':
        return <AutomationView />;
      case 'skills':
        return <SkillsView />;
      case 'files':
        return <FilesView />;
      case 'system':
        return <SystemView />;
      case 'memory':
        return <MemoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#080B10] text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Top Custom Window Header */}
      <WindowHeader
        onMinimize={() => console.log('Minimize window')}
        onMaximize={() => console.log('Maximize window')}
        onClose={() => console.log('Close application')}
      />

      {/* Main Desktop Workspace Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Auto-Expanding / Compressing Left Navigation Sidebar on Hover */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Central Assistant Workspace View */}
        <main className="flex-1 flex overflow-hidden bg-gradient-to-b from-[#080B10] via-[#0A0E17] to-[#080B10] relative">
          {renderActiveContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
