"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Bookmark {
  surahId: number;
  verseNumber: number;
  surahName: string;
  arabicName: string;
  verseText: string;
  timestamp: number;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "timestamp">) => void;
  removeBookmark: (surahId: number, verseNumber: number) => void;
  isBookmarked: (surahId: number, verseNumber: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEY = "quran-bookmarks";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks:", e);
      }
    }
  }, []);

  const addBookmark = useCallback(
    (bookmark: Omit<Bookmark, "timestamp">) => {
      setBookmarks((prev) => {
        const exists = prev.some(
          (b) => b.surahId === bookmark.surahId && b.verseNumber === bookmark.verseNumber
        );
        if (exists) return prev;
        const updated = [...prev, { ...bookmark, timestamp: Date.now() }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const removeBookmark = useCallback(
    (surahId: number, verseNumber: number) => {
      setBookmarks((prev) => {
        const updated = prev.filter(
          (b) => !(b.surahId === surahId && b.verseNumber === verseNumber)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const isBookmarked = useCallback(
    (surahId: number, verseNumber: number) => {
      return bookmarks.some(
        (b) => b.surahId === surahId && b.verseNumber === verseNumber
      );
    },
    [bookmarks]
  );

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
