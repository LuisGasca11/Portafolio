import { stats } from "@/lib/content";

export function Stats() {
  return (
    <section className="border-b border-line px-5 py-16 sm:py-20" aria-label="Datos del portafolio">
      <ul className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label} data-reveal className="border-t border-line pt-6">
            <p className="font-display text-6xl tracking-tight sm:text-7xl">
              <span data-count={stat.value}>{stat.value}</span>
            </p>
            <p className="mt-2 text-sm tracking-wide text-muted uppercase">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
