import Link from "next/link";
import React from "react";
const ChaptersList: any = await fetch(
  `https://api.quran.com/api/v4/chapters?language=en`
).then((res) => res.json());

export default function Sidebar() {
  return (
    <aside className="fixed top-18 right-0 w-60 h-[92vh]  overflow-y-scroll border-l border-slate-800 text-gray-400 text-xl hidden md:block font">
      <div>
        <div className="sticky top-0 py-4 pr-14 text-gray-400 font-bold bg-slate-900 border-b border-slate-800 rounded-t text-right">
          <Link href={"/"}>الفهرس</Link>
        </div>
        <div className="text-right mt-2">
          <div className=" flex flex-col">
            {ChaptersList.chapters.map((chapter: any) => (
              <Link
                href={`/${chapter.id}`}
                className="mx-2 my-1 py-2.5 pr-12 pl-4 hover:bg-slate-800 rounded cursor-pointer hover:border-transparent duration-500 transition-all flex justify-between"
              >
                <div>{chapter.id}</div>
                <div>{chapter.name_arabic}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
