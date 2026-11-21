"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/variants/contact-form";
import type { ContactFormClasses } from "@/components/variants/contact-form";
import { cvUrl, projects, roles, site, skillGroups, studies } from "@/lib/content";

type Tok = { k: "key" | "str" | "num" | "p" | "c"; v: string; href?: string };
type CodeLine = { indent: number; toks: Tok[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function emit(value: unknown, indent: number, prefix: Tok[], suffix: string, out: CodeLine[], keyName = ""): void {
  const end: Tok[] = suffix === "" ? [] : [{ k: "p", v: suffix }];
  if (typeof value === "string") {
    const href = keyName === "href" ? value : undefined;
    out.push({ indent, toks: [...prefix, { k: "str", v: JSON.stringify(value), href }, ...end] });
    return;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    out.push({ indent, toks: [...prefix, { k: "num", v: String(value) }, ...end] });
    return;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      out.push({ indent, toks: [...prefix, { k: "p", v: "[]" }, ...end] });
      return;
    }
    if (value.every((item) => typeof item === "string")) {
      const toks: Tok[] = [...prefix, { k: "p", v: "[" }];
      value.forEach((item, index) => {
        toks.push({ k: "str", v: JSON.stringify(item) });
        toks.push({ k: "p", v: index < value.length - 1 ? ", " : "" });
      });
      toks.push({ k: "p", v: "]" }, ...end);
      out.push({ indent, toks });
      return;
    }
    out.push({ indent, toks: [...prefix, { k: "p", v: "[" }] });
    value.forEach((item, index) => {
      emit(item, indent + 1, [], index < value.length - 1 ? "," : "", out);
    });
    out.push({ indent, toks: [{ k: "p", v: "]" }, ...end] });
    return;
  }
  if (isRecord(value)) {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);
    out.push({ indent, toks: [...prefix, { k: "p", v: "{" }] });
    entries.forEach(([key, item], index) => {
      emit(
        item,
        indent + 1,
        [{ k: "key", v: JSON.stringify(key) }, { k: "p", v: ": " }],
        index < entries.length - 1 ? "," : "",
        out,
        key,
      );
    });
    out.push({ indent, toks: [{ k: "p", v: "}" }, ...end] });
    return;
  }
  out.push({ indent, toks: [...prefix, { k: "num", v: "null" }, ...end] });
}

function jsonLines(value: unknown): CodeLine[] {
  const out: CodeLine[] = [];
  emit(value, 0, [], "", out);
  return out;
}

const tokClass: Record<Tok["k"], string> = {
  key: "text-[#9cdcfe]",
  str: "text-[#ce9178]",
  num: "text-[#b5cea8]",
  p: "text-[#d4d4d4]",
  c: "text-[#6a9955]",
};

type FileDef = { name: string; icon: string; lines?: CodeLine[]; contact?: true };

const comment = (text: string): CodeLine => ({ indent: 0, toks: [{ k: "c", v: text }] });

const files: FileDef[] = [
  {
    name: "sobre-mi.md",
    icon: "M↓",
    lines: [
      { indent: 0, toks: [{ k: "key", v: `# ${site.name}` }] },
      { indent: 0, toks: [] },
      { indent: 0, toks: [{ k: "str", v: `**${site.title}**` }] },
      { indent: 0, toks: [{ k: "p", v: `${site.focus} · ${site.location}` }] },
      { indent: 0, toks: [] },
      { indent: 0, toks: [{ k: "p", v: site.about }] },
      { indent: 0, toks: [] },
      comment("<!-- Prueba Ctrl+K (⌘K en Mac) para navegar entre archivos -->"),
    ],
  },
  { name: "desarrollos.json", icon: "{}", lines: jsonLines(projects) },
  { name: "experiencia.json", icon: "{}", lines: jsonLines(roles) },
  {
    name: "habilidades.json",
    icon: "{}",
    lines: jsonLines(Object.fromEntries(skillGroups.map((group) => [group.title, [...group.items]]))),
  },
  { name: "educacion.json", icon: "{}", lines: jsonLines(studies) },
  {
    name: "contacto.tsx",
    icon: "TS",
    contact: true,
    lines: [
      comment("// ¿Tienes un proyecto en mente?"),
      comment("// Escríbeme: completa el formulario o usa cualquiera de estos datos."),
      { indent: 0, toks: [] },
      {
        indent: 0,
        toks: [
          { k: "str", v: "const " },
          { k: "key", v: "correo" },
          { k: "p", v: " = " },
          { k: "str", v: JSON.stringify(site.email), href: `mailto:${site.email}` },
        ],
      },
      {
        indent: 0,
        toks: [
          { k: "str", v: "const " },
          { k: "key", v: "telefono" },
          { k: "p", v: " = " },
          { k: "str", v: JSON.stringify(site.phone), href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
        ],
      },
      {
        indent: 0,
        toks: [
          { k: "str", v: "const " },
          { k: "key", v: "github" },
          { k: "p", v: " = " },
          { k: "str", v: JSON.stringify(site.githubUrl), href: site.githubUrl },
        ],
      },
    ],
  },
];

const formClasses: ContactFormClasses = {
  form: "grid gap-4 font-sans",
  field: "grid gap-1",
  label: "text-xs text-[#9cdcfe]",
  input:
    "w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#007acc] focus:outline-none",
  button: "mt-1 inline-flex h-10 items-center justify-center rounded bg-[#0e639c] px-5 text-sm font-semibold text-white disabled:opacity-60",
  error: "text-sm text-[#f48771]",
  sent: "rounded border border-[#3c3c3c] p-4 font-sans",
  sentTitle: "font-semibold text-[#89d185]",
  sentText: "mt-1 text-sm text-[#cccccc]",
  again: "mt-3 rounded border border-[#3c3c3c] px-3 py-1.5 text-sm text-[#cccccc]",
};

function renderTok(tok: Tok, key: number): ReactNode {
  if (tok.href !== undefined) {
    const external = tok.href.startsWith("http");
    return (
      <a
        key={key}
        href={tok.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${tokClass[tok.k]} underline underline-offset-2`}
      >
        {tok.v}
      </a>
    );
  }
  return (
    <span key={key} className={tokClass[tok.k]}>
      {tok.v}
    </span>
  );
}

type Command = { id: string; label: string; hint: string; run: () => void };

export function V4Editor() {
  const [current, setCurrent] = useState(files[0]?.name ?? "");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const file = files.find((item) => item.name === current) ?? files[0];

  const commands = useMemo<Command[]>(
    () => [
      ...files.map((item) => ({
        id: item.name,
        label: item.name,
        hint: "Abrir archivo",
        run: () => {
          setCurrent(item.name);
        },
      })),
      {
        id: "cv",
        label: "Abrir currículum",
        hint: cvUrl,
        run: () => {
          window.location.assign(cvUrl);
        },
      },
      {
        id: "mail",
        label: "Enviar correo",
        hint: site.email,
        run: () => {
          window.location.assign(`mailto:${site.email}`);
        },
      },
    ],
    [],
  );

  const results = commands.filter((command) =>
    `${command.label} ${command.hint}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function openPalette() {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery("");
    setCursor(0);
    setPaletteOpen(true);
  }

  function closePalette() {
    setPaletteOpen(false);
    returnFocus.current?.focus();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setQuery("");
        setCursor(0);
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (paletteOpen) {
      inputRef.current?.focus();
    }
  }, [paletteOpen]);

  function onPaletteKey(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = results[cursor];
      if (command !== undefined) {
        setPaletteOpen(false);
        command.run();
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  if (file === undefined) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1e1e1e] font-mono text-[#cccccc]">
      <div className="flex items-center justify-between gap-3 border-b border-[#2b2b2b] bg-[#181818] px-4 py-2 text-xs">
        <p className="truncate text-[#9d9d9d]">
          <span className="text-[#cccccc]">{site.brand}</span> — {file.name}
        </p>
        <button
          type="button"
          onClick={openPalette}
          className="shrink-0 rounded border border-[#3c3c3c] px-2.5 py-1 text-[#cccccc] hover:border-[#007acc]"
          aria-label="Abrir paleta de comandos"
        >
          Ctrl K
        </button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav aria-label="Archivos" className="shrink-0 border-b border-[#2b2b2b] bg-[#181818] md:w-60 md:border-r md:border-b-0">
          <p className="hidden px-4 pt-3 pb-2 text-[0.65rem] tracking-[0.2em] text-[#9d9d9d] uppercase md:block">Explorador</p>
          <ul className="flex overflow-x-auto md:block md:overflow-visible">
            {files.map((item) => {
              const active = item.name === file.name;
              return (
                <li key={item.name} className="shrink-0">
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      setCurrent(item.name);
                    }}
                    className={`flex w-full items-center gap-2 border-b-2 px-4 py-2 text-left text-sm whitespace-nowrap md:border-b-0 md:border-l-2 ${
                      active ? "border-[#007acc] bg-[#1e1e1e] text-white" : "border-transparent text-[#9d9d9d] hover:bg-[#222]"
                    }`}
                  >
                    <span className="w-5 text-[0.65rem] text-[#e2c08d]">{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section className="min-w-0 flex-1 px-2 py-5 sm:px-4" aria-label={file.name}>
          <ol className="text-[0.8rem] leading-6 sm:text-sm">
            {(file.lines ?? []).map((line, index) => (
              <li key={`${file.name}-${index}`} className="flex">
                <span aria-hidden="true" className="w-8 shrink-0 pr-3 text-right text-[#6e7681] select-none sm:w-10">
                  {index + 1}
                </span>
                <span className="min-w-0 break-words whitespace-pre-wrap" style={{ paddingLeft: `${line.indent * 2}ch` }}>
                  {line.toks.map((tok, tokIndex) => renderTok(tok, tokIndex))}
                </span>
              </li>
            ))}
          </ol>
          {file.contact === true ? (
            <div className="mt-6 ml-8 max-w-lg rounded border border-[#3c3c3c] bg-[#252526] p-4 sm:ml-10">
              <p className="mb-4 text-xs text-[#6a9955]">{"// enviar mensaje"}</p>
              <ContactForm classes={formClasses} submitLabel="Enviar" labels={{ nombre: "nombre", correo: "correo", mensaje: "mensaje" }} />
              <p className="mt-4 font-sans text-xs text-[#9d9d9d]">
                <Link href={cvUrl} className="underline underline-offset-4">
                  Ver currículum
                </Link>
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <footer className="flex items-center justify-between gap-3 bg-[#007acc] px-4 py-1 text-[0.7rem] text-white">
        <span>{site.location}</span>
        <span className="truncate">{site.shortTitle}</span>
      </footer>

      {paletteOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-3 pt-[12vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePalette();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Paleta de comandos"
            onKeyDown={onPaletteKey}
            className="w-full max-w-lg overflow-hidden rounded-lg border border-[#454545] bg-[#252526] shadow-2xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              placeholder="Ir a un archivo o ejecutar un comando…"
              aria-label="Buscar comando"
              className="w-full border-b border-[#454545] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#8a8a8a]"
            />
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((command, index) => (
                <li key={command.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPaletteOpen(false);
                      command.run();
                    }}
                    onMouseEnter={() => {
                      setCursor(index);
                    }}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-sm ${
                      index === cursor ? "bg-[#04395e] text-white" : ""
                    }`}
                  >
                    <span>{command.label}</span>
                    <span className="truncate text-xs text-[#9d9d9d]">{command.hint}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 ? <li className="px-4 py-3 text-sm text-[#9d9d9d]">Sin resultados</li> : null}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
