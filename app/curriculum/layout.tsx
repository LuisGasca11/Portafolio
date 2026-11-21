import { MotionEffects } from "@/components/cv/motion-effects";
import { SiteFooter } from "@/components/cv/site-footer";
import { SiteHeader } from "@/components/cv/site-header";
import { SmoothScroll } from "@/components/shared/smooth-scroll";

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
