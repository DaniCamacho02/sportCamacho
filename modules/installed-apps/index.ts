import InstalledAppsModule from "./src/InstalledAppsModule";

export type { InstalledAppInfo } from "./src/InstalledApps.types";

/**
 * Lista las apps con icono en el launcher del dispositivo (excluyendo sportCamacho).
 * Solo funciona en Android y requiere un development build (no funciona en Expo Go,
 * porque es un módulo nativo local).
 */
export async function getInstalledApps() {
  return InstalledAppsModule.getInstalledApps();
}
