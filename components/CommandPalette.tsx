"use client";

import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { surahs } from "@/lib/surahs";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen } = useSettings();
  const [query, setQuery] = useState("");
  const router = useRouter();

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
              <Combobox
                onChange={(surah: any) => {
                  if (surah) {
                    setIsSearchOpen(false);
                    router.push(`/${surah.id}`);
                  }
                }}
              >
                <div className="relative border-b border-white/[0.04]">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <ComboboxInput
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100
                      placeholder:text-gray-600 focus:ring-0 text-sm font-english outline-none"
                    placeholder="Search surahs..."
                    onChange={(event) => setQuery(event.target.value)}
                    autoComplete="off"
                  />
                </div>

                {filteredSurahs.length > 0 && (
                  <ComboboxOptions static className="max-h-80 overflow-y-auto p-2">
                    {filteredSurahs.map((surah) => (
                      <ComboboxOption
                        key={surah.id}
                        value={surah}
                        className={({ active }) =>
                          `flex cursor-pointer select-none rounded-xl p-2.5 transition-colors ${
                            active ? "bg-white/[0.04]" : ""
                          }`
                        }
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
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}

                {query !== "" && (
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="w-full p-4 text-left hover:bg-white/[0.04] transition-colors border-t border-white/[0.04]"
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
                          Search verses and translations
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {query === "" && (
                  <div className="py-12 px-6 text-center">
                    <p className="text-sm text-gray-400 font-english">Search for a surah</p>
                    <p className="mt-1 text-xs text-gray-700 font-english">by name, Arabic, or number</p>
                  </div>
                )}
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
