export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type VoiceGender = 'male' | 'female';

export interface VoiceConfig {
  gender: VoiceGender;
  voiceName: string; // e.g. 'Puck' (Male) or 'Aoede' (Female)
}

export interface VoiceEventHandlers {
  onStatusChange?: (status: ConnectionStatus) => void;
  onTranscript?: (text: string) => void;
  onAudioData?: (pcmBase64: string, mimeType: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onError?: (error: string) => void;
}

export interface VoiceProvider {
  name: string;
  connect: (config: VoiceConfig, handlers: VoiceEventHandlers) => Promise<void>;
  disconnect: () => void;
  sendAudioChunk: (pcmBase64: string, mimeType?: string) => void;
  sendTextPrompt: (text: string) => void;
  isConnected: () => boolean;
}
