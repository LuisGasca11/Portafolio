import { skillGroups } from "@/lib/content";
import { Section } from "@/components/section";

export function Skills() {
  return (
    <Section id="habilidades" title="Habilidades técnicas">
      <ul className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <li key={group.title} className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="rounded-full border border-line px-2.5 py-1 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
