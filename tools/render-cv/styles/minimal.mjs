/* Estilo «minimal»: blanco, tipografía con serifas en el nombre y un solo
 * color de acento. Mucho aire y todo a ancho completo. */
import { esc, upper } from "../helpers.mjs";

const css = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif;
    width: 595pt; height: 842pt; overflow: hidden; padding: 44pt 52pt 0;
    color: #222; font-size: 7.7pt; line-height: 1.45;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  h1 { margin: 0; font-family: Georgia, "Times New Roman", "Liberation Serif", serif; font-weight: 400; font-size: 31pt; letter-spacing: -0.4pt; line-height: 1.05; }
  .subtitle { margin: 7pt 0 0; font-size: 9.5pt; color: #777; letter-spacing: 0.2pt; }
  .contact { margin: 10pt 0 0; padding-top: 9pt; border-top: 1.2pt solid #b5532f; display: flex; flex-wrap: wrap; gap: 3pt 14pt; font-size: 7.3pt; color: #555; }
  section { margin-top: 15pt; }
  h2 { margin: 0 0 6pt; font-size: 6.6pt; letter-spacing: 1.6pt; font-weight: 700; color: #b5532f; }
  .about { margin: 0; font-family: Georgia, "Liberation Serif", serif; font-size: 9.4pt; line-height: 1.5; color: #333; }
  .job + .job { margin-top: 7pt; }
  .head { display: flex; justify-content: space-between; align-items: baseline; }
  .title { font-weight: 700; font-size: 8.6pt; }
  .org { color: #b5532f; font-weight: 600; }
  .date { color: #888; font-size: 7.1pt; }
  .desc { margin: 1.5pt 0 0; color: #555; }
  .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt 22pt; }
  .project .title { font-size: 8pt; }
  .project .org { font-weight: 400; font-size: 6.6pt; color: #999; }
  .project .desc { font-size: 6.9pt; }
  .links { font-size: 6.4pt; color: #b5532f; margin-top: 1pt; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 22pt; }
  .skill { margin-top: 2pt; color: #555; }
  .skill b { color: #222; margin-right: 4pt; }
  .edu div { margin-top: 3pt; }
  .edu b { font-weight: 700; }
  .inline { display: flex; flex-wrap: wrap; gap: 1pt 0; color: #333; }
  .inline span { white-space: nowrap; }
  .inline span + span::before { content: "/"; margin: 0 5pt; color: #bbb; }
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
      (job) => `<div class="job"><div class="head"><div class="title">${esc(job.role)} <span class="org">· ${esc(job.organization)}</span></div><div class="date">${esc(job.period)}</div></div><p class="desc">${esc(job.description)}</p></div>`,
    )
    .join("");
  const projects = cv.projects
    .map((project) => {
      const links = (project.links ?? []).map((link) => link.label);
      return `<div class="project"><div class="title">${esc(project.name)}</div><div class="org">${esc(project.context)}</div><p class="desc">${esc(project.summary)}</p>${links.length ? `<div class="links">${esc(links.join(" · "))}</div>` : ""}</div>`;
    })
    .join("");
  const skills = cv.technicalSkills
    .map((group) => `<div class="skill"><b>${esc(group.label)}</b>${esc(group.items.join(", "))}</div>`)
    .join("");
  const education = cv.education
    .map((item) => `<div><b>${esc(item.program ?? item.institution)}</b>${item.program ? ` · ${esc(item.institution)}` : ""} <span class="date">${esc(item.period)}</span></div>`)
    .join("");
  const inline = (items) => `<div class="inline">${items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;

  return `<!doctype html><html lang="${tag}"><head><meta charset="utf-8"><title>${esc(profile.name)} — CV</title><style>${css}</style></head><body>
    <h1>${esc(profile.name)}</h1>
    <p class="subtitle">${esc(profile.title)}</p>
    <div class="contact"><span>${esc(profile.phone)}</span><span>${esc(profile.email)}</span><span>${esc(profile.location)}</span><span>${esc(profile.portfolio.label)}</span></div>
    <section><p class="about">${esc(cv.about)}</p></section>
    <section>${h("cv.sections.experience")}${jobs}</section>
    <section>${h("cv.sections.projects")}<div class="projects">${projects}</div></section>
    <section class="cols"><div>${h("cv.sections.technical")}${skills}</div><div>${h("cv.sections.education")}<div class="edu">${education}</div><div style="margin-top:9pt">${h("cv.sections.languages")}${inline(cv.languages)}</div></div></section>
    <section>${h("cv.sections.soft")}${inline(cv.softSkills)}</section>
  </body></html>`;
}
