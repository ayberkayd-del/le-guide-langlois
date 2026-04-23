/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mic, MicOff, Volume2, Globe } from "lucide-react";
import { GeminiLiveService } from "../services/geminiLiveService";
import { AudioVisualizer } from "./AudioVisualizer";

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIConcierge({ isOpen, onClose }: AIConciergeProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState<string>("");
  const serviceRef = useRef<GeminiLiveService | null>(null);

  const startSession = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setTranscript("Connecting to Le Guide...");
    
    try {
      if (!serviceRef.current) {
        serviceRef.current = new GeminiLiveService(
          (text, isModel) => {
            if (isModel) setTranscript(text);
          },
          (level) => setAudioLevel(level)
        );
      }
      await serviceRef.current.connect();
      setIsConnected(true);
      setTranscript("Bienvenue. I am listening, Monsieur/Madame.");
    } catch (error) {
      console.error(error);
      setTranscript("I apologize, there was a connection error. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const endSession = () => {
    serviceRef.current?.disconnect();
    setIsConnected(false);
    setAudioLevel(0);
    setTranscript("");
  };

  useEffect(() => {
    if (!isOpen) {
      endSession();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#F5F2ED] text-[#1A1A1A] p-6 md:p-12"
        >
          {/* Minimal Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-1">Le Guide Langlois</span>
              <h2 className="text-2xl font-serif tracking-tight uppercase">Live Session</h2>
            </div>
            <button 
              onClick={onClose}
              className="group flex items-center gap-3 px-4 py-2 hover:bg-black/5 transition-colors border border-black/10 rounded-full"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans">Exit</span>
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Interaction Content */}
          <div className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {!isConnected ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-12"
                >
                  <div className="w-32 h-32 rounded-full border border-black/10 flex items-center justify-center p-8 bg-white/50 backdrop-blur-sm shadow-xl">
                    <Mic className="w-10 h-10 opacity-20" />
                  </div>
                  <div className="space-y-6 text-center">
                    <p className="text-xl md:text-2xl font-serif italic opacity-60 max-w-md mx-auto leading-relaxed">
                      "Your guide for Hotel Langlois and the city beyond."
                    </p>
                    <button
                      onClick={startSession}
                      disabled={isConnecting}
                      className="px-12 py-5 bg-[#1A1A1A] text-white rounded-full font-sans text-[11px] tracking-[0.3em] uppercase hover:bg-[#9E825F] transition-all disabled:opacity-50"
                    >
                      {isConnecting ? "Establishing Link..." : "Begin Conversation"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-16 flex flex-col items-center"
                >
                  <div className="w-full flex justify-center">
                    <AudioVisualizer level={audioLevel} />
                  </div>
                  
                  <div className="max-w-2xl text-center px-4">
                    <p className="text-2xl md:text-4xl font-serif tracking-tight leading-snug text-[#1A1A1A]/80">
                      {transcript || "Listening..."}
                    </p>
                  </div>

                  <button
                    onClick={endSession}
                    className="group border border-black/10 px-8 py-3 rounded-full hover:bg-red-50 hover:border-red-200 transition-all"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-red-600/60 group-hover:text-red-600">Disconnect Session</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimal Footer Info */}
          <div className="flex justify-between items-end opacity-30 text-[9px] tracking-[0.2em] uppercase">
            <span>Paris 75009</span>
            <span>Secure Real-time Audio Stream</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
