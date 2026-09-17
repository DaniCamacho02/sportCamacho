import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useSportCamacho } from "@/lib/sport-context";

export default function BlocksScreen() {
  const router = useRouter();
  const { apps, toggleApp, selectApp, bankMinutes } = useSportCamacho();
  const blockedCount = apps.filter((app) => app.blocked).length;

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}><View><Text style={styles.eyebrow}>CONTROL</Text><Text style={styles.title}>Apps vetadas</Text></View><View style={styles.countPill}><Text style={styles.countValue}>{blockedCount}</Text><Text style={styles.countLabel}>activas</Text></View></View>
        <View style={styles.introCard}><View style={styles.introIcon}><MaterialIcons name="lock" size={24} color="#D9FF66" /></View><View style={styles.introCopy}><Text style={styles.introTitle}>Tu atención, tus reglas</Text><Text style={styles.introText}>Cuando intentes abrir una app activa, sportCamacho te traerá aquí para ganar el acceso con movimiento.</Text></View></View>
        <Text style={styles.sectionTitle}>Selecciona qué quieres bloquear</Text>
        <Pressable onPress={() => Platform.OS === "android" && Linking.openSettings()} style={({ pressed }) => [styles.systemButton, pressed && styles.pressed]}><View style={styles.systemIcon}><MaterialIcons name="apps" size={20} color="#D9FF66" /></View><View style={styles.systemCopy}><Text style={styles.systemTitle}>Elegir apps instaladas</Text><Text style={styles.systemText}>Abrir permisos de uso para detectar cualquier app del móvil</Text></View><MaterialIcons name="open-in-new" size={18} color="#D9FF66" /></Pressable>
        <View style={styles.listCard}>
          {apps.map((app, index) => (
            <View key={app.id} style={[styles.appRow, index < apps.length - 1 && styles.rowDivider]}>
              <View style={[styles.appIcon, { backgroundColor: app.accent }]}><MaterialIcons name={app.icon as never} size={20} color="#fff" /></View>
              <View style={styles.appCopy}><Text style={styles.appName}>{app.name}</Text><Text style={styles.appSubtitle}>{app.subtitle}</Text></View>
              <Switch value={app.blocked} onValueChange={() => toggleApp(app.id)} trackColor={{ false: "#293750", true: "#79963B" }} thumbColor={app.blocked ? "#D9FF66" : "#8995AA"} />
            </View>
          ))}
        </View>
        <View style={styles.infoRow}><MaterialIcons name="shield" size={17} color="#8995AA" /><Text style={styles.infoText}>Para impedir que otra app se abra y redirigir a sportCamacho hace falta un servicio nativo de accesibilidad Android. La interfaz ya está preparada para esa integración.</Text></View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Simular una app vetada</Text><Text style={styles.available}>{bankMinutes} min en banco</Text></View>
        <Pressable onPress={() => { const first = apps.find((app) => app.blocked); if (first) { selectApp(first.id); router.push("/(tabs)/train" as never); } }} style={({ pressed }) => [styles.simulateButton, pressed && styles.pressed]}><View style={styles.simulateIcon}><MaterialIcons name="open-in-new" size={20} color="#101B2D" /></View><View style={styles.simulateCopy}><Text style={styles.simulateTitle}>Intentar abrir app vetada</Text><Text style={styles.simulateText}>Te llevará a ganar o invertir minutos</Text></View><MaterialIcons name="arrow-forward" size={20} color="#D9FF66" /></Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 30, gap: 18 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: "#9AA5BA", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#F5F7FB", fontSize: 28, fontWeight: "900", marginTop: 5 },
  countPill: { backgroundColor: "#1B263B", borderRadius: 15, paddingHorizontal: 13, paddingVertical: 9, alignItems: "center" },
  countValue: { color: "#D9FF66", fontSize: 18, fontWeight: "900" },
  countLabel: { color: "#8995AA", fontSize: 10, fontWeight: "800" },
  introCard: { backgroundColor: "#1B263B", borderRadius: 20, padding: 16, flexDirection: "row", gap: 12, borderWidth: 1, borderColor: "#2B3953" },
  introIcon: { width: 47, height: 47, borderRadius: 15, backgroundColor: "#2D3B20", alignItems: "center", justifyContent: "center" },
  introCopy: { flex: 1, gap: 4 },
  introTitle: { color: "#F5F7FB", fontSize: 15, fontWeight: "900" },
  introText: { color: "#9AA5BA", fontSize: 12, lineHeight: 17 },
  sectionTitle: { color: "#F5F7FB", fontSize: 17, fontWeight: "900" },
  listCard: { backgroundColor: "#151F32", borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: "#243149" },
  appRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 15 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#243149" },
  appIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  appCopy: { flex: 1, gap: 3 },
  appName: { color: "#F5F7FB", fontSize: 15, fontWeight: "800" },
  appSubtitle: { color: "#8995AA", fontSize: 12 },
  infoRow: { flexDirection: "row", gap: 7, alignItems: "flex-start" },
  infoText: { color: "#8995AA", flex: 1, fontSize: 11, lineHeight: 16 },
  systemButton: { backgroundColor: "#1B263B", borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#2B3953" },
  systemIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#2D3B20", alignItems: "center", justifyContent: "center" },
  systemCopy: { flex: 1, gap: 4 },
  systemTitle: { color: "#F5F7FB", fontSize: 13, fontWeight: "900" },
  systemText: { color: "#8995AA", fontSize: 11, lineHeight: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  available: { color: "#D9FF66", fontSize: 12, fontWeight: "800" },
  simulateButton: { backgroundColor: "#D9FF66", borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 11 },
  simulateIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "rgba(16,27,45,0.12)", alignItems: "center", justifyContent: "center" },
  simulateCopy: { flex: 1, gap: 4 },
  simulateTitle: { color: "#101B2D", fontSize: 14, fontWeight: "900" },
  simulateText: { color: "#51611E", fontSize: 11, fontWeight: "700" },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
});
