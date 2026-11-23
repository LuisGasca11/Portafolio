import Link from "next/link";
import { ContactIcon } from "@/components/shared/contact-icon";
import { ExternalLink } from "@/components/shared/external-link";
import { TechIcon } from "@/components/shared/tech-icon";
import { Crab, Starfish, Submarine } from "@/components/abismo/art/creatures";
import { Coral, Seaweed } from "@/components/abismo/art/flora";
import { SectionHeading } from "@/components/abismo/ui/section-heading";
import { ContactForm } from "@/components/abismo/ui/contact-form";
import type { ContactFormClasses } from "@/components/abismo/ui/contact-form";
import { useContent, useLocale, useT } from "@/components/shared/locale-provider";
import { cvPath, cvPdf, identity } from "@/lib/content";
import { otherLocale, pathFor, translate } from "@/lib/i18n";

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1.5",
  label: "text-xs font-semibold tracking-[0.18em] text-cyan-200/80 uppercase",
  input:
    "w-full rounded-xl border border-cyan-200/25 bg-[#02101c]/70 px-4 py-3 text-base text-white placeholder:text-cyan-100/35 focus:border-cyan-200 focus:outline-none sm:text-sm",
  button:
    "mt-2 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-200 to-emerald-200 px-7 text-sm font-bold text-[#02202e] shadow-[0_0_30px_rgba(126,232,255,0.5)] disabled:opacity-60",
  error: "text-sm text-rose-300",
  sent: "rounded-2xl border border-emerald-200/40 bg-emerald-300/10 p-6",
  sentTitle: "ab-display text-2xl",
  sentText: "mt-2 text-sm text-cyan-50/80",
  again: "mt-4 inline-flex h-10 items-center rounded-full border border-cyan-200/50 px-4 text-sm font-semibold",
};

export function Contact({ glOn }: { glOn: boolean }) {
  const t = useT();
  const locale = useLocale();
  const { site } = useContent();
  const other = otherLocale(locale);
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="relative overflow-hidden px-5 pt-28 pb-64 sm:pb-72">
      <div aria-hidden="true" data-sub className="pointer-events-none absolute top-24 left-0 hidden w-[min(34vw,330px)] lg:block">
        <Submarine className="ab-bob" />
      </div>
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading id="contacto-titulo" meters={1200} zone={t("sea.seabed")} title={t("contact.heading")} size="xl" />
        <p className="mt-4 max-w-xl text-cyan-50/85">{t("contact.text")}</p>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:pl-[22%]">
          <ul className="flex flex-wrap content-start gap-2.5 text-sm">
            <li className="w-full">
              <a href={`mailto:${identity.email}`} className="ab-contact ab-contact-main">
                <ContactIcon kind="mail" />
                <span className="break-all">{identity.email}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${identity.phone.replace(/[^+\d]/g, "")}`} className="ab-contact">
                <ContactIcon kind="phone" />
                {identity.phone}
              </a>
            </li>
            <li>
              <ExternalLink href={identity.whatsappUrl} className="ab-contact">
                <TechIcon name="WhatsApp" size={1.7} />
                WhatsApp
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={identity.githubUrl} className="ab-contact">
                <TechIcon name="GitHub" size={1.7} />
                <span className="break-all">{identity.githubLabel}</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={identity.linkedinUrl} className="ab-contact">
                <TechIcon name="LinkedIn" size={1.7} />
                <span className="break-all">{identity.linkedinLabel}</span>
              </ExternalLink>
            </li>
            <li className="flex flex-wrap gap-2.5 pt-1" aria-label={t("common.cv")}>
              <Link href={pathFor(locale, cvPath)} className="ab-store">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />
                </svg>
                <span>
                  <small>{t("common.cvWeb")}</small>
                  {t("common.cv")}
                </span>
              </Link>
              {[locale, other].map((item) => (
                <a key={item} href={cvPdf[item].href} download={cvPdf[item].file} lang={item} className="ab-store">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
                  </svg>
                  <span>
                    <small>PDF · {item.toUpperCase()}</small>
                    {translate(item, "common.downloadCv")}
                  </span>
                </a>
              ))}
            </li>
            <li className="text-cyan-100/70">{site.location}</li>
            <li className="pt-2">
              <a href="#inicio" className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-200/40 px-4 text-sm font-semibold text-cyan-100">
                <span aria-hidden="true">↑</span> {t("contact.surface")}
              </a>
            </li>
          </ul>
          <div className="ab-glass rounded-3xl p-6 sm:p-8">
            <ContactForm classes={formClasses} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56">
        {glOn ? null : (
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="ab-sand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1d3a4a" />
                <stop offset="1" stopColor="#050d14" />
              </linearGradient>
            </defs>
            <path d="M0 120 C200 80 380 150 600 110 C820 70 1050 140 1250 100 C1340 84 1400 96 1440 110 L1440 220 L0 220Z" fill="url(#ab-sand)" />
          </svg>
        )}
        {/* Fondo dibujado: solo sin WebGL; con la escena 3D, el fondo es el real. */}
        {glOn ? null : (
          <>
            <Seaweed hue={155} className="absolute bottom-6 left-[1%] w-14 sm:w-20" />
            <Coral color="#ff6bd6" className="absolute bottom-10 left-[11%] w-16 sm:w-24" />
            <Starfish className="ab-bob absolute bottom-4 left-[22%] w-9 sm:w-12" color="#ff8f5a" />
            <Seaweed hue={140} className="absolute bottom-8 left-[27%] w-12 sm:w-16" />
            <Crab className="absolute bottom-3 left-[40%] w-14 sm:w-20" />
            <Coral color="#ff9d5c" className="absolute bottom-6 left-[52%] w-12 sm:w-16" />
            <Starfish className="ab-bob absolute right-[34%] bottom-3 w-8 sm:w-11" color="#ff6bb0" />
            <Seaweed hue={165} className="absolute right-[24%] bottom-8 w-14 sm:w-20" />
            <Coral color="#5dffc9" className="absolute right-[16%] bottom-8 w-14 sm:w-20" />
            <Seaweed hue={150} className="absolute right-[7%] bottom-6 w-12 sm:w-16" />
            <Coral color="#c18bff" className="absolute right-[0%] bottom-6 w-16 sm:w-24" />
          </>
        )}
      </div>
    </section>
  );
}
