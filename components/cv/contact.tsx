import Link from "next/link";
import { DownloadButton } from "@/components/cv/download-button";
import { ContactIcon } from "@/components/shared/contact-icon";
import { ExternalLink } from "@/components/shared/external-link";
import { TechIcon } from "@/components/shared/tech-icon";
import { getCv } from "@/lib/cv";
import { createT, otherLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

/** Botón de contacto: píldora con ícono, sin subrayado. */
const chip =
  "inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/20 bg-white/5 py-1 pr-4 pl-1.5 font-semibold text-white transition hover:-translate-y-0.5 hover:border-accent hover:bg-white/10";

export function Contact({ locale }: { locale: Locale }) {
  const t = createT(locale);
  const other = otherLocale(locale);
  const { profile } = getCv(locale);
  const phoneHref = profile.phone.replace(/[^+\d]/g, "");
  const whatsappHref = `https://wa.me/${phoneHref.replace("+", "")}`;
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="scroll-mt-24">
      <div className="cta-band px-5 py-28 sm:py-36 print:px-0 print:py-6">
        <div className="mx-auto max-w-6xl" data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">06</p>
          <h2 id="contacto-titulo" className="mt-4 max-w-4xl font-display text-6xl tracking-[-0.04em] sm:text-8xl">
            {t("cv.sections.contact")}
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
            {[locale, other].map((item) => (
              <DownloadButton
                key={item}
                locale={item}
                className="no-print inline-flex h-12 items-center rounded-full border border-white/20 px-5 text-sm font-semibold hover:border-accent"
              />
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2.5 text-sm">
            <li>
              <a href={`tel:${phoneHref}`} className={chip}>
                <ContactIcon kind="phone" />
                {profile.phone}
              </a>
            </li>
            <li>
              <ExternalLink href={whatsappHref} className={chip}>
                <TechIcon name="WhatsApp" size={1.7} />
                WhatsApp
              </ExternalLink>
            </li>
            <li>
              <Link href={profile.portfolio.href} className={chip}>
                <ContactIcon kind="web" />
                {profile.portfolio.label}
              </Link>
            </li>
            <li>
              <ExternalLink href={profile.github.href} className={chip}>
                <TechIcon name="GitHub" size={1.7} />
                {profile.github.label}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.linkedin.href} className={chip}>
                <TechIcon name="LinkedIn" size={1.7} />
                LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
