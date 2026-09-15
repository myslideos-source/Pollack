import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { LegalPageShell, LegalSection } from "@/components/shared/LegalPage";
import { LegalConfirmationNotice } from "@/components/shared/LegalConfirmationNotice";
import { contact, siteConfig } from "@/content/site";
import { juergenPollack } from "@/content/about";
import { legalConfirmations, warnIfLegalConfirmationsMissing } from "@/content/legal-config";

warnIfLegalConfirmationsMissing("Impressum");

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des Sportpark Pollack in Fichtenau.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "15. September 2026";

const sections = [
  { id: "angaben", label: "Angaben gemäß § 5 DDG" },
  { id: "kontakt", label: "Kontakt" },
  { id: "register", label: "Registereintrag & Umsatzsteuer-ID" },
  { id: "aufsicht", label: "Zuständige Aufsichtsbehörde" },
  { id: "verantwortlich-inhalt", label: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)" },
  { id: "verantwortlich-datenschutz", label: "Verantwortlicher für den Datenschutz" },
  { id: "streitbeilegung", label: "Verbraucherstreitbeilegung" },
  { id: "haftung-inhalte", label: "Haftung für Inhalte" },
  { id: "haftung-links", label: "Haftung für Links" },
  { id: "urheberrecht", label: "Urheberrecht & Bildnachweis" },
];

/** Renders a confirmed value, or a clearly-labelled "still open" note — never a bare
 *  "[PLATZHALTER]" string mixed into the legal text itself. */
function ConfigField({ value, missingLabel }: { value: string | null; missingLabel: string }) {
  if (value !== null) return <>{value || "entfällt"}</>;
  return <span className="text-paper/50">({missingLabel} — noch zu bestätigen)</span>;
}

export default function ImpressumPage() {
  return (
    <>
      <PageHero title="Impressum" texture="performance" breadcrumbs={[{ label: "Start", href: "/" }, { label: "Impressum" }]} />
      <LegalPageShell lastUpdated={LAST_UPDATED} sections={sections}>
        <LegalSection id="angaben" label="Angaben gemäß § 5 DDG">
          <p>
            {siteConfig.name} (<ConfigField value={legalConfirmations.rechtsform} missingLabel="Rechtsform" />)
            <br />
            Inhaber: {juergenPollack.name}{" "}
            {legalConfirmations.inhaberVollstaendig ? null : (
              <span className="text-paper/50">(vollständiger Name noch zu bestätigen)</span>
            )}
            <br />
            {contact.street}
            <br />
            {contact.zip} {contact.city}
            <br />
            {contact.country === "DE" ? "Deutschland" : contact.country}
          </p>
          <p>
            Vertretungsberechtigte Person:{" "}
            <ConfigField value={legalConfirmations.vertretungsberechtigte} missingLabel="nur falls die Rechtsform das erfordert" />
          </p>
        </LegalSection>

        <LegalSection id="kontakt" label="Kontakt">
          <p>
            Telefon: {contact.phoneDisplay}
            <br />
            E-Mail: {contact.email}
          </p>
        </LegalSection>

        <LegalSection id="register" label="Registereintrag & Umsatzsteuer-ID">
          <p>
            Handels-/Vereins-/Unternehmensregister:{" "}
            <ConfigField value={legalConfirmations.registerName} missingLabel="falls vorhanden" />
            <br />
            Registernummer: <ConfigField value={legalConfirmations.registerNummer} missingLabel="falls vorhanden" />
            <br />
            Umsatzsteuer-Identifikationsnummer nach § 27a UStG:{" "}
            <ConfigField value={legalConfirmations.ustId} missingLabel="noch nicht hinterlegt" />
          </p>
        </LegalSection>

        <LegalSection id="aufsicht" label="Zuständige Aufsichtsbehörde">
          <p>
            <ConfigField
              value={legalConfirmations.aufsichtsbehoerdeUnternehmen}
              missingLabel="nur falls der Betrieb einer besonderen Erlaubnis bedarf — für ein Fitnessstudio in der Regel nicht einschlägig, bitte trotzdem bestätigen"
            />
          </p>
        </LegalSection>

        <LegalSection id="verantwortlich-inhalt" label="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)">
          <p>
            {juergenPollack.name}
            <br />
            {contact.street}, {contact.zip} {contact.city}
          </p>
        </LegalSection>

        <LegalSection id="verantwortlich-datenschutz" label="Verantwortlicher für den Datenschutz">
          <p>
            {juergenPollack.name}
            <br />
            E-Mail: {contact.email}
            <br />
            Telefon: {contact.phoneDisplay}
          </p>
          <p>Details zur Datenverarbeitung findest du in unserer Datenschutzerklärung.</p>
        </LegalSection>

        <LegalSection id="streitbeilegung" label="Verbraucherstreitbeilegung">
          {legalConfirmations.verbraucherschlichtungConfirmed ? (
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          ) : (
            <p className="rounded-xl border border-sand/30 bg-sand/10 p-3 text-sm text-paper/70">
              Diese Aussage aus der bisherigen Website („Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.“) ist hier noch
              nicht veröffentlicht — sie erscheint erst, sobald bestätigt ist, dass sie weiterhin zutrifft und
              im konkreten Fall (§ 36 VSBG) erforderlich ist.
            </p>
          )}
        </LegalSection>

        <LegalSection id="haftung-inhalte" label="Haftung für Inhalte">
          <p>
            Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir dennoch keine Gewähr übernehmen. Als
            Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Bei Bekanntwerden entsprechender Rechtsverletzungen
            werden wir diese Inhalte umgehend entfernen.
          </p>
        </LegalSection>

        <LegalSection id="haftung-links" label="Haftung für Links">
          <p>
            Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
            haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
            der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Eine
            permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
            Links umgehend entfernen. Kontakt bei einem konkreten Verdacht: {contact.email}.
          </p>
        </LegalSection>

        <LegalSection id="urheberrecht" label="Urheberrecht & Bildnachweis">
          <p>
            Die durch die Betreiber dieser Website erstellten Inhalte und Werke unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
            der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
            Erstellers.
          </p>
          <p>Die Bilder, Fotografien, Grafiken und Videos auf dieser Website sind urheberrechtlich geschützt.</p>
          <p>
            Rechteinhaber: {siteConfig.name}
            {legalConfirmations.bildrechteOrtnerMedia === true ? ", Ortner MEDIA" : ""}
          </p>
          {legalConfirmations.bildrechteOrtnerMedia === null ? (
            <p className="rounded-xl border border-sand/30 bg-sand/10 p-3 text-sm text-paper/70">
              Auf der bisherigen Website wurde zusätzlich „Ortner MEDIA“ als Rechteinhaber genannt — hier noch
              nicht übernommen, bis bestätigt ist, ob das weiterhin zutrifft. Bitte vor Veröffentlichung auch
              prüfen, ob alle neuen bzw. KI-bearbeiteten Bilder ausreichend gekennzeichnet bzw. nutzbar sind.
            </p>
          ) : null}
        </LegalSection>

        <LegalConfirmationNotice />
      </LegalPageShell>
    </>
  );
}
