import AppBlockerModule from "./src/AppBlockerModule";

export type { BlockedSession } from "./src/AppBlocker.types";

export async function syncBlockerState(blockedPackages: string[], sessions: { packageName: string; expiresAt: number }[]) {
  return AppBlockerModule.syncState(blockedPackages, sessions);
}

export async function isAccessibilityServiceEnabled(): Promise<boolean> {
  return AppBlockerModule.isAccessibilityServiceEnabled();
}

export async function openAccessibilitySettings(): Promise<void> {
  return AppBlockerModule.openAccessibilitySettings();
}
