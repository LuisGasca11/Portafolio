import Link from "next/link";
import "./ticket.css";
import { ExternalLink } from "@/components/external-link";
import { ContactForm } from "@/components/variants/contact-form";
import type { ContactFormClasses } from "@/components/variants/contact-form";
import { cvUrl, projects, roles, site, skillGroups, studies, technologies } from "@/lib/content";

const formClasses: ContactFormClasses = {
  form: "grid gap-3",
  field: "grid gap-1",
  label: "text-[0.7rem] tracking-widest uppercase",
  input:
    "w-full border border-dashed border-neutral-700 bg-transparent px-2 py-2 text-sm placeholder:text-neutral-400 focus:border-solid focus:outline-none",
  button: "mt-2 h-11 bg-neutral-900 text-sm font-bold tracking-widest text-[#f7f5ee] uppercase disabled:opacity-60",
  error: "text-sm font-bold",
  sent: "border border-dashed border-neutral-700 p-4",
  sentTitle: "font-bold uppercase",
  sentText: "mt-2 text-sm",
  again: "mt-3 border border-neutral-900 px-3 py-2 text-xs font-bold uppercase",
};

function Rule({ char = "-" }: { char?: string }) {
  return (
    <p aria-hidden="true" className="my-4 overflow-hidden text-clip whitespace-nowrap text-neutral-500 select-none">
      {char.repeat(80)}
    </p>
  );
}

function Leader({ left, right }: { left: string; right?: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-bold">{left}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 overflow-hidden border-b border-dotted border-neutral-500" />
      {right !== undefined ? <span className="text-right">{right}</span> : null}
    </p>
  );
}

/** Código de barras decorativo: se genera a partir del texto, no codifica datos reales. */
function Barcode({ text }: { text: string }) {
  let seed = 7;
  for (const char of text) {
    seed = (seed * 31 + char.charCodeAt(0)) % 100003;
  }
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let index = 0; index < 48; index += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483647;
    const w = 1 + (seed % 3);
    bars.push({ x, w });
    x += w + 1 + (seed % 2);
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} className="mx-auto h-14 w-56" aria-hidden="true" preserveAspectRatio="none">
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="40" fill="#1b1b1b" />
      ))}
    </svg>
  );
}

export function V3Ticket() {
  return (
    <div className="min-h-screen bg-[#3a3a3c] px-3 py-14 sm:py-20">
      <article className="ticket-paper mx-auto max-w-md px-5 py-8 font-mono text-[0.8rem] leading-relaxed sm:px-8 sm:text-sm">
        <header className="text-center">
          <p className="text-xs tracking-[0.35em]">*** LGASCA ***</p>
          <h1 className="mt-2 text-xl leading-tight font-bold uppercase sm:text-2xl">{site.name}</h1>
          <p className="mt-1">{site.title}</p>
          <p>{site.focus}</p>
          <p>{site.location}</p>
          <p className="mt-3">TICKET No. 0001 · 2026</p>
        </header>

        <Rule char="=" />
        <section aria-label="Sobre mí">
          <p>{site.about}</p>
        </section>

        <Rule char="=" />
        <section id="desarrollos" aria-label="Desarrollos">
          <h2 className="text-center font-bold tracking-widest uppercase">Desarrollos</h2>
          <ul className="mt-3 grid gap-4">
            {projects.map((project, index) => (
              <li key={project.name}>
                <Leader left={`${String(index + 1).padStart(2, "0")} ${project.name}`} right="1 pza" />
                <p className="text-neutral-600">{project.context}</p>
                <p className="mt-1">{project.description}</p>
                {project.stack.length > 0 ? <p className="mt-1 text-neutral-600">[{project.stack.join(" / ")}]</p> : null}
                {project.href !== undefined ? (
                  <ExternalLink href={project.href} className="mt-1 inline-block font-bold underline underline-offset-4">
                    {project.linkLabel ?? project.href}
                  </ExternalLink>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <Rule />
        <section aria-label="Totales">
          <Leader left="Desarrollos" right={String(projects.length)} />
          <Leader left="Roles de desarrollo" right={String(roles.length)} />
          <Leader left="Tecnologías" right={String(technologies.length)} />
          <p className="mt-3 flex justify-between border-y-2 border-neutral-900 py-1 text-base font-bold">
            <span>TOTAL</span>
            <span>{projects.length} ENTREGAS</span>
          </p>
        </section>

        <Rule char="=" />
        <section id="experiencia" aria-label="Experiencia">
          <h2 className="text-center font-bold tracking-widest uppercase">Experiencia</h2>
          <ul className="mt-3 grid gap-3">
            {roles.map((role) => (
              <li key={role.organization}>
                <Leader left={role.organization} right={role.period} />
                <p>{role.role}</p>
                {role.summary !== undefined ? <p className="mt-1 text-neutral-600">{role.summary}</p> : null}
                {role.href !== undefined ? (
                  <ExternalLink href={role.href} className="underline underline-offset-4">
                    {role.href.replace("https://", "")}
                  </ExternalLink>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <Rule />
        <section id="habilidades" aria-label="Habilidades">
          <h2 className="text-center font-bold tracking-widest uppercase">Habilidades</h2>
          <ul className="mt-3 grid gap-2">
            {skillGroups.map((group) => (
              <li key={group.title}>
                <span className="font-bold">{group.title}: </span>
                {group.items.join(", ")}
              </li>
            ))}
          </ul>
        </section>

        <Rule />
        <section id="educacion" aria-label="Educación">
          <h2 className="text-center font-bold tracking-widest uppercase">Educación</h2>
          <ul className="mt-3 grid gap-2">
            {studies.map((study) => (
              <li key={study.title}>
                <Leader left={study.title} right={study.period} />
                {study.institution !== undefined ? <p className="text-neutral-600">{study.institution}</p> : null}
              </li>
            ))}
          </ul>
        </section>

        <Rule char="=" />
        <section id="contacto" aria-label="Contacto">
          <h2 className="text-center font-bold tracking-widest uppercase">¿Quieres otro igual?</h2>
          <ul className="mt-3 grid gap-1">
            <li>
              <a href={`mailto:${site.email}`} className="font-bold underline underline-offset-4">
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
          </ul>
          <div className="mt-5">
            <ContactForm classes={formClasses} submitLabel="Imprimir mensaje" sendingLabel="Imprimiendo…" />
          </div>
        </section>

        <Rule char="=" />
        <footer className="text-center">
          <p className="font-bold">¡GRACIAS POR SU VISITA!</p>
          <p>Conserve este ticket para futuras colaboraciones.</p>
          <div className="mt-4">
            <Barcode text={site.email} />
          </div>
          <p className="mt-1 tracking-[0.3em]">LGASCA-0001-2026</p>
        </footer>
      </article>
    </div>
  );
}
