/**
 * Datos del currículum (`/curriculum` y el PDF), en todos los idiomas.
 * Los proyectos son los mismos del portafolio (`lib/content.ts`).
 */
import { cvPath, formatPeriod, getContent, identity } from "@/lib/content";
import type { Content, Project, ProjectId } from "@/lib/content";
import { createT, pathFor } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export type { Project, ProjectId };

export type EducationItem = { period: string; institution: string; program?: string };
export type SkillGroup = { label: string; items: readonly string[] };
export type ExperienceItem = {
  role: string;
  organization: string;
  period: string;
  description: string;
  website?: { href: string; label: string };
  /** Si va en el PDF de una página (el de Telmex se queda en la web). */
  inPdf: boolean;
};

export function getCv(locale: Locale) {
  const t = createT(locale);
  const content: Content = getContent(locale);
  const present = t("cv.present");

  const profile = {
    name: identity.name,
    title: content.site.title,
    email: identity.email,
    phone: identity.phone,
    location: content.site.location,
    portfolio: { href: pathFor(locale, "/"), label: "portgasca.netlify.app" },
    github: { href: identity.githubUrl, label: identity.githubLabel },
    linkedin: { href: identity.linkedinUrl, label: identity.linkedinLabel },
  } as const;

  const navItems = [
    { href: "#sobre-mi", label: t("cv.nav.about") },
    { href: "#experiencia", label: t("cv.nav.experience") },
    { href: "#proyectos", label: t("cv.nav.projects") },
    { href: "#habilidades", label: t("cv.nav.skills") },
    { href: "#educacion", label: t("cv.nav.education") },
    { href: "#contacto", label: t("cv.nav.contact") },
  ] as const;

  // Del más antiguo al más reciente.
  const education: readonly EducationItem[] = [...content.studies]
    .reverse()
    .map((study) => ({ period: study.period, program: study.title, institution: study.institution }));

  const technicalSkills: readonly SkillGroup[] = content.skillGroups.map((group) => ({
    label: group.title,
    items: group.items,
  }));

  const softSkills = [
    t("cv.softSkills.committed"),
    t("cv.softSkills.teamwork"),
    t("cv.softSkills.proactive"),
    t("cv.softSkills.communication"),
    t("cv.softSkills.leadership"),
    t("cv.softSkills.problemSolving"),
    t("cv.softSkills.responsible"),
    t("cv.softSkills.adaptability"),
    t("cv.softSkills.analytical"),
    t("cv.softSkills.timeManagement"),
    t("cv.softSkills.discipline"),
    t("cv.softSkills.creativity"),
  ];

  const languages = [t("cv.languageList.english"), t("cv.languageList.spanish")];

  const current = content.roles[0];
  const experience: readonly ExperienceItem[] = [
    {
      role: current?.role ?? "",
      organization: current?.organization ?? "",
      period: formatPeriod(locale, { from: "2025-11", to: "2026-06" }, present),
      description: current?.cvSummary ?? "",
      website: { href: "https://blck-sheep.com", label: "blck-sheep.com" },
      inPdf: true,
    },
    {
      role: t("cv.jobs.trainer.role"),
      organization: "CECYTEM Tultitlán",
      period: formatPeriod(locale, { from: "2022", ongoing: true }, present),
      description: t("cv.jobs.trainer.description"),
      inPdf: true,
    },
    {
      role: t("cv.jobs.admin.role"),
      organization: "Curiosidades Ale",
      period: formatPeriod(locale, { from: "2023" }, present),
      description: t("cv.jobs.admin.description"),
      inPdf: true,
    },
    {
      role: t("cv.jobs.sales.role"),
      organization: "Telmex",
      period: formatPeriod(locale, { from: "2018" }, present),
      description: t("cv.jobs.sales.description"),
      inPdf: false,
    },
  ];

  return {
    profile,
    navItems,
    about: t("site.aboutLong"),
    education,
    technicalSkills,
    softSkills,
    languages,
    experience,
    projects: content.projects,
    path: cvPath,
  };
}

export type Cv = ReturnType<typeof getCv>;
