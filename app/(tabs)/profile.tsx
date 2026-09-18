import { MaterialIcons } from "@expo/vector-icons";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AVATARS, getAvatarDef } from "@/components/avatars/hero-avatars";
import { useSportCamacho } from "@/lib/sport-context";

export default function ProfileScreen() {
  const { avatarId, setAvatarId, levelInfo, totalReps, streakDays } = useSportCamacho();
  const current = getAvatarDef(avatarId);
  const CurrentAvatar = current.Component;

  return (
    <ScreenContainer className="px-5 pt-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CUENTA Y PERSONAJE</Text>
        <Text style={styles.title}>{current.name}</Text>
        <View style={[styles.heroCard, { borderColor: current.accent }]}><View style={[styles.avatarShell, { backgroundColor: `${current.accent}22` }]}><CurrentAvatar size={105} /></View><Text style={styles.className}>{current.className} · Nivel {levelInfo.level}</Text><View style={styles.stats}><Text style={styles.stat}>{totalReps} <Text style={styles.muted}>flexiones</Text></Text><Text style={styles.stat}>{streakDays} <Text style={styles.muted}>días seguidos</Text></Text></View></View>
        <Text style={styles.sectionTitle}>Elige tu avatar</Text>
        <View style={styles.grid}>{AVATARS.map((avatar) => { const Avatar = avatar.Component; const selected = avatar.id === avatarId; const unlocked = levelInfo.level >= avatar.unlockLevel; return <Pressable key={avatar.id} disabled={!unlocked} onPress={() => setAvatarId(avatar.id)} style={[styles.option, selected && { borderColor: avatar.accent }, !unlocked && styles.locked]}><Avatar size={62} /><Text style={styles.optionName}>{avatar.name}</Text><Text style={styles.optionClass}>{unlocked ? (selected ? "Activo" : avatar.className) : `Nivel ${avatar.unlockLevel}`}</Text>{selected && <View style={[styles.check, { backgroundColor: avatar.accent }]}><MaterialIcons name="check" size={13} color="#101B2D" /></View>}</Pressable>; })}</View>
        <Text style={styles.sectionTitle}>Cuenta Google</Text>
        <Pressable onPress={() => Alert.alert("Cuenta Google", "El botón está preparado. Para activar el inicio de sesión real hay que registrar los clientes OAuth de Google para Android/iOS en EAS y enlazarlos con el callback de sportCamacho.")} style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}><View style={styles.googleBadge}><Text style={styles.googleG}>G</Text></View><View style={styles.googleCopy}><Text style={styles.googleTitle}>Conectar mi cuenta de Google</Text><Text style={styles.googleSubtitle}>Configurar OAuth en la build de producción</Text></View><MaterialIcons name="arrow-forward" size={18} color="#F5F7FB" /></Pressable>
        <Text style={styles.note}>El bloqueo de apps y la detección MoveNet ya están integrados en la build nativa Android. Google requiere sus credenciales OAuth propias.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ content: { paddingBottom: 30, gap: 18 }, eyebrow: { color: "#9AA5BA", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 }, title: { color: "#F5F7FB", fontSize: 28, fontWeight: "900", marginTop: 3 }, heroCard: { backgroundColor: "#151F32", borderRadius: 24, borderWidth: 1.5, padding: 20, alignItems: "center", gap: 10 }, avatarShell: { width: 132, height: 132, borderRadius: 66, alignItems: "center", justifyContent: "center" }, className: { color: "#D9FF66", fontSize: 13, fontWeight: "900" }, stats: { flexDirection: "row", gap: 18, marginTop: 4 }, stat: { color: "#F5F7FB", fontSize: 16, fontWeight: "900" }, muted: { color: "#8995AA", fontSize: 11, fontWeight: "700" }, sectionTitle: { color: "#F5F7FB", fontSize: 17, fontWeight: "900" }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }, option: { width: "47%", backgroundColor: "#151F32", borderRadius: 18, borderWidth: 1, borderColor: "#243149", padding: 12, alignItems: "center", gap: 3, position: "relative" }, locked: { opacity: 0.45 }, optionName: { color: "#F5F7FB", fontSize: 12, fontWeight: "900", textAlign: "center" }, optionClass: { color: "#8995AA", fontSize: 10, fontWeight: "800" }, check: { position: "absolute", top: 8, right: 8, width: 21, height: 21, borderRadius: 11, alignItems: "center", justifyContent: "center" }, googleButton: { backgroundColor: "#1B263B", borderRadius: 17, padding: 14, flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: "#2B3953" }, googleBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, googleG: { color: "#4285F4", fontSize: 18, fontWeight: "900" }, googleCopy: { flex: 1, gap: 3 }, googleTitle: { color: "#F5F7FB", fontSize: 13, fontWeight: "900" }, googleSubtitle: { color: "#8995AA", fontSize: 10 }, note: { color: "#8995AA", fontSize: 11, lineHeight: 16 }, pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
});
