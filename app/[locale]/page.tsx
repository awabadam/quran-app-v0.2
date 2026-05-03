import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import SurahBrowser from "@/components/SurahBrowser";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const [chaptersRes, verseRes, juzRes] = await Promise.all([
    fetch("https://api.quran.com/api/v4/chapters?language=en", {
      next: { revalidate: 3600 },
    }),
    fetch(
      "https://api.quran.com/api/v4/verses/random?language=en&translations=20&fields=text_uthmani,chapter_id,verse_number,verse_key",
      { next: { revalidate: 86400 } }
    ),
    fetch("https://api.quran.com/api/v4/juzs", {
      next: { revalidate: 86400 },
    }),
  ]);

  const chaptersData = await chaptersRes.json();
  const verseData = await verseRes.json();
  const dailyVerse = verseData?.verse;

  const juzData = await juzRes.json();

  const surahName = dailyVerse
    ? chaptersData.chapters?.find((ch: any) => ch.id === dailyVerse.chapter_id)?.name_simple
    : undefined;

  return (
    <main className="min-h-screen w-full pt-16">
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10 space-y-4 md:space-y-6">
        {/* Verse of the Day — top, full width */}
        <Hero dailyVerse={dailyVerse} surahName={surahName} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/bookmarks"
            className="flex items-center gap-3 p-3.5 rounded-xl
              bg-white/[0.03] border border-white/[0.05]
              hover:bg-white/[0.05] hover:border-emerald-500/20
              transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15
              flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400 font-english group-hover:text-white transition-colors">{t('bookmarks')}</span>
          </Link>
          <Link
            href="/athkar"
            className="flex items-center gap-3 p-3.5 rounded-xl
              bg-white/[0.03] border border-white/[0.05]
              hover:bg-white/[0.05] hover:border-emerald-500/20
              transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15
              flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400 font-english group-hover:text-white transition-colors">{t('athkar')}</span>
          </Link>
        </div>

        {/* Continue Reading — highlighted, most-used action */}
        <FeatureCards />
      </section>

      {/* Surah/Juz Browser — main content */}
      <section id="surahs" className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-12 md:pb-20">
        <SurahBrowser chapters={chaptersData.chapters ?? []} juzs={juzData.juzs ?? []} />
      </section>
    </main>
  );
}
