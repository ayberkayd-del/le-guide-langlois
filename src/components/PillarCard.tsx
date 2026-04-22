/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface PillarCardProps {
  id: string;
  order: string;
  title: string;
  description: string;
  onClick: () => void;
}

export function PillarCard({ order, title, description, onClick }: PillarCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full h-full p-6 md:p-8 text-left border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 last:border-b-0 md:last:border-r-0 hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 group cursor-pointer flex flex-col justify-between min-h-[160px]"
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-sans font-bold tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
          {order}
        </span>
        <div className="w-4 h-[1px] bg-[#1A1A1A] mt-2 group-hover:bg-white transition-colors"></div>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-[11px] font-sans uppercase tracking-wider opacity-50 group-hover:opacity-80 transition-opacity">
          {description.split(',').join(' · ')}
        </p>
      </div>
    </motion.button>
  );
}
