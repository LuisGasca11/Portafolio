/* Estilo «clásico»: hoja A4 clara, etiquetas a la izquierda y acento morado. */
import { esc, upper } from "../helpers.mjs";

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

export function render({ locale, getCv, createT, tagOf }) {
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
