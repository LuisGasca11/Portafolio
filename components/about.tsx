import { site } from "@/lib/content";
import { Section } from "@/components/section";

export function About() {
  return (
    <Section id="sobre-mi" title="Sobre mí">
      <p className="max-w-3xl text-lg leading-relaxed">{site.about}</p>
    </Section>
  );
}
