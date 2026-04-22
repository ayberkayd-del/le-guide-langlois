/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PILLARS, PLACEHOLDER_MESSAGE, PILLAR_CONTENT } from "./constants";
import { PillarCard } from "./components/PillarCard";
import { AIConcierge } from "./components/AIConcierge";
import * as Icons from "lucide-react";
import Markdown from "react-markdown";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubCategoryNavigation = (path: string) => {
    setSelectedCategory(path);
  };

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col bg-[#F5F2ED] text-[#1A1A1A] overflow-y-auto md:overflow-hidden selection:bg-[#9E825F]/20">
      {/* Header Section */}
      <header className="flex justify-between items-center px-6 md:px-16 py-8 md:py-12 border-b border-[#1A1A1A]/10 bg-white/50 backdrop-blur-sm relative z-20">
        <div className="flex flex-col">
          <span className="text-[11px] tracking-[0.2em] uppercase font-sans mb-1 opacity-60">Le Guide Langlois</span>
          <h1 className="text-4xl tracking-tighter uppercase font-light font-serif">Hôtel Langlois</h1>
        </div>
        <div className="text-right flex flex-col items-end">
          {/* Address and Date removed */}
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-[#1A1A1A]/10 relative overflow-hidden">
        {/* Left Navigation Rails - Hidden on mobile */}
        <div className="hidden md:flex md:col-span-1 border-r border-[#1A1A1A]/10 items-center justify-center bg-white/20">
        </div>

        {/* Central Interaction Zone */}
        <div className="col-span-1 md:col-span-10 flex flex-col items-center justify-center relative bg-white/10 overflow-hidden min-h-[40vh]">
          {/* Geometric Rings */}
          <div className="absolute w-64 h-64 border border-[#9E825F]/20 rounded-full" />
          <div className="absolute w-80 h-80 border border-[#9E825F]/10 rounded-full" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsConciergeOpen(true)}
            className="w-48 h-48 rounded-full border border-[#1A1A1A] flex flex-col items-center justify-center p-8 text-center bg-white shadow-2xl z-10 transition-colors hover:border-[#9E825F] group"
          >
            <div className="w-2 h-2 bg-[#9E825F] rounded-full mb-4 group-hover:scale-150 transition-transform" />
            <h2 className="text-xl tracking-tight font-serif">Ask Anything</h2>
          </motion.button>
          
          {/* Welcome quote removed */}
        </div>

        {/* Right Navigation Rails - Hidden on mobile */}
        <div className="hidden md:flex md:col-span-1 border-l border-[#1A1A1A]/10 items-center justify-center bg-white/20">
        </div>
      </main>

      {/* Bottom Pillars (Footer Grid) */}
      <footer className="h-auto md:h-56 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 bg-white border-b md:border-b-0 border-[#1A1A1A]/10">
        {PILLARS.map((pillar, index) => (
          <PillarCard
            key={pillar.id}
            id={pillar.id}
            order={`0${index + 1}`}
            title={pillar.title}
            description={pillar.description}
            onClick={() => handleCategoryClick(pillar.title)}
          />
        ))}
      </footer>

      {/* AI Concierge Component */}
      <AIConcierge isOpen={isConciergeOpen} onClose={() => setIsConciergeOpen(false)} />

      {/* Placeholder Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-[#F5F2ED]/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="max-w-xl w-full bg-white p-6 md:p-12 border border-[#1A1A1A]/20 text-center shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#9E825F]/20" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#9E825F]/20" />
              
              <div className="flex justify-center mb-6 md:mb-8 text-[#9E825F]">
                <Icons.Calendar size={48} strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6 uppercase tracking-tight">
                {selectedCategory}
              </h3>
              <div className="font-serif text-left prose prose-ink prose-lg max-h-[60vh] md:max-h-[70vh] overflow-y-auto mb-8 md:mb-12 scrollbar-thin px-2 md:px-4">
                {PILLAR_CONTENT[selectedCategory] ? (
                  <div className="text-[#1A1A1A]/90">
                    <Markdown
                      components={{
                        h4: ({ ...props }) => (
                          <h4 className="text-center font-bold mb-4 uppercase tracking-wider text-[#9E825F]" {...props} />
                        ),
                        strong: ({ children, ...props }) => {
                          const content = String(children);
                          if (content.startsWith("[") && content.includes("]")) {
                            const [key, label] = content.split("]:");
                            const cleanKey = key.replace("[", "").trim();
                            const cleanLabel = label?.trim() || content;
                            
                            // Navigation Keys
                            const navigationKeys = ["HISTORY_HERITAGE", "BESPOKE_SERVICES", "THE_ROOMS", "BACK_TO_ABOUT"];
                            
                            if (navigationKeys.includes(cleanKey)) {
                              const target = cleanKey === "BACK_TO_ABOUT" ? "ABOUT HOTEL" : cleanKey;
                              return (
                                <button
                                  onClick={() => handleSubCategoryNavigation(target)}
                                  className="w-full text-left p-4 my-2 border border-[#9E825F]/20 hover:border-[#9E825F] hover:bg-[#F5F2ED] transition-all group flex justify-between items-center no-underline font-serif italic"
                                >
                                  <span>{cleanLabel}</span>
                                  <Icons.ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              );
                            }
                          }
                          return <strong className="font-bold text-[#1A1A1A]" {...props}>{children}</strong>;
                        },
                        hr: () => <hr className="border-[#9E825F]/20 my-6" />
                      }}
                    >
                      {PILLAR_CONTENT[selectedCategory]}
                    </Markdown>
                  </div>
                ) : (
                  <p className="italic text-xl text-[#1A1A1A]/70 leading-relaxed text-center">
                    {PLACEHOLDER_MESSAGE(selectedCategory)}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="group inline-flex items-center gap-4 border border-[#1A1A1A]/10 px-8 py-4 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                Return to Entry
                <Icons.X size={14} className="group-hover:rotate-90 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
