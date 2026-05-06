const STORAGE_KEY = "athkar-streaks";

export interface DayCompletion {
  [category: string]: boolean;
}

export interface CompletionLog {
  [date: string]: DayCompletion;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  completionLog: CompletionLog;
}

function getDefaultStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    completionLog: {},
  };
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getStreakData(): StreakData {
  if (typeof window === "undefined") return getDefaultStreakData();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultStreakData();
    const parsed = JSON.parse(saved);
    // Validate structure
    if (
      typeof parsed.currentStreak !== "number" ||
      typeof parsed.longestStreak !== "number" ||
      typeof parsed.completionLog !== "object"
    ) {
      return getDefaultStreakData();
    }
    return parsed as StreakData;
  } catch {
    return getDefaultStreakData();
  }
}

export function saveStreakData(data: StreakData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function markCategoryCompleted(
  category: string,
  date?: string
): StreakData {
  const data = getStreakData();
  const dateKey = date || getTodayKey();

  if (!data.completionLog[dateKey]) {
    data.completionLog[dateKey] = {};
  }
  data.completionLog[dateKey][category] = true;

  const { current, longest } = calculateStreak(data.completionLog);
  data.currentStreak = current;
  data.longestStreak = Math.max(longest, data.longestStreak);

  saveStreakData(data);
  return data;
}

export function calculateStreak(
  log: CompletionLog
): { current: number; longest: number } {
  if (!log || Object.keys(log).length === 0) {
    return { current: 0, longest: 0 };
  }

  // Check if a day has at least one completed category
  const isDayCompleted = (dateKey: string): boolean => {
    const day = log[dateKey];
    if (!day) return false;
    return Object.values(day).some((v) => v === true);
  };

  // Walk backwards from today
  const today = new Date();
  let current = 0;
  const checkDate = new Date(today);

  // Check today first
  const todayKey = checkDate.toISOString().slice(0, 10);
  if (isDayCompleted(todayKey)) {
    current = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If today isn't completed, check if yesterday was (streak still alive until end of today)
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayKey = checkDate.toISOString().slice(0, 10);
    if (!isDayCompleted(yesterdayKey)) {
      // Streak is broken — but still calculate longest from history
      return { current: 0, longest: calculateLongest(log) };
    }
  }

  // Walk backwards counting consecutive days
  while (true) {
    const key = checkDate.toISOString().slice(0, 10);
    if (isDayCompleted(key)) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const longest = calculateLongest(log);
  return { current, longest: Math.max(current, longest) };
}

function calculateLongest(log: CompletionLog): number {
  // Get all dates sorted
  const dates = Object.keys(log).sort();
  if (dates.length === 0) return 0;

  let longest = 0;
  let streak = 0;

  for (let i = 0; i < dates.length; i++) {
    const day = log[dates[i]];
    const hasCompletion = day && Object.values(day).some((v) => v === true);

    if (!hasCompletion) continue;

    if (i === 0) {
      streak = 1;
    } else {
      // Check if this date is consecutive with previous completed date
      const prevDate = new Date(dates[i - 1] + "T00:00:00");
      const currDate = new Date(dates[i] + "T00:00:00");
      const diffDays =
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      // Find the previous date that had a completion
      let prevCompletedIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        const d = log[dates[j]];
        if (d && Object.values(d).some((v) => v === true)) {
          prevCompletedIdx = j;
          break;
        }
      }

      if (prevCompletedIdx >= 0) {
        const prevCompDate = new Date(dates[prevCompletedIdx] + "T00:00:00");
        const diff =
          (currDate.getTime() - prevCompDate.getTime()) /
          (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }
    }

    longest = Math.max(longest, streak);
  }

  return longest;
}

export function getCompletionForDate(date: string): DayCompletion | null {
  const data = getStreakData();
  return data.completionLog[date] || null;
}

/**
 * Returns completion status for a date:
 * "none" = no categories completed
 * "partial" = some categories completed
 * "full" = all known categories completed
 */
export function getDayStatus(
  date: string,
  allCategories: string[]
): "none" | "partial" | "full" {
  const data = getStreakData();
  const day = data.completionLog[date];
  if (!day) return "none";

  const completedCount = allCategories.filter((cat) => day[cat] === true).length;
  if (completedCount === 0) return "none";
  if (completedCount >= allCategories.length) return "full";
  return "partial";
}
