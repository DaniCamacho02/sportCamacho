import { requireNativeModule } from "expo-modules-core";
import type { AppBlockerNativeModule } from "./AppBlocker.types";

// "AppBlocker" debe coincidir con Name("AppBlocker") en el Kotlin del módulo.
export default requireNativeModule<AppBlockerNativeModule>("AppBlocker");
