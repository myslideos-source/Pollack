"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCookieConsent } from "./CookieConsentProvider";
import type { ConsentCategory, ConsentState } from "@/lib/consent";
import { privacyServices, type ServiceCategory } from "@/content/legal-config";

const CATEGORY_LABELS: Record<ServiceCategory, { title: string; description: string }> = {
  necessary: {
    title: "Technisch erforderlich",
    description: "Ohne diese läuft die Website bzw. das Mitgliederportal nicht (Sitzung, Sicherheit, Grundfunktionen). Kann nicht deaktiviert werden.",
  },
  externalMedia: {
    title: "Externe Medien",
    description: "Inhalte, die erst nach deiner Zustimmung von externen Anbietern geladen werden, z. B. die Anfahrtskarte.",
  },
  statistics: {
    title: "Statistik",
    description: "Aktuell nicht im Einsatz — es läuft kein Statistik-/Analysewerkzeug auf dieser Website.",
  },
  marketing: {
    title: "Marketing",
    description: "Aktuell nicht im Einsatz — es läuft kein Marketing- oder Werbe-Tracking auf dieser Website.",
  },
};

const CATEGORY_ORDER: ServiceCategory[] = ["necessary", "externalMedia", "statistics", "marketing"];

function SettingsPanel({
  initial,
  onSave,
  onClose,
  showClose,
}: {
  initial: ConsentState;
  onSave: (state: ConsentState) => void;
  onClose: () => void;
  showClose: boolean;
}) {
  const [draft, setDraft] = useState<ConsentState>(initial);

  function toggle(category: ConsentCategory) {
    if (category === "necessary") return;
    setDraft((d) => ({ ...d, [category]: !d[category] }));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 backdrop-blur-sm print:hidden sm:items-center sm:p-6">
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-paper/10 bg-anthracite p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-paper">Cookie-Einstellungen</h2>
          {showClose ? (
            <button type="button" onClick={onClose} aria-label="Schließen" className="text-paper/50 hover:text-paper">
              <X size={20} />
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-paper/60">
          Wähle aus, welche Kategorien du zulässt. Details zu den Diensten findest du in der{" "}
          <Link href="/datenschutz" className="text-red underline underline-offset-2 hover:text-red-dark">
            Datenschutzerklärung
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {CATEGORY_ORDER.map((category) => {
            const services = privacyServices.filter((s) => s.category === category);
            const label = CATEGORY_LABELS[category];
            return (
              <div key={category} className="rounded-2xl border border-paper/10 bg-ink p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-sm uppercase tracking-wide text-paper">{label.title}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draft[category]}
                    aria-label={`${label.title} ${draft[category] ? "deaktivieren" : "aktivieren"}`}
                    disabled={category === "necessary"}
                    onClick={() => toggle(category)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      draft[category] ? "bg-red" : "bg-paper/20"
                    } ${category === "necessary" ? "opacity-60" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform ${
                        draft[category] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-2 text-xs text-paper/50">{label.description}</p>
                {services.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {services.map((s) => (
                      <li key={s.id} className="rounded-full border border-paper/15 px-2.5 py-1 text-[11px] text-paper/60">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSave(draft)}
          className="mt-6 w-full rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark"
        >
          Auswahl speichern
        </button>
      </div>
    </div>
  );
}

/** Renders the initial bottom banner (first visit) and, on demand, the settings panel reached
 *  via the Footer's "Cookie-Einstellungen" link. Mounted once in the public site layout. */
export function CookieBanner() {
  const { categories, hasDecided, settingsOpen, acceptAll, acceptNecessaryOnly, saveSelection, closeSettings } =
    useCookieConsent();

  if (categories === null) return null; // not yet hydrated from localStorage

  if (settingsOpen) {
    return (
      <SettingsPanel
        initial={categories}
        onSave={saveSelection}
        onClose={closeSettings}
        showClose={hasDecided}
      />
    );
  }

  if (hasDecided) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-paper/10 bg-anthracite px-4 py-5 shadow-2xl print:hidden sm:px-6"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      role="dialog"
      aria-label="Cookie-Hinweis"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-paper/70">
          Wir verwenden nur technisch notwendige Cookies sowie — mit deiner Zustimmung — externe Inhalte wie die
          Anfahrtskarte.{" "}
          <Link href="/datenschutz" className="text-red underline underline-offset-2 hover:text-red-dark">
            Mehr in der Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <button
            type="button"
            onClick={acceptNecessaryOnly}
            className="rounded-full border border-paper/25 px-4 py-2.5 text-sm text-paper hover:border-paper/50"
          >
            Nur notwendige
          </button>
          <SettingsOpenButton />
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-full bg-red px-5 py-2.5 text-sm font-medium text-paper hover:bg-red-dark"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsOpenButton() {
  const { openSettings } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openSettings}
      className="rounded-full border border-paper/25 px-4 py-2.5 text-sm text-paper hover:border-paper/50"
    >
      Einstellungen
    </button>
  );
}
