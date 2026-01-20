"use client";

import { useSettings } from "@/context/SettingsContext";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function SettingsDrawer() {
  const { fontSize, setFontSize, readingMode, setReadingMode } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const fontSizePresets = [
    { label: "Small", value: 22 },
    { label: "Medium", value: 28 },
    { label: "Large", value: 36 },
    { label: "X-Large", value: 44 },
  ];

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full shadow-glass
          bg-gray-900/80 backdrop-blur-sm border border-white/[0.06]
          text-gray-400 hover:text-emerald-400 
          hover:border-emerald-500/30 hover:shadow-glow-sm
          transition-all duration-300 btn-press group"
        title="Appearance Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
          className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Drawer */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-auto 
                      bg-gray-900/95 backdrop-blur-xl shadow-2xl 
                      border-l border-white/[0.06]">
                      
                      {/* Header */}
                      <div className="px-6 py-5 border-b border-white/[0.06]">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-semibold text-white font-english">
                            Appearance
                          </Dialog.Title>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 hover:text-white 
                              hover:bg-white/5 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 px-6 py-8 space-y-8">
                        
                        {/* Font Size Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-300 font-english">
                              Arabic Font Size
                            </h3>
                            <span className="text-xs text-emerald-400 font-english bg-emerald-500/10 px-2 py-1 rounded">
                              {fontSize}px
                            </span>
                          </div>
                          
                          {/* Preset Buttons */}
                          <div className="grid grid-cols-4 gap-2">
                            {fontSizePresets.map((preset) => (
                              <button
                                key={preset.value}
                                onClick={() => setFontSize(preset.value)}
                                className={`px-3 py-2 rounded-lg text-xs font-english transition-all duration-200
                                  ${fontSize === preset.value 
                                    ? "bg-emerald-500 text-white" 
                                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-white/5"
                                  }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                          
                          {/* Slider */}
                          <div className="flex items-center gap-4 pt-2">
                            <span className="text-sm text-gray-500 font-Scheherazade_New">أ</span>
                            <input 
                              type="range" 
                              min="18" 
                              max="60" 
                              value={fontSize} 
                              onChange={(e) => setFontSize(Number(e.target.value))}
                              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer 
                                accent-emerald-500 
                                [&::-webkit-slider-thumb]:appearance-none 
                                [&::-webkit-slider-thumb]:w-4 
                                [&::-webkit-slider-thumb]:h-4 
                                [&::-webkit-slider-thumb]:bg-emerald-500 
                                [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:shadow-glow-sm
                                [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <span className="text-2xl text-gray-300 font-Scheherazade_New">أ</span>
                          </div>
                          
                          {/* Preview */}
                          <div className="glass-card p-6 text-center">
                            <p className="text-gray-500 text-xs font-english mb-3 uppercase tracking-wider">
                              Preview
                            </p>
                            <p 
                              className="font-Scheherazade_New text-gray-200 leading-relaxed"
                              style={{ fontSize: `${fontSize}px`, lineHeight: '2.4' }}
                            >
                              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </p>
                          </div>
                        </div>

                        {/* Reading Mode Section */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-300 font-english">
                            Reading Mode
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {/* Flow Mode */}
                            <button
                              onClick={() => setReadingMode("flow")}
                              className={`relative p-4 rounded-xl border transition-all duration-200 text-left
                                ${readingMode === "flow" 
                                  ? "bg-emerald-500/10 border-emerald-500/50" 
                                  : "bg-gray-800/30 border-white/5 hover:border-white/10"
                                }`}
                            >
                              {/* Icon */}
                              <div className="flex justify-center mb-3">
                                <div className={`w-12 h-16 rounded border-2 flex items-center justify-center
                                  ${readingMode === "flow" ? "border-emerald-500" : "border-gray-600"}`}>
                                  <div className="space-y-1 px-1">
                                    <div className={`h-0.5 w-full rounded ${readingMode === "flow" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                    <div className={`h-0.5 w-3/4 rounded ${readingMode === "flow" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                    <div className={`h-0.5 w-full rounded ${readingMode === "flow" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                    <div className={`h-0.5 w-1/2 rounded ${readingMode === "flow" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                  </div>
                                </div>
                              </div>
                              <p className={`text-xs font-english text-center
                                ${readingMode === "flow" ? "text-emerald-400" : "text-gray-400"}`}>
                                Continuous
                              </p>
                            </button>

                            {/* Spread Mode */}
                            <button
                              onClick={() => setReadingMode("spread")}
                              className={`relative p-4 rounded-xl border transition-all duration-200 text-left
                                ${readingMode === "spread" 
                                  ? "bg-emerald-500/10 border-emerald-500/50" 
                                  : "bg-gray-800/30 border-white/5 hover:border-white/10"
                                }`}
                            >
                              {/* Icon - Two pages */}
                              <div className="flex justify-center gap-1 mb-3">
                                <div className={`w-6 h-16 rounded-l border-2 border-r-0
                                  ${readingMode === "spread" ? "border-emerald-500" : "border-gray-600"}`}>
                                  <div className="space-y-1 p-1 pt-2">
                                    <div className={`h-0.5 w-full rounded ${readingMode === "spread" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                    <div className={`h-0.5 w-2/3 rounded ${readingMode === "spread" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                  </div>
                                </div>
                                <div className={`w-6 h-16 rounded-r border-2 border-l-0
                                  ${readingMode === "spread" ? "border-emerald-500" : "border-gray-600"}`}>
                                  <div className="space-y-1 p-1 pt-2">
                                    <div className={`h-0.5 w-full rounded ${readingMode === "spread" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                    <div className={`h-0.5 w-2/3 rounded ${readingMode === "spread" ? "bg-emerald-500" : "bg-gray-600"}`} />
                                  </div>
                                </div>
                              </div>
                              <p className={`text-xs font-english text-center
                                ${readingMode === "spread" ? "text-emerald-400" : "text-gray-400"}`}>
                                Book Spread
                              </p>
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-gray-600 font-english">
                            {readingMode === "spread" 
                              ? "View two Quran pages side by side like a physical Mushaf" 
                              : "Read verses in a continuous scrolling flow"
                            }
                          </p>
                        </div>

                        {/* Info */}
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-xs text-gray-500 font-english leading-relaxed">
                            Your preferences are saved automatically.
                          </p>
                        </div>
                        
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
