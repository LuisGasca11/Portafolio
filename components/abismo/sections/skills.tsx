import type { CSSProperties } from "react";
import { TechIcon } from "@/components/shared/tech-icon";
import { Angler } from "@/components/abismo/art/creatures";
import { groupHues, zoneOf } from "@/components/abismo/data";
import { SectionHeading } from "@/components/abismo/ui/section-heading";
import { useContent, useT } from "@/components/shared/locale-provider";

export function Skills({ glOn }: { glOn: boolean }) {
  const t = useT();
  const { skillGroups } = useContent();
  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="relative px-5 py-28">
      {/* Dibujos planos de animales: solo en el respaldo sin WebGL; con la escena 3D sobran. */}
      {glOn ? null : (
        <div aria-hidden="true" data-angler className="pointer-events-none absolute right-0 bottom-10 w-40 sm:w-72">
          <div data-parallax="1">
            <Angler />
          </div>
        </div>
      )}
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading id="habilidades-titulo" meters={880} zone={`${zoneOf(880, t)} · ${t("sea.bioluminescence")}`} title={t("skills.heading")} />
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
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
