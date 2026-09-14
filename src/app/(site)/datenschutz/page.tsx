import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { contact, siteConfig } from "@/content/site";
import { juergenPollack } from "@/content/about";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung des Sportpark Pollack.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        title="Datenschutzerklärung"
        texture="health"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Datenschutz" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-2xl text-sm leading-relaxed text-paper/80">
          <p className="rounded-xl border border-sand/30 bg-sand/10 p-4 text-xs text-paper/70">
            Rechtlicher Hinweis: Diese Datenschutzerklärung beschreibt strukturiert, welche Dienste diese
            Website tatsächlich einsetzt. Sie ersetzt keine rechtliche Prüfung durch eine sachkundige
            Stelle. Offene Punkte sind in TODO_CLIENT.md aufgeführt.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">Verantwortlicher</h2>
          <p className="mt-3">
            {siteConfig.name}, {juergenPollack.name}
            <br />
            {contact.street}, {contact.zip} {contact.city}
            <br />
            E-Mail: {contact.email}
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Hosting &amp; Server-Logfiles
          </h2>
          <p className="mt-3">
            Beim Aufruf dieser Website verarbeitet der Hosting-Anbieter automatisch Verbindungsdaten
            (z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite) in Server-Logfiles.
            Dies ist technisch notwendig, um die Website auszuliefern (Art. 6 Abs. 1 lit. f DSGVO). Der
            konkrete Hosting-Anbieter wird hier ergänzt, sobald das Deployment final feststeht (siehe
            TODO_CLIENT.md).
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">Schriftarten</h2>
          <p className="mt-3">
            Diese Website nutzt die Schriftart &bdquo;Poppins&ldquo; ausschließlich selbst gehostet. Es
            findet keine Verbindung zu Google Fonts oder anderen Schriftarten-Servern statt.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Kontakt- und Probetraining-Formular
          </h2>
          <p className="mt-3">
            Wenn du unser Kontakt- oder Probetraining-Formular ausfüllst, werden deine Angaben (Name,
            E-Mail-Adresse, optional Telefonnummer, gewünschter Bereich, gewünschter Termin, Nachricht)
            auf einem Server unseres Datenbank-Dienstleisters Supabase (Supabase Inc., Region Frankfurt,
            EU) gespeichert und ausschließlich zur Bearbeitung deiner Anfrage durch unser Team
            verarbeitet (Art. 6 Abs. 1 lit. b DSGVO). Der Versand erfolgt nur, wenn du der Verarbeitung
            aktiv zustimmst. Du kannst jederzeit die Löschung deiner Anfrage verlangen; wende dich dazu
            an {contact.email}. Zur Vermeidung von Missbrauch speichern wir zusätzlich einen technisch
            nicht auf dich persönlich rückführbaren Hash-Wert deiner IP-Adresse für eine begrenzte Zeit.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Anfahrtskarte (OpenStreetMap)
          </h2>
          <p className="mt-3">
            Auf der Kontaktseite kannst du optional eine interaktive Karte von OpenStreetMap laden.
            Diese wird erst nach deinem aktiven Klick eingebunden. Dabei kann deine IP-Adresse an die
            OpenStreetMap Foundation übertragen werden. Ohne deine Zustimmung zeigen wir nur die
            Adresse als Text sowie einen Link, der Google Maps in einem neuen Tab öffnet.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Google-Bewertungen
          </h2>
          <p className="mt-3">
            Die auf der Startseite angezeigte Sternebewertung und Anzahl der Bewertungen rufen wir
            serverseitig über die Google Places API ab, ohne dass dabei Daten deines Browsers oder
            deiner Person an Google übertragen werden. Es handelt sich um eine reine
            Server-zu-Server-Abfrage öffentlich einsehbarer Kennzahlen unseres Google-Maps-Eintrags.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            WhatsApp-Kontakt
          </h2>
          <p className="mt-3">
            Wenn du uns über den WhatsApp-Link kontaktierst, öffnet sich WhatsApp (Meta Platforms
            Ireland Limited) mit einer vorausgefüllten Nachricht. Es gelten die Datenschutzbestimmungen
            von WhatsApp. Diese Funktion wird erst durch deinen aktiven Klick ausgelöst.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">
            Anonymer Besucherzähler
          </h2>
          <p className="mt-3">
            Damit wir eine grobe wöchentliche Besucherzahl für unsere interne Verwaltung sehen können,
            setzen wir ein rein technisches Cookie (&bdquo;sp_visitor&ldquo;) mit einer zufällig erzeugten
            Kennung — ohne IP-Adresse, Namen, Standort oder sonstige personenbezogene Daten, ohne
            Weitergabe an Dritte und ohne Einsatz durch einen externen Analyse-Dienst. Die Kennung wird
            zusammen mit einem Zeitstempel gespeichert; ältere Einträge werden regelmäßig gelöscht.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">Deine Rechte</h2>
          <p className="mt-3">
            Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
            Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner personenbezogenen
            Daten. Wende dich dazu an {contact.email}.
          </p>

          <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-paper">Ziel-Kompass Rechner</h2>
          <p className="mt-3">
            Der Gesundheits- und Kalorienrechner läuft vollständig lokal in deinem Browser. Deine
            Eingaben (Alter, Größe, Gewicht etc.) werden nicht gespeichert und nicht an einen Server
            übertragen.
          </p>
        </Container>
      </section>
    </>
  );
}
