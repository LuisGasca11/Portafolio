/** Profundidad total que recorre la página, en metros. */
export const maxDepth = 1200;

/**
 * Capítulos del descenso, al estilo de un recorrido continuo: cada uno tiene
 * su profundidad, su color de acento y un escenario 3D al que la cámara se
 * lanza mientras el texto del capítulo queda fijo en pantalla.
 */
export const chapters = [
  { id: "inicio", label: "Superficie", meters: 0, accent: "#bff6ff" },
  { id: "sobre-mi", label: "Sobre mí", meters: 40, accent: "#ffb38a" },
  { id: "desarrollos", label: "Desarrollos", meters: 180, accent: "#7ee8ff" },
  { id: "experiencia", label: "Experiencia", meters: 520, accent: "#ffd27a" },
  { id: "habilidades", label: "Habilidades", meters: 880, accent: "#d79bff" },
  { id: "educacion", label: "Educación", meters: 1040, accent: "#5dffc9" },
  { id: "contacto", label: "Contacto", meters: 1200, accent: "#ff7ed8" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export function chapterOf(id: ChapterId) {
  const index = chapters.findIndex((chapter) => chapter.id === id);
  return { ...chapters[index]!, index, total: chapters.length };
}

export const navLinks = chapters.slice(1).map((chapter) => ({ href: `#${chapter.id}`, label: chapter.label }));

/** Zona oceánica real según la profundidad. */
export function zoneOf(meters: number): string {
  if (meters < 200) return "Zona de luz";
  if (meters < 1000) return "Zona crepuscular";
  return "Zona de medianoche";
}

/** Burbujas simples del hero. */
export const heroBubbles = Array.from({ length: 14 }, (_, index) => ({
  left: `${(index * 61) % 100}%`,
  size: 8 + ((index * 13) % 26),
  duration: 9 + ((index * 7) % 10),
  delay: -((index * 5) % 13),
  dx: (index % 2 === 0 ? 1 : -1) * (14 + ((index * 11) % 40)),
}));

/**
 * Burbujas con el icono de una tecnología. Suben desde el borde inferior de
 * la pantalla durante todo el recorrido (capa fija). `compact` marca las que
 * se conservan en pantallas pequeñas.
 */
export const techBubbles = [
  { name: "React.js", left: "4%", size: 4.2, duration: 18, delay: 0.4, dx: 22, compact: true },
  { name: "Node.js", left: "13%", size: 3.4, duration: 22, delay: 6.5, dx: -18, compact: false },
  { name: "TypeScript", left: "22%", size: 3.8, duration: 20, delay: 11, dx: 16, compact: false },
  { name: "Supabase", left: "31%", size: 3.4, duration: 24, delay: 3, dx: 14, compact: false },
  { name: "Next.js", left: "40%", size: 4.0, duration: 19, delay: 8.5, dx: -14, compact: false },
  { name: "Tailwind CSS", left: "50%", size: 3.4, duration: 23, delay: 13, dx: 18, compact: false },
  { name: "Laravel", left: "60%", size: 3.6, duration: 21, delay: 1.8, dx: -20, compact: false },
  { name: "Vercel", left: "69%", size: 3.4, duration: 25, delay: 9.5, dx: 14, compact: false },
  { name: "Expo", left: "77%", size: 4.0, duration: 18, delay: 4.2, dx: 18, compact: true },
  { name: "Cloudflare", left: "85%", size: 3.4, duration: 22, delay: 12, dx: -16, compact: false },
  { name: "Vue.js", left: "92%", size: 4.2, duration: 20, delay: 7, dx: -12, compact: true },
  { name: "Netlify", left: "57%", size: 3.2, duration: 26, delay: 15.5, dx: 12, compact: false },
  { name: "Flutter", left: "27%", size: 3.6, duration: 21, delay: 17, dx: -14, compact: true },
  { name: "Python", left: "46%", size: 3.4, duration: 23, delay: 19.5, dx: 16, compact: false },
] as const;

/** Cardumen SVG del respaldo sin WebGL. */
export const fallbackSchool = [
  { top: "6%", w: 78, from: "#9ff4ff", to: "#1b8fb8", speed: 1.0 },
  { top: "18%", w: 56, from: "#b8fff0", to: "#14a58a", speed: 0.85 },
  { top: "32%", w: 92, from: "#9ff4ff", to: "#1b8fb8", speed: 1.15 },
  { top: "48%", w: 64, from: "#ffd9a0", to: "#e07a1f", speed: 0.95 },
  { top: "64%", w: 84, from: "#9ff4ff", to: "#1b8fb8", speed: 1.05 },
];

/** Tono (HSL) de cada grupo de habilidades. */
export const groupHues = [190, 160, 320, 45, 270, 20];
