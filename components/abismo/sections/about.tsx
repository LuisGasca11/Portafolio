import { Fish, Turtle } from "@/components/abismo/art/creatures";
import { fallbackSchool } from "@/components/abismo/data";
import { SectionHeading } from "@/components/abismo/ui/section-heading";
import { site, stats } from "@/lib/content";

export function About({ glOn }: { glOn: boolean }) {
  const aboutWords = site.about.split(" ");

  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="relative px-5 py-28 sm:py-36">
      {glOn ? null : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div data-school="0.7" className="absolute left-0" style={{ top: "80%" }}>
            <Turtle className="ab-bob w-28 opacity-90" />
          </div>
          {fallbackSchool.map((fish) => (
            <div key={fish.top} data-school={fish.speed} className="absolute left-0" style={{ top: fish.top }}>
              <Fish from={fish.from} to={fish.to} className="ab-bob opacity-90" style={{ width: fish.w }} />
            </div>
          ))}
        </div>
      )}
      <div className="relative mx-auto max-w-4xl">
        <SectionHeading id="sobre-mi-titulo" meters={40} title="Sobre mí" size="md" />
        <p data-about className="ab-display mt-8 text-[1.75rem] leading-snug font-light text-balance sm:text-5xl sm:leading-[1.15]">
          {aboutWords.map((word, index) => (
            <span key={`${word}-${index}`} data-word className="inline-block pr-[0.28em]">
              {word}
            </span>
          ))}
        </p>
        <dl className="mt-16 grid grid-cols-3 gap-3 text-center sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} data-reveal className="ab-glass ab-sonar rounded-2xl px-2 py-6">
              <dt className="order-2 mt-1 text-[0.6rem] tracking-[0.16em] text-cyan-100/80 uppercase sm:text-xs">{stat.label}</dt>
              <dd className="ab-display text-4xl font-semibold text-cyan-100 tabular-nums sm:text-6xl" data-count={stat.value}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
