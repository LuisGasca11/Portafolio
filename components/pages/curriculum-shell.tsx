import type { ReactNode } from "react";
import { MotionEffects } from "@/components/cv/motion-effects";
import { SiteFooter } from "@/components/cv/site-footer";
import { SiteHeader } from "@/components/cv/site-header";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import type { Locale } from "@/lib/i18n";

export function CurriculumShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter locale={locale} />
      <MotionEffects />
    </SmoothScroll>
  );
}
