import type { Metadata } from "next";
import { About } from "@/components/cv/about";
import { Contact } from "@/components/cv/contact";
import { Education } from "@/components/cv/education";
import { Experience } from "@/components/cv/experience";
import { Hero } from "@/components/cv/hero";
import { JsonLd } from "@/components/cv/json-ld";
import { Marquee } from "@/components/cv/marquee";
import { Projects } from "@/components/cv/projects";
import { Skills } from "@/components/cv/skills";
import { profile } from "@/lib/cv";

const description =
  "Currículum de Luis Alberto Aguilar Gasca, ingeniero en Tecnologías de la Información y la Comunicación. Desarrollo web full stack y mobile. Ecatepec de Morelos.";

export const metadata: Metadata = {
  title: { absolute: "Luis Alberto Aguilar Gasca | Currículum" },
  description,
  applicationName: "Currículum de Luis Alberto Aguilar Gasca",
  authors: [{ name: profile.name, url: profile.github.href }],
  creator: profile.name,
  keywords: [
    "Luis Alberto Aguilar Gasca",
    "currículum",
    "ingeniero en TIC",
    "desarrollador full stack",
    "Next.js",
    "React",
    "Ecatepec de Morelos",
  ],
  alternates: {
    canonical: "/curriculum",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    title: "Luis Alberto Aguilar Gasca | Currículum",
    description,
    url: "/curriculum",
    locale: "es_MX",
    type: "profile",
    firstName: "Luis Alberto",
    lastName: "Aguilar Gasca",
    username: "LuisGasca11",
  },
  twitter: {
    card: "summary",
    title: "Luis Alberto Aguilar Gasca | Currículum",
    description,
  },
};

export default function CurriculumPage() {
  return (
    <div className="curriculum bg-canvas text-ink">
      <JsonLd />
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </div>
  );
}
