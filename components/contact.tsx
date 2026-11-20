"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { cvUrl, site } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-2 w-full rounded-2xl border border-line bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none";
const labelClass = "text-xs font-medium tracking-[0.18em] text-white/70 uppercase";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const phoneHref = site.phone.replace(/[^+\d]/g, "");
  const whatsappHref = `https://wa.me/${phoneHref.replace("+", "")}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") {
      return;
    }
    setStatus("sending");
    const body = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => {
      if (typeof value === "string") {
        body.append(key, value);
      }
    });
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="scroll-mt-24">
      <div className="px-5 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl" data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">06 · Destino final</p>
          <h2 className="mt-4 max-w-4xl font-display text-6xl tracking-[-0.04em] sm:text-8xl">Contacto</h2>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            Llegaste al final del recorrido. ¿Tienes un proyecto en mente? Escríbeme.
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-sm leading-relaxed text-white/70">{site.focus}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-black"
                >
                  {site.email}
                </a>
                <a
                  href={whatsappHref}
                  className="inline-flex h-12 items-center rounded-full border border-white/20 bg-black/20 px-5 text-sm font-semibold text-white backdrop-blur-sm"
                >
                  WhatsApp
                </a>
              </div>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                <li>
                  <a
                    href={`tel:${phoneHref}`}
                    className="underline decoration-white/25 underline-offset-4 hover:decoration-accent"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <ExternalLink
                    href={site.githubUrl}
                    className="underline decoration-white/25 underline-offset-4 hover:decoration-accent"
                  >
                    {site.githubLabel}
                  </ExternalLink>
                </li>
                <li>
                  <Link href={cvUrl} className="underline decoration-white/25 underline-offset-4 hover:decoration-accent">
                    Currículum
                  </Link>
                </li>
              </ul>
              <p className="mt-8 text-sm text-muted">{site.location}</p>
            </div>
            {status === "sent" ? (
              <div className="rounded-3xl border border-line bg-black/30 p-8 backdrop-blur-sm">
                <p className="font-display text-3xl tracking-tight">¡Mensaje enviado!</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Gracias por escribir. Te respondo pronto a tu correo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                  }}
                  className="mt-6 inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                name="contacto"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={onSubmit}
                className="rounded-3xl border border-line bg-black/30 p-6 backdrop-blur-sm sm:p-8"
              >
                <input type="hidden" name="form-name" value="contacto" />
                <p className="hidden">
                  <label>
                    No llenes este campo si eres humano: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div>
                  <label htmlFor="contacto-nombre" className={labelClass}>
                    Nombre
                  </label>
                  <input
                    id="contacto-nombre"
                    name="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Tu nombre"
                    className={inputClass}
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="contacto-correo" className={labelClass}>
                    Correo
                  </label>
                  <input
                    id="contacto-correo"
                    name="correo"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className={inputClass}
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="contacto-mensaje" className={labelClass}>
                    Mensaje
                  </label>
                  <textarea
                    id="contacto-mensaje"
                    name="mensaje"
                    required
                    rows={5}
                    placeholder="Cuéntame de tu proyecto..."
                    className={`${inputClass} resize-y`}
                  />
                </div>
                {status === "error" ? (
                  <p role="alert" className="mt-5 text-sm leading-relaxed text-red-300">
                    Hubo un problema al enviar el mensaje. Inténtalo de nuevo o escríbeme directo a {site.email}.
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {status === "sending" ? "Enviando…" : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
