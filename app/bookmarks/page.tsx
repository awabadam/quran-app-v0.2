"use client";

import { useBookmarks, Bookmark } from "@/context/BookmarkContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  // Group bookmarks by surah
  const grouped = bookmarks.reduce<Record<number, Bookmark[]>>((acc, b) => {
    if (!acc[b.surahId]) acc[b.surahId] = [];
    acc[b.surahId].push(b);
    return acc;
  }, {});

  // Sort groups by surah ID, verses within each group by verse number
  const sortedGroups = Object.entries(grouped)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, items]) => items.sort((a, b) => a.verseNumber - b.verseNumber));

  return (
    <main className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-semibold font-english text-white mb-1.5">
          Bookmarks
        </h1>
        <p className="text-gray-600 font-english text-sm">
          {bookmarks.length} saved verse{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {sortedGroups.length > 0 ? (
        <div className="space-y-8">
          {sortedGroups.map((group) => {
            const first = group[0];
            return (
              <div key={first.surahId}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-english text-gray-600">{first.surahId}</span>
                  <h2 className="text-sm font-english text-gray-300 font-medium">{first.surahName}</h2>
                  <span dir="rtl" className="text-sm text-gray-500 font-Scheherazade_New">{first.arabicName}</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {group.map((bookmark) => (
                      <motion.div
                        key={`${bookmark.surahId}-${bookmark.verseNumber}`}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <Link
                          href={`/${bookmark.surahId}?verse=${bookmark.verseNumber}`}
                          className="flex items-start gap-3 p-3 rounded-xl
                            bg-white/[0.02] border border-white/[0.05]
                            hover:bg-white/[0.04] hover:border-emerald-500/20
                            transition-all duration-200 group"
                        >
                          <span className="text-xs font-english text-emerald-400 font-medium mt-1 shrink-0">
                            {bookmark.surahId}:{bookmark.verseNumber}
                          </span>
                          <p dir="rtl" className="flex-1 text-gray-300 font-Scheherazade_New text-base leading-loose line-clamp-2">
                            {bookmark.verseText}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeBookmark(bookmark.surahId, bookmark.verseNumber);
                            }}
                            className="shrink-0 mt-1 p-1 rounded-md
                              text-gray-700 hover:text-red-400 hover:bg-red-400/10
                              transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove bookmark"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="w-10 h-10 text-gray-800 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <p className="text-gray-600 font-english text-sm">No bookmarks yet</p>
          <p className="text-xs text-gray-700 font-english mt-1">
            Hover over a verse number while reading to bookmark it
          </p>
        </div>
      )}
    </main>
  );
}
