import type { VoiceProvider, VoiceConfig, VoiceEventHandlers } from './types';

export class GeminiLiveProvider implements VoiceProvider {
  name = 'Google Gemini Live';
  private ws: WebSocket | null = null;
  private handlers: VoiceEventHandlers = {};
  private wsUrl = 'ws://127.0.0.1:8000/ws/live';

  async connect(config: VoiceConfig, handlers: VoiceEventHandlers): Promise<void> {
    this.handlers = handlers;
    this.handlers.onStatusChange?.('connecting');

    const url = `${this.wsUrl}?voice=${encodeURIComponent(config.gender)}`;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('[GeminiLiveProvider] Connected to backend voice bridge');
          this.handlers.onStatusChange?.('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'audio_chunk' && data.data) {
              this.handlers.onAudioData?.(data.data, data.mimeType || 'audio/pcm;rate=24000');
            } else if (data.type === 'transcript' && data.text) {
              this.handlers.onTranscript?.(data.text);
            } else if (data.type === 'turn_complete') {
              this.handlers.onTurnComplete?.();
            } else if (data.type === 'interrupted') {
              this.handlers.onInterrupted?.();
            } else if (data.type === 'status') {
              if (data.status === 'connected') {
                this.handlers.onStatusChange?.('connected');
              } else if (data.status === 'disconnected') {
                this.handlers.onStatusChange?.('disconnected');
              }
            } else if (data.type === 'error') {
              this.handlers.onError?.(data.message);
              this.handlers.onStatusChange?.('error');
            }
          } catch (err) {
            console.error('[GeminiLiveProvider] Error parsing incoming message:', err);
          }
        };

        this.ws.onerror = (err) => {
          console.error('[GeminiLiveProvider] WebSocket error:', err);
          this.handlers.onError?.('Failed to connect to JARVIS Voice Backend on ws://127.0.0.1:8000.');
          this.handlers.onStatusChange?.('error');
          reject(err);
        };

        this.ws.onclose = () => {
          console.log('[GeminiLiveProvider] WebSocket connection closed');
          this.handlers.onStatusChange?.('disconnected');
        };
      } catch (err) {
        this.handlers.onStatusChange?.('error');
        reject(err);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.onStatusChange?.('disconnected');
  }

  sendAudioChunk(pcmBase64: string, mimeType = 'audio/pcm;rate=16000'): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'audio_chunk',
          data: pcmBase64,
          mimeType,
        })
      );
    }
  }

  sendTextPrompt(text: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'text_prompt',
          text,
        })
      );
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
