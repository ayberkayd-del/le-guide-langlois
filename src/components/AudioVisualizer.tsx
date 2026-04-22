/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export function AudioVisualizer({ isListening, isSpeaking }: { isListening?: boolean; isSpeaking?: boolean }) {
  if (!isListening && !isSpeaking) return null;

  return (
    <div className="flex items-end justify-center gap-1 h-8 px-4">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${isListening ? 'bg-gold' : 'bg-ink'}`}
          animate={{
            height: isListening 
              ? [8, 24, 12, 32, 8] 
              : isSpeaking 
              ? [4, 16, 8, 20, 4] 
              : 8
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
