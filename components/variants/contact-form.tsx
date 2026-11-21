"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { site } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

export type ContactFormClasses = {
  form: string;
  field: string;
  label: string;
  input: string;
  button: string;
  error: string;
  sent: string;
  sentTitle: string;
  sentText: string;
  again: string;
};

type ContactFormProps = {
  classes: ContactFormClasses;
  submitLabel?: string;
  sendingLabel?: string;
  sentTitle?: string;
  labels?: { nombre: string; correo: string; mensaje: string };
};

/**
 * Formulario de contacto compartido por todas las versiones. Los campos y el
 * nombre del formulario (`contacto`) no cambian para que Netlify Forms siga
 * recibiendo los mensajes sin importar la versión elegida.
 */
export function ContactForm({
  classes,
  submitLabel = "Enviar mensaje",
  sendingLabel = "Enviando…",
  sentTitle = "¡Mensaje enviado!",
  labels = { nombre: "Nombre", correo: "Correo", mensaje: "Mensaje" },
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const id = useId();

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

  if (status === "sent") {
    return (
      <div className={classes.sent} role="status">
        <p className={classes.sentTitle}>{sentTitle}</p>
        <p className={classes.sentText}>Gracias por escribir. Te respondo pronto a tu correo.</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
          }}
          className={classes.again}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      name="contacto"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className={classes.form}
    >
      <input type="hidden" name="form-name" value="contacto" />
      <p className="hidden">
        <label>
          No llenes este campo si eres humano: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className={classes.field}>
        <label htmlFor={`${id}-nombre`} className={classes.label}>
          {labels.nombre}
        </label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          className={classes.input}
        />
      </div>
      <div className={classes.field}>
        <label htmlFor={`${id}-correo`} className={classes.label}>
          {labels.correo}
        </label>
        <input
          id={`${id}-correo`}
          name="correo"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className={classes.input}
        />
      </div>
      <div className={classes.field}>
        <label htmlFor={`${id}-mensaje`} className={classes.label}>
          {labels.mensaje}
        </label>
        <textarea
          id={`${id}-mensaje`}
          name="mensaje"
          required
          rows={5}
          placeholder="Cuéntame de tu proyecto..."
          className={`${classes.input} resize-y`}
        />
      </div>
      {status === "error" ? (
        <p role="alert" className={classes.error}>
          Hubo un problema al enviar el mensaje. Inténtalo de nuevo o escríbeme directo a {site.email}.
        </p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className={classes.button}>
        {status === "sending" ? sendingLabel : submitLabel}
      </button>
    </form>
  );
}
