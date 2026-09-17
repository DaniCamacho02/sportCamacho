import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calculatePeriodStats, getLevelInfo, getStreakDays, getTotalReps, type LevelInfo, type StatsPeriod } from "@/lib/sport-logic";
import { colorFromString } from "@/lib/app-colors";
import { getInstalledApps } from "@/lib/installed-apps";
import { appBlockerAvailable, isAccessibilityServiceEnabled, openAccessibilitySettings, syncBlockerState } from "@/lib/app-blocker";
import type { AvatarId } from "@/components/avatars/hero-avatars";

export type RewardMinutes = 1 | 2;
export type LedgerType = "earned" | "spent";
/** El id de una app es su packageName real (p.ej. "com.instagram.android"). */
export type AppId = string;

export type ActiveSession = {
  packageName: AppId;
  /** Epoch millis en el que expira el acceso concedido. */
  expiresAt: number;
};

export type BlockedApp = {
  id: AppId;
  name: string;
  /** Para apps reales: el packageName. Para las apps demo: una categoría corta. */
  subtitle: string;
  /** data URI base64 del icono real, un nombre de MaterialIcons (demo), o null. */
  icon: string | null;
  accent: string;
  blocked: boolean;
  /** Segundos restantes de una sesión de tiempo pagado vigente, o 0 si no hay ninguna. */
  sessionSecondsRemaining: number;
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
  entries: LedgerEntry[];
  avatarId: AvatarId;
  /** packageNames marcados como vetados; persistido independientemente de qué apps haya instaladas ahora. */
  blockedPackages: string[];
  activeSessions: ActiveSession[];
};

type SportContextValue = SportState & {
  hydrated: boolean;
  selectedAppId: AppId;
  apps: BlockedApp[];
  appsLoading: boolean;
  /** true si no se pudo leer la lista real de apps instaladas (Expo Go, iOS, web...). */
  appsUnavailable: boolean;
  /** true en Android con development build; false en Expo Go, iOS o web. */
  blockerAvailable: boolean;
  /** true si el usuario ya activó sportCamacho en Ajustes > Accesibilidad. */
  accessibilityEnabled: boolean;
  refreshAccessibilityStatus: () => void;
  requestAccessibilityAccess: () => void;
  totalReps: number;
  levelInfo: LevelInfo;
  streakDays: number;
  setRewardMinutes: (minutes: RewardMinutes) => void;
  toggleApp: (id: AppId) => void;
  selectApp: (id: AppId) => void;
  setAvatarId: (id: AvatarId) => void;
  addPushup: () => void;
  spendMinutes: (appId: AppId, minutes: number) => boolean;
  getPeriodStats: (period: StatsPeriod) => { earned: number; spent: number; reps: number };
  refreshInstalledApps: () => void;
};

const STORAGE_KEY = "sportcamacho-state-v1";

/** Apps de ejemplo que se muestran mientras no haya un development build con el módulo nativo. */
const demoApps: Omit<BlockedApp, "blocked" | "sessionSecondsRemaining">[] = [
  { id: "demo.instagram", name: "Instagram (demo)", subtitle: "Redes sociales", icon: "camera-alt", accent: "#E46A87" },
  { id: "demo.tiktok", name: "TikTok (demo)", subtitle: "Vídeos cortos", icon: "music-note", accent: "#57C7C8" },
  { id: "demo.youtube", name: "YouTube (demo)", subtitle: "Entretenimiento", icon: "play-arrow", accent: "#F05B5B" },
  { id: "demo.netflix", name: "Netflix (demo)", subtitle: "Series y películas", icon: "movie", accent: "#C94C69" },
];

const defaultState: SportState = {
  bankMinutes: 0,
  rewardMinutes: 1,
  entries: [],
  avatarId: "warrior",
  blockedPackages: ["demo.instagram", "demo.tiktok"],
  activeSessions: [],
};

const SportContext = createContext<SportContextValue | null>(null);

export function SportProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SportState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<AppId>("");
  const [installedApps, setInstalledApps] = useState<Omit<BlockedApp, "blocked" | "sessionSecondsRemaining">[]>(demoApps);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsUnavailable, setAppsUnavailable] = useState(false);
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setState((current) => ({ ...current, ...(JSON.parse(saved) as Partial<SportState>) }));
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  // Refresca el reloj cada 5s para que la cuenta atrás de las sesiones y la limpieza
  // de sesiones caducadas se mantengan al día mientras la app está en uso.
  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setState((current) => {
      const stillValid = current.activeSessions.filter((session) => session.expiresAt > nowTick);
      if (stillValid.length === current.activeSessions.length) return current;
      return { ...current, activeSessions: stillValid };
    });
  }, [nowTick]);

  const refreshInstalledApps = useCallback(() => {
    setAppsLoading(true);
    getInstalledApps()
      .then(({ apps, unavailable }) => {
        setAppsUnavailable(unavailable);
        if (unavailable || apps.length === 0) {
          setInstalledApps(demoApps);
          return;
        }
        setInstalledApps(
          apps.map((app) => ({
            id: app.packageName,
            name: app.appName,
            subtitle: app.packageName,
            icon: app.icon,
            accent: colorFromString(app.packageName),
          })),
        );
      })
      .finally(() => setAppsLoading(false));
  }, []);

  useEffect(() => {
    refreshInstalledApps();
  }, [refreshInstalledApps]);

  const refreshAccessibilityStatus = useCallback(() => {
    isAccessibilityServiceEnabled().then(setAccessibilityEnabled);
  }, []);

  useEffect(() => {
    refreshAccessibilityStatus();
  }, [refreshAccessibilityStatus]);

  // Cada vez que cambian las apps vetadas o las sesiones activas, se lo decimos al
  // AccessibilityService nativo para que sepa qué bloquear ahora mismo.
  useEffect(() => {
    syncBlockerState(state.blockedPackages, state.activeSessions);
  }, [state.blockedPackages, state.activeSessions]);

  const apps = useMemo<BlockedApp[]>(
    () =>
      installedApps.map((app) => {
        const session = state.activeSessions.find((entry) => entry.packageName === app.id);
        const sessionSecondsRemaining = session ? Math.max(0, Math.round((session.expiresAt - nowTick) / 1000)) : 0;
        return { ...app, blocked: state.blockedPackages.includes(app.id), sessionSecondsRemaining };
      }),
    [installedApps, state.blockedPackages, state.activeSessions, nowTick],
  );

  useEffect(() => {
    if (!appsLoading && apps.length > 0 && !apps.some((app) => app.id === selectedAppId)) {
      setSelectedAppId(apps.find((app) => app.blocked)?.id ?? apps[0].id);
    }
  }, [appsLoading, apps, selectedAppId]);

  const setRewardMinutes = useCallback((minutes: RewardMinutes) => {
    setState((current) => ({ ...current, rewardMinutes: minutes }));
  }, []);

  const toggleApp = useCallback((id: AppId) => {
    setState((current) => ({
      ...current,
      blockedPackages: current.blockedPackages.includes(id)
        ? current.blockedPackages.filter((packageName) => packageName !== id)
        : [...current.blockedPackages, id],
    }));
  }, []);

  const selectApp = useCallback((id: AppId) => setSelectedAppId(id), []);

  const setAvatarId = useCallback((id: AvatarId) => {
    setState((current) => ({ ...current, avatarId: id }));
  }, []);

  const requestAccessibilityAccess = useCallback(() => {
    openAccessibilitySettings();
  }, []);

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

  const stateRef = useRef(state);
  stateRef.current = state;

  const spendMinutes = useCallback((appId: AppId, minutes: number) => {
    const current = stateRef.current;
    const accepted = minutes > 0 && current.bankMinutes >= minutes;
    if (!accepted) return false;

    setState((prev) => {
      if (minutes <= 0 || prev.bankMinutes < minutes) return prev;
      const now = Date.now();
      const existing = prev.activeSessions.find((session) => session.packageName === appId);
      const base = existing && existing.expiresAt > now ? existing.expiresAt : now;
      const newExpiresAt = base + minutes * 60 * 1000;

      return {
        ...prev,
        bankMinutes: prev.bankMinutes - minutes,
        entries: [{ id: `${Date.now()}`, type: "spent", minutes, appId, date: new Date().toISOString() }, ...prev.entries],
        activeSessions: [
          ...prev.activeSessions.filter((session) => session.packageName !== appId),
          { packageName: appId, expiresAt: newExpiresAt },
        ],
      };
    });
    return accepted;
  }, []);

  const getPeriodStats = useCallback(
    (period: StatsPeriod) => calculatePeriodStats(state.entries, period),
    [state.entries],
  );

  const totalReps = useMemo(() => getTotalReps(state.entries), [state.entries]);
  const levelInfo = useMemo(() => getLevelInfo(totalReps), [totalReps]);
  const streakDays = useMemo(() => getStreakDays(state.entries), [state.entries]);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      selectedAppId,
      apps,
      appsLoading,
      appsUnavailable,
      blockerAvailable: appBlockerAvailable,
      accessibilityEnabled,
      refreshAccessibilityStatus,
      requestAccessibilityAccess,
      totalReps,
      levelInfo,
      streakDays,
      setRewardMinutes,
      toggleApp,
      selectApp,
      setAvatarId,
      addPushup,
      spendMinutes,
      getPeriodStats,
      refreshInstalledApps,
    }),
    [
      state,
      hydrated,
      selectedAppId,
      apps,
      appsLoading,
      appsUnavailable,
      accessibilityEnabled,
      refreshAccessibilityStatus,
      requestAccessibilityAccess,
      totalReps,
      levelInfo,
      streakDays,
      setRewardMinutes,
      toggleApp,
      selectApp,
      setAvatarId,
      addPushup,
      spendMinutes,
      getPeriodStats,
      refreshInstalledApps,
    ],
  );

  return <SportContext.Provider value={value}>{children}</SportContext.Provider>;
}

export function useSportCamacho() {
  const context = useContext(SportContext);
  if (!context) throw new Error("useSportCamacho must be used inside SportProvider");
  return context;
}
