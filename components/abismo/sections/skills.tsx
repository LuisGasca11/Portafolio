import type { CSSProperties } from "react";
import { TechIcon } from "@/components/shared/tech-icon";
import { Angler } from "@/components/abismo/art/creatures";
import { groupHues, zoneOf } from "@/components/abismo/data";
import { Chapter } from "@/components/abismo/ui/chapter";
import { skillGroups, technologies } from "@/lib/content";

export function Skills() {
  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="relative px-5 pb-28">
      <div aria-hidden="true" data-angler className="pointer-events-none absolute right-0 bottom-10 w-40 sm:w-72">
        <div data-parallax="1">
          <Angler />
        </div>
      </div>
      <Chapter
        id="habilidades"
        headingId="habilidades-titulo"
        zone={`${zoneOf(880)} · bioluminiscencia`}
        title="Habilidades"
        body="Organismos bioluminiscentes: cada tecnología brilla con su propio color."
        tags={[`${technologies.length} tecnologías`, `${skillGroups.length} áreas`]}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2">
          {skillGroups.map((group, index) => (
            <div key={group.title} data-reveal>
              <h3 className="ab-display text-2xl font-semibold italic">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <li key={item} className="ab-orb" style={{ "--h": groupHues[index % groupHues.length] } as CSSProperties}>
                    <TechIcon name={item} size={1.7} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
