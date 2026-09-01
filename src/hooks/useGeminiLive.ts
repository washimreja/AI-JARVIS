import { useState, useRef, useCallback, useEffect } from 'react';
import { GeminiLiveProvider } from '../services/voice/GeminiLiveProvider';
import type { ConnectionStatus, VoiceGender } from '../services/voice/types';

interface UseGeminiLiveOptions {
  onAudioData?: (pcmBase64: string, mimeType: string) => void;
  onTranscript?: (text: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onError?: (error: string) => void;
}

export function useGeminiLive(options: UseGeminiLiveOptions = {}) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const providerRef = useRef<GeminiLiveProvider | null>(null);

  const getProvider = useCallback(() => {
    if (!providerRef.current) {
      providerRef.current = new GeminiLiveProvider();
    }
    return providerRef.current;
  }, []);

  const connect = useCallback(
    async (gender: VoiceGender = 'male') => {
      const provider = getProvider();
      setErrorMessage(null);

      try {
        await provider.connect(
          { gender, voiceName: gender === 'male' ? 'Puck' : 'Aoede' },
          {
            onStatusChange: (newStatus) => {
              setStatus(newStatus);
            },
            onAudioData: (pcmBase64, mimeType) => {
              options.onAudioData?.(pcmBase64, mimeType);
            },
            onTranscript: (text) => {
              options.onTranscript?.(text);
            },
            onTurnComplete: () => {
              options.onTurnComplete?.();
            },
            onInterrupted: () => {
              options.onInterrupted?.();
            },
            onError: (err) => {
              setErrorMessage(err);
              options.onError?.(err);
            },
          }
        );
      } catch (err) {
        console.error('[useGeminiLive] Connection error:', err);
        setStatus('error');
        setErrorMessage('Failed to connect to JARVIS Voice Backend.');
      }
    },
    [getProvider, options]
  );

  const disconnect = useCallback(() => {
    if (providerRef.current) {
      providerRef.current.disconnect();
    }
    setStatus('disconnected');
  }, []);

  const sendAudioChunk = useCallback(
    (pcmBase64: string, mimeType = 'audio/pcm;rate=16000') => {
      if (providerRef.current) {
        providerRef.current.sendAudioChunk(pcmBase64, mimeType);
      }
    },
    []
  );

  const sendTextPrompt = useCallback((text: string) => {
    if (providerRef.current) {
      providerRef.current.sendTextPrompt(text);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (providerRef.current) {
        providerRef.current.disconnect();
      }
    };
  }, []);

  return {
    status,
    errorMessage,
    connect,
    disconnect,
    sendAudioChunk,
    sendTextPrompt,
    isConnected: status === 'connected',
  };
}
