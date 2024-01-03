import Link from "next/link";
import React from "react";
const ChaptersList: any = await fetch(
  `https://api.quran.com/api/v4/chapters?language=en`
).then((res) => res.json());

export default function Sidebar() {
  return (
    <aside className="fixed top-0 right-0 m-2 w-48 h-[98vh] bg-gray-700 rounded-2xl overflow-y-scroll text-gray-300 text-xl hidden md:block font">
      <div>
        <div className="sticky top-2 py-4 px-8 text-gray-400 font-bold bg-gray-950 m-2 rounded-xl">
          <Link href={"/"}>الفهرس</Link>
        </div>
        <div className="   text-right">
          <div className=" flex flex-col">
            {ChaptersList.chapters.map((chapter: any) => (
              <a
                href={chapter.id}
                className="m-1 py-2.5 px-8 hover:bg-gray-800 rounded-xl cursor-pointer"
              >
                {chapter.name_arabic}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
