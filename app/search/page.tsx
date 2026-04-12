import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search the Quran",
  description: "Search the Holy Quran by translation text",
};

interface SearchResult {
  verse_key: string;
  text: string;
  translations: { text: string; name: string }[];
}

interface SearchResponse {
  search: {
    query: string;
    total_results: number;
    current_page: number;
    total_pages: number;
    results: SearchResult[];
  };
}

async function searchQuran(query: string, page: number): Promise<SearchResponse | null> {
  if (!query) return null;

  const res = await fetch(
    `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=en&size=10&page=${page}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function SearchPage(
  props: {
    searchParams: Promise<{ q?: string; page?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const data = await searchQuran(query, page);

  return (
    <main className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-3xl mx-auto">
      {/* Search input */}
      <form action="/search" method="GET" className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search the Quran..."
            autoFocus
            className="w-full pl-11 pr-4 py-3 rounded-xl
              bg-white/[0.03] border border-white/[0.06]
              text-gray-100 placeholder-gray-600 font-english text-sm
              focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05]
              transition-all duration-200"
          />
        </div>
      </form>

      {/* Results */}
      {data && data.search.total_results > 0 && (
        <>
          <p className="text-xs text-gray-600 font-english mb-6">
            {data.search.total_results} results for &ldquo;{query}&rdquo;
          </p>

          <div className="space-y-4">
            {data.search.results.map((result) => {
              const [surahId, verseNum] = result.verse_key.split(":");
              const translationHtml = result.translations[0]?.text || "";

              return (
                <Link
                  key={result.verse_key}
                  href={`/${surahId}?verse=${verseNum}`}
                  className="block p-4 rounded-xl
                    bg-white/[0.02] border border-white/[0.05]
                    hover:bg-white/[0.04] hover:border-emerald-500/20
                    transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-english text-emerald-400 font-medium">
                      {result.verse_key}
                    </span>
                  </div>
                  <p dir="rtl" className="text-gray-200 font-Scheherazade_New text-lg leading-loose mb-2">
                    {result.text}
                  </p>
                  <p
                    className="text-sm text-gray-500 font-english leading-relaxed
                      [&>em]:text-emerald-400 [&>em]:not-italic [&>em]:font-medium"
                    dangerouslySetInnerHTML={{ __html: translationHtml }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {data.search.total_pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10 font-english">
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                  className="px-4 py-2 rounded-full text-sm
                    bg-white/[0.04] border border-white/[0.06]
                    text-gray-300 hover:text-white hover:border-white/[0.1]
                    transition-all duration-200"
                >
                  Previous
                </Link>
              )}
              <span className="text-sm text-gray-600">
                Page {page} of {data.search.total_pages}
              </span>
              {page < data.search.total_pages && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                  className="px-4 py-2 rounded-full text-sm
                    bg-white/[0.04] border border-white/[0.06]
                    text-gray-300 hover:text-white hover:border-white/[0.1]
                    transition-all duration-200"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {/* No results */}
      {data && data.search.total_results === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-600 font-english text-sm">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-gray-700 font-english mt-1">
            Try searching in English (e.g. &ldquo;mercy&rdquo;, &ldquo;patience&rdquo;)
          </p>
        </div>
      )}

      {/* Empty state */}
      {!query && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-english text-sm">
            Search the Quran by English translation
          </p>
        </div>
      )}
    </main>
  );
}
