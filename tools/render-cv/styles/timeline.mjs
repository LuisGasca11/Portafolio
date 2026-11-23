/* Estilo «timeline»: experiencia como línea de tiempo vertical, proyectos en
 * tarjetas suaves y habilidades como chips. Acento verde azulado. */
import { esc, upper } from "../helpers.mjs";

const css = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif;
    width: 595pt; height: 842pt; overflow: hidden; padding: 34pt 42pt 0; color: #17262b; font-size: 7.5pt; line-height: 1.4;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  header { display: grid; grid-template-columns: 1fr auto; gap: 14pt; align-items: end; padding-bottom: 12pt; border-bottom: 1.4pt solid #0d9488; }
  h1 { margin: 0; font-size: 26pt; font-weight: 800; letter-spacing: -0.4pt; line-height: 1.02; }
  .subtitle { margin: 5pt 0 0; font-size: 9.4pt; color: #0d7a70; font-weight: 600; }
  .contact { text-align: right; font-size: 7.1pt; color: #4d6168; line-height: 1.55; }
  .about { margin: 11pt 0 0; font-size: 8pt; color: #2d4046; }
  h2 { margin: 14pt 0 7pt; font-size: 7pt; letter-spacing: 1.2pt; font-weight: 800; color: #0d9488; }
  .timeline { position: relative; margin-left: 4pt; padding-left: 14pt; border-left: 1.2pt solid #b8e0db; }
  .job { position: relative; }
  .job + .job { margin-top: 7pt; }
  .job::before { content: ""; position: absolute; left: -19.6pt; top: 2.4pt; width: 7pt; height: 7pt; border-radius: 50%; background: #fff; border: 1.6pt solid #0d9488; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
  .title { font-weight: 700; font-size: 8.6pt; }
  .date { color: #6c8187; font-size: 7pt; white-space: nowrap; }
  .org { color: #0d7a70; font-weight: 700; }
  .desc { margin: 1.5pt 0 0; color: #405459; }
  .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt; }
  .project { background: #f0f7f6; border-radius: 6pt; padding: 6pt 8pt; }
  .project .title { font-size: 7.9pt; }
  .project .org { font-size: 6.4pt; font-weight: 400; color: #6c8187; }
  .project .desc { font-size: 6.7pt; }
  .links { font-size: 6.3pt; color: #0d7a70; margin-top: 1pt; }
  .two { display: grid; grid-template-columns: 1.35fr 1fr; gap: 20pt; }
  .group { display: flex; gap: 6pt; margin-top: 3pt; }
  .group b { flex: 0 0 38pt; }
  .group span { color: #4d6168; }
  .edu div { margin-top: 3.5pt; }
  .edu b { font-size: 7.6pt; }
  .edu span { display: block; color: #6c8187; font-size: 6.9pt; }
  .tags { display: flex; flex-wrap: wrap; gap: 3pt; }
  .tags span { background: #e3f3f1; color: #0b5f57; border-radius: 8pt; padding: 1.3pt 5.5pt; font-size: 6.6pt; font-weight: 600; }
`;

export function render({ locale, getCv, createT, tagOf }) {
  const tag = tagOf(locale);
  const t = createT(locale);
  const cv = getCv(locale);
  const { profile } = cv;
  const h = (key) => `<h2>${esc(upper(t(key), tag))}</h2>`;

  const jobs = cv.experience
    .filter((job) => job.inPdf)
    .map(
      (job) => `<div class="job"><div class="head"><div class="title">${esc(job.role)} · <span class="org">${esc(job.organization)}</span></div><div class="date">${esc(job.period)}</div></div><p class="desc">${esc(job.description)}</p></div>`,
    )
    .join("");
  const projects = cv.projects
    .map((project) => {
      const links = (project.links ?? []).map((link) => link.label);
      return `<div class="project"><div class="title">${esc(project.name)}</div><div class="org">${esc(project.context)}</div><p class="desc">${esc(project.summary)}</p>${links.length ? `<div class="links">${esc(links.join(" · "))}</div>` : ""}</div>`;
    })
    .join("");
  const skills = cv.technicalSkills
    .map((group) => `<div class="group"><b>${esc(group.label)}</b><span>${esc(group.items.join(", "))}</span></div>`)
    .join("");
  const education = cv.education
    .map((item) => `<div><b>${esc(item.program ?? item.institution)}</b><span>${esc(item.program ? `${item.institution} · ` : "")}${esc(item.period)}</span></div>`)
    .join("");
  const tags = (items) => `<div class="tags">${items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;

  return `<!doctype html><html lang="${tag}"><head><meta charset="utf-8"><title>${esc(profile.name)} — CV</title><style>${css}</style></head><body>
    <header><div><h1>${esc(profile.name)}</h1><p class="subtitle">${esc(profile.title)}</p></div>
      <div class="contact">${esc(profile.phone)}<br>${esc(profile.email)}<br>${esc(profile.location)}<br>${esc(profile.portfolio.label)}</div></header>
    <p class="about">${esc(cv.about)}</p>
    ${h("cv.sections.experience")}<div class="timeline">${jobs}</div>
    ${h("cv.sections.projects")}<div class="projects">${projects}</div>
    <div class="two"><div>${h("cv.sections.technical")}${skills}</div><div>${h("cv.sections.education")}<div class="edu">${education}</div></div></div>
    <div class="two"><div>${h("cv.sections.soft")}${tags(cv.softSkills)}</div><div>${h("cv.sections.languages")}${tags(cv.languages)}</div></div>
  </body></html>`;
}
