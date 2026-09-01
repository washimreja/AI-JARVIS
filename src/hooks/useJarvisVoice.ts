import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioStream } from './useAudioStream';
import { useGeminiLive } from './useGeminiLive';
import type { JarvisState } from '../types/jarvis';
import type { VoiceGender } from '../services/voice/types';
import { playUiChime } from '../utils/speech';

export function useJarvisVoice() {
  const [jarvisState, setJarvisState] = useState<JarvisState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => {
    return (localStorage.getItem('jarvis_voice_gender') as VoiceGender) || 'male';
  });

  const {
    isRecording,
    isPlayingAudio,
    audioLevel,
    startRecording,
    stopRecording,
    playAudioChunk,
    stopAudioPlayback,
  } = useAudioStream();

  const isSpeakingRef = useRef(false);

  const {
    status,
    errorMessage,
    connect,
    disconnect,
    sendAudioChunk,
    sendTextPrompt,
    isConnected,
  } = useGeminiLive({
    onAudioData: (pcmBase64) => {
      setJarvisState('speaking');
      isSpeakingRef.current = true;
      playAudioChunk(pcmBase64);
    },
    onTranscript: (text) => {
      setTranscript((prev) => (prev ? `${prev} ${text}` : text));
    },
    onTurnComplete: () => {
      // Audio playback continues until queue drains, then transitions to idle
      setTimeout(() => {
        if (!isPlayingAudio) {
          setJarvisState('idle');
          isSpeakingRef.current = false;
        }
      }, 500);
    },
    onInterrupted: () => {
      stopAudioPlayback();
      setJarvisState('listening');
      isSpeakingRef.current = false;
    },
    onError: () => {
      setJarvisState('error');
    },
  });

  // Watch playback ending
  useEffect(() => {
    if (!isPlayingAudio && isSpeakingRef.current && jarvisState === 'speaking') {
      const timer = setTimeout(() => {
        setJarvisState('idle');
        isSpeakingRef.current = false;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isPlayingAudio, jarvisState]);

  // Set voice gender and persist to localStorage
  const updateVoiceGender = useCallback(
    (gender: VoiceGender) => {
      setVoiceGender(gender);
      localStorage.setItem('jarvis_voice_gender', gender);
      if (isConnected) {
        disconnect();
        connect(gender);
      }
    },
    [isConnected, disconnect, connect]
  );

  // Toggle or start voice interaction
  const toggleVoiceSession = useCallback(async () => {
    if (jarvisState === 'idle') {
      playUiChime('activate');
      setTranscript('');
      setJarvisState('listening');

      try {
        // Ensure connected to backend
        if (!isConnected) {
          await connect(voiceGender);
        }

        // Start streaming microphone PCM
        await startRecording((pcmBase64) => {
          sendAudioChunk(pcmBase64);
        });
      } catch (err) {
        console.error('[useJarvisVoice] Failed to start voice session:', err);
        setJarvisState('error');
        stopRecording();
      }
    } else if (jarvisState === 'listening') {
      // User done speaking, transition to thinking/processing
      stopRecording();
      setJarvisState('thinking');
      playUiChime('click');
    } else {
      // Cancel/stop active session
      stopRecording();
      stopAudioPlayback();
      setJarvisState('idle');
      playUiChime('click');
    }
  }, [
    jarvisState,
    isConnected,
    connect,
    voiceGender,
    startRecording,
    sendAudioChunk,
    stopRecording,
    stopAudioPlayback,
  ]);

  // Send a text command through Gemini Live
  const sendCommandText = useCallback(
    async (text: string) => {
      setJarvisState('thinking');
      setTranscript(`"${text}"`);
      playUiChime('click');

      try {
        if (!isConnected) {
          await connect(voiceGender);
        }
        sendTextPrompt(text);
      } catch (err) {
        console.error('[useJarvisVoice] Failed to send text command:', err);
        setJarvisState('error');
      }
    },
    [isConnected, connect, voiceGender, sendTextPrompt]
  );

  return {
    jarvisState,
    setJarvisState,
    connectionStatus: status,
    errorMessage,
    transcript,
    voiceGender,
    setVoiceGender: updateVoiceGender,
    audioLevel,
    isRecording,
    isPlayingAudio,
    toggleVoiceSession,
    sendCommandText,
    connect,
    disconnect,
  };
}
