/* Genera los PDF del currículum (uno por idioma) con el estilo de una página
 * A4: etiquetas a la izquierda, acento morado y proyectos en dos columnas.
 * Usa los mismos datos y textos que el sitio (`lib/cv.ts` y `lib/i18n`).
 *
 * Uso: node tools/render-cv/render.mjs [--style=classic|sidebar] [--out=carpeta]
 * Requiere Playwright (Chromium). Salida: public/cv/ */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Playwright se resuelve como en `tools/render-loops` (global o del proyecto).
const { chromium } = createRequire(import.meta.url)("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tmp = mkdtempSync(path.join(tmpdir(), "render-cv-"));
const bundle = path.join(tmp, "data.mjs");

await build({
  entryPoints: [path.join(root, "tools/render-cv/entry.ts")],
  outfile: bundle,
  bundle: true,
  platform: "node",
  format: "esm",
  alias: { "@": root },
  logLevel: "warning",
});
const { getCv, cvPdf, createT, locales, tagOf } = await import(pathToFileURL(bundle).href);

const style = process.argv.find((arg) => arg.startsWith("--style="))?.slice(8) ?? "classic";
const outArg = process.argv.find((arg) => arg.startsWith("--out="))?.slice(6);
const { render } = await import(`./styles/${style}.mjs`);

const outDir = outArg ? path.resolve(outArg) : path.join(root, "public/cv");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const locale of locales) {
  const page = await browser.newPage();
  await page.setContent(render({ locale, getCv, createT, tagOf }), { waitUntil: "load" });
  const overflow = await page.evaluate(() => document.body.scrollHeight - document.body.clientHeight);
  const file = path.join(outDir, cvPdf[locale].file);
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log(`${locale}: ${path.relative(root, file)}${overflow > 0 ? `  ⚠ el contenido excede la página por ${overflow}px` : ""}`);
  await page.close();
}
await browser.close();
