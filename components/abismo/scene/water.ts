/** Colores del agua según la profundidad (0 = superficie, 1 = fondo). */
const stops: { p: number; top: [number, number, number]; bottom: [number, number, number] }[] = [
  { p: 0, top: [0.31, 0.85, 0.9], bottom: [0.05, 0.48, 0.65] },
  { p: 0.25, top: [0.08, 0.58, 0.74], bottom: [0.03, 0.31, 0.48] },
  { p: 0.5, top: [0.04, 0.35, 0.53], bottom: [0.02, 0.23, 0.37] },
  { p: 0.8, top: [0.02, 0.18, 0.3], bottom: [0.01, 0.11, 0.19] },
  { p: 1, top: [0.01, 0.1, 0.18], bottom: [0, 0.04, 0.07] },
];

export type WaterColors = { top: readonly number[]; bottom: readonly number[] };

export function waterColors(p: number): WaterColors {
  let index = 0;
  while (index < stops.length - 2 && p > (stops[index + 1]?.p ?? 1)) {
    index += 1;
  }
  const a = stops[index];
  const b = stops[index + 1];
  if (!a || !b) {
    return { top: [0, 0, 0], bottom: [0, 0, 0] };
  }
  const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
  const mix = (x: readonly number[], y: readonly number[]) => x.map((value, i) => value + ((y[i] ?? 0) - value) * t);
  return { top: mix(a.top, b.top), bottom: mix(a.bottom, b.bottom) };
}
