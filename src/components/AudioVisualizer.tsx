/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface AudioVisualizerProps {
  level: number;
  isModel?: boolean;
}

export function AudioVisualizer({ level, isModel = false }: AudioVisualizerProps) {
  // Create 40 bars for a finer resolution
  const bars = Array.from({ length: 40 });
  const color = "bg-[#1A1A1A]";

  return (
    <div className="flex items-center justify-center gap-0.5 h-24 w-full max-w-lg mx-auto">
      {bars.map((_, i) => {
        const randomFactor = 0.4 + Math.random() * 0.6;
        const scale = Math.max(0.05, level * 4 * randomFactor);
        
        return (
          <motion.div
            key={i}
            animate={{ 
              height: `${scale * 100}%`,
              opacity: 0.1 + (scale * 0.9)
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`w-1 rounded-full ${color}`}
          />
        );
      })}
    </div>
  );
}
