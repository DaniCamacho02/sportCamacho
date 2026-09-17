export type InstalledAppInfo = {
  /** Identificador único, p.ej. "com.instagram.android" */
  packageName: string;
  /** Nombre visible tal como aparece en el launcher del dispositivo */
  appName: string;
  /** Icono real de la app como data URI base64 (image/png), o null si no se pudo leer */
  icon: string | null;
};

export type InstalledAppsNativeModule = {
  getInstalledApps: () => Promise<InstalledAppInfo[]>;
};
