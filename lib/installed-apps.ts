import { Platform } from "react-native";

export type { InstalledAppInfo } from "@/modules/installed-apps";

export type InstalledAppsResult = {
  apps: { packageName: string; appName: string; icon: string | null }[];
  /** true si el módulo nativo no está disponible (Expo Go, iOS, web o build sin prebuild). */
  unavailable: boolean;
};

/**
 * Devuelve las apps instaladas con lanzador. Si el módulo nativo no está
 * disponible (por ejemplo en Expo Go, donde los módulos nativos locales no
 * funcionan sin un development build) devuelve una lista vacía y marca
 * `unavailable: true` para que la UI pueda explicarlo en vez de fallar.
 */
export async function getInstalledApps(): Promise<InstalledAppsResult> {
  if (Platform.OS !== "android") {
    return { apps: [], unavailable: true };
  }

  try {
    const native = await import("@/modules/installed-apps");
    const apps = await native.getInstalledApps();
    return { apps, unavailable: false };
  } catch (error) {
    console.warn(
      "[installed-apps] Módulo nativo no disponible. ¿Estás usando Expo Go en vez de un development build?",
      error,
    );
    return { apps: [], unavailable: true };
  }
}
