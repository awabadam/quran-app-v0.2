import Link from "next/link";

export function ChapterCard({ id, arName, enName, verses, place }: any) {
  return (
    <Link
      href={`/${id}`}
      className="h-full w-full p-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-800 text-gray-500"
    >
      <div className="bg-gray-900 rounded-lg text-gray-500 border-gray-700 border-2 h-48 flex justify-center items-center text-4xl font-arabic">
        سورة {arName}
      </div>
      <div className="font-english p-2 text-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{enName}</h3>{" "}
          <p>
            {" "}
            <span className="font-semibold">{verses}</span> verses
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p>#{id}</p>
          <p>{place}</p>
        </div>
      </div>
    </Link>
  );
}
