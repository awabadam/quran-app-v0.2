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
  const canBookmark = !!(surahId && surahName && arabicName && verseText);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canBookmark) return;

    if (bookmarked) {
      removeBookmark(surahId!, count);
    } else {
      addBookmark({ surahId: surahId!, verseNumber: count, surahName: surahName!, arabicName: arabicName!, verseText: verseText! });
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center mx-1 select-none align-middle
        ${canBookmark ? "cursor-pointer" : ""}
        ${bookmarked ? "text-emerald-400" : "text-emerald-400/70"}`}
      style={{ fontSize: "0.55em" }}
      onClick={canBookmark ? handleClick : undefined}
      title={canBookmark ? (bookmarked ? "Remove bookmark" : "Bookmark this verse") : undefined}
    >
      {bookmarked ? "﴾" : "﴿"}{count}{bookmarked ? "﴿" : "﴾"}
    </span>
  );
}
