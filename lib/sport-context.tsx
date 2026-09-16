import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { calculatePeriodStats, type StatsPeriod } from "@/lib/sport-logic";

export type RewardMinutes = 1 | 2;
export type LedgerType = "earned" | "spent";
export type AppId = "instagram" | "tiktok" | "youtube" | "netflix";

export type BlockedApp = {
  id: AppId;
  name: string;
  subtitle: string;
  icon: string;
  accent: string;
  blocked: boolean;
};

export type LedgerEntry = {
  id: string;
  type: LedgerType;
  minutes: number;
  repetitions?: number;
  appId?: AppId;
  date: string;
};

type SportState = {
  bankMinutes: number;
  rewardMinutes: RewardMinutes;
  apps: BlockedApp[];
  entries: LedgerEntry[];
};

type SportContextValue = SportState & {
  hydrated: boolean;
  selectedAppId: AppId;
  setRewardMinutes: (minutes: RewardMinutes) => void;
  toggleApp: (id: AppId) => void;
  selectApp: (id: AppId) => void;
  addPushup: () => void;
  spendMinutes: (appId: AppId, minutes: number) => boolean;
  getPeriodStats: (period: StatsPeriod) => { earned: number; spent: number; reps: number };
};

const STORAGE_KEY = "sportcamacho-state-v1";

const defaultApps: BlockedApp[] = [
  { id: "instagram", name: "Instagram", subtitle: "Redes sociales", icon: "camera-alt", accent: "#E46A87", blocked: true },
  { id: "tiktok", name: "TikTok", subtitle: "Vídeos cortos", icon: "music-note", accent: "#57C7C8", blocked: true },
  { id: "youtube", name: "YouTube", subtitle: "Entretenimiento", icon: "play-arrow", accent: "#F05B5B", blocked: false },
  { id: "netflix", name: "Netflix", subtitle: "Series y películas", icon: "movie", accent: "#C94C69", blocked: false },
];

const defaultState: SportState = {
  bankMinutes: 0,
  rewardMinutes: 1,
  apps: defaultApps,
  entries: [],
};

const SportContext = createContext<SportContextValue | null>(null);

export function SportProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SportState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<AppId>("instagram");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setState(JSON.parse(saved) as SportState);
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  const setRewardMinutes = useCallback((minutes: RewardMinutes) => {
    setState((current) => ({ ...current, rewardMinutes: minutes }));
  }, []);

  const toggleApp = useCallback((id: AppId) => {
    setState((current) => ({
      ...current,
      apps: current.apps.map((app) => (app.id === id ? { ...app, blocked: !app.blocked } : app)),
    }));
  }, []);

  const selectApp = useCallback((id: AppId) => setSelectedAppId(id), []);

  const addPushup = useCallback(() => {
    setState((current) => ({
      ...current,
      bankMinutes: current.bankMinutes + current.rewardMinutes,
      entries: [
        { id: `${Date.now()}`, type: "earned", minutes: current.rewardMinutes, repetitions: 1, date: new Date().toISOString() },
        ...current.entries,
      ],
    }));
  }, []);

  const spendMinutes = useCallback((appId: AppId, minutes: number) => {
    const accepted = minutes > 0 && state.bankMinutes >= minutes;
    setState((current) => {
      if (minutes <= 0 || current.bankMinutes < minutes) return current;
      return {
        ...current,
        bankMinutes: current.bankMinutes - minutes,
        entries: [{ id: `${Date.now()}`, type: "spent", minutes, appId, date: new Date().toISOString() }, ...current.entries],
      };
    });
    return accepted;
  }, [state.bankMinutes]);

  const getPeriodStats = useCallback(
    (period: StatsPeriod) => calculatePeriodStats(state.entries, period),
    [state.entries],
  );

  const value = useMemo(
    () => ({ ...state, hydrated, selectedAppId, setRewardMinutes, toggleApp, selectApp, addPushup, spendMinutes, getPeriodStats }),
    [state, hydrated, selectedAppId, setRewardMinutes, toggleApp, selectApp, addPushup, spendMinutes, getPeriodStats],
  );

  return <SportContext.Provider value={value}>{children}</SportContext.Provider>;
}

export function useSportCamacho() {
  const context = useContext(SportContext);
  if (!context) throw new Error("useSportCamacho must be used inside SportProvider");
  return context;
}
