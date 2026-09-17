export type Point = { x: number; y: number; score?: number };

/** Ángulo en grados del vértice `b`, entre los vectores b→a y b→c. */
export function angleBetween(a: Point, b: Point, c: Point): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return 180;

  const cos = (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2);
  const clamped = Math.min(1, Math.max(-1, cos));
  return (Math.acos(clamped) * 180) / Math.PI;
}
