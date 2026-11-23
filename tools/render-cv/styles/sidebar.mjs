/* Estilo «lateral»: barra oscura (azul océano) con contacto y habilidades, y
 * columna clara con experiencia y proyectos. */
import { esc, upper } from "../helpers.mjs";

const css = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif;
    width: 595pt; height: 842pt; overflow: hidden; display: grid; grid-template-columns: 178pt 1fr;
    color: #1b2733; font-size: 7.5pt; line-height: 1.4;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  aside {
    background: linear-gradient(180deg, #06324f 0%, #04243a 55%, #031a2b 100%);
    color: #d8eef7; padding: 34pt 18pt 0 22pt;
  }
  .brand { width: 30pt; height: 3pt; background: #5dd8ff; border-radius: 2pt; margin-bottom: 14pt; }
  aside h2 { margin: 15pt 0 6pt; font-size: 6.4pt; letter-spacing: 1.1pt; font-weight: 700; color: #5dd8ff; }
  aside h2:first-of-type { margin-top: 0; }
  aside p, aside li { margin: 0; }
  .contact li { list-style: none; margin-top: 4pt; font-size: 7.2pt; word-break: break-word; }
  .contact span { display: block; font-size: 6pt; letter-spacing: 0.6pt; color: #7fb3c8; }
  aside ul { margin: 0; padding: 0; }
  .group { margin-top: 5pt; }
  .group b { display: block; font-size: 7.2pt; color: #fff; }
  .group span { color: #b9dbe8; font-size: 6.9pt; }
  .tags { display: flex; flex-wrap: wrap; gap: 3pt; }
  .tags li { list-style: none; border: 0.6pt solid rgba(93, 216, 255, 0.45); border-radius: 8pt; padding: 1.2pt 5pt; font-size: 6.6pt; }
  .edu li { list-style: none; margin-top: 5pt; }
  .edu b { display: block; color: #fff; font-size: 7.4pt; }
  .edu span { color: #b9dbe8; font-size: 6.8pt; }
  main { padding: 34pt 34pt 0 26pt; }
  h1 { margin: 0; font-size: 25pt; line-height: 1.02; font-weight: 800; letter-spacing: -0.3pt; color: #04243a; }
  .subtitle { margin: 6pt 0 0; font-size: 10pt; color: #0a8fc0; font-weight: 600; }
  h3 { margin: 15pt 0 6pt; font-size: 7pt; letter-spacing: 1.1pt; font-weight: 800; color: #0a8fc0; display: flex; align-items: center; gap: 7pt; }
  h3::after { content: ""; flex: 1; height: 0.6pt; background: #d7e6ee; }
  .about { margin: 11pt 0 0; font-size: 8pt; color: #2b3b49; }
  .job + .job { margin-top: 7pt; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
  .title { font-size: 8.8pt; font-weight: 700; color: #04243a; }
  .date { font-size: 7pt; color: #6a7c89; white-space: nowrap; }
  .org { font-size: 7.4pt; font-weight: 700; color: #0a8fc0; }
  .desc { margin: 2pt 0 0; color: #43535f; }
  .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt 11pt; }
  .project { border-left: 1.6pt solid #5dd8ff; padding-left: 6pt; }
  .project .title { font-size: 8pt; }
  .project .org { font-size: 6.4pt; font-weight: 400; color: #6a7c89; }
  .project .desc { font-size: 6.7pt; line-height: 1.35; }
  .links { font-size: 6.3pt; color: #0a8fc0; margin-top: 1pt; }
`;

export function render({ locale, getCv, createT, tagOf }) {
  const tag = tagOf(locale);
  const t = createT(locale);
  const cv = getCv(locale);
  const { profile } = cv;

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
      const links = (project.links ?? []).map((link) => link.label);
      return `<div class="project">
        <div class="title">${esc(project.name)}</div>
        <div class="org">${esc(project.context)}</div>
        <p class="desc">${esc(project.summary)}</p>
        ${links.length > 0 ? `<div class="links">${esc(links.join(" · "))}</div>` : ""}
      </div>`;
    })
    .join("");

  const contact = [
    [t("cv.nav.contact"), profile.phone],
    ["EMAIL", profile.email],
    [profile.location, ""],
    ["WEB", profile.portfolio.label],
    ["GITHUB", profile.github.label],
  ]
    .map(([k, v]) => (v ? `<li><span>${esc(k)}</span>${esc(v)}</li>` : `<li>${esc(k)}</li>`))
    .join("");

  const skills = cv.technicalSkills
    .map((group) => `<div class="group"><b>${esc(group.label)}</b><span>${esc(group.items.join(" · "))}</span></div>`)
    .join("");
  const tags = (items) => `<ul class="tags">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  const education = cv.education
    .map((item) => `<li><b>${esc(item.program ?? item.institution)}</b><span>${esc(item.program ? `${item.institution} · ` : "")}${esc(item.period)}</span></li>`)
    .join("");

  return `<!doctype html><html lang="${tag}"><head><meta charset="utf-8"><title>${esc(profile.name)} — CV</title><style>${css}</style></head><body>
    <aside>
      <div class="brand"></div>
      <h2>${esc(upper(t("cv.nav.contact"), tag))}</h2>
      <ul class="contact">${contact.replace(`<li><span>${esc(t("cv.nav.contact"))}</span>`, "<li><span>TEL</span>")}</ul>
      <h2>${esc(upper(t("cv.sections.technical"), tag))}</h2>
      ${skills}
      <h2>${esc(upper(t("cv.sections.education"), tag))}</h2>
      <ul class="edu">${education}</ul>
      <h2>${esc(upper(t("cv.sections.soft"), tag))}</h2>
      ${tags(cv.softSkills)}
      <h2>${esc(upper(t("cv.sections.languages"), tag))}</h2>
      ${tags(cv.languages)}
    </aside>
    <main>
      <h1>${esc(profile.name)}</h1>
      <p class="subtitle">${esc(profile.title)}</p>
      <p class="about">${esc(cv.about)}</p>
      <h3>${esc(upper(t("cv.sections.experience"), tag))}</h3>
      ${jobs}
      <h3>${esc(upper(t("cv.sections.projects"), tag))}</h3>
      <div class="projects">${projects}</div>
    </main>
  </body></html>`;
}
