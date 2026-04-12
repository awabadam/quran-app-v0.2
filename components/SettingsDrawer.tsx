"use client";

import { useSettings } from "@/context/SettingsContext";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useReadingNav } from "./Navbar";

export default function SettingsDrawer() {
  const { fontSize, setFontSize, readingMode, setReadingMode, showTranslation, setShowTranslation } = useSettings();
  const readingNav = useReadingNav();
  const isOpen = readingNav?.settingsOpen ?? false;
  const setIsOpen = readingNav?.setSettingsOpen ?? (() => {});

  const fontSizePresets = [
    { label: "S", value: 22 },
    { label: "M", value: 28 },
    { label: "L", value: 36 },
    { label: "XL", value: 44 },
  ];

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-6 left-6 z-40
          w-10 h-10 rounded-full items-center justify-center
          bg-[hsl(240,5%,10%)] border border-white/[0.06]
          text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20
          transition-all duration-200 shadow-lg shadow-black/20"
        title="Reading settings"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      <Transition show={isOpen}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
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
                  <DialogPanel className="pointer-events-auto w-screen max-w-xs">
                    <div className="flex h-full flex-col bg-[hsl(240,5%,9%)] border-l border-white/[0.04]">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
                        <DialogTitle className="text-sm font-medium text-white font-english">
                          Settings
                        </DialogTitle>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="w-7 h-7 rounded-md flex items-center justify-center
                            text-gray-500 hover:text-white hover:bg-white/[0.04] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex-1 px-5 py-6 space-y-8">
                        {/* Font Size */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-gray-400 font-english uppercase tracking-wider">
                              Font Size
                            </h3>
                            <span className="text-[11px] text-emerald-500 font-english">
                              {fontSize}px
                            </span>
                          </div>

                          <div className="flex gap-1.5">
                            {fontSizePresets.map((preset) => (
                              <button
                                key={preset.value}
                                onClick={() => setFontSize(preset.value)}
                                className={`flex-1 py-1.5 rounded-md text-xs font-english transition-all duration-200
                                  ${fontSize === preset.value
                                    ? "bg-emerald-500 text-gray-950 font-medium"
                                    : "bg-white/[0.03] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300 border border-white/[0.04]"
                                  }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          <input
                            type="range"
                            min="18"
                            max="60"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer
                              accent-emerald-500
                              [&::-webkit-slider-thumb]:appearance-none
                              [&::-webkit-slider-thumb]:w-3
                              [&::-webkit-slider-thumb]:h-3
                              [&::-webkit-slider-thumb]:bg-emerald-500
                              [&::-webkit-slider-thumb]:rounded-full
                              [&::-webkit-slider-thumb]:cursor-pointer"
                          />

                          {/* Preview */}
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                            <p
                              dir="rtl"
                              className="font-Scheherazade_New text-gray-300"
                              style={{ fontSize: `${fontSize}px`, lineHeight: "2.2" }}
                            >
                              بِسْمِ ٱللَّهِ
                            </p>
                          </div>
                        </div>

                        {/* Reading Mode */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-medium text-gray-400 font-english uppercase tracking-wider">
                            Layout
                          </h3>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setReadingMode("flow")}
                              className={`p-3 rounded-xl border transition-all duration-200 text-center
                                ${readingMode === "flow"
                                  ? "bg-emerald-500/8 border-emerald-500/25"
                                  : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]"
                                }`}
                            >
                              <div className="flex justify-center mb-2">
                                <div className={`w-8 h-10 rounded border flex flex-col items-center justify-center gap-0.5 p-1
                                  ${readingMode === "flow" ? "border-emerald-500/50" : "border-gray-700"}`}>
                                  <div className={`h-px w-full rounded ${readingMode === "flow" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                  <div className={`h-px w-3/4 rounded ${readingMode === "flow" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                  <div className={`h-px w-full rounded ${readingMode === "flow" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                  <div className={`h-px w-1/2 rounded ${readingMode === "flow" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                </div>
                              </div>
                              <p className={`text-[11px] font-english
                                ${readingMode === "flow" ? "text-emerald-400" : "text-gray-500"}`}>
                                Flow
                              </p>
                            </button>

                            <button
                              onClick={() => setReadingMode("spread")}
                              className={`p-3 rounded-xl border transition-all duration-200 text-center
                                ${readingMode === "spread"
                                  ? "bg-emerald-500/8 border-emerald-500/25"
                                  : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]"
                                }`}
                            >
                              <div className="flex justify-center gap-0.5 mb-2">
                                <div className={`w-4 h-10 rounded-l border border-r-0 p-0.5 flex flex-col gap-0.5
                                  ${readingMode === "spread" ? "border-emerald-500/50" : "border-gray-700"}`}>
                                  <div className={`h-px w-full rounded ${readingMode === "spread" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                  <div className={`h-px w-2/3 rounded ${readingMode === "spread" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                </div>
                                <div className={`w-4 h-10 rounded-r border border-l-0 p-0.5 flex flex-col gap-0.5
                                  ${readingMode === "spread" ? "border-emerald-500/50" : "border-gray-700"}`}>
                                  <div className={`h-px w-full rounded ${readingMode === "spread" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                  <div className={`h-px w-2/3 rounded ${readingMode === "spread" ? "bg-emerald-500/60" : "bg-gray-700"}`} />
                                </div>
                              </div>
                              <p className={`text-[11px] font-english
                                ${readingMode === "spread" ? "text-emerald-400" : "text-gray-500"}`}>
                                Spread
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Translation Toggle */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-medium text-gray-400 font-english uppercase tracking-wider">
                            Translation
                          </h3>
                          <button
                            onClick={() => setShowTranslation(!showTranslation)}
                            className="w-full flex items-center justify-between p-3 rounded-xl
                              bg-white/[0.02] border border-white/[0.04] transition-colors"
                          >
                            <div>
                              <p className="text-sm text-gray-300 font-english text-left">English Translation</p>
                              <p className="text-[11px] text-gray-600 font-english text-left">Saheeh International</p>
                            </div>
                            <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5
                              ${showTranslation ? "bg-emerald-500" : "bg-white/[0.08]"}`}>
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
                                ${showTranslation ? "translate-x-4" : "translate-x-0"}`} />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
