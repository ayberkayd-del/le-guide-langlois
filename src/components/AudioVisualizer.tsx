/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export function AudioVisualizer({ isListening, isSpeaking, volume = 0 }: { isListening?: boolean; isSpeaking?: boolean; volume?: number }) {
  if (!isListening && !isSpeaking) return null;

  return (
    <div className="flex items-end justify-center gap-1.5 h-16 px-4">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${isListening ? 'bg-[#9E825F]' : 'bg-[#1A1A1A]'}`}
          animate={{
            height: isListening 
              ? [8, Math.max(12, volume * 100 * (0.5 + Math.random())), 8]
              : isSpeaking 
              ? [4, 16, 8, 20, 4] 
              : 8
          }}
          transition={{
            duration: 0.15,
            repeat: i % 2 === 0 ? 0 : Infinity, // Only repeat some for variety if not listening
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
