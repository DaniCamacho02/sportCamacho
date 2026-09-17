import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AVATAR_OPTIONS, useSportCamacho } from "@/lib/sport-context";

function AppDot({ color }: { color: string }) {
  return <View style={[styles.appDot, { backgroundColor: color }]} />;
}

export default function HomeScreen() {
  const router = useRouter();
  const { bankMinutes, apps, entries, profile } = useSportCamacho();
  const blockedApps = apps.filter((app) => app.blocked);
  const earnedToday = entries.filter((entry) => entry.type === "earned" && new Date(entry.date).toDateString() === new Date().toDateString()).reduce((sum, entry) => sum + entry.minutes, 0);
  const avatar = AVATAR_OPTIONS[profile.avatarId];
  const xpProgress = profile.xp % 100;

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View><Text style={styles.eyebrow}>REINO DE LA DISCIPLINA</Text><Text style={styles.title}>Hola, {profile.name.split(" ")[0]}</Text></View>
          <Pressable onPress={() => router.push("/(tabs)/profile" as never)} style={styles.avatarButton}><Image source={avatar.image} style={styles.avatarImage} /></Pressable>
        </View>

        <ImageBackground source={require("@/assets/images/rpg-hero-banner.png")} imageStyle={styles.bannerImage} style={styles.questBanner}>
          <View style={styles.bannerShade} />
          <View style={styles.bannerCopy}><Text style={styles.questEyebrow}>MISIÓN DIARIA · NIVEL {profile.level}</Text><Text style={styles.questTitle}>Despierta al héroe</Text><Text style={styles.questText}>Completa flexiones para cargar tu reloj de poder.</Text><View style={styles.xpTrack}><View style={[styles.xpFill, { width: `${xpProgress || 3}%` }]} /></View><Text style={styles.xpText}>{xpProgress}/100 XP hasta el siguiente nivel</Text></View>
        </ImageBackground>

        <View style={styles.bankCard}>
          <View style={styles.bankTopRow}><View><Text style={styles.bankLabel}>BANCO DE TIEMPO</Text><Text style={styles.bankValue}>{bankMinutes}<Text style={styles.bankUnit}> min</Text></Text></View><View style={styles.coin}><MaterialIcons name="timer" size={24} color="#101B2D" /></View></View>
          <View style={styles.divider} /><View style={styles.bankBottomRow}><Text style={styles.bankFootnote}>{earnedToday} min ganados hoy</Text><Pressable style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={() => router.push("/(tabs)/train" as never)}><MaterialIcons name="fitness-center" size={17} color="#101B2D" /><Text style={styles.addButtonText}>Entrenar</Text></Pressable></View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Misión activa</Text><Text style={styles.sectionMeta}>{blockedApps.length} objetivos</Text></View>
        <Pressable style={({ pressed }) => [styles.heroCard, pressed && styles.pressed]} onPress={() => router.push("/(tabs)/train" as never)}><View style={styles.heroIcon}><MaterialIcons name="auto-awesome" size={25} color="#D9FF66" /></View><View style={styles.heroCopy}><Text style={styles.heroTitle}>Haz una flexión, gana tiempo</Text><Text style={styles.heroSubtitle}>La cámara vigila tu movimiento. Tú decides dónde invertirlo.</Text></View><MaterialIcons name="arrow-forward" size={22} color="#D9FF66" /></Pressable>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Tus apps vetadas</Text><Pressable onPress={() => router.push("/(tabs)/blocks" as never)}><Text style={styles.linkText}>Gestionar</Text></Pressable></View>
        <View style={styles.listCard}>{blockedApps.length === 0 ? <Text style={styles.emptyText}>No hay objetivos activos. Añade una app para comenzar.</Text> : blockedApps.map((app, index) => <View key={app.id} style={[styles.appRow, index < blockedApps.length - 1 && styles.rowDivider]}><AppDot color={app.accent} /><View style={styles.appCopy}><Text style={styles.appName}>{app.name}</Text><Text style={styles.appSubtitle}>{app.subtitle}</Text></View><View style={styles.lockPill}><MaterialIcons name="lock" size={13} color="#758098" /><Text style={styles.lockText}>Vetada</Text></View></View>)}</View>

        <View style={styles.miniStatsRow}><View style={styles.miniStat}><Text style={styles.miniValue}>{earnedToday}</Text><Text style={styles.miniLabel}>min hoy</Text></View><View style={styles.miniStat}><Text style={styles.miniValue}>{entries.filter((entry) => entry.type === "earned" && new Date(entry.date).toDateString() === new Date().toDateString()).reduce((sum, entry) => sum + (entry.repetitions ?? 0), 0)}</Text><Text style={styles.miniLabel}>flexiones</Text></View><View style={styles.miniStat}><Text style={styles.miniValue}>Nv. {profile.level}</Text><Text style={styles.miniLabel}>rango</Text></View></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 28, gap: 18 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: "#9AA5BA", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#F5F7FB", fontSize: 28, fontWeight: "900", marginTop: 5 },
  avatarButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#D9FF66", padding: 2, overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%", borderRadius: 23 },
  questBanner: { height: 190, borderRadius: 23, overflow: "hidden", backgroundColor: "#1B263B", borderWidth: 1, borderColor: "#365174" },
  bannerImage: { resizeMode: "cover", opacity: 0.85 },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(8,17,34,0.35)" },
  bannerCopy: { flex: 1, justifyContent: "flex-end", padding: 18, width: "75%" },
  questEyebrow: { color: "#D9FF66", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  questTitle: { color: "#fff", fontSize: 23, fontWeight: "900", marginTop: 4 },
  questText: { color: "#D8E1EC", fontSize: 12, lineHeight: 17, marginTop: 3 },
  xpTrack: { height: 7, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)", marginTop: 12, overflow: "hidden" },
  xpFill: { height: 7, borderRadius: 4, backgroundColor: "#D9FF66" },
  xpText: { color: "#B9C6D8", fontSize: 10, marginTop: 5, fontWeight: "700" },
  bankCard: { backgroundColor: "#D9FF66", borderRadius: 24, padding: 20, shadowColor: "#D9FF66", shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  bankTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, bankLabel: { color: "#51611E", fontSize: 11, fontWeight: "900", letterSpacing: 1.3 }, bankValue: { color: "#101B2D", fontSize: 54, lineHeight: 59, fontWeight: "900", marginTop: 2 }, bankUnit: { fontSize: 20, fontWeight: "800" }, coin: { width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(16,27,45,0.10)", alignItems: "center", justifyContent: "center" }, divider: { height: 1, backgroundColor: "rgba(16,27,45,0.14)", marginVertical: 15 }, bankBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, bankFootnote: { color: "#51611E", fontSize: 13, fontWeight: "700" }, addButton: { backgroundColor: "#101B2D", borderRadius: 16, paddingHorizontal: 13, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 5 }, addButtonText: { color: "#F5F7FB", fontSize: 13, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 }, sectionTitle: { color: "#F5F7FB", fontSize: 18, fontWeight: "800" }, sectionMeta: { color: "#8995AA", fontSize: 12, fontWeight: "700" }, linkText: { color: "#D9FF66", fontSize: 13, fontWeight: "800" }, heroCard: { backgroundColor: "#1B263B", borderRadius: 22, padding: 17, flexDirection: "row", alignItems: "center", gap: 13, borderWidth: 1, borderColor: "#2B3953" }, heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#2D3B20", alignItems: "center", justifyContent: "center" }, heroCopy: { flex: 1, gap: 4 }, heroTitle: { color: "#F5F7FB", fontSize: 16, fontWeight: "800" }, heroSubtitle: { color: "#9AA5BA", fontSize: 12, lineHeight: 17 }, listCard: { backgroundColor: "#151F32", borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: "#243149" }, appRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15, gap: 12 }, rowDivider: { borderBottomWidth: 1, borderBottomColor: "#243149" }, appDot: { width: 38, height: 38, borderRadius: 12 }, appCopy: { flex: 1, gap: 3 }, appName: { color: "#F5F7FB", fontSize: 15, fontWeight: "800" }, appSubtitle: { color: "#8995AA", fontSize: 12 }, lockPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#202B40", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6 }, lockText: { color: "#8995AA", fontSize: 10, fontWeight: "800" }, emptyText: { color: "#8995AA", fontSize: 13, lineHeight: 19, paddingVertical: 18 }, miniStatsRow: { flexDirection: "row", gap: 10 }, miniStat: { flex: 1, backgroundColor: "#151F32", borderRadius: 17, paddingVertical: 15, paddingHorizontal: 14, borderWidth: 1, borderColor: "#243149" }, miniValue: { color: "#D9FF66", fontSize: 20, fontWeight: "900" }, miniLabel: { color: "#8995AA", fontSize: 11, fontWeight: "700", marginTop: 4 }, pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
