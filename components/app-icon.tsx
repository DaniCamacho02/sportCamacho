import { MaterialIcons } from "@expo/vector-icons";
import { Image, View } from "react-native";

type Props = {
  icon: string | null;
  accent: string;
  size?: number;
};

/** Renderiza el icono real de una app instalada (data URI) o un icono de MaterialIcons de respaldo. */
export function AppIcon({ icon, accent, size = 40 }: Props) {
  const isRealIcon = !!icon && icon.startsWith("data:image");

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: isRealIcon ? "#0E1728" : accent,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {isRealIcon ? (
        <Image source={{ uri: icon! }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : (
        <MaterialIcons name={(icon as never) ?? "apps"} size={size * 0.5} color="#fff" />
      )}
    </View>
  );
}
