"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { surahs } from "@/lib/surahs";

interface ReadingProgress {
  surahId: number;
  surahName: string;
  surahArabic: string;
  verseNumber: number;
  timestamp: string;
}

interface ReadingProgressContextType {
  lastRead: ReadingProgress | null;
  saveProgress: (surahId: number, verseNumber?: number) => void;
  clearProgress: () => void;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | undefined>(undefined);

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [lastRead, setLastRead] = useState<ReadingProgress | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readingProgress');
    if (saved) {
      try {
        setLastRead(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reading progress:', e);
      }
    }
  }, []);

  const saveProgress = (surahId: number, verseNumber?: number) => {
    const surah = surahs.find(s => s.id === surahId);
    if (surah) {
      const progress: ReadingProgress = {
        surahId: surah.id,
        surahName: surah.name,
        surahArabic: surah.arabic,
        verseNumber: verseNumber || lastRead?.verseNumber || 1,
        timestamp: new Date().toISOString(),
      };
      setLastRead(progress);
      localStorage.setItem('readingProgress', JSON.stringify(progress));
    }
  };

  const clearProgress = () => {
    setLastRead(null);
    localStorage.removeItem('readingProgress');
  };

  return (
    <ReadingProgressContext.Provider value={{ lastRead, saveProgress, clearProgress }}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

export function useReadingProgress() {
  const context = useContext(ReadingProgressContext);
  if (context === undefined) {
    throw new Error('useReadingProgress must be used within a ReadingProgressProvider');
  }
  return context;
}
