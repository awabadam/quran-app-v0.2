"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface DailyVerse {
  text_uthmani: string;
  verse_key: string;
  chapter_id: number;
  translations?: { text: string }[];
}

interface HeroProps {
  dailyVerse?: DailyVerse;
  surahName?: string;
}

export default function Hero({ dailyVerse, surahName }: HeroProps) {
  const cleanTranslation = dailyVerse?.translations?.[0]?.text?.replace(/<[^>]*>/g, "") || "";

  if (!dailyVerse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Link href={`/${dailyVerse.chapter_id}`} className="group block h-full">
        <div className="relative h-full p-6 md:p-8 rounded-2xl overflow-hidden
          bg-white/[0.02] border border-white/[0.05]
          hover:bg-white/[0.04] hover:border-emerald-500/15
          transition-all duration-300">

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)" }}
          />

          {/* Label */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] text-gray-600 font-english uppercase tracking-widest">
              Verse of the Day
            </p>
            <span className="text-[11px] text-emerald-500/60 font-english tracking-wider group-hover:text-emerald-400 transition-colors">
              {surahName && `${surahName} `}{dailyVerse.verse_key}
              <svg className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Arabic text */}
          <p dir="rtl" className="font-Scheherazade_New text-2xl md:text-3xl text-gray-100 leading-[2.4] mb-5">
            {dailyVerse.text_uthmani}
          </p>

          {/* Translation */}
          {cleanTranslation && (
            <p className="text-sm text-gray-500 font-english leading-relaxed line-clamp-3 group-hover:text-gray-400 transition-colors">
              &ldquo;{cleanTranslation}&rdquo;
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
