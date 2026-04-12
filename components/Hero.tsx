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

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, transparent 70%)" }}
      />

      {/* Bismillah */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="mb-10"
      >
        <p dir="rtl" className="font-Scheherazade_New text-2xl md:text-3xl text-white/20 select-none">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      </motion.div>

      {/* Daily Verse — the centerpiece */}
      {dailyVerse && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl text-center mb-12"
        >
          <Link href={`/${dailyVerse.chapter_id}`} className="group block">
            <p dir="rtl" className="font-Scheherazade_New text-arabic-xl md:text-arabic-2xl lg:text-arabic-3xl text-gray-100 text-glow leading-arabic mb-6">
              {dailyVerse.text_uthmani}
            </p>

            {cleanTranslation && (
              <p className="text-gray-500 font-english text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-4 group-hover:text-gray-400 transition-colors">
                &ldquo;{cleanTranslation}&rdquo;
              </p>
            )}

            <span className="inline-flex items-center gap-2 text-emerald-500/60 font-english text-xs tracking-widest uppercase group-hover:text-emerald-400 transition-colors">
              {surahName && `${surahName} `}{dailyVerse.verse_key}
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <a
          href="#surahs"
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400
            text-gray-950 font-english font-medium text-sm rounded-full
            transition-all duration-200 hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.5)]"
        >
          Browse Surahs
        </a>
        <a
          href="/athkar"
          className="px-8 py-3 bg-white/[0.04] hover:bg-white/[0.08]
            text-gray-400 hover:text-white font-english font-medium text-sm rounded-full
            border border-white/[0.06] hover:border-white/[0.12]
            transition-all duration-200"
        >
          Daily Athkar
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#surahs" className="text-white/15 hover:text-white/30 transition-colors">
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
