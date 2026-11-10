import { navItems, site } from "@/lib/content";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
        <a href="#inicio" className="min-w-0 truncate font-serif text-lg tracking-tight">
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>
        <div className="flex items-center gap-2">
          <nav aria-label="Secciones" className="hidden lg:block">
            <ul className="flex items-center gap-5 text-sm text-muted">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-ink hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
