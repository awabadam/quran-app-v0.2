import Link from "next/link";
import React from "react";
const ChaptersList: any = await fetch(
  `https://api.quran.com/api/v4/chapters?language=en`,
  { cache: "force-cache", next: { revalidate: false } }
).then((res) => res.json());

export default function Sidebar() {
  return (
    <aside className="fixed top-18 right-0 w-72 h-[92vh] bg-slate-950/10 overflow-y-scroll border-l border-slate-800 text-gray-400 text-xl hidden md:block font">
      <div>
        <div className="sticky top-0 py-4 pr-14 text-gray-400 bg-slate-900 border-b border-slate-800 rounded-t text-right">
          <Link href={"/"}>السورة</Link>
        </div>
        <div className="text-right mt-2">
          <div className=" flex flex-col">
            {ChaptersList.chapters.map((chapter: any) => (
              <Link
                href={`/${chapter.id}`}
                className=" w-full cursor-pointer flex flex-col justify-center items-center"
              >
                <div className="flex ml-4 justify-between rounded w-full pr-16 pl-4 duration-500 transition-all py-2.5 hover:bg-slate-800 text-slate-500 hover:text-slate-300">
                  <div className="text-slate-600 ml-2">{chapter.id}</div>
                  <div className="">سورة {chapter.name_arabic}</div>
                </div>
                <hr className="my-2 ml-4 border-0.5 w-full border-slate-800/50 " />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
