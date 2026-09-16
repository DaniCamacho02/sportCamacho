import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useSportCamacho } from "@/lib/sport-context";

export default function TrainScreen() {
  const router = useRouter();
  const { bankMinutes, rewardMinutes, setRewardMinutes, addPushup, apps, selectedAppId, spendMinutes, selectApp } = useSportCamacho();
  const [permission, requestPermission] = useCameraPermissions();
  const [lastEarned, setLastEarned] = useState<number | null>(null);
  const [investment, setInvestment] = useState(1);
  const selectedApp = apps.find((app) => app.id === selectedAppId) ?? apps[0];

  const completeRep = () => {
    addPushup();
    setLastEarned(rewardMinutes);
    setTimeout(() => setLastEarned(null), 1800);
  };

  const invest = () => {
    if (spendMinutes(selectedApp.id, investment)) {
      setInvestment(1);
      router.push("/(tabs)/index" as never);
    }
  };

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View><Text style={styles.eyebrow}>ENTRENAMIENTO</Text><Text style={styles.title}>Activa tu tiempo</Text></View>
          <View style={styles.counter}><MaterialIcons name="timer" size={16} color="#D9FF66" /><Text style={styles.counterText}>{bankMinutes} min</Text></View>
        </View>

        <View style={styles.cameraShell}>
          {Platform.OS === "web" ? (
            <View style={styles.cameraFallback}>
              <View style={styles.cameraCircle}><MaterialIcons name="videocam" size={38} color="#D9FF66" /></View>
              <Text style={styles.cameraTitle}>Cámara lista para entrenar</Text>
              <Text style={styles.cameraBody}>En la app nativa, sportCamacho usará la cámara frontal para validar el rango de movimiento.</Text>
            </View>
          ) : !permission ? (
            <View style={styles.cameraFallback}><Text style={styles.cameraBody}>Preparando cámara…</Text></View>
          ) : !permission.granted ? (
            <View style={styles.cameraFallback}>
              <View style={styles.cameraCircle}><MaterialIcons name="camera-alt" size={38} color="#D9FF66" /></View>
              <Text style={styles.cameraTitle}>Necesitamos la cámara</Text>
              <Text style={styles.cameraBody}>Coloca el móvil de lado y deja que la cámara compruebe cada repetición.</Text>
              <Pressable onPress={requestPermission} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>Dar permiso</Text></Pressable>
            </View>
          ) : (
            <CameraView style={styles.camera} facing="front">
              <View style={styles.cameraOverlay}><View style={styles.poseFrame}><Text style={styles.poseLabel}>ENCUADRA TU CUERPO</Text></View><Text style={styles.cameraHint}>Baja el pecho · sube con control</Text></View>
            </CameraView>
          )}
          <View style={styles.cameraBadge}><View style={styles.liveDot} /><Text style={styles.cameraBadgeText}>MODO DEMO</Text></View>
        </View>

        <View style={styles.notice}><MaterialIcons name="info-outline" size={18} color="#D9FF66" /><Text style={styles.noticeText}>El contador automático de pose se conectará en la build nativa. Usa el botón para simular una detección.</Text></View>

        <Text style={styles.sectionTitle}>¿Cuánto vale cada flexión?</Text>
        <View style={styles.rewardRow}>
          {[1, 2].map((minutes) => (
            <Pressable key={minutes} onPress={() => setRewardMinutes(minutes as 1 | 2)} style={[styles.rewardOption, rewardMinutes === minutes && styles.rewardOptionActive]}>
              <Text style={[styles.rewardValue, rewardMinutes === minutes && styles.rewardValueActive]}>{minutes}</Text><Text style={[styles.rewardUnit, rewardMinutes === minutes && styles.rewardValueActive]}>minuto</Text>
              {rewardMinutes === minutes && <MaterialIcons name="check-circle" size={17} color="#101B2D" />}
            </Pressable>
          ))}
        </View>

        <Pressable onPress={completeRep} style={({ pressed }) => [styles.repButton, pressed && styles.pressed]}><MaterialIcons name="fitness-center" size={22} color="#101B2D" /><Text style={styles.repButtonText}>Registrar flexión detectada</Text></Pressable>
        {lastEarned !== null && <View style={styles.successToast}><MaterialIcons name="check" size={18} color="#101B2D" /><Text style={styles.successText}>+{lastEarned} minuto{lastEarned > 1 ? "s" : ""} al banco</Text></View>}

        <View style={styles.investHeader}><Text style={styles.sectionTitle}>Invertir minutos</Text><Text style={styles.available}>{bankMinutes} disponibles</Text></View>
        <Text style={styles.muted}>Desbloquea una app vetada durante el tiempo que elijas.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.appsRail}>
          {apps.filter((app) => app.blocked).map((app) => (
            <Pressable key={app.id} onPress={() => selectApp(app.id)} style={[styles.appChoice, selectedApp.id === app.id && styles.appChoiceActive]}>
              <View style={[styles.appChoiceIcon, { backgroundColor: app.accent }]}><MaterialIcons name={app.icon as never} size={18} color="#fff" /></View><Text style={styles.appChoiceText}>{app.name}</Text>{selectedApp.id === app.id && <MaterialIcons name="check" size={15} color="#D9FF66" />}
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.investRow}>
          <View style={styles.stepper}><Pressable onPress={() => setInvestment(Math.max(1, investment - 1))} style={styles.stepButton}><MaterialIcons name="remove" size={20} color="#F5F7FB" /></Pressable><Text style={styles.investValue}>{investment} min</Text><Pressable onPress={() => setInvestment(Math.min(Math.max(bankMinutes, 1), investment + 1))} style={styles.stepButton}><MaterialIcons name="add" size={20} color="#F5F7FB" /></Pressable></View>
          <Pressable disabled={bankMinutes < investment} onPress={invest} style={({ pressed }) => [styles.investButton, bankMinutes < investment && styles.disabled, pressed && styles.pressed]}><Text style={styles.investButtonText}>Invertir</Text><MaterialIcons name="arrow-forward" size={18} color="#101B2D" /></Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 30, gap: 17 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { color: "#9AA5BA", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#F5F7FB", fontSize: 28, fontWeight: "900", marginTop: 5 },
  counter: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#1B263B", borderRadius: 13, paddingHorizontal: 10, paddingVertical: 8 },
  counterText: { color: "#D9FF66", fontSize: 12, fontWeight: "900" },
  cameraShell: { height: 295, borderRadius: 25, overflow: "hidden", backgroundColor: "#0E1728", borderWidth: 1, borderColor: "#2B3953", position: "relative" },
  camera: { flex: 1 },
  cameraFallback: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 10 },
  cameraCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#263B2B", alignItems: "center", justifyContent: "center", marginBottom: 5 },
  cameraTitle: { color: "#F5F7FB", fontSize: 18, fontWeight: "900", textAlign: "center" },
  cameraBody: { color: "#9AA5BA", fontSize: 13, lineHeight: 19, textAlign: "center" },
  cameraOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 10 },
  poseFrame: { width: 190, height: 205, borderRadius: 95, borderWidth: 1.5, borderColor: "rgba(217,255,102,0.75)", borderStyle: "dashed", alignItems: "center", justifyContent: "flex-start", paddingTop: 16 },
  poseLabel: { color: "#D9FF66", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  cameraHint: { color: "#F5F7FB", fontSize: 12, fontWeight: "800", marginTop: 15 },
  cameraBadge: { position: "absolute", top: 14, left: 14, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, backgroundColor: "rgba(14,23,40,0.75)" },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#D9FF66" },
  cameraBadgeText: { color: "#D9FF66", fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  notice: { flexDirection: "row", gap: 8, backgroundColor: "#1B263B", borderRadius: 14, padding: 12, alignItems: "flex-start" },
  noticeText: { color: "#AAB4C6", flex: 1, fontSize: 11, lineHeight: 16 },
  sectionTitle: { color: "#F5F7FB", fontSize: 17, fontWeight: "900" },
  rewardRow: { flexDirection: "row", gap: 12 },
  rewardOption: { flex: 1, borderRadius: 18, padding: 15, backgroundColor: "#151F32", borderWidth: 1, borderColor: "#243149", flexDirection: "row", alignItems: "baseline", gap: 4 },
  rewardOptionActive: { backgroundColor: "#D9FF66", borderColor: "#D9FF66" },
  rewardValue: { color: "#F5F7FB", fontSize: 28, fontWeight: "900" },
  rewardValueActive: { color: "#101B2D" },
  rewardUnit: { color: "#8995AA", fontSize: 12, fontWeight: "700", flex: 1 },
  primaryButton: { marginTop: 7, backgroundColor: "#D9FF66", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
  primaryButtonText: { color: "#101B2D", fontSize: 13, fontWeight: "900" },
  repButton: { height: 54, borderRadius: 17, backgroundColor: "#D9FF66", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9 },
  repButtonText: { color: "#101B2D", fontSize: 14, fontWeight: "900" },
  successToast: { alignSelf: "center", flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: "#D9FF66", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: -6 },
  successText: { color: "#101B2D", fontSize: 12, fontWeight: "900" },
  investHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  available: { color: "#D9FF66", fontSize: 12, fontWeight: "800" },
  muted: { color: "#8995AA", fontSize: 12, marginTop: -8 },
  appsRail: { gap: 9, paddingVertical: 2 },
  appChoice: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#151F32", borderWidth: 1, borderColor: "#243149", borderRadius: 14, paddingHorizontal: 9, paddingVertical: 8 },
  appChoiceActive: { borderColor: "#D9FF66", backgroundColor: "#1F2D32" },
  appChoiceIcon: { width: 27, height: 27, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  appChoiceText: { color: "#F5F7FB", fontSize: 12, fontWeight: "800" },
  investRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  stepper: { flexDirection: "row", height: 48, alignItems: "center", backgroundColor: "#151F32", borderRadius: 15, borderWidth: 1, borderColor: "#243149" },
  stepButton: { width: 38, height: 48, alignItems: "center", justifyContent: "center" },
  investValue: { color: "#F5F7FB", fontSize: 13, fontWeight: "900", minWidth: 46, textAlign: "center" },
  investButton: { flex: 1, height: 48, borderRadius: 15, backgroundColor: "#D9FF66", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  investButtonText: { color: "#101B2D", fontSize: 13, fontWeight: "900" },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
});
