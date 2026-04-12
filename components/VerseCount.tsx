"use client";

import { useBookmarks } from "@/context/BookmarkContext";

interface VerseCountProps {
  count: number;
  surahId?: number;
  surahName?: string;
  arabicName?: string;
  verseText?: string;
}

export default function VerseCount({ count, surahId, surahName, arabicName, verseText }: VerseCountProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const bookmarked = surahId ? isBookmarked(surahId, count) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!surahId || !surahName || !arabicName || !verseText) return;

    if (bookmarked) {
      removeBookmark(surahId, count);
    } else {
      addBookmark({ surahId, verseNumber: count, surahName, arabicName, verseText });
    }
  };

  return (
    <span className="inline-flex items-center justify-center mx-1.5 select-none group/verse align-middle">
      <span
        className="inline-flex items-center justify-center text-emerald-400/80 tabular-nums"
        style={{ fontSize: "0.55em" }}
      >
        ﴿{count}﴾
      </span>
      {surahId && (
        <button
          onClick={handleClick}
          className={`ml-1 opacity-0 group-hover/verse:opacity-100 transition-opacity duration-200
            ${bookmarked ? "!opacity-100" : ""}`}
          title={bookmarked ? "Remove bookmark" : "Bookmark verse"}
        >
          <svg
            className={`w-3.5 h-3.5 ${bookmarked ? "text-emerald-400 fill-emerald-400" : "text-gray-600 hover:text-emerald-400"}`}
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </button>
      )}
    </span>
  );
}
