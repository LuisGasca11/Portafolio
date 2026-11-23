import { Abismo } from "@/components/abismo/abismo";
import { SmoothScroll } from "@/components/shared/smooth-scroll";

export function HomePage() {
  return (
    <SmoothScroll>
      <main id="contenido">
        <Abismo />
      </main>
    </SmoothScroll>
  );
}
