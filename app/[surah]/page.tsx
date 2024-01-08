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
        <div className="sticky top-2 bg-gradient-to-b from-gray-900 to-gray-900 border-2 border-gray-800 rounded-xl w-full flex p-4 justify-between items-center">
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

        <div className="mt-4">
          <h2 className="my-4">بسم الله الرحمن الرحيم</h2>
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
