import { site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {site.name}</p>
        <p>{site.shortTitle}</p>
      </div>
    </footer>
  );
}
