import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { ContactForm } from "@/components/variants/contact-form";
import type { ContactFormClasses } from "@/components/variants/contact-form";
import { cvUrl, projects, roles, site, skillGroups, studies, technologies } from "@/lib/content";

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1",
  label: "text-[0.7rem] font-semibold tracking-[0.14em] text-stone-500 uppercase",
  input:
    "w-full border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none",
  button:
    "mt-2 inline-flex h-12 items-center justify-center bg-emerald-800 px-6 text-sm font-semibold tracking-wide text-white uppercase disabled:opacity-60",
  error: "text-sm text-red-700",
  sent: "border border-emerald-700 bg-emerald-50 p-6",
  sentTitle: "font-semibold text-emerald-900",
  sentText: "mt-2 text-sm text-stone-700",
  again: "mt-4 inline-flex h-10 items-center border border-emerald-800 px-4 text-sm font-semibold text-emerald-900",
};

const cell = "border-b border-stone-200 px-3 py-3 align-top";

export function V1Factura() {
  return (
    <div className="min-h-screen bg-[#e9e6dd] px-3 py-8 text-stone-900 sm:px-6 sm:py-14">
      <article className="mx-auto max-w-4xl border border-stone-300 bg-[#fffdf8] shadow-[0_1px_0_#d6d1c4,0_24px_60px_-30px_rgba(60,50,20,0.45)]">
        <header className="flex flex-col gap-6 border-b-4 border-double border-emerald-800 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-emerald-800 uppercase">Cotización de servicios</p>
            <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">{site.name}</h1>
            <p className="mt-2 text-stone-600">{site.title}</p>
          </div>
          <dl className="grid shrink-0 grid-cols-[auto_auto] gap-x-4 gap-y-1 border border-stone-300 bg-stone-50 p-4 font-mono text-xs">
            <dt className="text-stone-500">Folio</dt>
            <dd className="text-right font-semibold">LGASCA-2026</dd>
            <dt className="text-stone-500">Fecha</dt>
            <dd className="text-right font-semibold">2026</dd>
            <dt className="text-stone-500">Tipo</dt>
            <dd className="text-right font-semibold">Cotización</dd>
            <dt className="text-stone-500">Lugar</dt>
            <dd className="text-right font-semibold">{site.location}</dd>
          </dl>
        </header>

        <section className="grid gap-px border-b border-stone-300 bg-stone-300 sm:grid-cols-2">
          <div className="bg-[#fffdf8] p-6 sm:px-10">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">Emisor</h2>
            <p className="mt-2 font-semibold">{site.name}</p>
            <p className="text-sm text-stone-600">{site.focus}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">{site.about}</p>
          </div>
          <div className="bg-[#fffdf8] p-6 sm:px-10">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">Receptor</h2>
            <p className="mt-2 font-semibold">Tú, que estás leyendo esto</p>
            <p className="text-sm text-stone-600">Reclutador, cliente o colega</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              Abajo está el detalle de lo que he desarrollado. Al final puedes solicitar tu cotización.
            </p>
          </div>
        </section>

        <section id="desarrollos" className="p-6 sm:p-10">
          <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">Conceptos · Desarrollos</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-emerald-800 text-xs tracking-wider text-white uppercase">
                  <th className="px-3 py-2 font-semibold">Cant.</th>
                  <th className="px-3 py-2 font-semibold">Descripción</th>
                  <th className="px-3 py-2 font-semibold">Cliente / contexto</th>
                  <th className="px-3 py-2 font-semibold">Tecnologías</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.name} className="odd:bg-white even:bg-stone-50/70">
                    <td className={`${cell} font-mono text-stone-500`}>{String(index + 1).padStart(2, "0")}</td>
                    <td className={cell}>
                      <p className="font-semibold">{project.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-stone-600">{project.description}</p>
                      {project.href !== undefined ? (
                        <ExternalLink
                          href={project.href}
                          className="mt-2 inline-block text-xs font-semibold text-emerald-800 underline underline-offset-4"
                        >
                          {project.linkLabel ?? project.href}
                        </ExternalLink>
                      ) : null}
                    </td>
                    <td className={`${cell} text-stone-700`}>{project.context}</td>
                    <td className={cell}>
                      {project.stack.length > 0 ? (
                        <ul className="flex flex-wrap gap-1">
                          {project.stack.map((tag) => (
                            <li key={tag} className="border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[0.68rem]">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto w-full max-w-xs font-mono text-sm">
            <p className="flex justify-between border-b border-stone-200 py-1.5">
              <span className="text-stone-500">Desarrollos</span>
              <span>{projects.length}</span>
            </p>
            <p className="flex justify-between border-b border-stone-200 py-1.5">
              <span className="text-stone-500">Roles de desarrollo</span>
              <span>{roles.length}</span>
            </p>
            <p className="flex justify-between border-b border-stone-200 py-1.5">
              <span className="text-stone-500">Tecnologías</span>
              <span>{technologies.length}</span>
            </p>
            <p className="flex justify-between bg-emerald-800 px-2 py-2 font-bold text-white">
              <span>TOTAL</span>
              <span>{projects.length} entregas</span>
            </p>
          </div>
        </section>

        <section id="experiencia" className="border-t border-stone-300 p-6 sm:p-10">
          <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">Historial de servicio</h2>
          <ol className="mt-4 grid gap-4">
            {roles.map((role) => (
              <li key={role.organization} className="border-l-4 border-emerald-800 bg-stone-50 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {role.role} ·{" "}
                    {role.href !== undefined ? (
                      <ExternalLink href={role.href} className="underline underline-offset-4">
                        {role.organization}
                      </ExternalLink>
                    ) : (
                      role.organization
                    )}
                  </p>
                  {role.period !== undefined ? <p className="font-mono text-xs text-stone-500">{role.period}</p> : null}
                </div>
                {role.summary !== undefined ? (
                  <p className="mt-2 text-sm leading-relaxed text-stone-700">{role.summary}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section id="habilidades" className="border-t border-stone-300 p-6 sm:p-10">
          <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">
            Catálogo de habilidades
          </h2>
          <dl className="mt-4 grid gap-px bg-stone-200 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title} className="bg-[#fffdf8] p-4">
                <dt className="text-sm font-semibold text-emerald-900">{group.title}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="educacion" className="border-t border-stone-300 p-6 sm:p-10">
          <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">Observaciones · Educación</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {studies.map((study) => (
              <li key={study.title} className="flex flex-wrap justify-between gap-2 border-b border-dashed border-stone-300 pb-3">
                <span>
                  <span className="font-semibold">{study.title}</span>
                  {study.institution !== undefined ? <span className="text-stone-600"> · {study.institution}</span> : null}
                </span>
                <span className="font-mono text-xs text-stone-500">{study.period}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="contacto" className="border-t-4 border-double border-emerald-800 bg-stone-50 p-6 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Solicitar cotización</h2>
          <p className="mt-2 max-w-xl text-sm text-stone-600">
            Cuéntame qué necesitas y te respondo con una propuesta. El primer paso no tiene costo.
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <ul className="grid content-start gap-2 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-4">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="underline underline-offset-4">
                  {site.phone}
                </a>
              </li>
              <li>
                <ExternalLink href={site.githubUrl} className="underline underline-offset-4">
                  {site.githubLabel}
                </ExternalLink>
              </li>
              <li>
                <Link href={cvUrl} className="underline underline-offset-4">
                  Currículum
                </Link>
              </li>
              <li className="text-stone-500">{site.location}</li>
            </ul>
            <ContactForm
              classes={formClasses}
              submitLabel="Solicitar cotización"
              sentTitle="Cotización solicitada"
            />
          </div>
        </section>
        <p className="border-t border-stone-300 px-6 py-3 text-center font-mono text-[0.65rem] tracking-widest text-stone-400 uppercase">
          Este documento no tiene validez fiscal · © 2026 {site.name}
        </p>
      </article>
    </div>
  );
}
