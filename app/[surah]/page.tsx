export default async function Page({ params }: any) {
  const surah: any = await fetch(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${params.surah}&page=1&per_page=10`
  ).then((res) => res.json());

  const surahMeta: any = await fetch(
    `https://api.quran.com/api/v4/chapters/${params.surah}?language=ar`
  ).then((res) => res.json());

  return (
    <main className="flex justify-center  text-gray-200">
      <div className="flex flex-col w-[90vw] lg:w-1/3 mb-36 leading-loose items-center text-center text-xl tracking-wider font-Scheherazade_New ">
        <h1 className="text-2xl my-8">سورة {surahMeta.chapter.name_arabic}</h1>
        <p>
          {surah.verses.map((verse: any, index: any) => (
            <>
              {verse.text_uthmani}{" "}
              <span className="border-2 border-gray-200 rounded-full text-base w-10 h-10 mx-0.5 px-3 py-0">
                {index + 1}
              </span>{" "}
            </>
          ))}
        </p>
      </div>
    </main>
  );
}
