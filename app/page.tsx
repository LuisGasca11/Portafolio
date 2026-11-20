import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { PhotoBand } from "@/components/journey-bands";
import { JourneyProgress } from "@/components/journey-progress";
import { Marquee } from "@/components/marquee";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Stats } from "@/components/stats";
import { landscapes } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <JourneyProgress />
      <Hero />
      <Marquee />
      <div className="journey relative">
        <About />
        <PhotoBand src={landscapes.desert} alt="Carretera de desierto al atardecer" label="El camino empieza" />
        <Stats />
        <Projects />
        <PhotoBand src={landscapes.city} alt="Ciudad al atardecer" label="La ciudad" />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </div>
    </>
  );
}
