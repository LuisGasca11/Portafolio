import { identity } from "@/lib/content";
import { createT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = createT(locale);
  return (
    <footer className="px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t("common.copyright", { name: identity.name })}</p>
        <p>{t("site.shortTitle")}</p>
      </div>
    </footer>
  );
}
