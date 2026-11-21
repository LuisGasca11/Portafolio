import { WorldAbismo } from "@/components/abismo/abismo";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function HomePage() {
  return (
    <SmoothScroll>
      <main id="contenido">
        <WorldAbismo />
      </main>
    </SmoothScroll>
  );
}
