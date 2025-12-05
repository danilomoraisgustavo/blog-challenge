import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChapterNav({ 
  chapters = [], 
  activeChapter = 0, 
  onSelect,
  completedChapters = []
}) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-semibold">Capítulos</h2>
        <p className="text-white/40 text-sm mt-1">
          {completedChapters.length} de {chapters.length} concluídos
        </p>
        
        {/* Progress Bar */}
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedChapters.length / chapters.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          />
        </div>
      </div>

      <ScrollArea className="max-h-[400px]">
        <nav className="p-2">
          {chapters.map((chapter, index) => {
            const isActive = activeChapter === index;
            const isCompleted = completedChapters.includes(index);
            
            return (
              <motion.button
                key={index}
                onClick={() => onSelect(index)}
                whileHover={{ x: 4 }}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-start gap-3 group ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-white/30" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className="text-white/40 text-xs font-mono">
                    {(chapter.number || index + 1).toString().padStart(2, "0")}
                  </span>
                  <p className={`text-sm truncate ${isActive ? "font-medium" : ""}`}>
                    {chapter.title}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isActive ? "opacity-100" : ""
                }`} />
              </motion.button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}