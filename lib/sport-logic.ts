import type { LedgerEntry } from "@/lib/sport-context";

export type StatsPeriod = "today" | "week" | "month";

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
