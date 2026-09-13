import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { contact, siteConfig } from "@/content/site";
import { juergenPollack } from "@/content/about";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des Sportpark Pollack in Fichtenau.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero
        title="Impressum"
        texture="performance"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Impressum" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-2xl text-sm leading-relaxed text-paper/80">
          <h2 className="font-display text-xl uppercase tracking-wide text-paper">Angaben gemäß § 5 TMG</h2>
          <p className="mt-3">
            {siteConfig.name}
            <br />
            Inhaber: {juergenPollack.name}
            <br />
            {contact.street}
            <br />
            {contact.zip} {contact.city}
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">Kontakt</h2>
          <p className="mt-3">
            Telefon: {contact.phoneDisplay}
            <br />
            E-Mail: {contact.email}
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Umsatzsteuer-Identifikationsnummer
          </h2>
          <p className="mt-3 text-paper/60">
            Wird ergänzt, sobald die Umsatzsteuer-ID vom Betreiber bestätigt wurde (siehe
            TODO_CLIENT.md).
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-3">
            {juergenPollack.name}
            <br />
            {contact.street}, {contact.zip} {contact.city}
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            EU-Streitschlichtung
          </h2>
          <p className="mt-3">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse findest du oben. Wir sind nicht verpflichtet und nicht bereit, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (bitte
            gemeinsam mit dem Betreiber final bestätigen, siehe TODO_CLIENT.md).
          </p>

          <p className="mt-10 rounded-xl border border-sand/30 bg-sand/10 p-4 text-xs text-paper/70">
            Rechtlicher Hinweis: Dieses Impressum wurde strukturiert nach den gesetzlichen Mindestangaben
            aufgebaut. Es ersetzt keine rechtliche Prüfung. Offene Punkte sind in TODO_CLIENT.md
            aufgeführt und sollten vor Veröffentlichung von einer sachkundigen Stelle geprüft werden.
          </p>
        </Container>
      </section>
    </>
  );
}
