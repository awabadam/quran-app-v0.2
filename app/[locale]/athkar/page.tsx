"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import StreakBanner from "@/components/StreakBanner";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import athkarData from "@/lib/athkar_data.json";
import { getStreakData, markCategoryCompleted, type StreakData } from "@/lib/streaks";

const STORAGE_KEY = "athkar-counts";
const STORAGE_DATE_KEY = "athkar-counts-date";
const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadCounts(): { [key: string]: number } {
  if (typeof window === "undefined") return {};
  try {
    const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
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
  const [counts, setCounts] = useState<{ [key: string]: number }>(loadCounts);
  const [streakData, setStreakData] = useState<StreakData>(() => getStreakData());
  const completedCategoriesRef = useRef<Set<string>>(new Set());

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
    {
      title: t("prayer"),
      key: "prayer",
      data: athkarData.prayer,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
          />
        </svg>
      ),
    },
  ];

  const getCount = (id: string) => counts[id] || 0;
  const isCompleted = (id: string, maxCount: number) => getCount(id) >= maxCount;

  const handleCountChange = useCallback((id: string, newCount: number, maxCount?: number) => {
    setCounts(prev => ({ ...prev, [id]: newCount }));
    if (newCount === 0) return;
    if (maxCount && newCount >= maxCount) {
      vibrate([50, 30, 100]);
    } else {
      vibrate(15);
    }
  }, []);

  const getNextThikr = useCallback((currentId: number) => {
    const currentTab = tabs[selectedIndex];
    const currentIdx = currentTab.data.findIndex((w: any) => w.id === currentId);
    for (let i = currentIdx + 1; i < currentTab.data.length; i++) {
      const w = currentTab.data[i] as any;
      if (!isCompleted(w.id, w.count)) return w;
    }
    for (let i = 0; i < currentIdx; i++) {
      const w = currentTab.data[i] as any;
      if (!isCompleted(w.id, w.count)) return w;
    }
    return null;
  }, [selectedIndex, counts]);

  const getCompletedCount = (tabData: any[]) => {
    return tabData.filter(wird => isCompleted(wird.id, wird.count)).length;
  };

  const categoryKeys = tabs.map((tab) => tab.key);

  useEffect(() => {
    for (const tab of tabs) {
      const allDone = tab.data.every((wird: any) => isCompleted(wird.id, wird.count));
      if (allDone && !completedCategoriesRef.current.has(tab.key)) {
        completedCategoriesRef.current.add(tab.key);
        const updated = markCategoryCompleted(tab.key);
        setStreakData(updated);
      } else if (!allDone) {
        completedCategoriesRef.current.delete(tab.key);
      }
    }
  }, [counts]);

  useEffect(() => {
    setStreakData(getStreakData());
    for (const tab of tabs) {
      const allDone = tab.data.every((wird: any) => isCompleted(wird.id, wird.count));
      if (allDone) {
        completedCategoriesRef.current.add(tab.key);
      }
    }
  }, []);

  // --- Modal helpers ---
  const modalTab = selectedThikr ? tabs.find(t => t.key === selectedThikr.category) : null;
  const modalIndex = modalTab?.data.findIndex((w: any) => w.id === selectedThikr?.id) ?? 0;
  const modalTotal = modalTab?.data.length ?? 0;

  const navigateModal = useCallback((dir: number) => {
    if (!selectedThikr || !modalTab) return;
    const newIdx = modalIndex + dir;
    if (newIdx >= 0 && newIdx < modalTotal) {
      setSelectedThikr({ ...modalTab.data[newIdx], category: selectedThikr.category });
    }
  }, [selectedThikr, modalTab, modalIndex, modalTotal]);

  // Once a thikr is finished, tapping the body again jumps to the next one.
  // The timestamp guards against the stray tap that follows the completing tap.
  const completedAtRef = useRef(0);

  const goToNextThikr = useCallback(() => {
    if (!selectedThikr) return;
    const next = getNextThikr(selectedThikr.id);
    if (!next) return;
    vibrate(10);
    setSelectedThikr({ ...next, category: selectedThikr.category });
  }, [selectedThikr, getNextThikr]);

  const handleModalTap = useCallback(() => {
    if (!selectedThikr) return;
    if (isCompleted(selectedThikr.id, selectedThikr.count)) {
      if (Date.now() - completedAtRef.current < 700) return;
      goToNextThikr();
      return;
    }
    const newCount = getCount(selectedThikr.id) + 1;
    if (newCount >= selectedThikr.count) {
      completedAtRef.current = Date.now();
    }
    handleCountChange(selectedThikr.id, newCount, selectedThikr.count);
  }, [selectedThikr, counts, handleCountChange, goToNextThikr]);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">

        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-5 pt-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold font-english text-white leading-tight">
              {t("title")}
            </h1>
            <p className="text-xs text-gray-500 font-english">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Streak Banner */}
        <StreakBanner streakData={streakData} categories={categoryKeys} />

        <Tabs
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
          className="flex flex-col gap-6"
        >
          {/* Scrollable Tab List */}
          <TabList className="flex gap-1.5 p-1 overflow-x-auto scrollbar-hide
            bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800/50 mx-auto max-w-full">
            {tabs.map((tab, index) => {
              const completedCount = getCompletedCount(tab.data);
              const allDone = completedCount === tab.data.length;
              return (
                <Tab
                  key={index}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg
                    text-xs font-medium transition-all duration-200
                    outline-none cursor-pointer font-english whitespace-nowrap flex-shrink-0
                    ${selectedIndex === index
                      ? "bg-emerald-500 text-gray-950"
                      : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                  {/* Completion indicator: dot on mobile, count on sm+ */}
                  {allDone && selectedIndex !== index ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 sm:hidden" />
                  ) : null}
                  <span className={`
                    hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full
                    ${selectedIndex === index
                      ? "bg-gray-950/20 text-gray-950"
                      : allDone
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
                    <div className="text-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-Scheherazade_New text-gray-200 mb-1">
                        {t(`${tab.key}Title`)}
                      </h2>
                      <div className="flex items-center justify-center gap-3">
                        <p className="text-gray-500 text-xs sm:text-sm font-english">
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

                    {/* Cards Grid — compact on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                            transition={{ duration: 0.2, delay: wirdIndex * 0.02 }}
                            className={`group relative flex flex-col p-3.5 sm:p-5 h-[120px] sm:h-[180px] rounded-2xl
                              backdrop-blur-sm border transition-all duration-300 text-left
                              active:scale-[0.98] sm:hover:-translate-y-1
                              ${completed
                                ? "bg-emerald-900/30 border-emerald-500/40 sm:hover:border-emerald-500/60"
                                : "bg-gray-900/60 border-white/[0.06] sm:hover:border-emerald-500/40 sm:hover:bg-gray-800/80 sm:hover:shadow-glow"
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

                            {/* Count Badge */}
                            <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg
                              flex items-center justify-center text-xs sm:text-sm font-bold font-english
                              transition-all duration-300
                              ${completed
                                ? "bg-emerald-500 text-white border border-emerald-400"
                                : currentCount > 0
                                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400"
                              }`}
                            >
                              {completed ? (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span>{wird.count - currentCount}</span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className={`font-english font-medium text-xs sm:text-sm mb-1.5 sm:mb-2 pr-10 sm:pr-12 transition-colors
                              ${completed ? "text-emerald-300" : "text-white group-hover:text-emerald-300"}`}>
                              {t(`${tab.key}_${wird.id}_title`)}
                            </h3>

                            {/* Arabic Text Preview */}
                            <div className="flex-1 pr-10 sm:pr-12">
                              <p dir="rtl" className={`font-Scheherazade_New text-sm sm:text-base leading-relaxed line-clamp-1 sm:line-clamp-2 text-right
                                transition-colors
                                ${completed ? "text-emerald-200/70" : "text-gray-400 group-hover:text-gray-300"}`}>
                                {wird.text}
                              </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-800/50">
                              {currentCount > 0 && !completed ? (
                                <p className="text-[10px] text-emerald-400 font-english">
                                  {t("done", { current: currentCount, total: wird.count })}
                                </p>
                              ) : (
                                <p className="text-[10px] text-gray-500 font-english">
                                  {wird.count === 1 ? t("once") : t("times", { count: wird.count })}
                                </p>
                              )}
                              <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all
                                ${completed
                                  ? "text-emerald-400"
                                  : "text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1"
                                }`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>

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

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedThikr && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedThikr(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl
                bg-gray-900 rounded-t-[1.75rem] border-t border-x border-gray-800
                shadow-2xl flex flex-col overflow-hidden
                h-[90vh] sm:h-[85vh] sm:max-h-[700px]"
            >
              {/* Position progress bar */}
              <div className="h-0.5 bg-gray-800 flex-shrink-0">
                <motion.div
                  className="h-full bg-emerald-500/80"
                  animate={{ width: `${((modalIndex + 1) / Math.max(modalTotal, 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Handle + Header */}
              <div className="pt-2.5 pb-2 px-4 flex-shrink-0">
                <div className="w-9 h-1 rounded-full bg-gray-700/80 mx-auto mb-3" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-gray-500 font-english tabular-nums flex-shrink-0">
                    {modalIndex + 1} / {modalTotal}
                  </span>
                  <h3 className="text-sm text-white font-english font-medium truncate text-center flex-1">
                    {t(`${selectedThikr.category}_${selectedThikr.id}_title`)}
                  </h3>
                  <button
                    onClick={() => setSelectedThikr(null)}
                    className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-800
                      flex items-center justify-center text-gray-400 hover:text-white
                      transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Full-body tap zone */}
              <div
                className="flex-1 overflow-y-auto overscroll-contain cursor-pointer select-none"
                onClick={handleModalTap}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedThikr.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center px-6 sm:px-8 py-6 min-h-full"
                  >
                    {/* Circular Progress Counter */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-2 flex-shrink-0">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60" cy="60" r={RING_RADIUS} fill="none"
                          stroke="currentColor" className="text-gray-800" strokeWidth="3"
                        />
                        <motion.circle
                          cx="60" cy="60" r={RING_RADIUS} fill="none"
                          stroke="currentColor"
                          className={isCompleted(selectedThikr.id, selectedThikr.count) ? "text-emerald-400" : "text-emerald-500"}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={RING_CIRCUMFERENCE}
                          animate={{
                            strokeDashoffset: RING_CIRCUMFERENCE * (1 - Math.min(getCount(selectedThikr.id) / selectedThikr.count, 1))
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      </svg>
                      <AnimatePresence mode="wait">
                        {isCompleted(selectedThikr.id, selectedThikr.count) ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="text-emerald-400"
                          >
                            <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        ) : (
                          <motion.span
                            key={getCount(selectedThikr.id)}
                            initial={{ scale: 1.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-3xl sm:text-4xl font-bold text-white font-english tabular-nums"
                          >
                            {selectedThikr.count - getCount(selectedThikr.id)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Tap hint */}
                    <p className="text-[11px] text-gray-600 font-english mb-6 sm:mb-8">
                      {isCompleted(selectedThikr.id, selectedThikr.count)
                        ? getNextThikr(selectedThikr.id) ? t("tapToContinue") : t("completed")
                        : t("tapToCount")}
                    </p>

                    {/* Arabic text — large, readable */}
                    <p
                      dir="rtl"
                      className={`text-arabic-lg leading-arabic font-Scheherazade_New text-center w-full transition-colors duration-300
                        ${isCompleted(selectedThikr.id, selectedThikr.count) ? "text-emerald-200/80" : "text-gray-200"}`}
                    >
                      {selectedThikr.text}
                    </p>

                    {/* Source & Benefit */}
                    {(() => {
                      const source = t(`${selectedThikr.category}_${selectedThikr.id}_source`);
                      const benefit = t(`${selectedThikr.category}_${selectedThikr.id}_benefit`);
                      if (!source && !benefit) return null;
                      return (
                        <div dir="rtl" className="mt-6 pt-4 border-t border-gray-800/50 w-full space-y-2 text-right">
                          {source && (
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-sm text-gray-500 font-Scheherazade_New">{source}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 flex-shrink-0" />
                            </div>
                          )}
                          {benefit && (
                            <p className="text-xs text-gray-600 leading-relaxed font-Scheherazade_New">{benefit}</p>
                          )}
                        </div>
                      );
                    })()}

                    {/* Next indicator — ghost hint while counting, solid button on completion */}
                    <div className="mt-8 flex justify-center">
                      <AnimatePresence mode="wait">
                        {isCompleted(selectedThikr.id, selectedThikr.count) ? (
                          getNextThikr(selectedThikr.id) ? (
                            <motion.button
                              key="next-btn"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                goToNextThikr();
                              }}
                              className="flex items-center gap-2 px-6 py-3 rounded-xl
                                bg-emerald-500/15 border border-emerald-500/30
                                hover:bg-emerald-500/25 hover:border-emerald-500/40
                                text-emerald-400 text-sm font-english font-medium
                                transition-colors active:scale-95"
                            >
                              {t("next")}
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.button>
                          ) : (
                            <motion.p
                              key="all-done"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-emerald-400 font-english"
                            >
                              {t("allDone")}
                            </motion.p>
                          )
                        ) : (
                          <motion.div
                            key="ghost-hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl
                              border border-dashed border-white/[0.04]
                              text-gray-700 text-sm font-english"
                          >
                            <span>{t("next")}</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/30 flex-shrink-0 safe-area-bottom">
                <button
                  onClick={(e) => { e.stopPropagation(); navigateModal(-1); }}
                  disabled={modalIndex <= 0}
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                    text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors
                    disabled:opacity-20 disabled:pointer-events-none"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {getCount(selectedThikr.id) > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountChange(selectedThikr.id, 0);
                    }}
                    className="text-xs text-gray-600 hover:text-red-400 transition-colors
                      px-3 py-1.5 rounded-lg hover:bg-red-500/10 font-english"
                  >
                    {t("reset")}
                  </button>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); navigateModal(1); }}
                  disabled={modalIndex >= modalTotal - 1}
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                    text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors
                    disabled:opacity-20 disabled:pointer-events-none"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
