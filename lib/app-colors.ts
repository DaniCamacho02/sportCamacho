const PALETTE = [
  "#E46A87", "#57C7C8", "#F05B5B", "#C94C69", "#5FBF5A",
  "#8C6FE0", "#E7C558", "#2FB4A6", "#E4633F", "#4D96D9",
  "#D97AD4", "#7BC97E",
];

/** Genera siempre el mismo color de la paleta para el mismo texto (p.ej. un packageName). */
export function colorFromString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
