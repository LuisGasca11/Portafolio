/* Estilo «band»: banda superior oscura con acento naranja (como /curriculum)
 * y dos columnas: contenido principal y panel lateral claro. */
import { esc, upper } from "../helpers.mjs";

const css = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif;
    width: 595pt; height: 842pt; overflow: hidden; display: flex; flex-direction: column; color: #1c1c1f; font-size: 7.5pt; line-height: 1.4;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  header { background: #15110e; color: #fff; padding: 30pt 40pt 20pt; border-bottom: 3pt solid #ff6b00; }
  h1 { margin: 0; font-size: 27pt; font-weight: 800; letter-spacing: -0.4pt; line-height: 1.03; }
  h1 em { font-style: normal; color: #ff6b00; }
  .subtitle { margin: 5pt 0 0; font-size: 9.6pt; color: #e9dfd7; }
  .contact { margin: 10pt 0 0; display: flex; flex-wrap: wrap; gap: 3pt 14pt; font-size: 7.2pt; color: #cbbfb5; }
  .layout { display: grid; grid-template-columns: 1fr 168pt; flex: 1; min-height: 0; }
  .main { padding: 15pt 22pt 0 40pt; }
  .side { background: #f4efe9; padding: 15pt 24pt 0 18pt; }
  h2 { margin: 14pt 0 5pt; font-size: 6.9pt; letter-spacing: 1.2pt; font-weight: 800; color: #ff6b00; text-transform: uppercase; }
  .main h2:first-child, .side h2:first-child { margin-top: 0; }
  p { margin: 0; }
  .about { color: #33333a; font-size: 7.8pt; }
  .job + .job { margin-top: 6pt; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 6pt; }
  .title { font-weight: 700; font-size: 8.6pt; }
  .date { color: #77716b; font-size: 7pt; white-space: nowrap; }
  .org { color: #d65500; font-weight: 700; font-size: 7.3pt; }
  .desc { color: #4a4743; margin-top: 1.5pt; }
  .project { margin-top: 5.5pt; }
  .project .title { font-size: 7.9pt; }
  .project .org { font-weight: 400; color: #8a847d; font-size: 6.5pt; }
  .project .desc { font-size: 6.8pt; }
  .links { font-size: 6.3pt; color: #d65500; }
  .group { margin-top: 4pt; }
  .group b { display: block; font-size: 7.2pt; }
  .group span { color: #5a5651; font-size: 6.9pt; }
  .edu div { margin-top: 4pt; }
  .edu b { display: block; font-size: 7.4pt; }
  .edu span { color: #5a5651; font-size: 6.8pt; }
  .tags { display: flex; flex-wrap: wrap; gap: 3pt; }
  .tags span { background: #fff; border: 0.6pt solid #e5dacd; border-radius: 8pt; padding: 1.2pt 5pt; font-size: 6.6pt; }
`;

export function render({ locale, getCv, createT, tagOf }) {
  const tag = tagOf(locale);
  const t = createT(locale);
  const cv = getCv(locale);
  const { profile } = cv;
  const words = profile.name.split(" ");
  const last = words.pop();
  const h = (key) => `<h2>${esc(t(key))}</h2>`;

  const jobs = cv.experience
    .filter((job) => job.inPdf)
    .map(
      (job) => `<div class="job"><div class="head"><div class="title">${esc(job.role)}</div><div class="date">${esc(job.period)}</div></div><div class="org">${esc(job.organization)}</div><p class="desc">${esc(job.description)}</p></div>`,
    )
    .join("");
  const projects = cv.projects
    .map((project) => {
      const links = (project.links ?? []).map((link) => link.label);
      return `<div class="project"><div class="head"><div class="title">${esc(project.name)}</div><div class="org">${esc(project.context)}</div></div><p class="desc">${esc(project.summary)}</p>${links.length ? `<div class="links">${esc(links.join(" · "))}</div>` : ""}</div>`;
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
    <header><h1>${esc(words.join(" "))} <em>${esc(last)}</em></h1><p class="subtitle">${esc(profile.title)}</p>
      <div class="contact"><span>${esc(profile.phone)}</span><span>${esc(profile.email)}</span><span>${esc(profile.location)}</span><span>${esc(profile.portfolio.label)}</span></div></header>
    <div class="layout">
      <div class="main">${h("cv.sections.about")}<p class="about">${esc(cv.about)}</p>${h("cv.sections.experience")}${jobs}${h("cv.sections.projects")}${projects}</div>
      <aside class="side">${h("cv.sections.technical")}${skills}${h("cv.sections.education")}<div class="edu">${education}</div>${h("cv.sections.soft")}${tags(cv.softSkills)}${h("cv.sections.languages")}${tags(cv.languages)}</aside>
    </div>
  </body></html>`;
}
