import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AVATARS, getAvatarDef } from "@/components/avatars/hero-avatars";
import { useSportCamacho } from "@/lib/sport-context";

export default function HeroScreen() {
  const { avatarId, setAvatarId, levelInfo, totalReps, streakDays, bankMinutes } = useSportCamacho();
  const current = getAvatarDef(avatarId);
  const CurrentAvatar = current.Component;

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>TU HÉROE</Text>
            <Text style={styles.title}>{current.name}</Text>
          </View>
        </View>

        <View style={[styles.heroCard, { borderColor: current.accent }]}>
          <View style={[styles.avatarShell, { backgroundColor: `${current.accent}22` }]}>
            <CurrentAvatar size={104} />
          </View>
          <Text style={styles.className}>{current.className}</Text>
          <View style={styles.levelPill}>
            <MaterialIcons name="military-tech" size={14} color="#101B2D" />
            <Text style={styles.levelPillText}>Nivel {levelInfo.level} · {levelInfo.title}</Text>
          </View>

          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${Math.min(100, levelInfo.progress * 100)}%`, backgroundColor: current.accent }]} />
          </View>
          <Text style={styles.xpLabel}>{levelInfo.repsIntoLevel} / {levelInfo.repsForNextLevel} flexiones para subir de nivel</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialIcons name="fitness-center" size={16} color="#D9FF66" />
              <Text style={styles.statValue}>{totalReps}</Text>
              <Text style={styles.statLabel}>reps totales</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="local-fire-department" size={16} color="#F0A64D" />
              <Text style={styles.statValue}>{streakDays}</Text>
              <Text style={styles.statLabel}>días seguidos</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="timer" size={16} color="#D9FF66" />
              <Text style={styles.statValue}>{bankMinutes}</Text>
              <Text style={styles.statLabel}>min en banco</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Elige tu clase</Text>
        <View style={styles.grid}>
          {AVATARS.map((avatar) => {
            const unlocked = levelInfo.level >= avatar.unlockLevel;
            const selected = avatar.id === avatarId;
            const AvatarPreview = avatar.Component;
            return (
              <Pressable
                key={avatar.id}
                disabled={!unlocked}
                onPress={() => setAvatarId(avatar.id)}
                style={({ pressed }) => [
                  styles.card,
                  selected && { borderColor: avatar.accent, backgroundColor: `${avatar.accent}14` },
                  !unlocked && styles.cardLocked,
                  pressed && unlocked && styles.pressed,
                ]}
              >
                <View style={styles.cardAvatarWrap}>
                  <AvatarPreview size={64} />
                  {!unlocked && (
                    <View style={styles.lockOverlay}>
                      <MaterialIcons name="lock" size={20} color="#F5F7FB" />
                    </View>
                  )}
                </View>
                <Text style={styles.cardName} numberOfLines={1}>{avatar.name}</Text>
                <Text style={styles.cardClass}>{avatar.className}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{avatar.description}</Text>
                {!unlocked ? (
                  <View style={styles.unlockPill}><Text style={styles.unlockText}>Nivel {avatar.unlockLevel}</Text></View>
                ) : selected ? (
                  <View style={[styles.unlockPill, { backgroundColor: avatar.accent }]}><Text style={[styles.unlockText, { color: "#101B2D" }]}>Activo</Text></View>
                ) : (
                  <View style={styles.unlockPill}><Text style={styles.unlockText}>Elegir</Text></View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 30, gap: 18 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { color: "#9AA5BA", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#F5F7FB", fontSize: 24, fontWeight: "900", marginTop: 5 },
  heroCard: { backgroundColor: "#151F32", borderRadius: 24, borderWidth: 1.5, padding: 20, alignItems: "center", gap: 8 },
  avatarShell: { width: 132, height: 132, borderRadius: 66, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  className: { color: "#9AA5BA", fontSize: 12, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" },
  levelPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#D9FF66", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, marginTop: 4 },
  levelPillText: { color: "#101B2D", fontSize: 12, fontWeight: "900" },
  xpTrack: { width: "100%", height: 10, borderRadius: 5, backgroundColor: "#0E1728", marginTop: 14, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 5 },
  xpLabel: { color: "#8995AA", fontSize: 11, fontWeight: "700", marginTop: 6 },
  statsRow: { flexDirection: "row", gap: 10, width: "100%", marginTop: 14 },
  statBox: { flex: 1, backgroundColor: "#0E1728", borderRadius: 14, paddingVertical: 12, alignItems: "center", gap: 3, borderWidth: 1, borderColor: "#243149" },
  statValue: { color: "#F5F7FB", fontSize: 16, fontWeight: "900" },
  statLabel: { color: "#8995AA", fontSize: 10, fontWeight: "700" },
  sectionTitle: { color: "#F5F7FB", fontSize: 17, fontWeight: "900" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  card: { width: "47%", backgroundColor: "#151F32", borderRadius: 20, borderWidth: 1, borderColor: "#243149", padding: 14, alignItems: "center", gap: 4 },
  cardLocked: { opacity: 0.55 },
  cardAvatarWrap: { position: "relative", marginBottom: 4 },
  lockOverlay: { position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(14,23,40,0.55)", borderRadius: 32 },
  cardName: { color: "#F5F7FB", fontSize: 13, fontWeight: "900", textAlign: "center" },
  cardClass: { color: "#8995AA", fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  cardDesc: { color: "#8995AA", fontSize: 10.5, lineHeight: 14, textAlign: "center", minHeight: 28 },
  unlockPill: { backgroundColor: "#0E1728", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginTop: 4 },
  unlockText: { color: "#8995AA", fontSize: 10, fontWeight: "900" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
