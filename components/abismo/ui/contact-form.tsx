"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { useT } from "@/components/shared/locale-provider";
import { identity } from "@/lib/content";

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
};

/**
 * Formulario de contacto compartido por todas las versiones. Los campos y el
 * nombre del formulario (`contacto`) no cambian para que Netlify Forms siga
 * recibiendo los mensajes sin importar la versión elegida.
 */
export function ContactForm({ classes }: ContactFormProps) {
  const t = useT();
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
        <p className={classes.sentTitle}>{t("form.sentTitle")}</p>
        <p className={classes.sentText}>{t("form.sentText")}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
          }}
          className={classes.again}
        >
          {t("form.again")}
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
          {t("form.honeypot")} <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className={classes.field}>
        <label htmlFor={`${id}-nombre`} className={classes.label}>
          {t("form.name")}
        </label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          type="text"
          required
          autoComplete="name"
          placeholder={t("form.namePlaceholder")}
          className={classes.input}
        />
      </div>
      <div className={classes.field}>
        <label htmlFor={`${id}-correo`} className={classes.label}>
          {t("form.email")}
        </label>
        <input
          id={`${id}-correo`}
          name="correo"
          type="email"
          required
          autoComplete="email"
          placeholder={t("form.emailPlaceholder")}
          className={classes.input}
        />
      </div>
      <div className={classes.field}>
        <label htmlFor={`${id}-mensaje`} className={classes.label}>
          {t("form.message")}
        </label>
        <textarea
          id={`${id}-mensaje`}
          name="mensaje"
          required
          rows={5}
          placeholder={t("form.messagePlaceholder")}
          className={`${classes.input} resize-y`}
        />
      </div>
      {status === "error" ? (
        <p role="alert" className={classes.error}>
          {t("form.error", { email: identity.email })}
        </p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className={classes.button}>
        {status === "sending" ? t("form.sending") : t("form.submit")}
      </button>
    </form>
  );
}
