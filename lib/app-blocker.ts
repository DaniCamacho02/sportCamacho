import { Platform } from "react-native";
import type { BlockedSession } from "@/modules/app-blocker";

const isNativeCapable = Platform.OS === "android";

async function loadNative() {
  if (!isNativeCapable) return null;
  try {
    return await import("@/modules/app-blocker");
  } catch (error) {
    console.warn(
      "[app-blocker] Módulo nativo no disponible. ¿Estás usando Expo Go en vez de un development build?",
      error,
    );
    return null;
  }
}

/** Envía el estado actual de apps vetadas + sesiones al AccessibilityService nativo. */
export async function syncBlockerState(blockedPackages: string[], sessions: BlockedSession[]): Promise<boolean> {
  const native = await loadNative();
  if (!native) return false;
  await native.syncBlockerState(blockedPackages, sessions);
  return true;
}

/** true si el usuario ha activado sportCamacho en Ajustes > Accesibilidad. */
export async function isAccessibilityServiceEnabled(): Promise<boolean> {
  const native = await loadNative();
  if (!native) return false;
  return native.isAccessibilityServiceEnabled();
}

/** Abre la pantalla de Ajustes > Accesibilidad para que el usuario active el servicio a mano. */
export async function openAccessibilitySettings(): Promise<boolean> {
  const native = await loadNative();
  if (!native) return false;
  await native.openAccessibilitySettings();
  return true;
}

export const appBlockerAvailable = isNativeCapable;
