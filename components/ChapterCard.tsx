import Link from "next/link";

export function ChapterCard({ id, arName, enName, verses, place }: any) {
  return (
    <Link
      href={`/${id}`}
      className="h-full w-full p-4 bg-gray-800 rounded-lg text-white"
    >
      <div className="bg-gray-600 rounded-lg h-48 flex justify-center items-center text-2xl font-arabic">
        {arName}
      </div>
      <div className="font-english p-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg">{enName}</h3> <p>{verses} Ayah</p>
        </div>
        <div className="flex items-center justify-between">
          <p>#{id}</p>
          <p>{place}</p>
        </div>
      </div>
    </Link>
  );
}
