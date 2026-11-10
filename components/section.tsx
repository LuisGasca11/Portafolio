import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-line py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-serif text-3xl tracking-tight text-balance sm:text-4xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
