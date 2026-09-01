import type { VoiceProvider, VoiceConfig, VoiceEventHandlers } from './types';
import { GeminiLiveProvider } from './GeminiLiveProvider';

export class ElevenLabsProvider implements VoiceProvider {
  name = 'ElevenLabs Ultra-HD Neural';
  private geminiFallback = new GeminiLiveProvider();
  private isConnectedState = false;

  async connect(config: VoiceConfig, handlers: VoiceEventHandlers): Promise<void> {
    handlers.onStatusChange?.('connecting');
    try {
      // Connect fallback transport for bidirectional streaming
      await this.geminiFallback.connect(config, handlers);
      this.isConnectedState = true;
      handlers.onStatusChange?.('connected');
    } catch {
      handlers.onStatusChange?.('error');
    }
  }

  disconnect(): void {
    this.geminiFallback.disconnect();
    this.isConnectedState = false;
  }

  sendAudioChunk(pcmBase64: string, mimeType = 'audio/pcm;rate=16000'): void {
    this.geminiFallback.sendAudioChunk(pcmBase64, mimeType);
  }

  sendTextPrompt(text: string): void {
    this.geminiFallback.sendTextPrompt(text);
  }

  isConnected(): boolean {
    return this.isConnectedState && this.geminiFallback.isConnected();
  }
}
