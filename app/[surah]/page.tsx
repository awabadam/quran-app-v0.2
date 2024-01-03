export default async function Page({ params }: any) {
  const surah: any = await fetch(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${params.surah}&page=1&per_page=10`
  ).then((res) => res.json());

  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=ar`
  ).then((res) => res.json());

  return (
    <main className="flex justify-center text-gray-300">
      <div className="flex flex-col w-[90vw] lg:w-[40vw] mb-36 leading-loose items-center text-center text-2xl tracking-wider font-Scheherazade_New ">
        <div className="sticky top-24 bg-gray-900 border-2 border-gray-800 rounded-xl w-[40vw] flex p-4 justify-between items-center">
          <h1 className="text-xl"> {surahMeta.chapter.name_arabic}</h1>
          <div className=" text-sm">
            <p>{surahMeta.chapter.id}</p>
            <p>{surahMeta.chapter.verses_count}</p>
          </div>
        </div>
        <div className="mt-4">
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
