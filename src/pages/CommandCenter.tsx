import React, { useState } from 'react';
import { VoiceCore } from '../components/voice/VoiceCore';
import { WaveformVisualizer } from '../components/voice/WaveformVisualizer';
import { VoiceStateIndicator } from '../components/voice/VoiceStateIndicator';
import { QuickActions } from '../components/commands/QuickActions';
import { CommandInput } from '../components/commands/CommandInput';
import { AppLauncherModal } from '../components/modals/AppLauncherModal';
import { VolumeModal } from '../components/modals/VolumeModal';
import { LockScreenModal } from '../components/modals/LockScreenModal';
import { ScreenshotToast } from '../components/modals/ScreenshotToast';
import { useJarvisVoice } from '../hooks/useJarvisVoice';
import { executeAgentCommand, askJarvisAI } from '../services/aiService';
import { playUiChime, speakResponse } from '../utils/speech';
import type { NavTab } from '../types/jarvis';
import { Wifi, WifiOff } from 'lucide-react';

interface CommandCenterProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigateTab,
}) => {
  const {
    jarvisState,
    setJarvisState,
    connectionStatus,
    transcript,
    toggleVoiceSession,
  } = useJarvisVoice();

  const [activeMessage, setActiveMessage] = useState<string | undefined>();
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showScreenshotToast, setShowScreenshotToast] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);

  // Handle user command via Agent Core
  const handleProcessCommand = async (command: string) => {
    setJarvisState('thinking');
    setActiveMessage(`Thinking: "${command}"`);
    playUiChime('click');

    // 1. Dispatch to Agent Core to check for Skill Intent (e.g. open_application)
    const agentRes = await executeAgentCommand(command);

    if (agentRes.success) {
      setJarvisState('executing');
      setActiveMessage(`Executing: ${agentRes.speech_response}`);
      playUiChime('activate');

      setTimeout(() => {
        setJarvisState('success');
        setActiveMessage(agentRes.speech_response);
        playUiChime('success');

        setTimeout(() => {
          setJarvisState('speaking');
          speakResponse(agentRes.speech_response, () => {
            setJarvisState('idle');
            setActiveMessage(undefined);
          });
        }, 600);
      }, 700);
      return;
    }

    // 2. If command was an invalid app attempt or had structured error
    if (agentRes.error === 'APPLICATION_NOT_ALLOWED' || agentRes.error === 'APPLICATION_NOT_FOUND') {
      setJarvisState('speaking');
      setActiveMessage(agentRes.speech_response);
      playUiChime('click');
      speakResponse(agentRes.speech_response, () => {
        setJarvisState('idle');
        setActiveMessage(undefined);
      });
      return;
    }

    // 3. Fallback to conversational reasoning query
    try {
      const aiResponse = await askJarvisAI(command);
      setJarvisState('speaking');
      setActiveMessage(aiResponse);
      playUiChime('success');
      speakResponse(aiResponse, () => {
        setJarvisState('idle');
        setActiveMessage(undefined);
      });
    } catch {
      setJarvisState('error');
      const err = 'I could not process that request, Washim.';
      setActiveMessage(err);
      speakResponse(err, () => {
        setJarvisState('idle');
        setActiveMessage(undefined);
      });
    }
  };

  const handleTriggerLock = () => {
    playUiChime('lock');
    setIsLocked(true);
    speakResponse('Windows workstation locked, Washim.');
  };

  const handleTriggerScreenshot = () => {
    setScreenFlash(true);
    playUiChime('camera');
    setTimeout(() => setScreenFlash(false), 150);
    setShowScreenshotToast(true);
    speakResponse('Desktop screenshot captured and saved to clipboard.');
    setTimeout(() => setShowScreenshotToast(false), 4000);
  };

  // Handle quick action button trigger
  const handleQuickAction = (actionId: string) => {
    playUiChime('click');

    switch (actionId) {
      case 'open_app':
        setShowAppLauncher(true);
        break;
      case 'system_info':
        onNavigateTab('system');
        speakResponse('Displaying system telemetry.');
        break;
      case 'screenshot':
        handleTriggerScreenshot();
        break;
      case 'lock_pc':
        handleTriggerLock();
        break;
      case 'volume':
        setShowVolumeModal(true);
        break;
    }
  };

  const handleLaunchAppFromModal = async (appName: string) => {
    setJarvisState('executing');
    setActiveMessage(`Launching ${appName}...`);
    playUiChime('activate');

    const res = await executeAgentCommand(`open ${appName}`);
    const speech = res.speech_response || `${appName} is ready, Washim.`;

    setTimeout(() => {
      setJarvisState('success');
      setActiveMessage(speech);
      playUiChime('success');

      setTimeout(() => {
        setJarvisState('speaking');
        speakResponse(speech, () => {
          setJarvisState('idle');
          setActiveMessage(undefined);
        });
      }, 500);
    }, 600);
  };

  return (
    <div className="relative flex-1 h-full flex flex-col items-center justify-between px-6 py-6 overflow-hidden select-none">
      {/* Screen flash for screenshot effect */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-white/80 pointer-events-none transition-opacity duration-150" />
      )}

      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-cyan-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Header: Elegant Greeting & Live Backend Indicator */}
      <div className="text-center z-10 pt-2 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold tracking-wider text-white">
            JARVIS
          </h1>
          {connectionStatus === 'connected' ? (
            <span title="Gemini 3.1 Live Connected" className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <Wifi className="w-3 h-3 text-emerald-400" />
            </span>
          ) : connectionStatus === 'connecting' ? (
            <span title="Connecting to Gemini Live..." className="flex items-center gap-1 text-[10px] font-mono text-amber-400 animate-pulse">
              <Wifi className="w-3 h-3 text-amber-400" />
            </span>
          ) : (
            <span title="Voice Backend Ready (Click to activate)" className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <WifiOff className="w-3 h-3" />
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 font-normal">
          How can I help you, Washim?
        </p>
      </div>

      {/* 2. Hero Center: Voice Core + Live Waveform + State Indicator */}
      <div className="flex flex-col items-center justify-center z-10 space-y-2 my-auto">
        {/* Central Refined Voice Core with Real-Time Audio Trigger */}
        <VoiceCore state={jarvisState} onClick={toggleVoiceSession} />

        {/* Live Audio Waveform (Reacts to Real Audio) */}
        <WaveformVisualizer state={jarvisState} />

        {/* Current State & Real-Time Gemini Response / Transcript */}
        <div className="pt-1">
          <VoiceStateIndicator state={jarvisState} customMessage={activeMessage || transcript || undefined} />
        </div>
      </div>

      {/* 3. Bottom Deck: Quick Actions & Compact Fallback Prompt */}
      <div className="w-full max-w-md z-10 space-y-3 pb-2">
        {/* Compact Quick Actions */}
        <QuickActions onTriggerAction={handleQuickAction} />

        {/* Minimal Secondary Command Input */}
        <CommandInput
          onSubmit={handleProcessCommand}
          disabled={jarvisState === 'executing' || jarvisState === 'processing'}
        />
      </div>

      {/* Interactive Windows Modals */}
      <AppLauncherModal
        isOpen={showAppLauncher}
        onClose={() => setShowAppLauncher(false)}
        onLaunchApp={handleLaunchAppFromModal}
      />

      <VolumeModal
        isOpen={showVolumeModal}
        onClose={() => setShowVolumeModal(false)}
      />

      <LockScreenModal
        isLocked={isLocked}
        onUnlock={() => {
          setIsLocked(false);
          playUiChime('success');
          speakResponse('Welcome back, Washim. Workstation unlocked.');
        }}
      />

      <ScreenshotToast
        isVisible={showScreenshotToast}
        onClose={() => setShowScreenshotToast(false)}
      />
    </div>
  );
};
