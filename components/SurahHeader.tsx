"use client";
import ReadingProgressBar from "./ReadingProgressBar";

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
  revelationPlace,
}: SurahHeaderProps) {
  return (
    <>
      <ReadingProgressBar />

      <div className="sticky top-0 z-40 -mx-5 md:-mx-8">
        <div className="h-14" />

        <div className="bg-[hsl(240,6%,7%)] border-b border-white/[0.04] px-5 md:px-8 py-3">
          <div className="flex items-center justify-between gap-3 max-w-[1440px] mx-auto">
            {/* Left: number + name */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20
                flex items-center justify-center text-sm font-semibold text-emerald-400 font-english flex-shrink-0">
                {id}
              </span>
              <h1 dir="rtl" className="font-Scheherazade_New text-xl text-gray-100 leading-tight truncate">
                سورة {nameArabic}
              </h1>
            </div>

            {/* Right: meta */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline text-xs text-gray-400 font-english">
                {nameEnglish}
              </span>
              <span className="hidden sm:inline text-gray-700">&middot;</span>
              <span className="text-xs text-gray-400 font-english">
                {versesCount} ayahs
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
