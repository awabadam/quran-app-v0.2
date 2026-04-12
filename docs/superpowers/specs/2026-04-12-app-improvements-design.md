# Quran App Improvements — Design Spec

**Date:** 2026-04-12
**Approach:** localStorage-only, no backend, no new infrastructure
**Stack:** Next.js 14, React 18, Tailwind CSS, Quran.com API v4

---

## Feature 1: Bookmarks & Verse-Level Progress

### Data Model (localStorage)

```
bookmarks: [
  {
    surahId: number,
    verseNumber: number,
    surahName: string,
    arabicName: string,
    verseText: string,       // Arabic text stored at bookmark time
    timestamp: number
  }
]

lastRead: {
  surahId: number,
  surahName: string,
  arabicName: string,
  verseNumber: number,
  timestamp: number
}
```

### New Code

- **`context/BookmarkContext.tsx`** — New context providing:
  - `bookmarks: Bookmark[]`
  - `addBookmark(surah, verse)` / `removeBookmark(surah, verse)`
  - `isBookmarked(surah, verse): boolean`
  - Persists to localStorage

- **`app/bookmarks/page.tsx`** — New page listing all bookmarked verses, grouped by surah. Each entry shows verse key, Arabic text snippet, and timestamp. Tap navigates to the verse.

### Existing Code Changes

- **`context/ReadingProgressContext.tsx`** — Extend `lastRead` to include `verseNumber`. Currently tracks surah only.

- **`components/SurahView.tsx`** — Track scroll position in FlowView to determine the currently visible verse. Save to `ReadingProgressContext` on scroll (debounced).

- **`components/VerseCount.tsx`** — Add a small bookmark toggle icon. Tapping bookmarks/unbookmarks the verse.

- **`components/ContinueReading.tsx`** — Display "Al-Baqarah, Verse 142" instead of just the surah name.

- **`components/Navbar.tsx`** — Add bookmarks link in navigation.

### Scope Exclusions

- No bookmarking in SpreadView (mushaf layout) — positioned word layout makes per-verse interaction complex for little gain.

---

## Feature 2: Quran Text Search

### API

- **Endpoint:** `GET https://api.quran.com/api/v4/search?q={query}&language=en&page={page}&size=10`
- Searches English translation text. Returns Arabic text + highlighted English matches (`<em>` tags).
- Arabic-script search is unreliable via this API — not supported.
- Pagination: `page` and `size` params, response includes `total_results`, `total_pages`.

### Response Shape (per result)

```
{
  verse_key: "7:151",
  text: "Arabic text...",
  translations: [{
    text: "...with <em>highlighted</em> matches...",
    name: "Saheeh International"
  }]
}
```

### New Code

- **`app/search/page.tsx`** — Server component. Reads `?q=` and `?page=` from URL search params. Fetches from Quran.com search API. Renders results list with pagination.

### Existing Code Changes

- **`components/CommandPalette.tsx`** — When the typed query doesn't match any surah name, show a "Search Quran for '{query}'" action at the bottom. Selecting it navigates to `/search?q={query}`.

- **`app/[surah]/page.tsx`** — Support `?verse=N` URL parameter. On load, scroll to that verse and briefly highlight it (CSS animation, 2s fade).

### Data Flow

1. User types in CommandPalette → no surah match → clicks "Search Quran"
2. Navigates to `/search?q=mercy`
3. Server component fetches API, renders results
4. User clicks a result → navigates to `/2?verse=255`
5. Surah page loads, scrolls to verse 255, highlights it

---

## Feature 3: Juz Navigation

### API

- **Endpoint:** `GET https://api.quran.com/api/v4/juzs`
- Returns 30 Juz objects with `juz_number`, `verse_mapping`, `verses_count`.
- `verse_mapping` maps chapter IDs to verse ranges, e.g. `{"1": "1-7", "2": "1-141"}`.

### Existing Code Changes

- **`components/SurahBrowser.tsx`** — Add a **Surahs | Juz** tab toggle above the grid. Surahs tab shows existing behavior. Juz tab shows 30 Juz cards.

- **`components/ChapterCard.tsx`** — Create a variant or new `JuzCard` component. Shows: Juz number, verses count, surah range it covers (derived from `verse_mapping` + chapter names from existing surahs data).

- **`app/page.tsx`** — Fetch `/juzs` server-side alongside existing `/chapters` call. Pass to `SurahBrowser`.

- **`components/SideMenu.tsx`** — Add Juz list as a tab alongside the existing 114-surah list for in-reading navigation.

### Navigation

Clicking a Juz card navigates to the first surah of that Juz with `?verse=N` (reusing deep linking from Feature 2). No new routes needed.

---

## Feature 4: PWA — Installable + Offline Shell

### New Files

- **`public/manifest.json`** — PWA manifest:
  - `name`: "Quran App"
  - `short_name`: "Quran"
  - `start_url`: "/"
  - `display`: "standalone"
  - `theme_color`: emerald (matching app theme)
  - `background_color`: dark background color
  - `icons`: 192x192 and 512x512 PNG

- **PWA icons** — Generate from existing `QuranLogo.svg`. Place in `public/icons/`.

- **Offline fallback page** — Simple page: "You're offline. Previously visited pages are available."

### Service Worker (via next-pwa or manual Workbox)

Caches:
- App shell: HTML, JS bundles, CSS
- Static assets: SVGs, icons in `/public`
- Google Fonts (Amiri, etc.)
- Does NOT cache Quran.com API responses

### Existing Code Changes

- **`app/layout.tsx`** — Add:
  - `<link rel="manifest" href="/manifest.json">`
  - `<meta name="theme-color" content="...">`
  - Apple touch icon meta tags

### What Users Get

- "Add to Home Screen" on mobile and desktop
- App opens in standalone mode (no browser chrome)
- Offline: app shell loads, previously visited (browser-cached) pages work
- New Quran data still requires network

---

## Dependencies Between Features

- Feature 2 (Search) creates `?verse=N` deep linking → Feature 3 (Juz) reuses it
- Features 1 and 2 are otherwise independent
- Feature 4 (PWA) is fully independent

**Recommended build order:** Search → Bookmarks → Juz → PWA

---

## Success Criteria

1. **Bookmarks:** Can bookmark a verse in FlowView, see it on `/bookmarks`, tap to navigate back. ContinueReading shows verse number.
2. **Search:** Can search "mercy" from CommandPalette, see paginated results, click through to the highlighted verse.
3. **Juz:** Can toggle to Juz tab on home page, see 30 Juz cards, click one to land on the correct starting verse.
4. **PWA:** Lighthouse PWA audit passes. App installable on Chrome/Safari. Offline shows app shell or fallback page.
