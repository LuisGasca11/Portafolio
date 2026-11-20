import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { ScrollWorld } from "@/components/scroll-world";
import { Skills } from "@/components/skills";
import { Stats } from "@/components/stats";

export default function HomePage() {
  return (
    <ScrollWorld>
      <div>
        <About />
        <Stats />
      </div>
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </ScrollWorld>
  );
}
