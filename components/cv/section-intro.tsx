type SectionIntroProps = {
  index: string;
  title: string;
  id: string;
};

export function SectionIntro({ index, title, id }: SectionIntroProps) {
  return (
    <div data-reveal>
      <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">{index}</p>
      <h2 id={id} className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-6xl">
        {title}
      </h2>
    </div>
  );
}
