import Link from "next/link";

export function ChapterCard({ id, arName, enName, verses, place }: any) {
  return (
    <Link
      href={`/${id}`}
      scroll={false}
      className="h-full flex flex-col w-full p-2 md:p-4 pb-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-gray-700 text-gray-500 transition-all duration-700 ease-in-out  hover:border-gray-600 hover:shadow-lg hover:shadow-black/50 hover:brightness-125"
    >
      <div className="bg-gray-900 rounded text-gray-500 border-gray-700 border md:h-36 flex md:flex-col md:justify-center justify-between items-center  w-full gap-4 hover:text-gray-300 transition-all duration-300 ease-in-out hover:text-[38px] p-2 ">
        <div className="font-arabic text-2xl md:text-3xl"> سورة {arName}</div>
        <div>
          <h3 className="font-base text-xs font-english">Surah {enName}</h3>
        </div>
      </div>
      <div className="font-english w-full text-gray-600 px-2 py-1 flex flex-col gap-2 md:text-sm text-xs text-center">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <p>#{id}</p>
            <p>{place}</p>
          </div>
          <p>
            Verses <span className="font-semibold">{verses}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
