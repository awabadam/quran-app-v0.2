import React from "react";
const ChaptersList: any = await fetch(
  `https://api.quran.com/api/v4/chapters?language=en`
).then((res) => res.json());

export default function Sidebar() {
  return (
    <aside className="fixed right-0 w-48 h-[92vh] overflow-y-scroll text-white text-xl">
      <div>
        <div className="sticky top-0 py-4 px-8 bg-gray-700/50 ">الفهرس</div>
        <div className="  bg-gray-700/50 text-right">
          <div className=" flex flex-col">
            {ChaptersList.chapters.map((chapter) => (
              <a
                href={chapter.id}
                className="m-2 py-2.5 px-8 hover:bg-gray-800 rounded cursor-pointer"
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
