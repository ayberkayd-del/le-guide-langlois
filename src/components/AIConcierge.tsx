/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { askConcierge } from "../services/geminiService";
import { AudioVisualizer } from "./AudioVisualizer";

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIConcierge({ isOpen, onClose }: AIConciergeProps) {
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceRequest(text);
      };

      recognitionRef.current.onend = () => {
        if (status === "listening") setStatus("thinking");
      };

      recognitionRef.current.onerror = () => {
        setStatus("idle");
      };
    }
  }, []);

  // Handle Voice Activation when isOpen changes
  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopAll();
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current && status !== "listening") {
      setStatus("listening");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition already started");
      }
    }
  };

  const stopAll = () => {
    recognitionRef.current?.stop();
    synthRef.current?.cancel();
    setStatus("idle");
  };

  const handleVoiceRequest = async (text: string) => {
    setStatus("thinking");
    const result = await askConcierge(text);
    
    if (result) {
      speak(result);
    } else {
      setStatus("idle");
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Cleanup markdown/formatting for voice
    const plainText = text.replace(/[*#_\[\]()]/g, "").trim();
    
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Try to find a nice European/French accented English voice if possible
    const voices = synthRef.current.getVoices();
    const frenchVoice = voices.find(v => v.lang.includes("fr") || v.name.includes("French"));
    if (frenchVoice) {
      // Note: If lang is set to fr-FR, it might pronounce English words weirdly.
      // But for the "concierge" feel, we want a sophisticated English voice.
    }

    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => {
      setStatus("idle");
      // Optional: auto-listen again after speaking
      // setTimeout(startListening, 500); 
    };

    synthRef.current.speak(utterance);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F5F2ED] pointer-events-auto"
        >
          {/* Close button - Minimalist */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:top-12 md:right-12 font-sans text-[10px] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity z-[110]"
          >
            [ Fermer ]
          </button>

          {/* Pure Visualizer Interface */}
          <div className="relative flex flex-col items-center justify-center text-center max-w-2xl px-6 md:px-8">
            <div className="mb-8 md:mb-12">
              <AudioVisualizer 
                isListening={status === "listening"} 
                isSpeaking={status === "speaking"} 
              />
            </div>

            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.5em] uppercase text-[#9E825F] mb-6 md:mb-8 block transition-opacity duration-500">
              {status === "listening" && "Direct Response Link Active"}
              {status === "thinking" && "Le Guide is reflecting"}
              {status === "speaking" && "Transmission in progress"}
              {status === "idle" && "Ready for request"}
            </span>

            <h2 className="text-2xl md:text-4xl font-serif italic font-light leading-relaxed text-[#1A1A1A]">
              {status === "listening" && "Monsieur, I am listening to your every word."}
              {status === "thinking" && "Searching the archives of Hotel Langlois."}
              {status === "speaking" && "S'il vous plaît..."}
              {status === "idle" && "Awaiting your voice."}
            </h2>

            {/* Hint for the user */}
            <div className="mt-12 md:mt-20 opacity-20 font-sans text-[9px] tracking-widest uppercase">
              {status === "listening" ? "Speak clearly" : "The session is private"}
            </div>
          </div>

          {/* Orbital Decorations */}
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[#9E825F]/10 rounded-full pointer-events-none" />
          <div className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] border border-[#9E825F]/5 rounded-full pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
