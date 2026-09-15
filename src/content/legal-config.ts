/**
 * Single source of truth for both Impressum and Datenschutzerklärung: which company details
 * are already confirmed vs. still open, and which external services this project actually
 * calls. Both legal pages render FROM this file — nothing is hand-duplicated in the page
 * markup — so the legal text can never silently drift from what the code really does.
 *
 * When adding/removing an integration (a new env var, a new fetch to a third party, a new
 * cookie), update `services` here first. That is also the checklist for what the privacy
 * policy needs to cover.
 */

/**
 * Company details still open. Real, fillable config fields — not booleans — so confirming one
 * is just typing the value in here; the page then renders it automatically. `null` means
 * "not yet confirmed" and is never shown to visitors as the literal value (no "[PLATZHALTER]"
 * text) — see LegalConfirmationNotice for how the gap is surfaced instead. A non-null empty
 * string means "confirmed as not applicable" (e.g. no register entry exists).
 */
export const legalConfirmations: {
  inhaberVollstaendig: string | null;
  rechtsform: string | null;
  vertretungsberechtigte: string | null; // nur falls die Rechtsform das erfordert (z. B. GmbH-Geschäftsführung)
  ustId: string | null;
  registerName: string | null; // z. B. "Amtsgericht Ellwangen, Handelsregister"
  registerNummer: string | null;
  aufsichtsbehoerdeUnternehmen: string | null; // nur falls der Betrieb erlaubnispflichtig ist
  verbraucherschlichtungConfirmed: boolean; // ob die alte Aussage weiterhin zutrifft
  bildrechteOrtnerMedia: boolean | null; // ob Ortner MEDIA weiterhin als Rechteinhaber genannt werden soll
} = {
  inhaberVollstaendig: null,
  rechtsform: null,
  vertretungsberechtigte: null,
  ustId: null,
  registerName: null,
  registerNummer: null,
  aufsichtsbehoerdeUnternehmen: null,
  verbraucherschlichtungConfirmed: false,
  bildrechteOrtnerMedia: null,
};

const CONFIRMATION_LABELS: Record<keyof typeof legalConfirmations, string> = {
  inhaberVollstaendig: "Vollständiger Name des Inhabers/der Inhaberin",
  rechtsform: "Rechtsform",
  vertretungsberechtigte: "Vertretungsberechtigte Person (falls die Rechtsform das erfordert)",
  ustId: "Umsatzsteuer-Identifikationsnummer",
  registerName: "Handels-/Vereins-/Unternehmensregister",
  registerNummer: "Registernummer",
  aufsichtsbehoerdeUnternehmen: "Zuständige Aufsichtsbehörde für den Betrieb (falls erlaubnispflichtig)",
  verbraucherschlichtungConfirmed: "Aussage zur Verbraucherschlichtung",
  bildrechteOrtnerMedia: "Nennung von Ortner MEDIA als Bildrechteinhaber",
};

/** Whether a given field still counts as "open" — null always means not yet decided; for
 *  verbraucherschlichtungConfirmed specifically, false also means not yet decided (it's a
 *  plain yes/no confirmation flag, not a tri-state value like the others). */
function isOpen(key: keyof typeof legalConfirmations): boolean {
  const value = legalConfirmations[key];
  if (key === "verbraucherschlichtungConfirmed") return value !== true;
  return value === null;
}

export const allLegalConfirmationsGiven = (Object.keys(legalConfirmations) as (keyof typeof legalConfirmations)[]).every(
  (key) => !isOpen(key),
);

export function openLegalConfirmations(): { key: string; label: string }[] {
  return (Object.keys(legalConfirmations) as (keyof typeof legalConfirmations)[])
    .filter(isOpen)
    .map((key) => ({ key, label: CONFIRMATION_LABELS[key] }));
}

/**
 * Emits an unmissable warning in the build/deploy logs while any legal confirmation is still
 * open — called once per page render from both /impressum and /datenschutz. Never blocks the
 * build (a client shouldn't be locked out of preview deploys over this), but makes it hard to
 * miss that the page is not yet release-ready. The page itself also renders the open items
 * visibly for anyone reading it — see LegalConfirmationNotice.
 */
export function warnIfLegalConfirmationsMissing(pageLabel: string): void {
  const open = openLegalConfirmations();
  if (open.length === 0) return;
  console.warn(
    `\n⚠️  [Rechtstexte] ${pageLabel}: ${open.length} Pflichtangabe(n) noch nicht bestätigt — ${open
      .map((o) => o.label)
      .join(", ")}. Vor Veröffentlichung mit dem Auftraggeber klären (siehe src/content/legal-config.ts).\n`,
  );
}

export type ServiceCategory = "necessary" | "externalMedia" | "statistics" | "marketing";

export type PrivacyService = {
  id: string;
  name: string;
  provider: string;
  category: ServiceCategory;
  purpose: string;
  dataProcessed: string;
  legalBasis: string;
  recipient: string;
  region: string;
  retention: string;
  consentRequired: boolean;
};

/**
 * Every service that actually touches a visitor's/member's data or device, verified against
 * the running code (see the session notes referenced in TODO_CLIENT.md #7 for how each entry
 * was checked). Nothing here is aspirational — if it's not wired up in the code, it's not
 * listed, and the cookie banner only ever gates what's listed with consentRequired: true.
 */
export const privacyServices: PrivacyService[] = [
  {
    id: "hosting-vercel",
    name: "Hosting",
    provider: "Vercel Inc.",
    category: "necessary",
    purpose: "Ausliefern der Website und Ausführen der Serverfunktionen.",
    dataProcessed: "IP-Adresse, Zeitstempel, angeforderte URL, Browser-/Geräteinformationen (Server-Logfiles).",
    legalBasis: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren, technisch fehlerfreien Betrieb)",
    recipient: "Vercel Inc. als Auftragsverarbeiter",
    region:
      "Vercels Netzwerk ist global; die für dieses Projekt konfigurierten Serverfunktionen laufen in der Region Frankfurt (fra1, EU). Eine Übermittlung in Drittländer (z. B. USA) über das globale Vercel-Netzwerk ist möglich.",
    retention: "Server-Logfiles: kurzfristig, im Rahmen der üblichen Löschfristen des Hosting-Anbieters.",
    consentRequired: false,
  },
  {
    id: "supabase",
    name: "Datenbank, Authentifizierung & Storage",
    provider: "Supabase Inc.",
    category: "necessary",
    purpose:
      "Speicherung aller Anfragen, Website-Inhalte, Medien sowie sämtlicher Mitgliederportal-Daten (Konten, Trainingspläne, Trainingsprotokolle, Nachrichten).",
    dataProcessed: "Siehe jeweiliger Abschnitt (Kontaktformular, Mitgliederportal).",
    legalBasis: "Art. 6 Abs. 1 lit. b und f DSGVO, bei Gesundheitsangaben zusätzlich Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung)",
    recipient: "Supabase Inc. als Auftragsverarbeiter",
    region: "Datenbank-Projekt in der Region Frankfurt (eu-central-1, EU).",
    retention: "Siehe jeweiliger Abschnitt.",
    consentRequired: false,
  },
  {
    id: "resend",
    name: "Transaktionale E-Mails",
    provider: "Resend (Resend, Inc.)",
    category: "necessary",
    purpose: "Versand der Eingangsbestätigung an Anfragende sowie einer internen Benachrichtigung an das Sportpark-Team bei neuen Anfragen.",
    dataProcessed: "Name, E-Mail-Adresse, Inhalt der jeweiligen Benachrichtigung.",
    legalBasis: "Art. 6 Abs. 1 lit. b und f DSGVO",
    recipient: "Resend, Inc. als Auftragsverarbeiter",
    region: "US-amerikanischer Anbieter — eine Übermittlung in die USA ist möglich; Resend verpflichtet sich vertraglich auf ein angemessenes Schutzniveau.",
    retention: "Nur für den Versandvorgang selbst; keine dauerhafte Speicherung der Inhalte bei Resend über den Versand hinaus.",
    consentRequired: false,
  },
  {
    id: "google-places",
    name: "Google-Bewertung (Kennzahl)",
    provider: "Google Ireland Limited",
    category: "necessary",
    purpose: "Anzeige der aktuellen Sterne-Bewertung und Bewertungsanzahl des Google-Eintrags auf der Startseite.",
    dataProcessed: "Keine Besucherdaten — die Abfrage läuft ausschließlich serverseitig; es wird keine Verbindung vom Browser der Besucherin/des Besuchers zu Google aufgebaut.",
    legalBasis: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer aktuellen Darstellung)",
    recipient: "Google Ireland Limited (reiner Datenabruf, keine Datenübermittlung von Besuchenden)",
    region: "Serverseitige Abfrage; kein direkter Datenfluss von Besuchenden an Google.",
    retention: "Nicht zutreffend (keine personenbezogenen Besucherdaten betroffen).",
    consentRequired: false,
  },
  {
    id: "osm-map",
    name: "Anfahrtskarte",
    provider: "OpenStreetMap Foundation",
    category: "externalMedia",
    purpose: "Anzeige einer interaktiven Anfahrtskarte auf der Kontaktseite.",
    dataProcessed: "IP-Adresse und Zugriffsdaten, sobald die Karte aktiv geladen wird.",
    legalBasis: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch aktives Laden)",
    recipient: "OpenStreetMap Foundation",
    region: "Kartenkachel-Server der OpenStreetMap Foundation, überwiegend EU.",
    retention: "Nach den Angaben der OpenStreetMap Foundation, außerhalb unserer Kontrolle.",
    consentRequired: true,
  },
];

export const servicesByCategory = (category: ServiceCategory) => privacyServices.filter((s) => s.category === category);
