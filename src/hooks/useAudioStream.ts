import { useState, useRef, useCallback } from 'react';

// Helper to convert base64 PCM 16-bit to Float32Array for WebAudio playback
function base64ToFloat32(base64: string): Float32Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

// Helper to convert Float32Array microphone samples to base64 PCM 16-bit (16kHz)
function float32ToBase64PCM16(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function useAudioStream() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // Normalized 0..1 for live waveform

  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Start microphone capture and stream 16kHz PCM chunks
  const startRecording = useCallback(
    async (onAudioChunk: (pcmBase64: string) => void) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        mediaStreamRef.current = stream;
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
          sampleRate: 16000,
        });
        inputAudioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        // Using ScriptProcessor for real-time PCM chunk streaming
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processorNodeRef.current = processor;

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);

          // Calculate RMS volume level for live waveform animation
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          const normalized = Math.min(1, rms * 5);
          setAudioLevel(normalized);

          // Convert to PCM16 base64 and stream to Gemini Live
          const pcmBase64 = float32ToBase64PCM16(inputData);
          onAudioChunk(pcmBase64);
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
        setIsRecording(true);
      } catch (err) {
        console.error('[useAudioStream] Failed to access microphone:', err);
        throw err;
      }
    },
    []
  );

  // Stop microphone recording
  const stopRecording = useCallback(() => {
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    setIsRecording(false);
    setAudioLevel(0);
  }, []);

  // Play incoming 24kHz PCM chunk from Gemini Live
  const playAudioChunk = useCallback((base64PCM24: string) => {
    if (!outputAudioCtxRef.current || outputAudioCtxRef.current.state === 'closed') {
      outputAudioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
        sampleRate: 24000,
      });
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }

    const audioCtx = outputAudioCtxRef.current;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const float32Samples = base64ToFloat32(base64PCM24);
    const audioBuffer = audioCtx.createBuffer(1, float32Samples.length, 24000);
    audioBuffer.getChannelData(0).set(float32Samples);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const startTime = Math.max(audioCtx.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;

    activeSourcesRef.current.push(source);
    setIsPlayingAudio(true);

    // Dynamic audio level for speaking waveform
    setAudioLevel(0.6 + Math.random() * 0.4);

    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setIsPlayingAudio(false);
        setAudioLevel(0);
      }
    };
  }, []);

  // Stop all playing audio immediately (e.g. on interrupt)
  const stopAudioPlayback = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Source already stopped
      }
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsPlayingAudio(false);
    setAudioLevel(0);
  }, []);

  return {
    isRecording,
    isPlayingAudio,
    audioLevel,
    startRecording,
    stopRecording,
    playAudioChunk,
    stopAudioPlayback,
  };
}
