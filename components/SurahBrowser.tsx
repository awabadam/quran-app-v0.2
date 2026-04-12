"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChapterCard from "./ChapterCard";
import JuzCard from "./JuzCard";

interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: { [chapterId: string]: string };
  verses_count: number;
}

type BrowseMode = "surahs" | "juz";

interface Chapter {
  id: number;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
}

type RevelationFilter = "all" | "makkah" | "madinah";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

const filterPills: { label: string; value: RevelationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Meccan", value: "makkah" },
  { label: "Medinan", value: "madinah" },
];

export default function SurahBrowser({ chapters, juzs = [] }: { chapters: Chapter[]; juzs?: Juz[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("all");
  const [browseMode, setBrowseMode] = useState<BrowseMode>("surahs");

  const filtered = useMemo(() => {
    return chapters.filter((ch) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        ch.name_simple.toLowerCase().includes(q) ||
        ch.name_arabic.includes(searchQuery) ||
        ch.id.toString() === q;
      const matchesPlace =
        revelationFilter === "all" || ch.revelation_place === revelationFilter;
      return matchesSearch && matchesPlace;
    });
  }, [chapters, searchQuery, revelationFilter]);

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

  return (
    <div>
      {/* Header + Toolbar */}
      <div className="flex flex-col gap-6 mb-10">
        <div>
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
        </div>

        {browseMode === "surahs" && (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-[280px]">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search surahs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full
                  bg-white/[0.03] border border-white/[0.05]
                  text-gray-200 placeholder-gray-600 font-english text-sm
                  focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05]
                  transition-all duration-200"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1">
              {filterPills.map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setRevelationFilter(pill.value)}
                  className={`px-3.5 py-1.5 rounded-full font-english text-[13px] transition-all duration-200
                    ${revelationFilter === pill.value
                      ? "bg-emerald-500 text-gray-950 font-medium"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                    }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {browseMode === "surahs" && (searchQuery || revelationFilter !== "all") && (
        <p className="text-xs text-gray-600 font-english mb-4">
          {filtered.length} surah{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {browseMode === "surahs" && (
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${searchQuery}-${revelationFilter}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((chapter) => (
                <motion.div key={chapter.id} variants={itemVariants} layout>
                  <ChapterCard
                    id={chapter.id}
                    arName={chapter.name_arabic}
                    enName={chapter.name_simple}
                    verses={chapter.verses_count}
                    place={chapter.revelation_place}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-600 font-english text-sm">No surahs found</p>
              <button
                onClick={() => { setSearchQuery(""); setRevelationFilter("all"); }}
                className="mt-2 text-xs text-emerald-500 hover:text-emerald-400 font-english transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

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
    </div>
  );
}
