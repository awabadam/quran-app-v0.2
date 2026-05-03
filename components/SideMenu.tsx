"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { surahs } from "@/lib/surahs";
import { useReadingNav } from "./Navbar";

export default function SideMenu() {
  const readingNav = useReadingNav();
  const open = readingNav?.sideMenuOpen ?? false;
  const setOpen = readingNav?.setSideMenuOpen ?? (() => {});
  const [sideTab, setSideTab] = useState<"surahs" | "juz">("surahs");
  const t = useTranslations('browser');

  return (
    <div>
      {/* Floating button — desktop only, mobile uses bottom nav */}
      <button
        className="hidden md:flex fixed bottom-6 right-6 z-40
          w-10 h-10 rounded-full items-center justify-center
          bg-[hsl(240,5%,10%)] border border-white/[0.06]
          text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20
          transition-all duration-200 shadow-lg shadow-black/20"
        onClick={() => setOpen(true)}
        title={t('surahs')}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <Transition show={open}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <TransitionChild
                       enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-16">
                <TransitionChild
                                   enter="transform transition ease-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-sm">
                    <div className="flex h-full flex-col bg-[hsl(240,5%,9%)] border-l border-white/[0.04]">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSideTab("surahs")}
                            className={`text-sm font-english transition-colors
                              ${sideTab === "surahs" ? "text-white font-medium" : "text-gray-600 hover:text-gray-400"}`}
                          >
                            {t('surahs')}
                          </button>
                          <button
                            onClick={() => setSideTab("juz")}
                            className={`text-sm font-english transition-colors
                              ${sideTab === "juz" ? "text-white font-medium" : "text-gray-600 hover:text-gray-400"}`}
                          >
                            {t('juz')}
                          </button>
                        </div>
                        <button
                          onClick={() => setOpen(false)}
                          className="w-7 h-7 rounded-md flex items-center justify-center
                            text-gray-500 hover:text-white hover:bg-white/[0.04] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* List */}
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
                              {t('juzNumber', { number: juzNum })}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
