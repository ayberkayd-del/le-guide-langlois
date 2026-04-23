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
  const [volume, setVolume] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const processingTriggeredRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const transcriptRef = useRef<string>(""); // Kritik: Anlık metni burada tutuyoruz
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      lastActiveTimestampRef.current = Date.now();
      isListeningRef.current = true;
      processingTriggeredRef.current = false;
      transcriptRef.current = "";
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let currentFullTranscript = "";
          // Tüm sonuçları (final + interim) birleştirerek en güncel metni alıyoruz
          for (let i = 0; i < event.results.length; ++i) {
            currentFullTranscript += event.results[i][0].transcript;
          }

          lastActiveTimestampRef.current = Date.now();
          transcriptRef.current = currentFullTranscript;
          setTranscript(currentFullTranscript);
          resetSilenceTimer();
        };

        recognitionRef.current.onstart = () => {
          setStatus("listening");
          lastActiveTimestampRef.current = Date.now();
          resetSilenceTimer();
        };

        recognitionRef.current.onend = () => {
          // Eğer hala açık olmalıysak ve bir işlem başlamadıysa mikrofonu canlı tut
          if (isOpen && isListeningRef.current