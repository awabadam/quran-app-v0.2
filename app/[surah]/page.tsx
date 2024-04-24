import { Bismillah, SideMenu, VerseCount } from "@/components";
import Link from "next/link";
import React from "react";

export default async function Page({ params }: any) {
  const surah: any = await fetch(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${params.surah}`
  ).then((res) => res.json());

  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=ar`
  ).then((res) => res.json());

  return (
    <main className="flex min-h-[91vh] justify-center text-gray-300">
      <SideMenu />
      <div className="flex flex-col w-[95vw] lg:w-[40vw] mb-12 leading-loose md:leading-loose items-center justify-center text-center  text-lg md:text-2xl tracking-wider font-Scheherazade_New ">
        <div className="sticky z-40 top-2 mt-2 w-full bg-gray-900 border border-gray-800 rounded flex p-4 justify-center items-center ">
          <div className="text-gray-500 text-sm w-full">
            <p className="">
              الترتيب{" "}
              <span className="text-lg font-bold">{surahMeta.chapter.id}</span>
            </p>
          </div>
          <div className=" w-full">
            <h1 className="text-lg">سورة {surahMeta.chapter.name_arabic}</h1>
          </div>
          <div className="text-gray-500 w-full text-xs">
            <p className="">
              عدد الآيات{" "}
              <span className="text-lg font-bold">
                {surahMeta.chapter.verses_count}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-8">
          {surahMeta.chapter.bismillah_pre ? <Bismillah /> : <></>}
          <p className="">
            {surah.verses.map((verse: any, index: any) => (
              <span key={index} className="hover:bg-black/30 group">
                {verse.text_uthmani} <VerseCount count={index + 1} />{" "}
                {verse.page_number}
              </span>
            ))}
          </p>
        </div>
        <hr className="border w-full mt-12 border-slate-800" />
        <div className="text-sm m-4 rounded-lg flex gap-4 mt-12">
          {params.surah <= 1 ? (
            <></>
          ) : (
            <Link
              className="border border-slate-700 p-4 rounded-lg text-slate-300 hover:bg-slate-900"
              href={`${encodeURIComponent(Number(params.surah) - 1)}`}
            >
              السورة السابقة
            </Link>
          )}
          {params.surah >= 114 ? (
            <></>
          ) : (
            <Link
              className="border border-slate-700 p-4 rounded-lg text-slate-300 hover:bg-slate-900"
              href={`${encodeURIComponent(Number(params.surah) + 1)}`}
            >
              السورة القادمة
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
