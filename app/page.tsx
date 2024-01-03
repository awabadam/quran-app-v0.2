import { ChapterCard } from "@/components/ChapterCard";

export default async function Home() {
  const ChaptersList: any = await fetch(
    `https://api.quran.com/api/v4/chapters?language=en`
  ).then((res) => res.json());

  return (
    <main className="flex flex-col items-center justify-between bg-gray-900">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-[80vw] mt-8">
        {ChaptersList.chapters.map((Chapter: any) => (
          <ChapterCard
            id={Chapter.id}
            arName={Chapter.name_arabic}
            enName={Chapter.name_simple}
            verses={Chapter.verses_count}
            place={Chapter.revelation_place}
          />
        ))}
      </div>
    </main>
  );
}
