"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useReadingProgress } from "@/context/ReadingProgressContext";
import { surahs } from "@/lib/surahs";
import { generateVerseShareImage } from "@/lib/shareImage";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("surah");
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  let lastPage = 0;

  const handleShare = async (
    e: React.MouseEvent,
    verseKey: string,
    verseTextUthmani: string
  ) => {
    e.stopPropagation();
    if (sharing) return;
    setSharing(true);
    try {
      const translation = translationMap[verseKey] || "";
      const blob = await generateVerseShareImage({
        verseText: verseTextUthmani,
        translation,
        surahName: surahName || "",
        arabicName: arabicName || "",
        verseKey,
      });
      const file = new File([blob], "verse.png", { type: "image/png" });
      const shareText = `${verseTextUthmani}${translation ? `\n\n\u201C${translation}\u201D` : ""}\n\n\u2014 ${surahName} ${verseKey}`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `verse-${verseKey}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError")
        console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async (
    e: React.MouseEvent,
    verseKey: string,
    verseTextUthmani: string
  ) => {
    e.stopPropagation();
    const translation = translationMap[verseKey] || "";
    const text = `${verseTextUthmani}${translation ? `\n\n${translation}` : ""}\n\n— ${surahName} ${verseKey}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
            {isActive && (
              <span dir="ltr" className="block my-3 mx-1">
                <motion.span
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <button
                    onClick={(e) => handleShare(e, verseKey, verse.text_uthmani)}
                    disabled={sharing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-xs font-english text-[#25D366]
                      hover:bg-[#25D366]/10 active:scale-95
                      transition-all disabled:opacity-50"
                  >
                    {sharing ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    )}
                    {t("share")}
                  </button>
                  <span className="w-px h-4 bg-white/[0.06]" />
                  <button
                    onClick={(e) => handleCopy(e, verseKey, verse.text_uthmani)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-xs font-english text-gray-500
                      hover:bg-white/[0.05] hover:text-white active:scale-95
                      transition-all"
                  >
                    {copied ? (
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    )}
                    {copied ? t("copied") : t("copy")}
                  </button>
                </motion.span>
                {showTranslation && translation && (
                  <span className="block mt-3 text-sm text-gray-400/90 font-english leading-relaxed text-left py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-emerald-400/50 text-xs font-medium mr-2">{index + 1}</span>
                    {translation}
                  </span>
                )}
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
  fontSize,
  showBismillah = false,
}: {
  pageData: PageData | null;
  position: "right" | "left";
  fontSize: number;
  showBismillah?: boolean;
}) {
  const t = useTranslations("surah");
  const roundedClass =
    position === "right" ? "rounded-l-2xl rounded-r-none" : "rounded-r-2xl rounded-l-none";
  const borderClass =
    position === "right" ? "border-r border-white/[0.03]" : "border-l border-white/[0.03]";

  if (!pageData || pageData.loading) {
    return (
      <div className={`min-h-0 bg-[hsl(240,4%,8%)] border border-white/[0.04] flex items-center justify-center ${roundedClass}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-[11px] text-gray-600 font-english">{t("loadingPage")}</span>
        </div>
      </div>
    );
  }

  const { pageNumber, lines } = pageData;
  const allLineNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className={`min-h-0 bg-[hsl(240,4%,8%)] border border-white/[0.04] ${borderClass} flex flex-col py-5 px-5 lg:py-7 lg:px-9 ${roundedClass}`}>
      {/* Page number header */}
      <div className="flex items-center justify-center mb-3 pb-2.5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[11px] font-english text-gray-600 tabular-nums">{pageNumber}</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>
      </div>

      {/* Content — rendered as continuous inline text, same as FlowView */}
      <div className="flex-1 font-Scheherazade_New text-gray-100" dir="rtl"
        style={{
          fontSize: `clamp(14px, 2.2vh, ${fontSize}px)`,
          lineHeight: "2.8",
          wordSpacing: "0.05em",
          textAlign: "justify",
          textAlignLast: "right",
        }}>
        {showBismillah && (
          <div className="flex justify-center pb-4 mb-2">
            <img src="/Bismillah.svg" alt="Bismillah" className="h-10 invert" />
          </div>
        )}
        {allLineNumbers.map((lineNum) => {
          const words = lines.get(lineNum) || [];
          if (words.length === 0) return null;

          return words.map((word, wi) => {
            if (word.char_type_name === "end") {
              const verseNum = parseInt(word.verse_key?.split(":")[1] || "0");
              return (
                <span key={`${word.id}-${wi}`}>
                  {" "}<VerseCount count={verseNum} />{" "}
                </span>
              );
            }
            return (
              <span key={`${word.id}-${wi}`}>
                {word.text}{" "}
              </span>
            );
          });
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
  fontSize,
}: {
  surahPages: [number, number];
  showBismillah?: boolean;
  fontSize: number;
}) {
  const t = useTranslations("surah");
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
          <MushafPage pageData={rightPage} position="right" fontSize={fontSize}
            showBismillah={showBismillah && currentLeft === startPage} />

          {/* Left page */}
          {leftPageNum ? (
            <MushafPage pageData={leftPage} position="left" fontSize={fontSize} />
          ) : (
            <div className="min-h-0 rounded-r-2xl border border-white/[0.03] border-dashed bg-white/[0.01] hidden lg:block" />
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
          {t("previous")}
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
          {t("next")}
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
          <SpreadView surahPages={surahPages} showBismillah={showBismillah} fontSize={fontSize} />
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
