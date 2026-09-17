export type BlockedSession = {
  packageName: string;
  /** Epoch millis en el que expira el acceso concedido. */
  expiresAt: number;
};

export type AppBlockerNativeModule = {
  /** Sobrescribe por completo qué paquetes están vetados y qué sesiones de acceso siguen vivas. */
  syncState: (blockedPackages: string[], sessions: BlockedSession[]) => Promise<void>;
  isAccessibilityServiceEnabled: () => Promise<boolean>;
  openAccessibilitySettings: () => Promise<void>;
};
