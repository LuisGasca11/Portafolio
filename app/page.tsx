import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { CityBand } from "@/components/parallax-layers";
import { Projects } from "@/components/projects";
import { ScrollPath } from "@/components/scroll-path";
import { Skills } from "@/components/skills";
import { Stats } from "@/components/stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <div className="journey relative">
        <ScrollPath />
        <About />
        <Stats />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <CityBand />
        <Contact />
      </div>
    </>
  );
}
