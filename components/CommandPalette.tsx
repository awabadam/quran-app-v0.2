"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { surahs } from "@/lib/surahs";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSettings } from "@/context/SettingsContext";

interface VerseResult {
  verse_key: string;
  text: string;
  translations: { text: string; name: string }[];
}

const hasArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export default function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen } = useSettings();
  const [query, setQuery] = useState("");
  const [verseResults, setVerseResults] = useState<VerseResult[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const t = useTranslations('search');

  // Filter surahs locally (instant)
  const filteredSurahs =
    query === ""
      ? []
      : surahs.filter((surah) => {
          return (
            surah.name.toLowerCase().includes(query.toLowerCase()) ||
            surah.arabic.includes(query) ||
            surah.id.toString() === query
          );
        });

  // Debounced verse search (API call)
  const searchVerses = useCallback(async (q: string) => {
    if (!q || q.length < 3) {
      setVerseResults([]);
      return;
    }

    setSearching(true);
    try {
      const langParam = hasArabic(q) ? "" : "&language=en";
      const res = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(q)}${langParam}&size=5&page=1`
      );
      if (!res.ok) { setVerseResults([]); return; }
      const text = await res.text();
      if (!text) { setVerseResults([]); return; }
      const data = JSON.parse(text);
      setVerseResults(data?.search?.results || []);
    } catch {
      setVerseResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => searchVerses(query), 400);
    } else {
      setVerseResults([]);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query, searchVerses]);

  // Reset on close
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      setVerseResults([]);
    }
  }, [isSearchOpen]);

  const navigate = (path: string) => {
    setIsSearchOpen(false);
    router.push(path);
  };

  const hasResults = filteredSurahs.length > 0 || verseResults.length > 0;

  return (
    <Transition show={isSearchOpen}>
      <Dialog as="div" className="relative z-50" onClose={setIsSearchOpen}>
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <TransitionChild
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-lg transform overflow-hidden rounded-2xl
              bg-[hsl(240,5%,10%)] border border-white/[0.06] shadow-2xl transition-all">

              {/* Search input */}
              <div className="relative border-b border-white/[0.04]">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  {searching ? (
                    <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100
                    placeholder:text-gray-600 focus:ring-0 text-sm font-english outline-none"
                  placeholder={t('placeholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.length >= 3) {
                      navigate(`/search?q=${encodeURIComponent(query)}`);
                    }
                  }}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {/* Surah matches */}
                {filteredSurahs.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[11px] text-gray-600 font-english uppercase tracking-wider">
                      {t('surahs')}
                    </p>
                    {filteredSurahs.slice(0, 5).map((surah) => (
                      <button
                        key={surah.id}
                        onClick={() => navigate(`/${surah.id}`)}
                        className="w-full flex cursor-pointer select-none rounded-xl p-2.5 mx-1 transition-colors hover:bg-white/[0.04]"
                        style={{ width: "calc(100% - 8px)" }}
                      >
                        <div className="flex flex-auto items-center gap-3">
                          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg
                            bg-white/[0.04] text-gray-500 text-xs font-english font-medium">
                            {surah.id}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-200 font-english text-left">{surah.name}</span>
                            <span className="text-xs text-gray-600 font-Scheherazade_New text-left">{surah.arabic}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Verse matches */}
                {verseResults.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[11px] text-gray-600 font-english uppercase tracking-wider">
                      {t('verses')}
                    </p>
                    {verseResults.map((result) => {
                      const [surahId, verseNum] = result.verse_key.split(":");
                      const translationText = result.translations?.[0]?.text?.replace(/<[^>]*>/g, "") || "";
                      return (
                        <button
                          key={result.verse_key}
                          onClick={() => navigate(`/${surahId}?verse=${verseNum}`)}
                          className="w-full text-left p-2.5 mx-1 rounded-xl transition-colors hover:bg-white/[0.04]"
                          style={{ width: "calc(100% - 8px)" }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-english text-emerald-400 font-medium mt-0.5 shrink-0">
                              {result.verse_key}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p dir="rtl" className="text-sm text-gray-300 font-Scheherazade_New leading-relaxed truncate">
                                {result.text}
                              </p>
                              {translationText && (
                                <p className="text-xs text-gray-600 font-english truncate mt-0.5">
                                  {translationText}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* See all results link */}
                {query.length >= 3 && (
                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                    className="w-full p-3 text-center text-xs text-emerald-400 hover:text-emerald-300
                      hover:bg-white/[0.03] transition-colors border-t border-white/[0.04] font-english"
                  >
                    {t('seeAllResults', { query })} →
                  </button>
                )}

                {/* Loading state */}
                {searching && verseResults.length === 0 && filteredSurahs.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-600 font-english">{t('searching')}</p>
                  </div>
                )}

                {/* No results */}
                {query.length >= 3 && !searching && !hasResults && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-600 font-english">{t('noResults')}</p>
                  </div>
                )}

                {/* Empty state */}
                {query === "" && (
                  <div className="py-12 px-6 text-center">
                    <p className="text-sm text-gray-400 font-english">{t('searchQuran')}</p>
                    <p className="mt-1 text-xs text-gray-700 font-english">{t('searchByName')}</p>
                  </div>
                )}

                {/* Typing hint */}
                {query.length > 0 && query.length < 3 && filteredSurahs.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-xs text-gray-600 font-english">{t('typeAtLeast')}</p>
                  </div>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
