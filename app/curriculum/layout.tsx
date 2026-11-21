import { MotionEffects } from "@/components/motion-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function CurriculumLayout({ children }: LayoutProps<"/curriculum">) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
      <MotionEffects />
    </SmoothScroll>
  );
}
