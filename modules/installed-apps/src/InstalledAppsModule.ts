import { requireNativeModule } from "expo-modules-core";
import type { InstalledAppsNativeModule } from "./InstalledApps.types";

// "InstalledApps" debe coincidir con Name("InstalledApps") declarado en el Kotlin del módulo.
export default requireNativeModule<InstalledAppsNativeModule>("InstalledApps");
