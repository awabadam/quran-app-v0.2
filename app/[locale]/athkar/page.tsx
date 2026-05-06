"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Thikr from "@/components/Thikr";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import athkarData from "@/lib/athkar_data.json";

const STORAGE_KEY = "athkar-counts";
const STORAGE_DATE_KEY = "athkar-counts-date";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadCounts(): { [key: string]: number } {
  if (typeof window === "undefined") return {};
  try {
    const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
    // Reset counts if it's a new day
    if (savedDate !== getTodayKey()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_DATE_KEY, getTodayKey());
      return {};
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export default function AthkarPage() {
  const t = useTranslations("athkar");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedThikr, setSelectedThikr] = useState<any>(null);

  // Track counts for each thikr, persisted to localStorage (resets daily)
  const [counts, setCounts] = useState<{ [key: string]: number }>(loadCounts);

  // Persist counts to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    localStorage.setItem(STORAGE_DATE_KEY, getTodayKey());
  }, [counts]);

  const tabs = [
    {
      title: t("morning"),
      key: "morning",
      data: athkarData.morning,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: t("evening"),
      key: "evening",
      data: athkarData.evening,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      title: t("sleep"),
      key: "sleep",
      data: athkarData.sleep,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
  ];

  // Get current count for a thikr
  const getCount = (id: string) => counts[id] || 0;
  
  // Check if thikr is completed
  const isCompleted = (id: string, maxCount: number) => getCount(id) >= maxCount;

  // Handle count change from Thikr component with haptic feedback
  const handleCountChange = useCallback((id: string, newCount: number, maxCount?: number) => {
    setCounts(prev => ({ ...prev, [id]: newCount }));
    if (newCount === 0) return; // reset, no vibration
    if (maxCount && newCount >= maxCount) {
      vibrate([50, 30, 100]); // completion pattern
    } else {
      vibrate(15); // short tap
    }
  }, []);

  // Get the next incomplete thikr in the current tab
  const getNextThikr = useCallback((currentId: number) => {
    const currentTab = tabs[selectedIndex];
    const currentIdx = currentTab.data.findIndex((w: any) => w.id === currentId);
    // Look for the next incomplete thikr after the current one
    for (let i = currentIdx + 1; i < currentTab.data.length; i++) {
      const w = currentTab.data[i] as any;
      if (!isCompleted(w.id, w.count)) return w;
    }
    // Wrap around: check from beginning
    for (let i = 0; i < currentIdx; i++) {
      const w = currentTab.data[i] as any;
      if (!isCompleted(w.id, w.count)) return w;
    }
    return null; // all done
  }, [selectedIndex, counts]);

  // Count completed thikr in a tab
  const getCompletedCount = (tabData: any[]) => {
    return tabData.filter(wird => isCompleted(wird.id, wird.count)).length;
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 py-8">
          <div className="w-12 h-12 mx-auto mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold font-english text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-500 font-english">
            {t("subtitle")}
          </p>
        </div>

        <Tabs 
          selectedIndex={selectedIndex} 
          onSelect={(index) => setSelectedIndex(index)}
          className="flex flex-col gap-8"
        >
          {/* Tab List */}
          <TabList className="flex flex-wrap justify-center gap-2 p-1.5 
            bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800/50 w-fit mx-auto">
            {tabs.map((tab, index) => {
              const completedCount = getCompletedCount(tab.data);
              return (
                <Tab 
                  key={index}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg 
                    text-sm font-medium transition-all duration-200 
                    outline-none cursor-pointer font-english
                    ${selectedIndex === index 
                      ? "bg-emerald-500 text-gray-950" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                  <span className={`
                    text-[10px] px-1.5 py-0.5 rounded-full
                    ${selectedIndex === index 
                      ? "bg-gray-950/20 text-gray-950" 
                      : completedCount === tab.data.length 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-800 text-gray-500"
                    }
                  `}>
                    {completedCount}/{tab.data.length}
                  </span>
                </Tab>
              );
            })}
          </TabList>

          {/* Tab Panels */}
          {tabs.map((tab, index) => (
            <TabPanel key={index} className="w-full">
              <AnimatePresence mode="wait">
                {selectedIndex === index && (
                  <motion.div
                    key={tab.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Section Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-Scheherazade_New text-gray-200 mb-1">
                        {t(`${tab.key}Title`)}
                      </h2>
                      <div className="flex items-center justify-center gap-3">
                        <p className="text-gray-500 text-sm font-english">
                          {t("completedOf", { completed: getCompletedCount(tab.data), total: tab.data.length })}
                        </p>
                        {getCompletedCount(tab.data) > 0 && (
                          <button
                            onClick={() => {
                              const keys = tab.data.map((w: any) => w.id);
                              setCounts(prev => {
                                const next = { ...prev };
                                keys.forEach((k: number) => delete next[k]);
                                return next;
                              });
                            }}
                            className="text-[11px] text-gray-600 hover:text-red-400 font-english
                              px-2 py-0.5 rounded-md hover:bg-red-500/10 transition-colors"
                          >
                            {t("resetAll")}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {tab.data.map((wird: any, wirdIndex: number) => {
                        const currentCount = getCount(wird.id);
                        const completed = isCompleted(wird.id, wird.count);
                        const progress = (currentCount / wird.count) * 100;
                        
                        return (
                          <motion.button
                            key={`${index}-${wird.id}`}
                            onClick={() => setSelectedThikr({ ...wird, category: tab.key })}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: wirdIndex * 0.03 }}
                            className={`group relative flex flex-col p-5 h-[180px] rounded-2xl 
                              backdrop-blur-sm border transition-all duration-300 text-left
                              hover:-translate-y-1
                              ${completed 
                                ? "bg-emerald-900/30 border-emerald-500/40 hover:border-emerald-500/60" 
                                : "bg-gray-900/60 border-white/[0.06] hover:border-emerald-500/40 hover:bg-gray-800/80 hover:shadow-glow"
                              }`}
                          >
                            {/* Progress Bar */}
                            {!completed && currentCount > 0 && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-2xl overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Count Badge - Top Right */}
                            <div className={`absolute top-4 right-4 w-9 h-9 rounded-lg 
                              flex items-center justify-center text-sm font-bold font-english
                              transition-all duration-300
                              ${completed 
                                ? "bg-emerald-500 text-white border border-emerald-400" 
                                : currentCount > 0
                                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400"
                              }`}
                            >
                              {completed ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span>{wird.count - currentCount}</span>
                              )}
                            </div>
                            
                            {/* English Title */}
                            <h3 className={`font-english font-medium text-sm mb-2 pr-12 transition-colors
                              ${completed ? "text-emerald-300" : "text-white group-hover:text-emerald-300"}`}>
                              {t(`${tab.key}_${wird.id}_title`)}
                            </h3>
                            
                            {/* Arabic Text Preview */}
                            <div className="flex-1 pr-12">
                              <p dir="rtl" className={`font-Scheherazade_New text-base leading-relaxed line-clamp-2 text-right
                                transition-colors
                                ${completed ? "text-emerald-200/70" : "text-gray-400 group-hover:text-gray-300"}`}>
                                {wird.text}
                              </p>
                            </div>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
                              {currentCount > 0 && !completed ? (
                                <p className="text-[10px] text-emerald-400 font-english">
                                  {t("done", { current: currentCount, total: wird.count })}
                                </p>
                              ) : (
                                <p className="text-[10px] text-gray-500 font-english">
                                  {wird.count === 1 ? t("once") : t("times", { count: wird.count })}
                                </p>
                              )}
                              <svg className={`w-4 h-4 transition-all
                                ${completed 
                                  ? "text-emerald-400" 
                                  : "text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1"
                                }`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            
                            {/* Bottom Border Glow on Hover */}
                            {!completed && (
                              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            )}
                            
                            {/* Completed Overlay */}
                            {completed && (
                              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none rounded-2xl" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabPanel>
          ))}
        </Tabs>
      </div>

      {/* Modal for Full Thikr */}
      <AnimatePresence>
        {selectedThikr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedThikr(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-gray-900 rounded-2xl border border-gray-800 
                shadow-2xl max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCompleted(selectedThikr.id, selectedThikr.count)) {
                        const newCount = getCount(selectedThikr.id) + 1;
                        handleCountChange(selectedThikr.id, newCount, selectedThikr.count);
                      }
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-english flex-shrink-0
                      cursor-pointer active:scale-90 transition-all
                    ${isCompleted(selectedThikr.id, selectedThikr.count)
                      ? "bg-emerald-500 text-white border border-emerald-400"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                    }`}>
                    {isCompleted(selectedThikr.id, selectedThikr.count) ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      `${selectedThikr.count - getCount(selectedThikr.id)}`
                    )}
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-white font-english font-medium text-sm truncate">
                      {t(`${selectedThikr.category}_${selectedThikr.id}_title`)}
                    </h3>
                    <p className="text-xs text-gray-500 font-english">
                      {isCompleted(selectedThikr.id, selectedThikr.count)
                        ? t("completed")
                        : t("tapToCount")
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getCount(selectedThikr.id) > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCountChange(selectedThikr.id, 0);
                      }}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors
                        px-3 py-1.5 rounded-lg hover:bg-red-500/10
                        border border-transparent hover:border-red-500/20 font-english"
                    >
                      {t("reset")}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedThikr(null)}
                    className="w-9 h-9 rounded-xl bg-gray-800/50 hover:bg-gray-800
                      border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white
                      transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-4 max-h-[calc(85vh-80px)]">
                <Thikr
                  thikr={selectedThikr.text}
                  Count={selectedThikr.count}
                  source={t(`${selectedThikr.category}_${selectedThikr.id}_source`)}
                  benefit={t(`${selectedThikr.category}_${selectedThikr.id}_benefit`)}
                  externalCount={getCount(selectedThikr.id)}
                  onCountChange={(newCount) => handleCountChange(selectedThikr.id, newCount, selectedThikr.count)}
                  inline
                />

                {/* Auto-advance: show Next button when completed */}
                {isCompleted(selectedThikr.id, selectedThikr.count) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex justify-center"
                  >
                    {getNextThikr(selectedThikr.id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const next = getNextThikr(selectedThikr.id);
                          if (next) setSelectedThikr({ ...next, category: selectedThikr.category });
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                          bg-emerald-500/10 border border-emerald-500/20
                          hover:bg-emerald-500/20 hover:border-emerald-500/30
                          text-emerald-400 text-sm font-english
                          transition-all duration-200 active:scale-95"
                      >
                        {t("next")}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <p className="text-sm text-emerald-400 font-english">
                        {t("allDone")}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
