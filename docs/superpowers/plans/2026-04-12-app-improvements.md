# Quran App Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bookmarks with verse-level progress, full-text Quran search, Juz navigation, and PWA installability to the Quran app.

**Architecture:** All state is localStorage-backed (no backend). Search and Juz data come from Quran.com API v4 via server components. PWA uses next-pwa with Workbox for app shell caching. Features share a `?verse=N` deep-linking mechanism on the surah page.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Quran.com API v4, next-pwa, Headless UI, Framer Motion

---

## File Map

**New files:**
- `context/BookmarkContext.tsx` — Bookmark state + localStorage persistence
- `app/bookmarks/page.tsx` — Bookmarks listing page
- `app/search/page.tsx` — Quran text search results page
- `components/JuzCard.tsx` — Card component for Juz grid
- `public/manifest.json` — PWA manifest
- `public/offline.html` — Offline fallback page
- `public/icons/icon-192x192.png` — PWA icon
- `public/icons/icon-512x512.png` — PWA icon

**Modified files:**
- `app/[surah]/page.tsx` — Add `?verse=N` deep-link scrolling
- `app/page.tsx` — Fetch Juz data, pass to SurahBrowser
- `app/layout.tsx` — Add BookmarkProvider, PWA meta tags
- `components/SurahView.tsx` — Track verse-level scroll position, pass verse text to bookmark
- `components/VerseCount.tsx` — Add bookmark toggle icon
- `components/ContinueReading.tsx` — Show verse number in display
- `components/CommandPalette.tsx` — Add "Search Quran" fallback action
- `components/SurahBrowser.tsx` — Add Surahs/Juz tab toggle
- `components/SideMenu.tsx` — Add Juz tab in sidebar
- `components/Navbar.tsx` — Add bookmarks nav link
- `context/ReadingProgressContext.tsx` — Add verseNumber to progress
- `package.json` — Add next-pwa dependency
- `next.config.js` — Wrap with next-pwa

---

## Task 1: Verse Deep-Linking on Surah Page

Search, Juz, and Bookmarks all navigate to `/{surahId}?verse=N`. Build this foundation first.

**Files:**
- Modify: `app/[surah]/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add searchParams to the surah page and a client wrapper for scroll**

In `app/[surah]/page.tsx`, the page component needs to accept `searchParams` and pass the verse number to a client component that handles scrolling. Add a `VerseHighlighter` client component inline at the bottom of the file.

Replace the `Page` function signature and add the client component:

```tsx
// At the top of file, add:
import VerseHighlighter from "./VerseHighlighter";
```

Create `app/[surah]/VerseHighlighter.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerseHighlighter() {
  const searchParams = useSearchParams();
  const verse = searchParams.get("verse");

  useEffect(() => {
    if (!verse) return;

    // Small delay to let the page render
    const timeout = setTimeout(() => {
      const el = document.getElementById(`verse-${verse}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("verse-highlight");
        setTimeout(() => el.classList.remove("verse-highlight"), 2000);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [verse]);

  return null;
}
```

Add `<VerseHighlighter />` inside the `<main>` tag in the surah page, after `<SideMenu />`.

- [ ] **Step 2: Add verse IDs to FlowView spans**

In `components/SurahView.tsx`, in the `FlowView` component, add an `id` attribute to each verse's outer `<span>`. At line 66, the existing code is:

```tsx
<span key={verseKey}>
```

Change to:

```tsx
<span key={verseKey} id={`verse-${index + 1}`}>
```

- [ ] **Step 3: Add highlight animation to globals.css**

In `app/globals.css`, add inside the `@layer utilities` section:

```css
.verse-highlight {
  animation: verseHighlight 2s ease-out;
}

@keyframes verseHighlight {
  0% { background-color: rgba(16, 185, 129, 0.15); border-radius: 0.375rem; }
  100% { background-color: transparent; }
}
```

- [ ] **Step 4: Verify deep-linking works**

Run: `npm run dev`

Navigate to `http://localhost:3000/2?verse=255`. The page should scroll to verse 255 (Ayat al-Kursi) and briefly highlight it with an emerald glow that fades over 2 seconds.

- [ ] **Step 5: Commit**

```bash
git add app/[surah]/VerseHighlighter.tsx app/[surah]/page.tsx components/SurahView.tsx app/globals.css
git commit -m "feat: add ?verse=N deep-linking with scroll and highlight animation"
```

---

## Task 2: Quran Text Search Page

**Files:**
- Create: `app/search/page.tsx`
- Modify: `components/CommandPalette.tsx`

- [ ] **Step 1: Create the search results page**

Create `app/search/page.tsx`:

```tsx
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
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
```

- [ ] **Step 2: Add "Search Quran" fallback to CommandPalette**

In `components/CommandPalette.tsx`, replace the "No surah found" empty state (lines 102-104) with a clickable action that navigates to the search page:

Replace:
```tsx
{query !== "" && filteredSurahs.length === 0 && (
  <p className="p-6 text-sm text-gray-600 text-center font-english">No surah found.</p>
)}
```

With:
```tsx
{query !== "" && filteredSurahs.length === 0 && (
  <button
    onClick={() => {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }}
    className="w-full p-4 text-left hover:bg-white/[0.04] transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg
        bg-emerald-500/10 text-emerald-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm text-gray-200 font-english">
          Search Quran for &ldquo;{query}&rdquo;
        </p>
        <p className="text-xs text-gray-600 font-english">
          Search in English translations
        </p>
      </div>
    </div>
  </button>
)}
```

- [ ] **Step 3: Verify search flow**

Run: `npm run dev`

1. Press Cmd+K, type "mercy", see "Search Quran for 'mercy'" appear. Click it.
2. Should navigate to `/search?q=mercy` and show ~10 results with highlighted matches.
3. Click a result (e.g. "7:151") — should navigate to the surah page and scroll to that verse.
4. Test pagination: navigate to `/search?q=god&page=2` — should show page 2 results.

- [ ] **Step 4: Commit**

```bash
git add app/search/page.tsx components/CommandPalette.tsx
git commit -m "feat: add Quran text search with results page and CommandPalette integration"
```

---

## Task 3: Bookmark Context

**Files:**
- Create: `context/BookmarkContext.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create BookmarkContext**

Create `context/BookmarkContext.tsx`:

```tsx
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

  const persist = (updated: Bookmark[]) => {
    setBookmarks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

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
```

- [ ] **Step 2: Wrap app with BookmarkProvider**

In `app/layout.tsx`, add the import and wrap children:

Add import at top:
```tsx
import { BookmarkProvider } from "@/context/BookmarkContext";
```

Wrap inside the existing `<SettingsProvider>` (after its opening tag, before `<ReadingNavProvider>`):

```tsx
<SettingsProvider>
  <BookmarkProvider>
    <ReadingNavProvider>
      ...
    </ReadingNavProvider>
  </BookmarkProvider>
</SettingsProvider>
```

- [ ] **Step 3: Verify context loads without errors**

Run: `npm run dev`

Navigate to `http://localhost:3000`. Open browser console — no errors. Open Application tab in DevTools — `quran-bookmarks` key should not exist yet (empty state is fine).

- [ ] **Step 4: Commit**

```bash
git add context/BookmarkContext.tsx app/layout.tsx
git commit -m "feat: add BookmarkContext with localStorage persistence"
```

---

## Task 4: Bookmark Toggle on Verses

**Files:**
- Modify: `components/VerseCount.tsx`
- Modify: `components/SurahView.tsx`

- [ ] **Step 1: Add bookmark toggle to VerseCount**

Replace the entire content of `components/VerseCount.tsx`:

```tsx
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
    <span className="inline-flex items-center justify-center mx-1 select-none group/verse">
      <span className="text-sm font-english text-emerald-400 tabular-nums">
        ﴿{count}﴾
      </span>
      {surahId && (
        <button
          onClick={handleClick}
          className={`ml-0.5 opacity-0 group-hover/verse:opacity-100 transition-opacity duration-200
            ${bookmarked ? "!opacity-100" : ""}`}
          title={bookmarked ? "Remove bookmark" : "Bookmark verse"}
        >
          <svg
            className={`w-3 h-3 ${bookmarked ? "text-emerald-400 fill-emerald-400" : "text-gray-600 hover:text-emerald-400"}`}
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
```

- [ ] **Step 2: Pass surah context and verse text to VerseCount in FlowView**

In `components/SurahView.tsx`, the `FlowView` component needs surah info. Add props to `FlowView`:

Update FlowView's props type and signature (around line 32):

```tsx
function FlowView({
  verses,
  pageMap,
  fontSize,
  translationMap,
  surahId,
  surahName,
  arabicName,
}: {
  verses: any[];
  pageMap: { [key: string]: number };
  fontSize: number;
  translationMap: { [key: string]: string };
  surahId?: number;
  surahName?: string;
  arabicName?: string;
}) {
```

Then update the `<VerseCount>` usage inside FlowView (around line 74):

Replace:
```tsx
<VerseCount count={index + 1} />{" "}
```

With:
```tsx
<VerseCount
  count={index + 1}
  surahId={surahId}
  surahName={surahName}
  arabicName={arabicName}
  verseText={verse.text_uthmani}
/>{" "}
```

Then update the `SurahView` component to pass these props to FlowView. First, add an import and resolve the surah info. In the main `SurahView` component (around line 357), add surah resolution:

```tsx
export default function SurahView({
  verses,
  surahId,
  pageMap = {},
  translationMap = {},
  showBismillah = false,
  surahPages,
}: SurahViewProps) {
  const { fontSize, readingMode } = useSettings();
  const surahIdNum = surahId ? parseInt(surahId) : undefined;
  const surah = surahIdNum ? surahs.find((s) => s.id === surahIdNum) : undefined;
```

Then update the `<FlowView>` usage:

Replace:
```tsx
<FlowView verses={verses} pageMap={pageMap} fontSize={fontSize} translationMap={translationMap} />
```

With:
```tsx
<FlowView
  verses={verses}
  pageMap={pageMap}
  fontSize={fontSize}
  translationMap={translationMap}
  surahId={surahIdNum}
  surahName={surah?.name}
  arabicName={surah?.arabic}
/>
```

- [ ] **Step 3: Verify bookmarking works**

Run: `npm run dev`

Navigate to any surah (e.g. `/2`). Hover over a verse number — a small bookmark icon should appear. Click it — it should fill in (emerald). Open DevTools Application tab — `quran-bookmarks` should contain the bookmark entry with `verseText`. Click again to unbookmark.

- [ ] **Step 4: Commit**

```bash
git add components/VerseCount.tsx components/SurahView.tsx
git commit -m "feat: add bookmark toggle on verse numbers in FlowView"
```

---

## Task 5: Verse-Level Reading Progress

**Files:**
- Modify: `context/ReadingProgressContext.tsx`
- Modify: `components/SurahView.tsx`
- Modify: `components/ContinueReading.tsx`

- [ ] **Step 1: Extend ReadingProgress to include verseNumber**

In `context/ReadingProgressContext.tsx`, update the interface and `saveProgress`:

Replace the `ReadingProgress` interface (lines 5-10):
```tsx
interface ReadingProgress {
  surahId: number;
  surahName: string;
  surahArabic: string;
  verseNumber: number;
  timestamp: string;
}
```

Replace the `ReadingProgressContextType` interface (lines 12-16):
```tsx
interface ReadingProgressContextType {
  lastRead: ReadingProgress | null;
  saveProgress: (surahId: number, verseNumber?: number) => void;
  clearProgress: () => void;
}
```

Replace the `saveProgress` function (lines 35-47):
```tsx
const saveProgress = (surahId: number, verseNumber?: number) => {
  const surah = surahs.find(s => s.id === surahId);
  if (surah) {
    const progress: ReadingProgress = {
      surahId: surah.id,
      surahName: surah.name,
      surahArabic: surah.arabic,
      verseNumber: verseNumber || lastRead?.verseNumber || 1,
      timestamp: new Date().toISOString(),
    };
    setLastRead(progress);
    localStorage.setItem('readingProgress', JSON.stringify(progress));
  }
};
```

- [ ] **Step 2: Track scroll position in SurahView**

In `components/SurahView.tsx`, replace the existing `useEffect` that saves reading progress (lines 367-383) with a version that also tracks verse-level scrolling:

```tsx
// Import useReadingProgress at the top of the file:
import { useReadingProgress } from "@/context/ReadingProgressContext";
```

Then in the `SurahView` component, replace the localStorage useEffect:

```tsx
const { saveProgress } = useReadingProgress();

// Save surah on mount
useEffect(() => {
  if (surahIdNum) {
    saveProgress(surahIdNum);
  }
}, [surahIdNum]);

// Track scroll position to save verse-level progress (debounced)
useEffect(() => {
  if (readingMode !== "flow" || !surahIdNum) return;

  let timeout: NodeJS.Timeout;
  const handleScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Find the verse element closest to the top of the viewport
      const viewportTop = window.scrollY + window.innerHeight * 0.3;
      let closestVerse = 1;
      for (let i = verses.length; i >= 1; i--) {
        const el = document.getElementById(`verse-${i}`);
        if (el && el.offsetTop <= viewportTop) {
          closestVerse = i;
          break;
        }
      }
      saveProgress(surahIdNum, closestVerse);
    }, 1000);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => {
    clearTimeout(timeout);
    window.removeEventListener("scroll", handleScroll);
  };
}, [surahIdNum, readingMode, verses.length, saveProgress]);
```

Remove the old `localStorage.setItem("readingProgress", ...)` block that was directly writing to localStorage.

- [ ] **Step 3: Update ContinueReading to show verse number**

In `components/ContinueReading.tsx`, update the link and display to include verse number.

Update the `ReadingProgress` interface (lines 7-12):
```tsx
interface ReadingProgress {
  surahId: number;
  surahName: string;
  surahArabic: string;
  verseNumber?: number;
  timestamp: string;
}
```

Update the Link href (line 56):
```tsx
<Link href={`/${lastRead.surahId}${lastRead.verseNumber ? `?verse=${lastRead.verseNumber}` : ''}`}>
```

Update the surah name display (lines 81-83):
```tsx
<p className="text-sm text-gray-200 font-english truncate group-hover:text-white transition-colors">
  {lastRead.surahName}{lastRead.verseNumber ? `, Verse ${lastRead.verseNumber}` : ''}
</p>
```

- [ ] **Step 4: Verify verse-level progress tracking**

Run: `npm run dev`

1. Navigate to `/2`. Scroll down several verses.
2. Go back to home page — ContinueReading widget should show "Al-Baqarah, Verse X" where X is approximately where you scrolled to.
3. Click the ContinueReading link — should navigate to `/2?verse=X` and scroll to that verse.

- [ ] **Step 5: Commit**

```bash
git add context/ReadingProgressContext.tsx components/SurahView.tsx components/ContinueReading.tsx
git commit -m "feat: track and display verse-level reading progress"
```

---

## Task 6: Bookmarks Page

**Files:**
- Create: `app/bookmarks/page.tsx`
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Create the bookmarks page**

Create `app/bookmarks/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Add bookmarks link to Navbar**

In `components/Navbar.tsx`, add a Bookmarks entry to the `navLinks` array (after the Home entry, around line 45):

```tsx
{ href: "/bookmarks", label: "Bookmarks", icon: (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
)},
```

- [ ] **Step 3: Verify bookmarks page**

Run: `npm run dev`

1. Navigate to a surah, bookmark 2-3 verses.
2. Click "Bookmarks" in the navbar — should see bookmarks grouped by surah.
3. Click a bookmark — should navigate to the verse and highlight it.
4. Hover a bookmark and click the X to remove it — should animate out.

- [ ] **Step 4: Commit**

```bash
git add app/bookmarks/page.tsx components/Navbar.tsx
git commit -m "feat: add bookmarks page with grouped display and navbar link"
```

---

## Task 7: Juz Navigation

**Files:**
- Create: `components/JuzCard.tsx`
- Modify: `app/page.tsx`
- Modify: `components/SurahBrowser.tsx`
- Modify: `components/SideMenu.tsx`

- [ ] **Step 1: Create JuzCard component**

Create `components/JuzCard.tsx`:

```tsx
import Link from "next/link";

interface JuzCardProps {
  juzNumber: number;
  versesCount: number;
  surahRange: string;
  firstSurahId: number;
  firstVerse: number;
}

export default function JuzCard({ juzNumber, versesCount, surahRange, firstSurahId, firstVerse }: JuzCardProps) {
  return (
    <Link href={`/${firstSurahId}?verse=${firstVerse}`}>
      <div className="group p-4 rounded-2xl
        bg-white/[0.02] border border-white/[0.05]
        hover:bg-white/[0.04] hover:border-emerald-500/20
        transition-all duration-200"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg
            bg-emerald-500/10 text-emerald-400 text-xs font-english font-semibold
            group-hover:bg-emerald-500/20 transition-colors">
            {juzNumber}
          </div>
          <div>
            <p className="text-sm text-gray-200 font-english font-medium group-hover:text-white transition-colors">
              Juz {juzNumber}
            </p>
            <p className="text-xs text-gray-600 font-english">
              {versesCount} verses
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-english truncate">
          {surahRange}
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Fetch Juz data on home page**

In `app/page.tsx`, add the Juz fetch to the existing `Promise.all`:

Replace lines 7-15:
```tsx
const [chaptersRes, verseRes, juzRes] = await Promise.all([
  fetch("https://api.quran.com/api/v4/chapters?language=en", {
    next: { revalidate: 3600 },
  }),
  fetch(
    "https://api.quran.com/api/v4/verses/random?language=en&translations=131&fields=text_uthmani,chapter_id,verse_number,verse_key",
    { next: { revalidate: 86400 } }
  ),
  fetch("https://api.quran.com/api/v4/juzs", {
    next: { revalidate: 86400 },
  }),
]);
```

Add after `const dailyVerse = verseData?.verse;`:
```tsx
const juzData = await juzRes.json();
```

Update the `<SurahBrowser>` component to pass juz data:
```tsx
<SurahBrowser chapters={chaptersData.chapters} juzs={juzData.juzs} />
```

- [ ] **Step 3: Add Surahs/Juz tabs to SurahBrowser**

In `components/SurahBrowser.tsx`, add Juz support.

Update the imports and add JuzCard:
```tsx
import JuzCard from "./JuzCard";
```

Update the component props:
```tsx
interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: { [chapterId: string]: string };
  verses_count: number;
}

type BrowseMode = "surahs" | "juz";

export default function SurahBrowser({ chapters, juzs = [] }: { chapters: Chapter[]; juzs?: Juz[] }) {
```

Add state for browse mode after the existing state declarations (line 41):
```tsx
const [browseMode, setBrowseMode] = useState<BrowseMode>("surahs");
```

Add a helper to derive surah range text from `verse_mapping`, before the return statement:
```tsx
const getJuzSurahRange = (juz: Juz): { range: string; firstSurahId: number; firstVerse: number } => {
  const chapterIds = Object.keys(juz.verse_mapping).map(Number).sort((a, b) => a - b);
  const firstId = chapterIds[0];
  const lastId = chapterIds[chapterIds.length - 1];
  const firstName = chapters.find((c) => c.id === firstId)?.name_simple || `Surah ${firstId}`;
  const lastName = chapters.find((c) => c.id === lastId)?.name_simple || `Surah ${lastId}`;
  const firstVerseRange = juz.verse_mapping[String(firstId)];
  const firstVerse = parseInt(firstVerseRange.split("-")[0], 10);
  const range = firstId === lastId ? firstName : `${firstName} — ${lastName}`;
  return { range, firstSurahId: firstId, firstVerse };
};
```

In the header section, replace the existing `<h2>` "Surahs" header and subtitle (lines 62-67) with a tabbed header:

```tsx
<div className="flex items-center gap-4 mb-1.5">
  <button
    onClick={() => setBrowseMode("surahs")}
    className={`text-xl md:text-2xl font-semibold font-english transition-colors duration-200
      ${browseMode === "surahs" ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
  >
    Surahs
  </button>
  <span className="text-gray-700">|</span>
  <button
    onClick={() => setBrowseMode("juz")}
    className={`text-xl md:text-2xl font-semibold font-english transition-colors duration-200
      ${browseMode === "juz" ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
  >
    Juz
  </button>
</div>
<p className="text-gray-600 font-english text-sm">
  {browseMode === "surahs" ? "114 chapters of the Holy Quran" : "30 parts of the Holy Quran"}
</p>
```

Hide the search/filter toolbar when in Juz mode — wrap the existing toolbar div (lines 70-108) with:
```tsx
{browseMode === "surahs" && (
  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
    ...existing search and filter pills...
  </div>
)}
```

After the existing surah grid's closing `</AnimatePresence>`, add the Juz grid (conditionally rendered):

```tsx
{browseMode === "juz" && (
  <motion.div
    key="juz-grid"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {juzs
      .filter((j, i, arr) => arr.findIndex((x) => x.juz_number === j.juz_number) === i)
      .sort((a, b) => a.juz_number - b.juz_number)
      .map((juz) => {
        const { range, firstSurahId, firstVerse } = getJuzSurahRange(juz);
        return (
          <motion.div key={juz.juz_number} variants={itemVariants} layout>
            <JuzCard
              juzNumber={juz.juz_number}
              versesCount={juz.verses_count}
              surahRange={range}
              firstSurahId={firstSurahId}
              firstVerse={firstVerse}
            />
          </motion.div>
        );
      })}
  </motion.div>
)}
```

Wrap the existing surah `<AnimatePresence>` block with `{browseMode === "surahs" && (...)}`.

Also wrap the results count `<p>` with `{browseMode === "surahs" && ...}`.

- [ ] **Step 4: Add Juz tab to SideMenu**

In `components/SideMenu.tsx`, add a tab toggle in the sidebar.

Add state at the top of the component:
```tsx
const [sideTab, setSideTab] = useState<"surahs" | "juz">("surahs");
```

Import useState:
```tsx
import React, { Fragment, useState } from "react";
```

Replace the `Dialog.Title` section (lines 61-63) with a tabbed header:

```tsx
<div className="flex items-center gap-3">
  <button
    onClick={() => setSideTab("surahs")}
    className={`text-sm font-english transition-colors
      ${sideTab === "surahs" ? "text-white font-medium" : "text-gray-600 hover:text-gray-400"}`}
  >
    Surahs
  </button>
  <button
    onClick={() => setSideTab("juz")}
    className={`text-sm font-english transition-colors
      ${sideTab === "juz" ? "text-white font-medium" : "text-gray-600 hover:text-gray-400"}`}
  >
    Juz
  </button>
</div>
```

Replace the list section (lines 76-92). Wrap the existing surah list with `{sideTab === "surahs" && (...)}` and add a Juz list:

```tsx
<div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
  {sideTab === "surahs" && surahs.map((chapter: any) => (
    <Link
      key={chapter.id}
      href={`/${chapter.id}`}
      className="flex items-center gap-3 px-5 py-2 hover:bg-white/[0.03] transition-colors group"
      onClick={() => setOpen(false)}
    >
      <span className="w-6 text-right text-xs text-gray-700 font-english group-hover:text-emerald-500 transition-colors">
        {chapter.id}
      </span>
      <span dir="rtl" className="text-gray-400 font-Scheherazade_New text-lg group-hover:text-gray-200 transition-colors">
        {chapter.arabic}
      </span>
    </Link>
  ))}
  {sideTab === "juz" && Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
    <Link
      key={juzNum}
      href={`/${juzNum === 1 ? 1 : juzNum}?verse=1`}
      className="flex items-center gap-3 px-5 py-2 hover:bg-white/[0.03] transition-colors group"
      onClick={() => setOpen(false)}
    >
      <span className="w-6 text-right text-xs text-gray-700 font-english group-hover:text-emerald-500 transition-colors">
        {juzNum}
      </span>
      <span className="text-gray-400 font-english text-sm group-hover:text-gray-200 transition-colors">
        Juz {juzNum}
      </span>
    </Link>
  ))}
</div>
```

Note: The SideMenu Juz links are simplified — they use a basic mapping. For accurate navigation, the Juz links in the main SurahBrowser (which has access to the API data) are the primary navigation method. The SideMenu provides a quick reference.

- [ ] **Step 5: Verify Juz navigation**

Run: `npm run dev`

1. On the home page, click "Juz" tab — should show 30 Juz cards with surah ranges.
2. Click "Juz 2" — should navigate to the start of Juz 2 (Al-Baqarah, verse 142) and scroll to it.
3. On a surah page, open the side menu — should see Surahs/Juz tabs.

- [ ] **Step 6: Commit**

```bash
git add components/JuzCard.tsx app/page.tsx components/SurahBrowser.tsx components/SideMenu.tsx
git commit -m "feat: add Juz navigation with browser tabs, cards, and side menu"
```

---

## Task 8: PWA — Installable + Offline Shell

**Files:**
- Create: `public/manifest.json`
- Create: `public/offline.html`
- Modify: `package.json` (add next-pwa)
- Modify: `next.config.js` (wrap with next-pwa)
- Modify: `app/layout.tsx` (add meta tags)

- [ ] **Step 1: Install next-pwa**

```bash
npm install next-pwa
```

- [ ] **Step 2: Create PWA manifest**

Create `public/manifest.json`:

```json
{
  "name": "Quran App",
  "short_name": "Quran",
  "description": "A modern, beautiful, and ad-free Quran reading experience",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f11",
  "theme_color": "#10b981",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 3: Create offline fallback page**

Create `public/offline.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quran App — Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f11;
      color: #e5e5e5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .container { max-width: 400px; }
    .icon { font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.6; }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #fff; }
    p { font-size: 0.875rem; color: #737373; line-height: 1.6; }
    .retry {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.5rem 1.5rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #10b981;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
    }
    .retry:hover { background: rgba(16, 185, 129, 0.2); }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">&#9778;</div>
    <h1>You're offline</h1>
    <p>Please check your internet connection. Previously visited pages may still be available.</p>
    <a href="/" class="retry">Try again</a>
  </div>
</body>
</html>
```

- [ ] **Step 4: Generate PWA icons**

Create the icons directory and generate simple placeholder icons from the SVG. Since we can't run image conversion tools easily, create a minimal script:

```bash
mkdir -p public/icons
```

For the icons, convert the existing `QuranLogo.svg` to PNG. If `sharp` or `inkscape` is available:

```bash
npx sharp-cli -i public/QuranLogo.svg -o public/icons/icon-192x192.png resize 192 192
npx sharp-cli -i public/QuranLogo.svg -o public/icons/icon-512x512.png resize 512 512
```

If those tools aren't available, create a simple script that generates a solid emerald square with "Q" as a temporary icon (you can replace with proper icons later):

```bash
node -e "
const { createCanvas } = require('canvas');
// If canvas isn't available, just create placeholder files
const fs = require('fs');
// Create a simple 1x1 green pixel PNG as placeholder
const png1px = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNU+s9QDwADigGABxMoRQAAAABJRU5ErkJggg==', 'base64');
fs.mkdirSync('public/icons', { recursive: true });
fs.writeFileSync('public/icons/icon-192x192.png', png1px);
fs.writeFileSync('public/icons/icon-512x512.png', png1px);
console.log('Placeholder icons created. Replace with proper icons before production.');
"
```

Note: Replace these placeholder icons with properly sized versions of the QuranLogo before deploying to production. You can use any online SVG-to-PNG converter.

- [ ] **Step 5: Configure next-pwa in next.config.js**

Read the current `next.config.js` first, then update it:

```js
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline.html",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);
```

- [ ] **Step 6: Add PWA meta tags to layout**

In `app/layout.tsx`, add meta tags inside the `<html>` tag. Add a `<head>` section or use the metadata export.

Add to the existing `metadata` export:

```tsx
export const metadata: Metadata = {
  // ...existing fields...
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quran App",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};
```

Also add `themeColor` to the metadata:
```tsx
export const metadata: Metadata = {
  // ...existing fields...
  themeColor: "#10b981",
  // ...rest...
};
```

- [ ] **Step 7: Add service worker generated files to .gitignore**

Add to `.gitignore`:

```
# PWA
public/sw.js
public/workbox-*.js
public/sw.js.map
public/workbox-*.js.map
```

- [ ] **Step 8: Verify PWA**

Run: `npm run build && npm run start`

1. Open `http://localhost:3000` in Chrome.
2. Open DevTools → Application → Manifest — should show the manifest with icons.
3. Application → Service Workers — should show an active service worker.
4. Chrome address bar should show an "Install" icon. Click it to install.
5. Turn off network in DevTools → Navigate to home page → should show the offline fallback for uncached pages.
6. Run Lighthouse PWA audit — should pass installability checks.

- [ ] **Step 9: Commit**

```bash
git add public/manifest.json public/offline.html public/icons/ next.config.js app/layout.tsx .gitignore package.json package-lock.json
git commit -m "feat: add PWA support with manifest, service worker, and offline fallback"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: No build errors.

- [ ] **Step 2: End-to-end smoke test**

Run: `npm run dev`

Test each feature:
1. **Search:** Cmd+K → type "patience" → click "Search Quran" → see results → click one → lands on verse
2. **Bookmarks:** Read a surah → hover verse numbers → bookmark 3 verses → go to /bookmarks → see them grouped → click one → navigate to verse → remove one
3. **Verse progress:** Read Al-Baqarah → scroll to verse ~100 → go home → ContinueReading shows "Al-Baqarah, Verse ~100" → click it → scrolls to that verse
4. **Juz:** Home page → click "Juz" tab → see 30 cards → click Juz 3 → lands on correct starting verse
5. **PWA:** Build and start prod → check Lighthouse PWA score → install the app

- [ ] **Step 3: Commit any fixes**

If any issues found during smoke testing, fix and commit.
