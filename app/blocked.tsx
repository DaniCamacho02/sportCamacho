import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/app-icon";
import { ScreenContainer } from "@/components/screen-container";
import { useSportCamacho } from "@/lib/sport-context";

/**
 * Ruta de destino del deep link manussportcamacho://blocked?package=...
 * que lanza el AccessibilityService en cuanto detecta una app vetada en
 * primer plano. Aquí el usuario ve cuánto tiene en el banco y decide
 * cuánto invertir para desbloquearla, o va a entrenar para ganar más.
 */
export default function BlockedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ package?: string }>();
  const { apps, bankMinutes, spendMinutes, selectApp } = useSportCamacho();
  const [investment, setInvestment] = useState(1);

  const blockedPackage = params.package;
  const app = useMemo(() => apps.find((candidate) => candidate.id === blockedPackage), [apps, blockedPackage]);

  const invest = () => {
    if (!app) return;
    const ok = spendMinutes(app.id, investment);
    if (ok) router.replace("/(tabs)" as never);
  };

  const goTrain = () => {
    if (app) selectApp(app.id);
    router.replace("/(tabs)/train" as never);
  };

  return (
    <ScreenContainer className="px-5 pt-10" edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.lockCircle}><MaterialIcons name="lock" size={28} color="#D9FF66" /></View>
        <Text style={styles.eyebrow}>APP VETADA DETECTADA</Text>
        {app ? (
          <>
            <View style={styles.appRow}>
              <AppIcon icon={app.icon} accent={app.accent} size={44} />
              <Text style={styles.appName}>{app.name}</Text>
            </View>
            {app.sessionSecondsRemaining > 0 && (
              <Text style={styles.sessionText}>Ya tienes acceso durante {Math.ceil(app.sessionSecondsRemaining / 60)} min más.</Text>
            )}
          </>
        ) : (
          <Text style={styles.appName}>{blockedPackage ?? "Esta app"}</Text>
        )}
      </View>

      <View style={styles.bankCard}>
        <Text style={styles.bankLabel}>Minutos en tu banco</Text>
        <Text style={styles.bankValue}>{bankMinutes}</Text>
      </View>

      <View style={styles.investCard}>
        <Text style={styles.investLabel}>Invertir para desbloquear ahora</Text>
        <View style={styles.stepper}>
          <Pressable onPress={() => setInvestment((v) => Math.max(1, v - 1))} style={styles.stepButton}><MaterialIcons name="remove" size={20} color="#F5F7FB" /></Pressable>
          <Text style={styles.investValue}>{investment} min</Text>
          <Pressable onPress={() => setInvestment((v) => Math.min(Math.max(bankMinutes, 1), v + 1))} style={styles.stepButton}><MaterialIcons name="add" size={20} color="#F5F7FB" /></Pressable>
        </View>
        <Pressable
          disabled={bankMinutes < investment}
          onPress={invest}
          style={({ pressed }) => [styles.investButton, bankMinutes < investment && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={styles.investButtonText}>Desbloquear {investment} min</Text>
          <MaterialIcons name="lock-open" size={18} color="#101B2D" />
        </Pressable>
      </View>

      <Pressable onPress={goTrain} style={({ pressed }) => [styles.trainButton, pressed && styles.pressed]}>
        <MaterialIcons name="fitness-center" size={20} color="#D9FF66" />
        <Text style={styles.trainButtonText}>No tengo suficiente, ir a hacer flexiones</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", gap: 8, marginBottom: 28 },
  lockCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#1B263B", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  eyebrow: { color: "#9AA5BA", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  appRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 },
  appName: { color: "#F5F7FB", fontSize: 20, fontWeight: "900" },
  sessionText: { color: "#D9FF66", fontSize: 12, fontWeight: "700", marginTop: 4 },
  bankCard: { backgroundColor: "#151F32", borderRadius: 20, borderWidth: 1, borderColor: "#243149", padding: 18, alignItems: "center", marginBottom: 16 },
  bankLabel: { color: "#8995AA", fontSize: 12, fontWeight: "700" },
  bankValue: { color: "#D9FF66", fontSize: 34, fontWeight: "900", marginTop: 2 },
  investCard: { backgroundColor: "#151F32", borderRadius: 20, borderWidth: 1, borderColor: "#243149", padding: 18, gap: 14 },
  investLabel: { color: "#F5F7FB", fontSize: 14, fontWeight: "800", textAlign: "center" },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18 },
  stepButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#0E1728", alignItems: "center", justifyContent: "center" },
  investValue: { color: "#F5F7FB", fontSize: 18, fontWeight: "900", minWidth: 70, textAlign: "center" },
  investButton: { backgroundColor: "#D9FF66", borderRadius: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  investButtonText: { color: "#101B2D", fontSize: 14, fontWeight: "900" },
  disabled: { opacity: 0.4 },
  trainButton: { marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderColor: "#293750", borderRadius: 16, paddingVertical: 14 },
  trainButtonText: { color: "#D9FF66", fontSize: 13, fontWeight: "800" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
