import { Bismillah, SideMenu } from "@/components";
import Link from "next/link";
import React from "react";
import SurahView from "@/components/SurahView";
import SurahHeader from "@/components/SurahHeader";

export async function generateMetadata({ params }: any) {
  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=en`
  ).then((res) => res.json());

  return {
    title: `Surah ${surahMeta.chapter.name_simple} - ${surahMeta.chapter.name_arabic}`,
    description: `Read Surah ${surahMeta.chapter.name_simple} (${surahMeta.chapter.name_arabic}) - ${surahMeta.chapter.verses_count} verses`,
  };
}

export default async function Page({ params }: any) {
  // Fetch verses with Uthmani script
  const surah: any = await fetch(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${params.surah}`,
    { next: { revalidate: 3600 } }
  ).then((res) => res.json());

  // Fetch verse metadata including page numbers
  const versesInfo: any = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${params.surah}?per_page=300`,
    { next: { revalidate: 3600 } }
  ).then((res) => res.json());

  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=ar`,
    { next: { revalidate: 3600 } }
  ).then((res) => res.json());
  
  // Create a map of verse_key to page_number
  const pageMap: { [key: string]: number } = {};
  versesInfo.verses?.forEach((v: any) => {
    pageMap[v.verse_key] = v.page_number;
  });

  return (
    <main className="relative min-h-screen pt-20">
      {/* Side Menu */}
      <SideMenu />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          {/* Surah Header */}
          <SurahHeader 
            id={surahMeta.chapter.id}
            nameArabic={surahMeta.chapter.name_arabic}
            nameEnglish={surahMeta.chapter.name_simple}
            versesCount={surahMeta.chapter.verses_count}
            revelationPlace={surahMeta.chapter.revelation_place}
          />
          
          {/* Bismillah */}
          <div className="mt-4">
            {surahMeta.chapter.bismillah_pre && <Bismillah />}
          </div>
          
          {/* Verses */}
          <div className="mt-4 mb-12">
            <SurahView 
              verses={surah.verses} 
              surahId={params.surah}
              pageMap={pageMap}
              showBismillah={surahMeta.chapter.bismillah_pre}
            />
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-800/50 pt-12 pb-24">
            <div className="flex justify-center gap-4 font-english">
              {Number(params.surah) > 1 && (
                <Link
                  href={`/${Number(params.surah) - 1}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-gray-900/50 border border-gray-800 
                    hover:border-emerald-500/30 hover:bg-gray-800/50
                    text-gray-400 hover:text-emerald-400
                    transition-all duration-300 btn-press"
                >
                  <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Previous</span>
                </Link>
              )}
              
              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-xl
                  bg-gray-900/50 border border-gray-800 
                  hover:border-emerald-500/30 hover:bg-gray-800/50
                  text-gray-400 hover:text-emerald-400
                  transition-all duration-300 btn-press"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>All Surahs</span>
              </Link>
              
              {Number(params.surah) < 114 && (
                <Link
                  href={`/${Number(params.surah) + 1}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-gray-900/50 border border-gray-800 
                    hover:border-emerald-500/30 hover:bg-gray-800/50
                    text-gray-400 hover:text-emerald-400
                    transition-all duration-300 btn-press"
                >
                  <span>Next</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
