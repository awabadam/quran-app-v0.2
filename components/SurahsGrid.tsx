"use client";
import { motion } from "framer-motion";
import ChapterCard from "./ChapterCard";

interface Chapter {
  id: number;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 150, damping: 20 },
  },
} as const;

export default function SurahsGrid({ chapters }: { chapters: Chapter[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {chapters.map((chapter) => (
        <motion.div key={chapter.id} variants={itemVariants}>
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
  );
}
