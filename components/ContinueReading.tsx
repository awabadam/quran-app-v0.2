"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingProgress {
  surahId: number;
  surahName: string;
  surahArabic: string;
  verseNumber?: number;
  timestamp: string;
}

export default function ContinueReading() {
  const t = useTranslations("continueReading");
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

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('daysAgo', { count: diffDays });
    return then.toLocaleDateString();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {lastRead && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full"
        >
          <Link href={`/${lastRead.surahId}${lastRead.verseNumber ? `?verse=${lastRead.verseNumber}` : ''}`}>
            <div className="group relative flex items-center gap-4 p-4 rounded-2xl
              bg-emerald-500/[0.04] border border-emerald-500/20
              hover:bg-emerald-500/[0.08] hover:border-emerald-500/30
              shadow-[0_0_20px_rgba(16,185,129,0.06)]
              transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-11 h-11 rounded-xl
                bg-emerald-500/10 border border-emerald-500/15
                flex items-center justify-center
                group-hover:bg-emerald-500/15 transition-colors duration-300"
              >
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-600 font-english mb-0.5 flex items-center gap-1.5">
                  <span>{t('label')}</span>
                  <span className="text-gray-700">&middot;</span>
                  <span>{getRelativeTime(lastRead.timestamp)}</span>
                </p>
                <p className="text-sm text-gray-200 font-english truncate group-hover:text-white transition-colors">
                  {lastRead.surahName}{lastRead.verseNumber ? `, ${t('verse', { number: lastRead.verseNumber })}` : ''}
                </p>
              </div>

              <svg className="w-4 h-4 text-gray-700 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
