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

interface SurahsGridProps {
  chapters: Chapter[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function SurahsGrid({ chapters }: SurahsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5"
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
