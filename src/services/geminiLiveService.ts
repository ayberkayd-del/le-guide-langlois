/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { KNOWLEDGE_BASE } from "../constants";

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private session: any | null = null;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private stream: MediaStream | null = null;
  private onMessageCallback: (text: string, isModel: boolean) => void;
  private onAudioLevelCallback: (level: number) => void;

  constructor(
    onMessage: (text: string, isModel: boolean) => void,
    onAudioLevel: (level: number) => void
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    this.onMessageCallback = onMessage;
    this.onAudioLevelCallback = onAudioLevel;
  }

  async connect() {
    try {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      
      // Load the audio worklet
      // Note: We'll embed the worklet code as a Blob to avoid extra files
      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0) {
              const channelData = input[0];
              // Convert Float32 to Int16
              const pcmData = new Int16Array(channelData.length);
              for (let i = 0; i < channelData.length; i++) {
                const s = Math.max(-1, Math.min(1, channelData[i]));
                pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              this.port.postMessage(pcmData.buffer, [pcmData.buffer]);
            }
            return true;
          }
        }
        registerProcessor('audio-processor', AudioProcessor);
      `;
      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      await this.audioContext.audioWorklet.addModule(url);
      
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-processor');
      source.connect(this.workletNode);

      const sessionPromise = this.ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            this.workletNode!.port.onmessage = (event) => {
              const buffer = event.data;
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({
                audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
              }));
              
              // Calculate audio level for UI
              const int16Array = new Int16Array(buffer);
              let sum = 0;
              for (let i = 0; i < int16Array.length; i++) {
                sum += Math.abs(int16Array[i]) / 0x8000;
              }
              this.onAudioLevelCallback(sum / int16Array.length);
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              const part = message.serverContent.modelTurn.parts[0];
              if (part.inlineData?.data) {
                this.playAudio(part.inlineData.data);
              }
            }
            
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              this.onMessageCallback(message.serverContent.modelTurn.parts[0].text, true);
            }

            if (message.serverContent?.interrupted) {
              this.stopAudio();
            }
          },
          onclose: () => console.log("Gemini Live Closed"),
          onerror: (e) => console.error("Gemini Live Error:", e),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are Le Guide Langlois, the sophisticated digital guide of Hotel Langlois in Paris (since 1870). 
          Knowledge: ${JSON.stringify(KNOWLEDGE_BASE)}. 
          Be elegant, Parisian, and helpful. Keep responses concise for voice interaction.`,
        },
      });

      this.session = await sessionPromise;
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  }

  private audioQueue: Int16Array[] = [];
  private isPlaying = false;
  private nextStartTime = 0;

  private playAudio(base64Data: string) {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    this.audioQueue.push(int16Array);
    this.processQueue();
  }

  private processQueue() {
    if (this.isPlaying || this.audioQueue.length === 0 || !this.audioContext) return;
    this.isPlaying = true;
    
    const chunk = this.audioQueue.shift()!;
    const float32Array = new Float32Array(chunk.length);
    for (let i = 0; i < chunk.length; i++) {
        float32Array[i] = chunk[i] / 0x8000;
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000); // Gemini Live usually sends 24kHz output
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    const startTime = Math.max(this.audioContext.currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;
    
    source.onended = () => {
        this.isPlaying = false;
        this.processQueue();
    };
  }

  private stopAudio() {
    this.audioQueue = [];
    this.nextStartTime = 0;
    // In a real implementation we might want to disconnect current sources
  }

  disconnect() {
    this.session?.close();
    this.stream?.getTracks().forEach(t => t.stop());
    
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(e => console.warn("Error closing context:", e));
    }
    
    this.audioContext = null;
    this.isPlaying = false;
    this.audioQueue = [];
  }
}
