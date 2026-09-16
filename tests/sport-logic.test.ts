import { describe, expect, it } from "vitest";

import { calculatePeriodStats } from "../lib/sport-logic";
import type { LedgerEntry } from "../lib/sport-context";

const reference = new Date("2026-09-16T15:00:00.000Z");
const entries: LedgerEntry[] = [
  { id: "today-earned", type: "earned", minutes: 2, repetitions: 1, date: "2026-09-16T09:00:00.000Z" },
  { id: "today-spent", type: "spent", minutes: 1, appId: "instagram", date: "2026-09-16T10:00:00.000Z" },
  { id: "week-earned", type: "earned", minutes: 1, repetitions: 1, date: "2026-09-14T09:00:00.000Z" },
  { id: "month-earned", type: "earned", minutes: 2, repetitions: 1, date: "2026-09-02T09:00:00.000Z" },
  { id: "old-earned", type: "earned", minutes: 8, repetitions: 8, date: "2026-08-28T09:00:00.000Z" },
];

describe("calculatePeriodStats", () => {
  it("calcula los minutos y repeticiones del día", () => {
    expect(calculatePeriodStats(entries, "today", reference)).toEqual({ earned: 2, spent: 1, reps: 1 });
  });

  it("incluye desde el lunes en la vista semanal", () => {
    expect(calculatePeriodStats(entries, "week", reference)).toEqual({ earned: 3, spent: 1, reps: 2 });
  });

  it("incluye todo el mes actual y excluye meses anteriores", () => {
    expect(calculatePeriodStats(entries, "month", reference)).toEqual({ earned: 5, spent: 1, reps: 3 });
  });
});
