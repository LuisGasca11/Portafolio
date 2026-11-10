"use client";

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M8.2 1.2a6.4 6.4 0 1 0 6.6 8.4A5.2 5.2 0 0 1 8.2 1.2z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="8" r="2.4" />
      <path strokeLinecap="round" d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" />
    </svg>
  );
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Cambiar tema de color"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-3 text-sm text-ink"
      onClick={() => {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          /* El tema sigue aplicado en la página aunque el navegador bloquee el almacenamiento. */
        }
      }}
    >
      <span className="theme-to-light inline-flex items-center gap-2">
        <MoonIcon />
        Claro
      </span>
      <span className="theme-to-dark items-center gap-2">
        <SunIcon />
        Oscuro
      </span>
    </button>
  );
}
