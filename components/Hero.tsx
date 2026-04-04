"use client";
import { motion } from "framer-motion";

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
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          top: "10%",
          left: "20%",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)",
          bottom: "10%",
          right: "15%",
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -15, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
          top: "50%",
          right: "40%",
        }}
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating geometric decorations */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {/* Top-left star */}
        <svg className="absolute top-[15%] left-[8%] w-12 h-12 text-emerald-500/[0.07] animate-float" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={0.6}>
          <polygon points="16,2 19.5,12.5 30,16 19.5,19.5 16,30 12.5,19.5 2,16 12.5,12.5" />
        </svg>
        {/* Top-right diamond */}
        <svg className="absolute top-[20%] right-[12%] w-8 h-8 text-gold-500/[0.08] animate-float-slow" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={0.6}>
          <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)" />
        </svg>
        {/* Bottom-left octagon */}
        <svg className="absolute bottom-[25%] left-[15%] w-10 h-10 text-emerald-500/[0.06] animate-float-slower" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={0.6}>
          <polygon points="12,2 20,2 30,12 30,20 20,30 12,30 2,20 2,12" />
        </svg>
        {/* Bottom-right star */}
        <svg className="absolute bottom-[18%] right-[8%] w-14 h-14 text-emerald-500/[0.05] animate-spin-slow" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={0.4}>
          <polygon points="16,2 19.5,12.5 30,16 19.5,19.5 16,30 12.5,19.5 2,16 12.5,12.5" />
          <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        {/* App identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-english font-semibold text-white mb-2">
            Quran App
          </h1>
          <p className="text-gray-500 font-english text-sm">
            Read &bull; Reflect &bull; Remember
          </p>
        </motion.div>

        {/* Daily Verse Centerpiece */}
        {dailyVerse && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-10"
          >
            <div className="relative px-2 md:px-8 py-6">
              {/* Decorative quotation marks */}
              <span className="absolute -top-2 left-2 md:left-4 text-emerald-500/15 text-6xl font-serif leading-none select-none">
                &#x201C;
              </span>

              <p dir="rtl" className="font-Scheherazade_New text-arabic-lg md:text-arabic-2xl text-gray-100 text-glow leading-arabic mb-4">
                {dailyVerse.text_uthmani}
              </p>

              {cleanTranslation && (
                <p className="text-gray-400 font-english text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-3">
                  &ldquo;{cleanTranslation}&rdquo;
                </p>
              )}

              <p className="text-emerald-500/70 font-english text-xs tracking-wider uppercase">
                {surahName && `Surah ${surahName} — `}{dailyVerse.verse_key}
              </p>
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="#surahs"
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400
              text-gray-950 font-english font-medium rounded-xl
              transition-colors duration-200"
          >
            Browse Surahs
          </a>
          <a
            href="/athkar"
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10
              text-gray-300 hover:text-white font-english font-medium rounded-xl
              transition-all duration-200"
          >
            Daily Athkar
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#surahs" className="flex flex-col items-center gap-2 text-gray-600 hover:text-emerald-400 transition-colors">
          <div className="w-5 h-8 border border-current rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-current rounded-full animate-bounce" />
          </div>
        </a>
      </motion.div>
    </section>
  );
}
