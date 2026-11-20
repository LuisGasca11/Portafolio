import Link from "next/link";
import { ExternalLink } from "@/components/cv/external-link";
import { PrintButton } from "@/components/cv/print-button";
import { profile } from "@/lib/cv";

const linkClass = "underline decoration-white/25 underline-offset-4 hover:decoration-accent";

export function Contact() {
  const phoneHref = profile.phone.replace(/[^+\d]/g, "");
  const whatsappHref = `https://wa.me/${phoneHref.replace("+", "")}`;
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="scroll-mt-24">
      <div className="cta-band px-5 py-28 sm:py-36 print:px-0 print:py-6">
        <div className="mx-auto max-w-6xl" data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">06</p>
          <h2 id="contacto-titulo" className="mt-4 max-w-4xl font-display text-6xl tracking-[-0.04em] sm:text-8xl">
            Contacto
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/80">{profile.title}</p>
          <p className="mt-3 text-sm text-muted">{profile.location}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="btn-accent inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold"
            >
              {profile.email}
            </a>
            <PrintButton className="no-print inline-flex h-12 items-center rounded-full border border-white/20 px-5 text-sm font-semibold hover:border-accent" />
          </div>
          <ul className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
            <li>
              <a href={`tel:${phoneHref}`} className={linkClass}>
                {profile.phone}
              </a>
            </li>
            <li>
              <ExternalLink href={whatsappHref} className={linkClass}>
                WhatsApp
              </ExternalLink>
            </li>
            <li>
              <Link href={profile.portfolio.href} className={linkClass}>
                {profile.portfolio.label}
              </Link>
            </li>
            <li>
              <ExternalLink href={profile.github.href} className={linkClass}>
                {profile.github.label}
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
