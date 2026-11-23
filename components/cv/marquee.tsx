import { getCv } from "@/lib/cv";
import type { Locale } from "@/lib/i18n";

function MarqueeRow({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex items-center gap-8 px-4">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 text-sm font-medium tracking-[0.18em] text-white/50 uppercase"
        >
          <span>{item}</span>
          <span aria-hidden="true" className="text-accent">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

function Ticker({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  return (
    <div className={reverse ? "marquee-track marquee-track-reverse" : "marquee-track"}>
      <MarqueeRow items={items} />
      <div className="marquee-duplicate">
        <MarqueeRow items={items} />
      </div>
    </div>
  );
}

export function Marquee({ locale }: { locale: Locale }) {
  const { technicalSkills, softSkills } = getCv(locale);
  const technicalItems = technicalSkills.flatMap((group) => group.items);
  return (
    <div className="no-print overflow-hidden border-y border-line py-4" aria-hidden="true">
      <Ticker items={technicalItems} />
      <div className="mt-3">
        <Ticker items={softSkills} reverse />
      </div>
    </div>
  );
}
