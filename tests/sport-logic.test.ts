import { describe, expect, it } from "vitest";

import { calculatePeriodStats, getLevelInfo, getStreakDays, getTotalReps } from "../lib/sport-logic";
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

describe("getTotalReps", () => {
  it("suma solo las repeticiones de entradas ganadas", () => {
    expect(getTotalReps(entries)).toBe(11);
  });
});

describe("getLevelInfo", () => {
  it("empieza en nivel 1 con 0 repeticiones", () => {
    expect(getLevelInfo(0)).toEqual({ level: 1, title: "Aprendiz", repsIntoLevel: 0, repsForNextLevel: 10, progress: 0 });
  });

  it("sube de nivel al superar el umbral de repeticiones", () => {
    // 10 reps -> nivel 2 (Recluta), con 0 reps hacia el nivel 3 (que ahora exige 15)
    expect(getLevelInfo(10)).toEqual({ level: 2, title: "Recluta", repsIntoLevel: 0, repsForNextLevel: 15, progress: 0 });
  });

  it("acumula progreso a mitad de nivel", () => {
    // 10 (nivel 1->2) + 7 de 15 (nivel 2->3)
    expect(getLevelInfo(17)).toEqual({ level: 2, title: "Recluta", repsIntoLevel: 7, repsForNextLevel: 15, progress: 7 / 15 });
  });

  it("usa el último título disponible para niveles muy altos", () => {
    expect(getLevelInfo(1000).title).toBe("Leyenda");
  });
});

describe("getStreakDays", () => {
  it("cuenta días consecutivos con actividad hasta la fecha de referencia", () => {
    const streakEntries: LedgerEntry[] = [
      { id: "d0", type: "earned", minutes: 1, repetitions: 1, date: "2026-09-16T09:00:00.000Z" },
      { id: "d1", type: "earned", minutes: 1, repetitions: 1, date: "2026-09-15T09:00:00.000Z" },
      { id: "d2", type: "earned", minutes: 1, repetitions: 1, date: "2026-09-14T09:00:00.000Z" },
      { id: "gap", type: "earned", minutes: 1, repetitions: 1, date: "2026-09-10T09:00:00.000Z" },
    ];
    expect(getStreakDays(streakEntries, reference)).toBe(3);
  });

  it("devuelve 0 si no hay actividad hoy", () => {
    const entriesWithoutToday: LedgerEntry[] = [
      { id: "yesterday", type: "earned", minutes: 1, repetitions: 1, date: "2026-09-15T09:00:00.000Z" },
    ];
    expect(getStreakDays(entriesWithoutToday, reference)).toBe(0);
  });
});
