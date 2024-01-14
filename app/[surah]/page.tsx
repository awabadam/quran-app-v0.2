import Bismillah from "@/components/Bismillah";

export default async function Page({ params }: any) {
  const surah: any = await fetch(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${params.surah}`
  ).then((res) => res.json());

  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=ar`
  ).then((res) => res.json());

  return (
    <main className="flex min-h-[91vh] justify-center text-gray-300">
      <div className="flex flex-col w-[90vw] lg:w-[40vw] mb-36 leading-loose items-center justify-center text-center text-2xl tracking-wider font-Scheherazade_New ">
        <div className="sticky z-40 top-2 mt-2 bg-gradient-to-b from-gray-900 to-gray-900 border-2 border-gray-800 rounded-xl w-full flex p-4 justify-between items-center drop-shadow-lg shadow-slate-950">
          <div className="text-gray-500 w-36 flex">
            <p className="text-sm">
              الترتيب{" "}
              <span className="text-lg font-bold">{surahMeta.chapter.id}</span>
            </p>
          </div>
          <div>
            <h1 className="text-lg">سورة {surahMeta.chapter.name_arabic}</h1>
          </div>
          <div className="text-gray-500 w-36 flex justify-end">
            <p className="text-sm">
              عدد الآيات{" "}
              <span className="text-lg font-bold">
                {surahMeta.chapter.verses_count}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 ">
          {surahMeta.chapter.bismillah_pre ? <Bismillah /> : <></>}
          <p>
            {surah.verses.map((verse: any, index: any) => (
              <>
                {verse.text_uthmani}{" "}
                <span className="border-2 text-gray-400 font-extrabold border-gray-700 rounded-full text-base mx-0.5 px-3 py-0">
                  {index + 1}
                </span>{" "}
              </>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
