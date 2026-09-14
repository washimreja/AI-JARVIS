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
import { getCurrentWindow } from '@tauri-apps/api/window';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  const handleMinimize = async () => {
    if (isTauri) {
      const appWindow = getCurrentWindow();
      await appWindow.minimize();
    } else {
      console.log('Minimize window (browser)');
    }
  };

  const handleMaximize = async () => {
    if (isTauri) {
      const appWindow = getCurrentWindow();
      await appWindow.toggleMaximize();
    } else {
      console.log('Maximize window (browser)');
    }
  };

  const handleClose = async () => {
    if (isTauri) {
      const appWindow = getCurrentWindow();
      await appWindow.close();
    } else {
      console.log('Close application (browser)');
    }
  };

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
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
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
