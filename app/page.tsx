import Hero from "@/components/Hero";
import SectionDivider from "@/components/SectionDivider";
import FeatureCards from "@/components/FeatureCards";
import SurahBrowser from "@/components/SurahBrowser";

export default async function Home() {
  const [chaptersRes, verseRes] = await Promise.all([
    fetch("https://api.quran.com/api/v4/chapters?language=en", {
      next: { revalidate: 3600 },
    }),
    fetch(
      "https://api.quran.com/api/v4/verses/random?language=en&translations=131&fields=text_uthmani,chapter_id,verse_number,verse_key",
      { next: { revalidate: 86400 } }
    ),
  ]);

  const chaptersData = await chaptersRes.json();
  const verseData = await verseRes.json();
  const dailyVerse = verseData?.verse;

  // Get surah name for the daily verse
  const surahName = dailyVerse
    ? chaptersData.chapters?.find((ch: any) => ch.id === dailyVerse.chapter_id)?.name_simple
    : undefined;

  return (
    <main className="min-h-screen w-full">
      <Hero dailyVerse={dailyVerse} surahName={surahName} />

      <SectionDivider />

      <section id="surahs" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <FeatureCards />
        <SurahBrowser chapters={chaptersData.chapters} />
      </section>
    </main>
  );
}
