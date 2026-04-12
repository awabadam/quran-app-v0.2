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
        {/* Spacer for fixed navbar */}
        <div className="h-14" />

        <div className="bg-[hsl(240,6%,7%)]/95 backdrop-blur-xl border-b border-white/[0.06] px-5 md:px-8 py-3">
          <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
            {/* Left: number + Arabic name */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                flex items-center justify-center text-sm font-bold text-emerald-400 font-english flex-shrink-0">
                {id}
              </span>
              <div className="min-w-0">
                <h1 dir="rtl" className="font-Scheherazade_New text-xl text-white leading-tight truncate">
                  سورة {nameArabic}
                </h1>
                <p className="text-[11px] text-gray-500 font-english mt-0.5">
                  {nameEnglish}
                </p>
              </div>
            </div>

            {/* Right: meta */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] text-gray-500 font-english capitalize">
                {revelationPlace}
              </span>
              <span className="text-gray-700">&middot;</span>
              <span className="text-[11px] text-gray-500 font-english">
                {versesCount} ayahs
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
