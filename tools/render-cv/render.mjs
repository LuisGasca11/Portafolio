/* Genera los PDF del currículum (uno por idioma) con el estilo de una página
 * A4: etiquetas a la izquierda, acento morado y proyectos en dos columnas.
 * Usa los mismos datos y textos que el sitio (`lib/cv.ts` y `lib/i18n`).
 *
 * Uso: node tools/render-cv/render.mjs
 * Requiere Playwright (Chromium). Salida: public/cv/ */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
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

const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const upper = (value, tag) => value.toLocaleUpperCase(tag);

const css = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif;
    color: #1d1d22; font-size: 7.6pt; line-height: 1.38;
    padding: 34pt 46pt 0; width: 595pt; height: 842pt; overflow: hidden;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  h1 { margin: 0; font-size: 28pt; line-height: 1; font-weight: 800; letter-spacing: -0.2pt; }
  .subtitle { margin: 5pt 0 0; font-size: 11pt; color: #6d3de0; }
  .contact { margin: 9pt 0 0; font-size: 7.4pt; color: #666; }
  .contact span + span::before { content: "·"; margin: 0 6pt; color: #999; }
  .row { display: grid; grid-template-columns: 108pt 1fr; gap: 0; border-top: 0.5pt solid #e1e1e6; padding: 7pt 0; }
  .row:first-of-type { margin-top: 11pt; }
  .label { font-size: 6.4pt; font-weight: 700; letter-spacing: 0.3pt; color: #6d3de0; padding-top: 1pt; }
  .job + .job { margin-top: 7pt; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 10pt; }
  .title { font-size: 9pt; font-weight: 700; }
  .date { font-size: 7.4pt; color: #666; white-space: nowrap; }
  .org { font-size: 7.4pt; font-weight: 700; color: #6d3de0; margin-top: 0.5pt; }
  .org.plain { font-weight: 400; font-size: 6.8pt; }
  .desc { color: #555; margin: 2pt 0 0; }
  .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; }
  .project .title { font-size: 8.4pt; }
  .project .desc { font-size: 6.9pt; line-height: 1.34; margin-top: 1.5pt; }
  .project .team { font-size: 6.4pt; color: #888; margin-top: 1pt; }
  .links { font-size: 6.5pt; color: #6d3de0; margin-top: 1pt; }
  .edu { display: grid; grid-template-columns: 62pt 1fr; gap: 3pt 0; }
  .edu .date { color: #555; font-size: 7.6pt; }
  .edu strong { font-weight: 700; font-size: 8.2pt; }
  .skill { display: grid; grid-template-columns: 54pt 1fr; margin-top: 2.2pt; color: #666; }
  .skill:first-child { margin-top: 0; }
  .skill b { color: #1d1d22; font-weight: 700; }
  .inline { font-size: 7.8pt; color: #1d1d22; }
  .inline span { white-space: nowrap; }
  .inline { word-spacing: 0; line-height: 1.55; }
  .inline span + span::before { content: "·"; margin: 0 5pt; color: #888; }
`;

function render(locale) {
  const tag = tagOf(locale);
  const t = createT(locale);
  const cv = getCv(locale);
  const { profile } = cv;
  const section = (label, body) =>
    `<section class="row"><div class="label">${esc(upper(label, tag))}</div><div>${body}</div></section>`;

  const jobs = cv.experience
    .filter((job) => job.inPdf)
    .map(
      (job) => `<div class="job">
        <div class="head"><div class="title">${esc(job.role)}</div><div class="date">${esc(job.period)}</div></div>
        <div class="org">${esc(job.organization)}</div>
        <p class="desc">${esc(job.description)}</p>
      </div>`,
    )
    .join("");

  const projects = cv.projects
    .map((project) => {
      const links = [...(project.links ?? []).map((link) => link.label), ...(project.apps ?? []).map((app) => app.label)];
      return `<div class="project">
        <div class="title">${esc(project.name)}</div>
        <div class="org plain">${esc(project.context)}</div>
        <p class="desc">${esc(project.summary)}</p>
        ${project.team ? `<div class="team">${esc(project.team)}</div>` : ""}
        ${links.length > 0 && !project.apps ? `<div class="links">${esc(links.join(" · "))}</div>` : ""}
      </div>`;
    })
    .join("");

  const education = cv.education
    .map(
      (item) =>
        `<div class="date">${esc(item.period)}</div><div><strong>${esc(item.program ?? item.institution)}</strong>${
          item.program ? ` · ${esc(item.institution)}` : ""
        }</div>`,
    )
    .join("");

  const skills = cv.technicalSkills
    .map((group) => `<div class="skill"><b>${esc(group.label)}</b><span>${esc(group.items.join(", "))}</span></div>`)
    .join("");

  const inline = (items) => `<div class="inline">${items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;
  const contact = [profile.phone, profile.email, profile.location, profile.portfolio.label]
    .map((item) => `<span>${esc(item)}</span>`)
    .join("");

  return `<!doctype html><html lang="${tag}"><head><meta charset="utf-8"><title>${esc(profile.name)} — CV</title><style>${css}</style></head><body>
    <h1>${esc(upper(profile.name, tag))}</h1>
    <p class="subtitle">${esc(profile.title)}</p>
    <p class="contact">${contact}</p>
    ${section(t("cv.sections.about"), `<p class="desc" style="margin:0;color:#1d1d22">${esc(cv.about)}</p>`)}
    ${section(t("cv.sections.experience"), jobs)}
    ${section(t("cv.sections.projects"), `<div class="projects">${projects}</div>`)}
    ${section(t("cv.sections.education"), `<div class="edu">${education}</div>`)}
    ${section(t("cv.sections.technical"), skills)}
    ${section(t("cv.sections.soft"), inline(cv.softSkills))}
    ${section(t("cv.sections.languages"), inline(cv.languages))}
  </body></html>`;
}

const outDir = path.join(root, "public/cv");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const locale of locales) {
  const page = await browser.newPage();
  await page.setContent(render(locale), { waitUntil: "load" });
  const overflow = await page.evaluate(() => document.body.scrollHeight - document.body.clientHeight);
  const file = path.join(outDir, cvPdf[locale].file);
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
  writeFileSync(path.join(tmp, `${locale}.html`), render(locale));
  console.log(`${locale}: ${path.relative(root, file)}${overflow > 0 ? `  ⚠ el contenido excede la página por ${overflow}px` : ""}`);
  await page.close();
}
await browser.close();
