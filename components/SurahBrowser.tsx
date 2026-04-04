"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChapterCard from "./ChapterCard";

interface Chapter {
  id: number;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
}

interface SurahBrowserProps {
  chapters: Chapter[];
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
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

const filterPills: { label: string; value: RevelationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Meccan", value: "makkah" },
  { label: "Medinan", value: "madinah" },
];

export default function SurahBrowser({ chapters }: SurahBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("all");

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

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-english text-gray-100 mb-3">
          Browse <span className="gradient-text">Surahs</span>
        </h2>
        <p className="text-gray-500 font-english">
          Select a surah to start reading
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-8">
        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[280px]">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search surahs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl
              bg-gray-900/60 backdrop-blur-sm border border-white/[0.06]
              text-gray-200 placeholder-gray-500 font-english text-sm
              focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20
              transition-all duration-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-900/40 backdrop-blur-sm rounded-xl p-1 border border-white/[0.04]">
          {filterPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setRevelationFilter(pill.value)}
              className={`px-4 py-1.5 rounded-lg font-english text-sm transition-all duration-200 btn-press
                ${revelationFilter === pill.value
                  ? "bg-emerald-500 text-gray-950 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count when filtering */}
      {(searchQuery || revelationFilter !== "all") && (
        <p className="text-xs text-gray-500 font-english mb-4">
          {filtered.length} surah{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key={`${searchQuery}-${revelationFilter}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5"
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
            className="text-center py-16"
          >
            <p className="text-gray-500 font-english">No surahs found</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRevelationFilter("all");
              }}
              className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 font-english transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
