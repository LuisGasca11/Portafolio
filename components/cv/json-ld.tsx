import { siteUrl } from "@/lib/content";
import { education, profile, technicalSkills } from "@/lib/cv";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
      addressCountry: "MX",
    },
    url: `${siteUrl}/curriculum`,
    sameAs: [profile.github.href, siteUrl],
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
