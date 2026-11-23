import { siteUrl } from "@/lib/content";
import { getCv } from "@/lib/cv";
import { pathFor, tagOf } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function JsonLd({ locale }: { locale: Locale }) {
  const { profile, education, technicalSkills } = getCv(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: profile.email,
    telephone: profile.phone,
    inLanguage: tagOf(locale),
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
      addressCountry: "MX",
    },
    url: `${siteUrl}${pathFor(locale, "/curriculum")}`,
    sameAs: [profile.github.href, profile.linkedin.href, siteUrl],
    alumniOf: education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    knowsAbout: technicalSkills.flatMap((group) => group.items),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
