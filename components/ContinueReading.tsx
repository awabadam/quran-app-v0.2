"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingProgress {
  surahId: number;
  surahName: string;
  surahArabic: string;
  timestamp: string;
}

export default function ContinueReading() {
  const [lastRead, setLastRead] = useState<ReadingProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('readingProgress');
    if (saved) {
      try {
        setLastRead(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reading progress:', e);
      }
    }
  }, []);

  // Format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {lastRead && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md mx-auto mb-8"
        >
          <Link href={`/${lastRead.surahId}`}>
            <div className="group relative overflow-hidden rounded-2xl 
              bg-gradient-to-br from-emerald-900/30 via-gray-900/50 to-gray-900/30
              border border-emerald-500/20 hover:border-emerald-500/40
              p-5 transition-all duration-500 cursor-pointer
              hover:shadow-glow"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 geometric-pattern" />
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 
                blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl 
                  bg-emerald-500/20 border border-emerald-500/30
                  flex items-center justify-center
                  group-hover:bg-emerald-500/30 group-hover:scale-105
                  transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-emerald-400 font-english mb-1 flex items-center gap-2">
                    <span>Continue Reading</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-400/50" />
                    <span className="text-gray-500">{getRelativeTime(lastRead.timestamp)}</span>
                  </p>
                  <h3 dir="rtl" className="text-lg font-Scheherazade_New text-gray-100 truncate">
                    سورة {lastRead.surahArabic}
                  </h3>
                  <p className="text-sm text-gray-500 font-english">
                    Surah {lastRead.surahName}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="flex-shrink-0">
                  <svg 
                    className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 
                      group-hover:-translate-x-1 transition-all duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
