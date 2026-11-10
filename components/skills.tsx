import { skillGroups } from "@/lib/content";

export function Skills() {
  return (
    <section id="habilidades" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">04</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Habilidades técnicas</h2>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((group, index) => (
            <li
              key={group.title}
              data-reveal
              className={`rounded-3xl border border-line bg-white/[0.03] p-6 transition-colors hover:border-white/25 ${
                index < 2 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <h3 className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{group.title}</h3>
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
      </div>
    </section>
  );
}
