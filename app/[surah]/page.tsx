import { Bismillah, SideMenu } from "@/components";
import Link from "next/link";
import React, { Suspense } from "react";
import SurahView from "@/components/SurahView";
import SurahHeader from "@/components/SurahHeader";
import VerseHighlighter from "./VerseHighlighter";

export async function generateMetadata(props: any) {
  const params = await props.params;
  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=en`
  ).then((res) => res.json());

  return {
    title: `Surah ${surahMeta.chapter.name_simple} - ${surahMeta.chapter.name_arabic}`,
    description: `Read Surah ${surahMeta.chapter.name_simple} (${surahMeta.chapter.name_arabic}) - ${surahMeta.chapter.verses_count} verses`,
  };
}

export default async function Page(props: any) {
  const params = await props.params;
  const [surah, versesInfo, surahMeta, translationsData] = await Promise.all([
    fetch(
      `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${params.surah}`,
      { next: { revalidate: 3600 } }
    ).then((res) => res.json()),
    fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${params.surah}?per_page=300`,
      { next: { revalidate: 3600 } }
    ).then((res) => res.json()),
    fetch(
      `https://api.quran.com/api/v4/chapters/${params.surah}?language=ar`,
      { next: { revalidate: 3600 } }
    ).then((res) => res.json()),
    fetch(
      `https://api.quran.com/api/v4/quran/translations/20?chapter_number=${params.surah}`,
      { next: { revalidate: 3600 } }
    ).then((res) => res.json()),
  ]);

  const pageMap: { [key: string]: number } = {};
  versesInfo.verses?.forEach((v: any) => {
    pageMap[v.verse_key] = v.page_number;
  });

  const translationMap: { [key: string]: string } = {};
  translationsData.translations?.forEach((t: any) => {
    translationMap[t.verse_key] = t.text?.replace(/<[^>]*>/g, "") || "";
  });

  const surahNum = Number(params.surah);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <SideMenu />
      <Suspense fallback={null}>
        <VerseHighlighter />
      </Suspense>

      {/* Header — always constrained */}
      <div className="px-5 md:px-8 max-w-[1440px] mx-auto">
        <SurahHeader
          id={surahMeta.chapter.id}
          nameArabic={surahMeta.chapter.name_arabic}
          nameEnglish={surahMeta.chapter.name_simple}
          versesCount={surahMeta.chapter.verses_count}
          revelationPlace={surahMeta.chapter.revelation_place}
        />
      </div>

      {/* Bismillah — constrained */}
      {surahMeta.chapter.bismillah_pre && (
        <div className="max-w-4xl mx-auto px-5 md:px-8 mt-2">
          <Bismillah />
        </div>
      )}

      {/*
        SurahView handles its own width:
        - Flow view: narrow column (max-w-3xl) for comfortable reading
        - Spread view: wide (max-w-7xl) for two-page mushaf layout
        The component itself wraps content in the appropriate container.
      */}
      <div className="px-5 md:px-8 mt-2 mb-12">
        <SurahView
          verses={surah.verses}
          surahId={params.surah}
          pageMap={pageMap}
          translationMap={translationMap}
          showBismillah={surahMeta.chapter.bismillah_pre}
          surahPages={surahMeta.chapter.pages as [number, number]}
        />
      </div>

      {/* Navigation — constrained */}
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="border-t border-white/[0.04] pt-10 pb-24">
          <div className="flex justify-between items-center font-english">
            {surahNum > 1 ? (
              <Link
                href={`/${surahNum - 1}`}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-white/[0.03] border border-white/[0.05]
                  hover:bg-white/[0.06] hover:border-white/[0.08]
                  text-gray-400 hover:text-white
                  transition-all duration-200"
              >
                <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Previous
              </Link>
            ) : <div />}

            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              All Surahs
            </Link>

            {surahNum < 114 ? (
              <Link
                href={`/${surahNum + 1}`}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-white/[0.03] border border-white/[0.05]
                  hover:bg-white/[0.06] hover:border-white/[0.08]
                  text-gray-400 hover:text-white
                  transition-all duration-200"
              >
                Next
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </main>
  );
}
