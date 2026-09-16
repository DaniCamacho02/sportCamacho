import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useSportCamacho } from "@/lib/sport-context";

type Period = "today" | "week" | "month";

export default function StatsScreen() {
  const { getPeriodStats, bankMinutes } = useSportCamacho();
  const [period, setPeriod] = useState<Period>("week");
  const stats = getPeriodStats(period);
  const maxMinutes = Math.max(stats.earned, stats.spent, 1);
  const periodLabel = useMemo(() => ({ today: "Hoy", week: "Esta semana", month: "Este mes" }[period]), [period]);

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View><Text style={styles.eyebrow}>ANALÍTICA</Text><Text style={styles.title}>Tu progreso</Text></View>
        <View style={styles.periodRow}>{(["today", "week", "month"] as Period[]).map((item) => <Text key={item} onPress={() => setPeriod(item)} style={[styles.periodOption, period === item && styles.periodOptionActive]}>{item === "today" ? "Día" : item === "week" ? "Semana" : "Mes"}</Text>)}</View>
        <View style={styles.summaryCard}><View style={styles.summaryIcon}><MaterialIcons name="insights" size={23} color="#101B2D" /></View><View><Text style={styles.summaryEyebrow}>{periodLabel.toUpperCase()}</Text><Text style={styles.summaryTitle}>Consistencia en movimiento</Text><Text style={styles.summaryText}>{stats.reps === 0 ? "Completa tu primera flexión para empezar a ver tendencias." : `${stats.reps} flexiones registradas y ${stats.earned} min ganados.`}</Text></View></View>
        <View style={styles.metricGrid}><View style={styles.metricCard}><Text style={styles.metricLabel}>Ganados</Text><Text style={styles.metricValue}>{stats.earned}<Text style={styles.metricUnit}> min</Text></Text><View style={styles.barTrack}><View style={[styles.barFillGreen, { width: `${(stats.earned / maxMinutes) * 100}%` }]} /></View></View><View style={styles.metricCard}><Text style={styles.metricLabel}>Invertidos</Text><Text style={styles.metricValue}>{stats.spent}<Text style={styles.metricUnit}> min</Text></Text><View style={styles.barTrack}><View style={[styles.barFillBlue, { width: `${(stats.spent / maxMinutes) * 100}%` }]} /></View></View></View>
        <View style={styles.streakCard}><View style={styles.streakIcon}><MaterialIcons name="local-fire-department" size={24} color="#D9FF66" /></View><View style={styles.streakCopy}><Text style={styles.streakTitle}>Racha de entrenamiento</Text><Text style={styles.streakText}>{stats.reps > 0 ? "Buen trabajo: ya estás construyendo el hábito." : "Tu racha empieza con una flexión hoy."}</Text></View><Text style={styles.streakValue}>{stats.reps > 0 ? "1" : "0"}<Text style={styles.streakUnit}> día</Text></Text></View>
        <Text style={styles.sectionTitle}>Resumen rápido</Text>
        <View style={styles.quickList}><View style={styles.quickRow}><View style={[styles.quickDot, { backgroundColor: "#D9FF66" }]} /><Text style={styles.quickLabel}>Banco disponible</Text><Text style={styles.quickValue}>{bankMinutes} min</Text></View><View style={styles.quickRow}><View style={[styles.quickDot, { backgroundColor: "#6C8FF5" }]} /><Text style={styles.quickLabel}>Flexiones registradas</Text><Text style={styles.quickValue}>{stats.reps}</Text></View><View style={styles.quickRow}><View style={[styles.quickDot, { backgroundColor: "#F05B5B" }]} /><Text style={styles.quickLabel}>Tiempo invertido</Text><Text style={styles.quickValue}>{stats.spent} min</Text></View></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 30, gap: 18 },
  eyebrow: { color: "#9AA5BA", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#F5F7FB", fontSize: 28, fontWeight: "900", marginTop: 5 },
  periodRow: { height: 45, padding: 4, borderRadius: 15, backgroundColor: "#151F32", flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#243149" },
  periodOption: { flex: 1, textAlign: "center", paddingVertical: 9, borderRadius: 11, color: "#8995AA", fontSize: 12, fontWeight: "800", overflow: "hidden" },
  periodOptionActive: { color: "#101B2D", backgroundColor: "#D9FF66" },
  summaryCard: { backgroundColor: "#D9FF66", borderRadius: 21, padding: 17, flexDirection: "row", gap: 12, alignItems: "center" },
  summaryIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "rgba(16,27,45,0.11)", alignItems: "center", justifyContent: "center" },
  summaryEyebrow: { color: "#51611E", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  summaryTitle: { color: "#101B2D", fontSize: 15, fontWeight: "900", marginTop: 2 },
  summaryText: { color: "#51611E", fontSize: 11, lineHeight: 15, marginTop: 3, maxWidth: 245 },
  metricGrid: { flexDirection: "row", gap: 12 },
  metricCard: { flex: 1, backgroundColor: "#151F32", borderRadius: 18, padding: 15, borderWidth: 1, borderColor: "#243149" },
  metricLabel: { color: "#8995AA", fontSize: 11, fontWeight: "800" },
  metricValue: { color: "#F5F7FB", fontSize: 27, fontWeight: "900", marginTop: 7 },
  metricUnit: { color: "#8995AA", fontSize: 12, fontWeight: "700" },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: "#273550", marginTop: 12, overflow: "hidden" },
  barFillGreen: { height: 6, borderRadius: 3, backgroundColor: "#D9FF66" },
  barFillBlue: { height: 6, borderRadius: 3, backgroundColor: "#6C8FF5" },
  streakCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1B263B", borderRadius: 19, padding: 15, borderWidth: 1, borderColor: "#2B3953" },
  streakIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#2D3B20", alignItems: "center", justifyContent: "center" },
  streakCopy: { flex: 1, gap: 3 },
  streakTitle: { color: "#F5F7FB", fontSize: 14, fontWeight: "900" },
  streakText: { color: "#9AA5BA", fontSize: 11, lineHeight: 15 },
  streakValue: { color: "#D9FF66", fontSize: 26, fontWeight: "900" },
  streakUnit: { color: "#9AA5BA", fontSize: 10, fontWeight: "700" },
  sectionTitle: { color: "#F5F7FB", fontSize: 17, fontWeight: "900" },
  quickList: { backgroundColor: "#151F32", borderRadius: 19, paddingHorizontal: 15, borderWidth: 1, borderColor: "#243149" },
  quickRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: "#243149" },
  quickDot: { width: 9, height: 9, borderRadius: 5 },
  quickLabel: { color: "#AAB4C6", fontSize: 13, flex: 1 },
  quickValue: { color: "#F5F7FB", fontSize: 13, fontWeight: "900" },
});
