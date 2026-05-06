"use client";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { type StreakData, getDayStatus } from "@/lib/streaks";

interface StreakBannerProps {
  streakData: StreakData;
  categories: string[];
}

export default function StreakBanner({ streakData, categories }: StreakBannerProps) {
  const t = useTranslations("athkar");

  const days = useMemo(() => {
    const result: { date: string; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push({ date: d.toISOString().slice(0, 10), isToday: i === 0 });
    }
    return result;
  }, []);

  const hasStreak = streakData.currentStreak > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-3 rounded-xl
        bg-gray-900/40 backdrop-blur-sm border border-white/[0.04] mb-5"
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center
          ${hasStreak ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-gray-800/50 border border-gray-700/40"}`}>
          <svg className={`w-4 h-4 ${hasStreak ? "text-emerald-400" : "text-gray-600"}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.13 3.08-7.46.58-.7 1.23-1.37 1.92-2.04.4-.39 1.04-.2 1.18.33.36 1.35 1.07 2.51 2.1 3.27.2.15.47.04.5-.19.14-.99.56-2.36 1.62-4.15.28-.47.96-.5 1.28-.06C17.07 8.5 21 13.03 21 15c0 4.42-4.03 8-9 8z" />
          </svg>
        </div>
        {hasStreak ? (
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={streakData.currentStreak}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-bold text-white font-english tabular-nums"
            >
              {streakData.currentStreak}
            </motion.span>
            <span className="text-xs text-gray-500 font-english">{t("streak")}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-500 font-english">{t("noStreak")}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {days.map((day) => {
          const status = getDayStatus(day.date, categories);
          return (
            <div
              key={day.date}
              className={`rounded-full transition-all duration-300
                ${day.isToday ? "w-3 h-3" : "w-2 h-2"}
                ${status === "full"
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : status === "partial"
                    ? "bg-emerald-500/40"
                    : day.isToday
                      ? "bg-gray-700 ring-1 ring-emerald-500/30"
                      : "bg-gray-700/40"
                }`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
