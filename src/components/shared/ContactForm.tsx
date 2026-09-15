"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitInquiryAction, type InquiryActionState } from "@/app/actions/inquiry";
import { inquiryAreas, inquiryAreaLabels, inquirySources } from "@/lib/validation/inquiry";

const inputClass =
  "rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red";

export function ContactForm({
  defaultSource = "probetraining",
}: {
  defaultSource?: (typeof inquirySources)[number];
}) {
  const [state, formAction, pending] = useActionState<InquiryActionState, FormData>(submitInquiryAction, {
    status: "idle",
  });

  if (state.status === "success") {
    return (
      <p role="status" className="flex items-start gap-2 rounded-xl border border-moss/30 bg-moss/10 p-4 text-sm text-moss">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        Vielen Dank für deine Anfrage beim Sportpark Pollack. Wir melden uns schnellstmöglich bei dir.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Honeypot: hidden from sighted users and screen readers, bots often fill every field. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Vorname</span>
          <input required name="firstName" type="text" autoComplete="given-name" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Nachname</span>
          <input required name="lastName" type="text" autoComplete="family-name" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">E-Mail-Adresse</span>
          <input required name="email" type="email" autoComplete="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Telefonnummer (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Gewünschter Bereich</span>
          <select name="area" defaultValue="allgemein" className={inputClass}>
            {inquiryAreas.map((a) => (
              <option key={a} value={a}>
                {inquiryAreaLabels[a]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-paper/70">Gewünschter Termin (optional)</span>
          <input
            name="preferredDate"
            type="text"
            placeholder="z. B. nächste Woche vormittags"
            className={inputClass}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-1.5 text-sm">
        <legend className="text-paper/70">Art der Anfrage</legend>
        <div className="flex flex-wrap gap-4 pt-1">
          <label className="flex items-center gap-1.5 text-paper/85">
            <input
              type="radio"
              name="source"
              value="probetraining"
              defaultChecked={defaultSource === "probetraining"}
            />
            Probetraining
          </label>
          <label className="flex items-center gap-1.5 text-paper/85">
            <input type="radio" name="source" value="kontakt" defaultChecked={defaultSource === "kontakt"} />
            Allgemeine Anfrage
          </label>
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-paper/70">Nachricht (optional)</span>
        <textarea name="message" rows={4} className={inputClass} />
      </label>

      <label className="flex items-start gap-2.5 text-xs text-paper/60">
        <input required type="checkbox" name="consent" className="mt-0.5" />
        Ich habe die{" "}
        <a href="/datenschutz" target="_blank" className="underline">
          Datenschutzerklärung
        </a>{" "}
        zur Kenntnis genommen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage
        einverstanden.
      </label>

      {state.status === "error" ? (
        <p role="alert" className="flex items-start gap-2 text-sm text-red">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
      >
        {pending ? "Wird gesendet …" : "Anfrage senden"}
      </button>
    </form>
  );
}
