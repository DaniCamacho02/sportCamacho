import Svg, { Circle, Ellipse, Path, Polygon, Rect } from "react-native-svg";

export type AvatarId = "warrior" | "rogue" | "archer" | "mage" | "paladin";

type AvatarProps = { size?: number };

const SKIN = "#E7B98F";
const SKIN_SHADOW = "#C99A72";

function AvatarBase({
  size = 96,
  bg,
  children,
}: AvatarProps & { bg: string; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      <Circle cx="48" cy="48" r="46" fill={bg} opacity={0.18} />
      <Circle cx="48" cy="48" r="46" stroke={bg} strokeWidth={2} fill="none" opacity={0.55} />
      {children}
    </Svg>
  );
}

export function WarriorAvatar({ size }: AvatarProps) {
  return (
    <AvatarBase size={size} bg="#E4633F">
      {/* cape */}
      <Path d="M28 78 Q48 58 68 78 L64 90 Q48 80 32 90 Z" fill="#8C2F1E" />
      {/* body / armor */}
      <Path d="M32 58 Q48 48 64 58 L62 86 Q48 92 34 86 Z" fill="#B0392A" />
      <Rect x="42" y="60" width="12" height="22" rx="2" fill="#E4633F" />
      {/* head */}
      <Circle cx="48" cy="38" r="15" fill={SKIN} />
      <Path d="M33 34 Q48 18 63 34 Q64 26 48 24 Q32 26 33 34 Z" fill="#5C3A21" />
      {/* helmet band */}
      <Rect x="31" y="30" width="34" height="7" rx="3.5" fill="#8A8F99" />
      <Circle cx="48" cy="24" r="3" fill="#D9FF66" />
      {/* sword */}
      <Path d="M74 30 L80 24 L83 27 L77 33 Z" fill="#D8DEE8" />
      <Rect x="70" y="33" width="14" height="4" rx="1" transform="rotate(45 77 35)" fill="#D8DEE8" />
      <Rect x="66" y="44" width="5" height="12" rx="1" transform="rotate(45 68 50)" fill="#8A8F99" />
      {/* shield */}
      <Path d="M16 46 Q16 40 24 38 Q32 40 32 46 L32 58 Q24 66 16 58 Z" fill="#8A8F99" />
      <Path d="M19 46 Q19 42 24 41 Q29 42 29 46 L29 56 Q24 62 19 56 Z" fill="#B0392A" />
    </AvatarBase>
  );
}

export function RogueAvatar({ size }: AvatarProps) {
  return (
    <AvatarBase size={size} bg="#2FB4A6">
      {/* hood cloak */}
      <Path d="M30 84 Q48 66 66 84 L62 92 Q48 84 34 92 Z" fill="#0E4A44" />
      <Path d="M30 60 Q48 50 66 60 L64 86 Q48 94 32 86 Z" fill="#146B62" />
      {/* hood over head */}
      <Path d="M30 40 Q30 16 48 14 Q66 16 66 40 Q66 50 48 52 Q30 50 30 40 Z" fill="#0E4A44" />
      {/* face shadow */}
      <Ellipse cx="48" cy="38" rx="11" ry="12" fill="#123B36" />
      <Circle cx="43" cy="37" r="2" fill="#D9FF66" />
      <Circle cx="53" cy="37" r="2" fill="#D9FF66" />
      {/* daggers crossed */}
      <Rect x="16" y="52" width="4" height="24" rx="1" transform="rotate(-28 18 64)" fill="#D8DEE8" />
      <Polygon points="14,50 22,50 18,42" transform="rotate(-28 18 50)" fill="#B7BEC9" />
      <Rect x="76" y="52" width="4" height="24" rx="1" transform="rotate(28 78 64)" fill="#D8DEE8" />
      <Polygon points="74,50 82,50 78,42" transform="rotate(28 78 50)" fill="#B7BEC9" />
    </AvatarBase>
  );
}

export function ArcherAvatar({ size }: AvatarProps) {
  return (
    <AvatarBase size={size} bg="#5FBF5A">
      {/* cloak */}
      <Path d="M30 82 Q48 64 66 82 L63 92 Q48 84 33 92 Z" fill="#2E7A2A" />
      <Path d="M31 58 Q48 48 65 58 L63 86 Q48 92 33 86 Z" fill="#3E9438" />
      {/* head */}
      <Circle cx="48" cy="38" r="15" fill={SKIN_SHADOW} />
      <Path d="M32 36 Q34 16 48 16 Q62 16 64 36 Q56 30 48 30 Q40 30 32 36 Z" fill="#7A5A2E" />
      <Path d="M60 22 L70 12" stroke="#3E9438" strokeWidth="4" strokeLinecap="round" />
      {/* bow */}
      <Path d="M74 20 Q88 48 74 76" stroke="#7A5A2E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M74 20 L74 76" stroke="#D8DEE8" strokeWidth="1.5" />
      {/* quiver */}
      <Rect x="16" y="48" width="10" height="26" rx="4" fill="#7A5A2E" />
      <Path d="M18 48 L24 30" stroke="#D9FF66" strokeWidth="2" strokeLinecap="round" />
      <Path d="M22 48 L28 32" stroke="#F5F7FB" strokeWidth="2" strokeLinecap="round" />
    </AvatarBase>
  );
}

export function MageAvatar({ size }: AvatarProps) {
  return (
    <AvatarBase size={size} bg="#8C6FE0">
      {/* robe */}
      <Path d="M26 90 Q48 56 70 90 Z" fill="#4B2E8C" />
      <Path d="M33 60 Q48 50 63 60 L60 88 Q48 94 36 88 Z" fill="#6544B0" />
      {/* head */}
      <Circle cx="48" cy="38" r="14" fill={SKIN} />
      {/* wizard hat */}
      <Polygon points="48,4 32,32 64,32" fill="#4B2E8C" />
      <Ellipse cx="48" cy="32" rx="19" ry="5" fill="#3A2270" />
      <Circle cx="48" cy="14" r="3" fill="#D9FF66" />
      {/* staff with orb */}
      <Rect x="78" y="24" width="4" height="60" rx="2" fill="#7A5A2E" />
      <Circle cx="80" cy="20" r="7" fill="#D9FF66" opacity={0.9} />
      <Circle cx="80" cy="20" r="10" fill="#D9FF66" opacity={0.25} />
    </AvatarBase>
  );
}

export function PaladinAvatar({ size }: AvatarProps) {
  return (
    <AvatarBase size={size} bg="#E7C558">
      {/* cape */}
      <Path d="M28 80 Q48 60 68 80 L64 92 Q48 82 32 92 Z" fill="#B8912E" />
      {/* armor */}
      <Path d="M31 58 Q48 47 65 58 L62 88 Q48 94 34 88 Z" fill="#F0E6C8" />
      <Polygon points="48,58 54,66 48,86 42,66" fill="#E7C558" />
      {/* head with holy halo */}
      <Circle cx="48" cy="37" r="18" fill="#D9FF66" opacity={0.3} />
      <Circle cx="48" cy="38" r="14" fill={SKIN} />
      <Path d="M33 34 Q48 20 63 34 Q64 28 48 26 Q32 28 33 34 Z" fill="#D8DEE8" />
      {/* holy shield */}
      <Path d="M14 44 Q14 38 23 36 Q32 38 32 44 L32 58 Q23 67 14 58 Z" fill="#F0E6C8" />
      <Path d="M23 40 L23 56 M17 46 L29 50 M29 46 L17 50" stroke="#E7C558" strokeWidth="2.5" strokeLinecap="round" />
    </AvatarBase>
  );
}

export type HeroAvatarDef = {
  id: AvatarId;
  name: string;
  className: string;
  accent: string;
  unlockLevel: number;
  description: string;
  Component: (props: AvatarProps) => React.ReactElement;
};

export const AVATARS: HeroAvatarDef[] = [
  {
    id: "warrior",
    name: "Camacho el Fuerte",
    className: "Guerrero",
    accent: "#E4633F",
    unlockLevel: 1,
    description: "Escudo en mano, primera línea contra las distracciones.",
    Component: WarriorAvatar,
  },
  {
    id: "rogue",
    name: "Sombra Silenciosa",
    className: "Pícaro",
    accent: "#2FB4A6",
    unlockLevel: 1,
    description: "Se cuela entre notificaciones sin hacer ruido.",
    Component: RogueAvatar,
  },
  {
    id: "archer",
    name: "Vientoveloz",
    className: "Arquera",
    accent: "#5FBF5A",
    unlockLevel: 3,
    description: "Precisión letal: una flexión, un minuto exacto.",
    Component: ArcherAvatar,
  },
  {
    id: "mage",
    name: "Archimago Reps",
    className: "Mago",
    accent: "#8C6FE0",
    unlockLevel: 5,
    description: "Convierte sudor en tiempo mediante pura disciplina arcana.",
    Component: MageAvatar,
  },
  {
    id: "paladin",
    name: "Guardián Dorado",
    className: "Paladín",
    accent: "#E7C558",
    unlockLevel: 8,
    description: "El rango más alto. Su fuerza de voluntad es leyenda.",
    Component: PaladinAvatar,
  },
];

export function getAvatarDef(id: AvatarId): HeroAvatarDef {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}
