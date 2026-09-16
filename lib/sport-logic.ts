import type { LedgerEntry } from "@/lib/sport-context";

export type StatsPeriod = "today" | "week" | "month";

export const LEVEL_TITLES = [
  "Aprendiz",
  "Recluta",
  "Guerrero",
  "Veterano",
  "Campeón",
  "Héroe",
  "Leyenda",
];

export type LevelInfo = {
  level: number;
  title: string;
  repsIntoLevel: number;
  repsForNextLevel: number;
  progress: number;
};

export function getTotalReps(entries: LedgerEntry[]): number {
  return entries.reduce((sum, entry) => (entry.type === "earned" ? sum + (entry.repetitions ?? 0) : sum), 0);
}

/**
 * Simple RPG-style level curve: each level requires 5 more reps than the previous one,
 * starting at 10 reps for level 1 -> 2.
 */
export function getLevelInfo(totalReps: number): LevelInfo {
  let level = 1;
  let remaining = totalReps;
  let needed = 10;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed += 5;
  }
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return { level, title, repsIntoLevel: remaining, repsForNextLevel: needed, progress: remaining / needed };
}

export function getStreakDays(entries: LedgerEntry[], reference = new Date()): number {
  const activeDays = new Set(
    entries.filter((entry) => entry.type === "earned").map((entry) => new Date(entry.date).toDateString()),
  );
  let streak = 0;
  const cursor = new Date(reference);
  while (activeDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getPeriodStart(period: StatsPeriod, reference = new Date()) {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  if (period === "week") {
    const day = start.getDay();
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  }
  if (period === "month") start.setDate(1);
  return start;
}

export function calculatePeriodStats(entries: LedgerEntry[], period: StatsPeriod, reference = new Date()) {
  const start = getPeriodStart(period, reference).getTime();
  return entries.reduce(
    (result, entry) => {
      if (new Date(entry.date).getTime() < start) return result;
      if (entry.type === "earned") {
        result.earned += entry.minutes;
        result.reps += entry.repetitions ?? 0;
      } else {
        result.spent += entry.minutes;
      }
      return result;
    },
    { earned: 0, spent: 0, reps: 0 },
  );
}
