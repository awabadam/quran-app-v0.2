"use client";
import { motion } from "framer-motion";
import ReadingProgressBar from "./ReadingProgressBar";
import { useSettings } from "@/context/SettingsContext";

interface SurahHeaderProps {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  versesCount: number;
  revelationPlace: string;
}

export default function SurahHeader({ 
  id, 
  nameArabic, 
  nameEnglish, 
  versesCount,
  revelationPlace 
}: SurahHeaderProps) {
  const { readingMode } = useSettings();
  const isCompact = readingMode === "spread";

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* Header Card */}
      <motion.div 
        className="sticky top-16 z-40 mt-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={`glass-card ${isCompact ? 'p-3' : 'p-5 md:p-6'}`}>
          <div className="flex items-center justify-between gap-4">
            {/* Surah Number */}
            <div className={`flex items-center gap-2 ${isCompact ? '' : 'flex-col'}`}>
              {!isCompact && (
                <span className="text-xs text-gray-500 font-english uppercase tracking-wider mb-1">
                  Surah
                </span>
              )}
              <div className={`rounded-xl bg-emerald-500/10 border border-emerald-500/20 
                flex items-center justify-center ${isCompact ? 'w-9 h-9' : 'w-12 h-12'}`}>
                <span className={`font-bold text-emerald-400 font-english ${isCompact ? 'text-sm' : 'text-xl'}`}>{id}</span>
              </div>
            </div>
            
            {/* Surah Name */}
            <div className="text-center flex-1">
              <h1 dir="rtl" className={`font-Scheherazade_New text-gray-100 ${isCompact ? 'text-xl' : 'text-2xl md:text-3xl mb-1'}`}>
                سورة {nameArabic}
              </h1>
              {!isCompact && (
                <p className="text-sm text-gray-500 font-english">
                  {nameEnglish}
                </p>
              )}
            </div>
            
            {/* Verses Count & Revelation Place */}
            <div className={`flex items-center gap-2 ${isCompact ? '' : 'flex-col'}`}>
              {!isCompact && (
                <span className="text-xs text-gray-500 font-english uppercase tracking-wider mb-1">
                  Verses
                </span>
              )}
              <div className={`flex items-center gap-2`}>
                <div className={`rounded-xl bg-gray-800/50 border border-white/5 
                  flex items-center justify-center ${isCompact ? 'w-9 h-9' : 'w-12 h-12'}`}>
                  <span className={`font-bold text-gray-300 font-english ${isCompact ? 'text-sm' : 'text-xl'}`}>{versesCount}</span>
                </div>
                {isCompact && (
                  <span className="px-2 py-1 rounded-lg text-[10px] font-english uppercase tracking-wider
                    bg-gray-800/50 border border-white/5 text-gray-500">
                    {revelationPlace === 'makkah' ? 'Meccan' : 'Medinan'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Revelation Place Badge - only in normal mode */}
          {!isCompact && (
            <div className="flex justify-center mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-english uppercase tracking-wider
                bg-gray-800/50 border border-white/5 text-gray-500">
                {revelationPlace === 'makkah' ? 'Meccan' : 'Medinan'}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
