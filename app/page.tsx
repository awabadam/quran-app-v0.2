import { Hero } from "@/components";
import SurahsGrid from "@/components/SurahsGrid";

export default async function Home() {
  const ChaptersList: any = await fetch(
    `https://api.quran.com/api/v4/chapters?language=en`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  ).then((res) => res.json());

  return (
    <main className="min-h-screen w-full">
      {/* Hero Section - Full Width */}
      <Hero />
      
      {/* Surahs Section */}
      <section id="surahs" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-english text-gray-100 mb-3">
            Browse <span className="gradient-text">Surahs</span>
          </h2>
          <p className="text-gray-500 font-english">
            Select a surah to start reading
          </p>
        </div>
        
        {/* Animated Surahs Grid */}
        <SurahsGrid chapters={ChaptersList.chapters} />
      </section>
    </main>
  );
}
