"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/site";

/**
 * No form backend is configured for this relaunch (see TODO_CLIENT.md — wiring a
 * provider like Formspree, Netlify Forms, or a custom endpoint is a client decision).
 * Rather than silently discarding submissions or pretending to send them, the form
 * opens the visitor's own email client via a mailto: link, prefilled with their input.
 * That is genuinely functional today; swap `handleSubmit` for a real POST once a
 * provider is configured, no markup changes needed.
 */
const areas = [
  "Fitness / Training",
  "Gesundheit (Milon, FIVE, InBody)",
  "Kampfkunst (Karate, Selbstverteidigung)",
  "Regeneration",
  "Noch unentschlossen",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const contactInfo = String(data.get("contact") ?? "");
    const area = String(data.get("area") ?? "");
    const channel = String(data.get("channel") ?? "");
    const message = String(data.get("message") ?? "");

    const body = [
      `Name: ${name}`,
      `Kontakt: ${contactInfo}`,
      `Gewünschter Bereich: ${area}`,
      `Bevorzugter Kontaktweg: ${channel}`,
      "",
      message,
    ].join("\n");

    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
      "Anfrage über die Website",
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">E-Mail oder Telefonnummer</span>
          <input
            required
            name="contact"
            type="text"
            autoComplete="email"
            className="rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Gewünschter Bereich</span>
          <select
            name="area"
            className="rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red"
            defaultValue={areas[4]}
          >
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="flex flex-col gap-1.5 text-sm">
          <legend className="text-paper/70">Bevorzugter Kontaktweg</legend>
          <div className="flex gap-4 pt-1">
            {["Telefon", "WhatsApp", "E-Mail"].map((c, i) => (
              <label key={c} className="flex items-center gap-1.5 text-paper/85">
                <input type="radio" name="channel" value={c} defaultChecked={i === 0} /> {c}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-paper/70">Nachricht</span>
        <textarea
          name="message"
          rows={4}
          className="rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red"
        />
      </label>

      <label className="flex items-start gap-2.5 text-xs text-paper/60">
        <input required type="checkbox" name="consent" className="mt-0.5" />
        Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
        Details in der{" "}
        <a href="/datenschutz" className="underline">
          Datenschutzerklärung
        </a>
        .
      </label>

      <button
        type="submit"
        className="self-start rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark"
      >
        Anfrage senden
      </button>

      {submitted ? (
        <p role="status" className="text-sm text-moss">
          Dein E-Mail-Programm öffnet sich mit deinen Angaben. Alternativ erreichst du uns direkt per
          Telefon oder WhatsApp.
        </p>
      ) : null}
    </form>
  );
}
