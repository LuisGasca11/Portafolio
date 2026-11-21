/* Genera lib/tech-icons.ts a partir de simple-icons (CC0).
 * Uso: npm i --no-save simple-icons && node tools/gen-tech-icons.cjs
 * Los iconos que simple-icons no tiene (Java, SQL Server, Firebird, Microsip)
 * son glifos propios dibujados con trazos. */
const si = require("simple-icons");
const fs = require("node:fs");
const path = require("node:path");

const brand = {
  html: si.siHtml5, css: si.siCss, javascript: si.siJavascript, "vue.js": si.siVuedotjs,
  "react.js": si.siReact, "next.js": si.siNextdotjs, typescript: si.siTypescript, php: si.siPhp,
  laravel: si.siLaravel, mysql: si.siMysql, expo: si.siExpo, "react native": si.siReact,
  git: si.siGit, github: si.siGithub, "tailwind css": si.siTailwindcss, leaflet: si.siLeaflet,
  pm2: si.siPm2, "three.js": si.siThreedotjs, "node.js": si.siNodedotjs, express: si.siExpress,
  vercel: si.siVercel, netlify: si.siNetlify, supabase: si.siSupabase, cloudflare: si.siCloudflare,
};

const custom = {
  java: { hex: "E76F00", strokes: ["M9 3c1.2 1.6-1.6 2.6 0 4.2", "M13 2c1.4 1.9-1.8 3 0 5", "M5 11h12v3a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z", "M17 12h1.4a2.1 2.1 0 0 1 0 4.2H16.6", "M4 21.5h14"] },
  "sql server": { hex: "CC2927", strokes: ["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z", "M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"] },
  firebird: { hex: "F40F02", strokes: ["M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.5 1 2 2 2-1-3-.5-6 1-9z"] },
  iis: { hex: "5E9BD1", strokes: ["M3 5h18v6H3z", "M3 13h18v6H3z", "M7 8h.01", "M7 16h.01", "M11 8h6", "M11 16h6"] },
  linkedin: { hex: "0A66C2", strokes: ["M4 9v11", "M4 4.5v.01", "M9 20V9", "M9 13a4 4 0 0 1 8 0v7"] },
  microsip: { hex: "0E7C86", strokes: ["M5 3.5h14v17H5z", "M9 8h6", "M9 12h6", "M9 16h3"] },
};

const out = {};
for (const [key, icon] of Object.entries(brand)) {
  if (!icon) throw new Error(`Falta el icono de ${key}`);
  out[key] = { hex: icon.hex, path: icon.path };
}
for (const [key, icon] of Object.entries(custom)) {
  out[key] = { hex: icon.hex, strokes: icon.strokes };
}

const body = `/* Generado por tools/gen-tech-icons.cjs. No editar a mano. */
export type TechIcon = { hex: string; path?: string; strokes?: readonly string[] };

export const techIcons: Readonly<Record<string, TechIcon>> = ${JSON.stringify(out, null, 2)};

/** Busca el icono de una tecnología por nombre («Microsip (básico)» → «microsip»). */
export function getTechIcon(name: string): TechIcon | undefined {
  return techIcons[name.replace(/\\s*\\(.*\\)\\s*$/, "").trim().toLowerCase()];
}
`;
fs.writeFileSync(path.resolve(__dirname, "../lib/tech-icons.ts"), body);
console.log("iconos:", Object.keys(out).length);
