"use client";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("surah");
  return (
    <>
      <ReadingProgressBar />

      {/* Non-sticky — scrolls away to maximize reading space.
          Surah name stays visible in the navbar. */}
      <div className="pt-16 pb-4 -mx-5 md:-mx-8 px-5 md:px-8">
        <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20
              flex items-center justify-center text-sm font-bold text-emerald-400 font-english flex-shrink-0">
              {id}
            </span>
            <div className="min-w-0">
              <h1 dir="rtl" className="font-Scheherazade_New text-xl text-white leading-tight truncate">
                {t("surahPrefix")} {nameArabic}
              </h1>
              <p className="text-[11px] text-gray-500 font-english mt-0.5">
                {nameEnglish}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-gray-500 font-english capitalize">
              {revelationPlace === 'makkah' ? t('meccan') : t('medinan')}
            </span>
            <span className="text-gray-700">&middot;</span>
            <span className="text-[11px] text-gray-500 font-english">
              {versesCount} {t('ayahs')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
