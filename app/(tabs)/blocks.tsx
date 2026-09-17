import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { AppIcon } from "@/components/app-icon";
import { ScreenContainer } from "@/components/screen-container";
import { useSportCamacho } from "@/lib/sport-context";

export default function BlocksScreen() {
  const router = useRouter();
  const {
    apps,
    appsLoading,
    appsUnavailable,
    toggleApp,
    selectApp,
    bankMinutes,
    blockerAvailable,
    accessibilityEnabled,
    refreshAccessibilityStatus,
    requestAccessibilityAccess,
  } = useSportCamacho();
  const [search, setSearch] = useState("");
  const blockedCount = apps.filter((app) => app.blocked).length;

  // Al volver de Ajustes > Accesibilidad (tras activar el servicio) refrescamos el estado.
  useFocusEffect(
    useCallback(() => {
      refreshAccessibilityStatus();
    }, [refreshAccessibilityStatus]),
  );

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return apps;
    return apps.filter((app) => app.name.toLowerCase().includes(query) || app.subtitle.toLowerCase().includes(query));
  }, [apps, search]);

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}><View><Text style={styles.eyebrow}>CONTROL</Text><Text style={styles.title}>Apps vetadas</Text></View><View style={styles.countPill}><Text style={styles.countValue}>{blockedCount}</Text><Text style={styles.countLabel}>activas</Text></View></View>
        <View style={styles.introCard}><View style={styles.introIcon}><MaterialIcons name="lock" size={24} color="#D9FF66" /></View><View style={styles.introCopy}><Text style={styles.introTitle}>Tu atención, tus reglas</Text><Text style={styles.introText}>Cuando intentes abrir una app activa, sportCamacho te traerá aquí para ganar el acceso con movimiento.</Text></View></View>

        {blockerAvailable && !accessibilityEnabled && (
          <Pressable onPress={requestAccessibilityAccess} style={({ pressed }) => [styles.accessibilityCard, pressed && styles.pressed]}>
            <View style={styles.accessibilityIcon}><MaterialIcons name="accessibility-new" size={22} color="#101B2D" /></View>
            <View style={styles.accessibilityCopy}>
              <Text style={styles.accessibilityTitle}>Falta activar el bloqueo real</Text>
              <Text style={styles.accessibilityText}>Actívalo en Ajustes → Accesibilidad → sportCamacho para que el bloqueo funcione de verdad.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#101B2D" />
          </Pressable>
        )}

        {blockerAvailable && accessibilityEnabled && (
          <View style={styles.activeRow}>
            <MaterialIcons name="verified" size={16} color="#5FBF5A" />
            <Text style={styles.activeText}>Bloqueo real activo en este dispositivo</Text>
          </View>
        )}

        {appsUnavailable && (
          <View style={styles.warningRow}>
            <MaterialIcons name="info" size={17} color="#F0A64D" />
            <Text style={styles.warningText}>
              No se pudo leer tu lista real de apps instaladas (esto pasa en Expo Go o iOS). Mostrando apps de ejemplo mientras tanto — el listado real funcionará en el development build de Android.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Selecciona qué quieres bloquear</Text>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color="#8995AA" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar entre tus apps instaladas..."
            placeholderTextColor="#5E6B85"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.listCard}>
          {appsLoading ? (
            <View style={styles.loadingRow}><ActivityIndicator color="#D9FF66" /><Text style={styles.loadingText}>Leyendo apps instaladas…</Text></View>
          ) : filteredApps.length === 0 ? (
            <Text style={styles.emptyText}>No hay apps que coincidan con &quot;{search}&quot;.</Text>
          ) : (
            filteredApps.map((app, index) => (
              <View key={app.id} style={[styles.appRow, index < filteredApps.length - 1 && styles.rowDivider]}>
                <AppIcon icon={app.icon} accent={app.accent} size={40} />
                <View style={styles.appCopy}>
                  <Text style={styles.appName} numberOfLines={1}>{app.name}</Text>
                  <Text style={styles.appSubtitle} numberOfLines={1}>
                    {app.sessionSecondsRemaining > 0 ? `Desbloqueada ${Math.ceil(app.sessionSecondsRemaining / 60)} min más` : app.subtitle}
                  </Text>
                </View>
                <Switch value={app.blocked} onValueChange={() => toggleApp(app.id)} trackColor={{ false: "#293750", true: "#79963B" }} thumbColor={app.blocked ? "#D9FF66" : "#8995AA"} />
              </View>
            ))
          )}
        </View>
        <View style={styles.infoRow}><MaterialIcons name="shield" size={17} color="#8995AA" /><Text style={styles.infoText}>Al abrir una app de esta lista, sportCamacho se abrirá automáticamente en su lugar para que ganes o inviertas minutos.</Text></View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Simular una app vetada</Text><Text style={styles.available}>{bankMinutes} min en banco</Text></View>
        <Pressable onPress={() => { const first = apps.find((app) => app.blocked); if (first) { selectApp(first.id); router.push("/train" as never); } }} style={({ pressed }) => [styles.simulateButton, pressed && styles.pressed]}><View style={styles.simulateIcon}><MaterialIcons name="open-in-new" size={20} color="#101B2D" /></View><View style={styles.simulateCopy}><Text style={styles.simulateTitle}>Intentar abrir app vetada</Text><Text style={styles.simulateText}>Te llevará a ganar o invertir minutos</Text></View><MaterialIcons name="arrow-forward" size={20} color="#D9FF66" /></Pressable>
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
  warningRow: { flexDirection: "row", gap: 8, alignItems: "flex-start", backgroundColor: "#2C2510", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "#4A3A17" },
  warningText: { color: "#E8C994", flex: 1, fontSize: 11.5, lineHeight: 16 },
  accessibilityCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#D9FF66", borderRadius: 18, padding: 14 },
  accessibilityIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "rgba(16,27,45,0.12)", alignItems: "center", justifyContent: "center" },
  accessibilityCopy: { flex: 1, gap: 3 },
  accessibilityTitle: { color: "#101B2D", fontSize: 14, fontWeight: "900" },
  accessibilityText: { color: "#3A4A1E", fontSize: 11, lineHeight: 15, fontWeight: "600" },
  activeRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  activeText: { color: "#5FBF5A", fontSize: 12, fontWeight: "800" },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#151F32", borderRadius: 14, borderWidth: 1, borderColor: "#243149", paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, color: "#F5F7FB", fontSize: 13, padding: 0 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 24, justifyContent: "center" },
  loadingText: { color: "#8995AA", fontSize: 12, fontWeight: "700" },
  emptyText: { color: "#8995AA", fontSize: 12, textAlign: "center", paddingVertical: 20 },
  infoRow: { flexDirection: "row", gap: 7, alignItems: "flex-start" },
  infoText: { color: "#8995AA", flex: 1, fontSize: 11, lineHeight: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  available: { color: "#D9FF66", fontSize: 12, fontWeight: "800" },
  simulateButton: { backgroundColor: "#D9FF66", borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 11 },
  simulateIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "rgba(16,27,45,0.12)", alignItems: "center", justifyContent: "center" },
  simulateCopy: { flex: 1, gap: 4 },
  simulateTitle: { color: "#101B2D", fontSize: 14, fontWeight: "900" },
  simulateText: { color: "#51611E", fontSize: 11, fontWeight: "700" },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
});
