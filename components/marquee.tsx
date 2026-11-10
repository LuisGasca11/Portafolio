import { technologies } from "@/lib/content";

function MarqueeRow() {
  return (
    <ul className="flex items-center gap-8 px-4">
      {technologies.map((item) => (
        <li key={item} className="flex items-center gap-8 text-sm font-medium tracking-[0.18em] text-white/45 uppercase">
          <span>{item}</span>
          <span aria-hidden="true" className="text-accent/70">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line py-4" aria-hidden="true">
      <div className="marquee-track">
        <MarqueeRow />
        <div className="marquee-duplicate">
          <MarqueeRow />
        </div>
      </div>
    </div>
  );
}
