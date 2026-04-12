"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useReadingProgress } from "@/context/ReadingProgressContext";
import { surahs } from "@/lib/surahs";
import VerseCount from "./VerseCount";
import SettingsDrawer from "./SettingsDrawer";

interface SurahViewProps {
  verses: any[];
  surahId?: string;
  pageMap?: { [key: string]: number };
  translationMap?: { [key: string]: string };
  showBismillah?: boolean;
  surahPages?: [number, number];
}

function PageBreak({ pageNumber }: { pageNumber: number }) {
  return (
    <div dir="ltr" className="w-full flex items-center justify-center my-10 select-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
        <span className="text-xs font-english text-gray-500">{pageNumber}</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
      </div>
    </div>
  );
}

// ─── Flow View ───────────────────────────────────────────────

function FlowView({
  verses,
  pageMap,
  fontSize,
  translationMap,
  surahId,
  surahName,
  arabicName,
}: {
  verses: any[];
  pageMap: { [key: string]: number };
  fontSize: number;
  translationMap: { [key: string]: string };
  surahId?: number;
  surahName?: string;
  arabicName?: string;
}) {
  const { showTranslation } = useSettings();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  let lastPage = 0;

  return (
    <motion.div
      className="font-Scheherazade_New"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: "2.8",
        textAlign: "justify",
        textAlignLast: "right",
        wordSpacing: "0.05em",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      dir="rtl"
    >
      {verses.map((verse: any, index: number) => {
        const verseKey = verse.verse_key;
        const currentPage = pageMap[verseKey] || 0;
        const showPageBreak = currentPage > 0 && currentPage !== lastPage && index > 0;
        const translation = translationMap[verseKey] || "";
        const isActive = activeVerse === verseKey;

        if (currentPage > 0) lastPage = currentPage;

        return (
          <span key={verseKey} id={`verse-${index + 1}`}>
            {showPageBreak && <PageBreak pageNumber={currentPage} />}
            <span
              className={`inline cursor-pointer rounded-lg px-1 transition-colors duration-200
                ${isActive ? "bg-emerald-500/8" : "hover:bg-white/[0.02]"}`}
              onClick={() => setActiveVerse(isActive ? null : verseKey)}
            >
              <span className="text-gray-100">{verse.text_uthmani}</span>{" "}
              <VerseCount
                count={index + 1}
                surahId={surahId}
                surahName={surahName}
                arabicName={arabicName}
                verseText={verse.text_uthmani}
              />{" "}
            </span>
            {showTranslation && isActive && translation && (
              <span dir="ltr" className="block my-4 mx-1">
                <span className="block text-sm text-gray-400/90 font-english leading-relaxed text-left py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-emerald-400/50 text-xs font-medium mr-2">{index + 1}</span>
                  {translation}
                </span>
              </span>
            )}
          </span>
        );
      })}
    </motion.div>
  );
}

// ─── Mushaf Page (15-line faithful layout) ────────────────────

interface WordData {
  id: number;
  position: number;
  line_number: number;
  page_number: number;
  char_type_name: "word" | "end";
  text: string;
  verse_key: string;
  verse_number?: number;
  translation?: { text: string };
}

interface PageData {
  pageNumber: number;
  lines: Map<number, WordData[]>;
  loading: boolean;
}

function MushafPage({
  pageData,
  position,
}: {
  pageData: PageData | null;
  position: "right" | "left";
}) {
  const roundedClass =
    position === "right" ? "rounded-l-2xl rounded-r-none" : "rounded-r-2xl rounded-l-none";
  const borderClass =
    position === "right" ? "border-r border-white/[0.03]" : "border-l border-white/[0.03]";

  if (!pageData || pageData.loading) {
    return (
      <div className={`aspect-[9/14] bg-[hsl(240,4%,8%)] border border-white/[0.04] flex items-center justify-center ${roundedClass}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-[11px] text-gray-600 font-english">Loading page...</span>
        </div>
      </div>
    );
  }

  const { pageNumber, lines } = pageData;
  const allLineNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className={`aspect-[9/14] bg-[hsl(240,4%,8%)] border border-white/[0.04] ${borderClass} flex flex-col py-5 px-5 lg:py-7 lg:px-9 ${roundedClass}`}>
      {/* Page number header */}
      <div className="flex items-center justify-center mb-3 pb-2.5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[11px] font-english text-gray-600 tabular-nums">{pageNumber}</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>
      </div>

      {/* 15 lines */}
      <div className="flex-1 flex flex-col justify-between font-Scheherazade_New" dir="rtl"
        style={{ fontSize: "clamp(16px, 2.3vw, 26px)", lineHeight: "2.0" }}>
        {allLineNumbers.map((lineNum) => {
          const words = lines.get(lineNum) || [];

          if (words.length === 0) {
            return <div key={lineNum} className="flex-1" />;
          }

          return (
            <p
              key={lineNum}
              className="flex-1 flex items-center text-justify text-gray-100"
              style={{ textAlignLast: "justify" }}
            >
              {words.map((word, wi) => {
                if (word.char_type_name === "end") {
                  const verseNum = parseInt(word.verse_key?.split(":")[1] || "0");
                  return (
                    <span key={`${word.id}-${wi}`}>
                      {" "}<VerseCount count={verseNum} />{" "}
                    </span>
                  );
                }
                return (
                  <span key={`${word.id}-${wi}`} className="hover:text-emerald-300/80 transition-colors">
                    {word.text}{" "}
                  </span>
                );
              })}
            </p>
          );
        })}
      </div>

      {/* Footer ornament */}
      <div className="mt-3 pt-2.5 flex justify-center flex-shrink-0">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>
    </div>
  );
}

// ─── Spread View (mushaf two-page layout) ────────────────────

function SpreadView({
  surahPages,
  showBismillah = false,
}: {
  surahPages: [number, number];
  showBismillah?: boolean;
}) {
  const [startPage, endPage] = surahPages;
  const totalPages = endPage - startPage + 1;

  // Current spread: index into pairs of pages
  const [currentLeft, setCurrentLeft] = useState(startPage);
  const pageCache = useRef<Map<number, PageData>>(new Map());
  const [, forceUpdate] = useState(0);

  // Fetch a mushaf page and cache it
  const fetchPage = useCallback(async (pageNum: number) => {
    if (pageCache.current.has(pageNum)) return;

    // Mark loading
    pageCache.current.set(pageNum, { pageNumber: pageNum, lines: new Map(), loading: true });
    forceUpdate((n) => n + 1);

    try {
      const res = await fetch(
        `https://api.quran.com/api/v4/verses/by_page/${pageNum}?words=true&per_page=50&word_fields=text_uthmani`
      );
      const data = await res.json();

      const lines = new Map<number, WordData[]>();
      for (const verse of data.verses || []) {
        for (const word of verse.words || []) {
          if (word.page_number !== pageNum) continue;
          const lineNum = word.line_number;
          if (!lines.has(lineNum)) lines.set(lineNum, []);
          lines.get(lineNum)!.push({
            id: word.id,
            position: word.position,
            line_number: word.line_number,
            page_number: word.page_number,
            char_type_name: word.char_type_name,
            text: word.text,
            verse_key: verse.verse_key,
            translation: word.translation,
          });
        }
      }

      pageCache.current.set(pageNum, { pageNumber: pageNum, lines, loading: false });
      forceUpdate((n) => n + 1);
    } catch (err) {
      console.error(`Failed to fetch page ${pageNum}:`, err);
      pageCache.current.set(pageNum, { pageNumber: pageNum, lines: new Map(), loading: false });
      forceUpdate((n) => n + 1);
    }
  }, []);

  // For desktop spread: show two pages. Right page = currentLeft, left page = currentLeft + 1
  // For mushaf: right page is read first (RTL)
  const rightPageNum = currentLeft;
  const leftPageNum = currentLeft + 1 <= endPage ? currentLeft + 1 : null;

  // Fetch current and adjacent pages
  useEffect(() => {
    fetchPage(rightPageNum);
    if (leftPageNum) fetchPage(leftPageNum);
    // Preload adjacent
    if (rightPageNum - 1 >= startPage) fetchPage(rightPageNum - 1);
    if ((leftPageNum || rightPageNum) + 1 <= endPage) fetchPage((leftPageNum || rightPageNum) + 1);
  }, [rightPageNum, leftPageNum, fetchPage, startPage, endPage]);

  const canGoPrev = currentLeft - 2 >= startPage;
  const canGoNext = leftPageNum ? leftPageNum < endPage : rightPageNum < endPage;

  const goNext = () => {
    const step = leftPageNum ? 2 : 1;
    setCurrentLeft((p) => Math.min(p + step, endPage));
  };

  const goPrev = () => {
    setCurrentLeft((p) => Math.max(p - 2, startPage));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      // RTL: right arrow = previous (earlier pages), left arrow = next
      if (e.key === "ArrowRight" && canGoPrev) goPrev();
      else if (e.key === "ArrowLeft" && canGoNext) goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoPrev, canGoNext]);

  const rightPage = pageCache.current.get(rightPageNum) || null;
  const leftPage = leftPageNum ? pageCache.current.get(leftPageNum) || null : null;

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLeft}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          dir="rtl"
          className="grid grid-cols-1 lg:grid-cols-2 gap-0"
        >
          {/* Right page (first in RTL reading) */}
          <MushafPage pageData={rightPage} position="right" />

          {/* Left page */}
          {leftPageNum ? (
            <MushafPage pageData={leftPage} position="left" />
          ) : (
            <div className="aspect-[9/14] rounded-r-2xl border border-white/[0.03] border-dashed bg-white/[0.01] hidden lg:block" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div dir="rtl" className="flex items-center justify-center gap-6 pt-8 pb-4">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-english text-xs transition-all duration-200 ${
            canGoPrev
              ? "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.05]"
              : "text-gray-800 cursor-not-allowed"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Previous
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-english tabular-nums">
            {rightPageNum}{leftPageNum ? ` – ${leftPageNum}` : ""}
          </span>
          <span className="text-[10px] text-gray-700 font-english">
            / {endPage}
          </span>
        </div>

        <button
          onClick={goNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-english text-xs transition-all duration-200 ${
            canGoNext
              ? "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.05]"
              : "text-gray-800 cursor-not-allowed"
          }`}
        >
          Next
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main SurahView ──────────────────────────────────────────

export default function SurahView({
  verses,
  surahId,
  pageMap = {},
  translationMap = {},
  showBismillah = false,
  surahPages,
}: SurahViewProps) {
  const { fontSize, readingMode } = useSettings();
  const { saveProgress } = useReadingProgress();

  const surahIdNum = surahId ? parseInt(surahId) : undefined;
  const surah = surahIdNum ? surahs.find((s) => s.id === surahIdNum) : undefined;

  // Save surah on mount
  useEffect(() => {
    if (surahIdNum) {
      saveProgress(surahIdNum);
    }
  }, [surahIdNum]);

  // Track scroll position to save verse-level progress (debounced)
  useEffect(() => {
    if (readingMode !== "flow" || !surahIdNum) return;

    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const viewportTop = window.scrollY + window.innerHeight * 0.3;
        let closestVerse = 1;
        for (let i = verses.length; i >= 1; i--) {
          const el = document.getElementById(`verse-${i}`);
          if (el && el.offsetTop <= viewportTop) {
            closestVerse = i;
            break;
          }
        }
        saveProgress(surahIdNum, closestVerse);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [surahIdNum, readingMode, verses.length, saveProgress]);

  return (
    <>
      {readingMode === "spread" && surahPages ? (
        <div className="max-w-[1400px] mx-auto">
          <SpreadView surahPages={surahPages} showBismillah={showBismillah} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <FlowView
            verses={verses}
            pageMap={pageMap}
            fontSize={fontSize}
            translationMap={translationMap}
            surahId={surahIdNum}
            surahName={surah?.name}
            arabicName={surah?.arabic}
          />
        </div>
      )}
      <SettingsDrawer />
    </>
  );
}
