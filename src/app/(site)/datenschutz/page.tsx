import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { LegalPageShell, LegalSection } from "@/components/shared/LegalPage";
import { LegalConfirmationNotice } from "@/components/shared/LegalConfirmationNotice";
import { contact, siteConfig } from "@/content/site";
import { juergenPollack } from "@/content/about";
import { privacyServices, warnIfLegalConfirmationsMissing } from "@/content/legal-config";

warnIfLegalConfirmationsMissing("Datenschutzerklärung");

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung des Sportpark Pollack — inklusive Mitgliederportal.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "15. September 2026";

const sections = [
  { id: "ueberblick", label: "Überblick" },
  { id: "verantwortlicher", label: "Verantwortlicher" },
  { id: "grundsaetze", label: "Grundsätze & Rechtsgrundlagen" },
  { id: "hosting", label: "Hosting & Server-Logfiles" },
  { id: "datenbank", label: "Datenbank, Authentifizierung & Storage" },
  { id: "formular", label: "Kontakt- & Probetraining-Formular" },
  { id: "spamschutz", label: "Spam-Schutz" },
  { id: "mitgliederportal", label: "Mitgliederportal" },
  { id: "gesundheitsdaten", label: "Gesundheitsbezogene Angaben" },
  { id: "cookies", label: "Cookies & Einwilligungsmanagement" },
  { id: "karte", label: "Anfahrtskarte (OpenStreetMap)" },
  { id: "bewertungen", label: "Google-Bewertungen" },
  { id: "email", label: "E-Mail-Versand" },
  { id: "schriftarten", label: "Schriftarten" },
  { id: "videos", label: "Videos" },
  { id: "rechner", label: "Ziel-Kompass & Kalorienrechner" },
  { id: "analyse", label: "Analyse & Tracking" },
  { id: "rechte", label: "Deine Rechte" },
  { id: "aufsicht", label: "Aufsichtsbehörde" },
];

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        title="Datenschutzerklärung"
        texture="health"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Datenschutz" }]}
      />
      <LegalPageShell lastUpdated={LAST_UPDATED} sections={sections}>
        <LegalSection id="ueberblick" label="Überblick">
          <p>
            Diese Erklärung beschreibt, welche Dienste diese Website und das Mitgliederportal des{" "}
            {siteConfig.name} tatsächlich einsetzen — nicht mehr und nicht weniger. Sie listet für jeden Dienst,
            welche Daten verarbeitet werden, zu welchem Zweck, auf welcher Rechtsgrundlage, wie lange sie
            gespeichert werden, wer sie empfängt und ob eine Übermittlung außerhalb der EU stattfindet.
          </p>
        </LegalSection>

        <LegalSection id="verantwortlicher" label="Verantwortlicher">
          <p>
            {juergenPollack.name}
            <br />
            {siteConfig.name}
            <br />
            {contact.street}, {contact.zip} {contact.city}
            <br />
            E-Mail: {contact.email}
            <br />
            Telefon: {contact.phoneDisplay}
          </p>
          <p>
            Die genaue Bezeichnung und Rechtsform sind im{" "}
            <Link href="/impressum">Impressum</Link> aufgeführt und werden dort final bestätigt.
          </p>
        </LegalSection>

        <LegalSection id="grundsaetze" label="Grundsätze & Rechtsgrundlagen">
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies für einen konkreten Zweck erforderlich ist
            (Datenminimierung, Art. 25 DSGVO) und stützen uns dabei je nach Zweck auf:
          </p>
          <ul>
            <li>Art. 6 Abs. 1 lit. a DSGVO — deine Einwilligung (z. B. externe Karte, Gesundheitsangaben)</li>
            <li>Art. 6 Abs. 1 lit. b DSGVO — Erfüllung eines Vertrags bzw. vorvertragliche Maßnahmen (z. B. deine Anfrage, dein Mitgliedskonto)</li>
            <li>Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse (z. B. technischer Betrieb, Missbrauchsschutz)</li>
            <li>Art. 9 Abs. 2 lit. a DSGVO — deine ausdrückliche Einwilligung bei gesundheitsbezogenen Angaben im Mitgliederportal</li>
          </ul>
          <p>
            Dienstleister, die dabei in unserem Auftrag Daten verarbeiten, sind über Auftragsverarbeitungsverträge
            nach Art. 28 DSGVO gebunden. Technische und organisatorische Maßnahmen nach Art. 32 DSGVO — u. a.
            Verschlüsselung der Verbindung (TLS), Zugriffsbeschränkung nach Rolle (Row-Level-Security in der
            Datenbank) und Speicherung gehashter statt roher IP-Adressen beim Kontaktformular — sind technisch
            umgesetzt (siehe die jeweiligen Abschnitte).
          </p>
        </LegalSection>

        <LegalSection id="hosting" label="Hosting & Server-Logfiles">
          <p>
            Diese Website wird bei <strong>Vercel Inc.</strong> gehostet. Beim Aufruf verarbeitet Vercel
            automatisch Verbindungsdaten (IP-Adresse, Zeitstempel, angeforderte URL, Browser-/
            Betriebssysteminformationen sowie Sicherheits- und Fehlerprotokolle) in Server-Logfiles, um die
            Website technisch auszuliefern und abzusichern (Art. 6 Abs. 1 lit. f DSGVO). Die für dieses Projekt
            konfigurierten Serverfunktionen laufen in der Region Frankfurt (EU); da Vercel ein global verteiltes
            Netzwerk betreibt, ist eine Verarbeitung auch außerhalb der EU (insbesondere USA) möglich. Vercel
            verpflichtet sich vertraglich auf ein angemessenes Schutzniveau. Die Speicherdauer der Logfiles
            richtet sich nach den Standard-Löschfristen von Vercel und ist uns nicht im Detail bekannt — für
            genaue Werte verweisen wir auf die Datenschutzhinweise von Vercel.
          </p>
        </LegalSection>

        <LegalSection id="datenbank" label="Datenbank, Authentifizierung & Storage">
          <p>
            Für die Datenbank, die Anmeldung (Mitglieder, Trainer:innen, Administration) und die Speicherung von
            Bild-/Videodateien nutzen wir <strong>Supabase</strong> (Supabase Inc.), mit Datenbank-Projekt in der
            Region Frankfurt (EU). Supabase verarbeitet die Daten als Auftragsverarbeiter nach Art. 28 DSGVO in
            unserem Auftrag. Welche Daten konkret gespeichert werden, ist in den Abschnitten{" "}
            <a href="#formular">Kontaktformular</a> und <a href="#mitgliederportal">Mitgliederportal</a>{" "}
            beschrieben. Die Anmeldung setzt technisch notwendige Sitzungs-Cookies von Supabase, damit du
            eingeloggt bleibst — siehe <a href="#cookies">Cookies</a>.
          </p>
        </LegalSection>

        <LegalSection id="formular" label="Kontakt- & Probetraining-Formular">
          <p>
            Wenn du unser Kontakt- oder Probetraining-Formular ausfüllst, verarbeiten wir: Vorname, Nachname,
            E-Mail-Adresse, optional Telefonnummer, gewünschter Bereich, optional gewünschter Termin und
            Nachricht, sowie automatisch den Zeitpunkt der Anfrage. Die Daten werden in unserer Datenbank
            gespeichert und erscheinen in unserem internen Anfragen-Bereich, wo ein Bearbeitungsstatus
            geführt wird; Empfänger ist ausschließlich unser Team. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
            DSGVO (Bearbeitung deiner Anfrage) sowie Art. 6 Abs. 1 lit. a DSGVO für deine explizite Einwilligung
            im Formular. Wir versenden zusätzlich automatisch eine Eingangsbestätigung an deine E-Mail-Adresse
            und eine interne Benachrichtigung an unser Team (siehe <a href="#email">E-Mail-Versand</a>).
          </p>
          <p>
            Zum Schutz vor Missbrauch speichern wir zusätzlich einen kryptografischen Hash-Wert deiner
            IP-Adresse (nicht die IP-Adresse selbst) für die Dauer einer Stunde, um eine automatisierte
            Begrenzung auf maximal fünf Anfragen pro Stunde und Absender umzusetzen.
          </p>
          <p>
            Deine Anfrage bleibt gespeichert, bis sie bearbeitet ist bzw. bis du ihre Löschung verlangst — dafür
            genügt eine kurze Nachricht an {contact.email}. Ein automatisiertes Löschkonzept mit fester Frist
            ist derzeit nicht implementiert; wir empfehlen, dafür zeitnah eine konkrete Aufbewahrungsfrist
            festzulegen (siehe Anmerkung am Ende dieser Seite).
          </p>
        </LegalSection>

        <LegalSection id="spamschutz" label="Spam-Schutz">
          <p>
            Statt eines Captchas eines Drittanbieters nutzen wir ein unsichtbares Zusatzfeld im Formular
            („Honeypot“) — echte Besucher:innen sehen und befüllen es nie, füllt es doch jemand (typischerweise
            ein automatisiertes Programm), wird die Anfrage verworfen, ohne dass eine Verbindung zu einem
            externen Anbieter aufgebaut wird. In Kombination mit der oben beschriebenen stündlichen
            Ratenbegrenzung kommt dieses Formular vollständig ohne Google reCAPTCHA oder vergleichbare
            Drittanbieter-Dienste aus.
          </p>
        </LegalSection>

        <LegalSection id="mitgliederportal" label="Mitgliederportal">
          <p>
            Mitglieder, Trainer:innen und Administrator:innen können sich im Mitgliederportal anmelden. Dabei
            verarbeiten wir folgende Datenkategorien, jeweils zweckgebunden für den Betrieb deines
            Trainingskontos (Art. 6 Abs. 1 lit. b DSGVO):
          </p>
          <ul>
            <li>Kontodaten: E-Mail-Adresse, Name, Rolle (Mitglied/Trainer/Administration), Sitzungsdaten für die Anmeldung</li>
            <li>Profil: Ziel, Erfahrungsstufe, gewünschte Trainingstage/-dauer, Trainingsschwerpunkte</li>
            <li>Trainingspläne: von Trainer:innen erstellte bzw. freigegebene Pläne, einzelne Übungen mit Sätzen, Wiederholungen und Zielgewichten</li>
            <li>Trainingsprotokoll: von dir eingetragene Sätze, Gewichte, Wiederholungen, wahrgenommene Anstrengung, Notizen</li>
            <li>Fortschrittsdaten: daraus berechnete Auswertungen (z. B. Trainingsserie, bewegtes Gewicht, persönliche Bestwerte)</li>
            <li>Körpermessungen: von dir freiwillig eingetragene Werte (z. B. Gewicht, Körperfettanteil)</li>
            <li>Nachrichten zwischen dir und deinem Trainer/deiner Trainerin</li>
            <li>Übungsbilder und -videos im gemeinsamen Übungskatalog (zeigen keine Mitglieder, nur die Übung selbst, sofern hinterlegt)</li>
          </ul>
          <p>
            <strong>Rollen und Zugriff:</strong> Mitglieder sehen ausschließlich ihre eigenen Daten. Trainer:innen
            sehen nur die ihnen zugewiesenen Mitglieder. Administrator:innen haben systembedingt vollen Zugriff
            zur Verwaltung des Portals. Ein neu erstellter Trainingsplan ist für das Mitglied erst nach
            ausdrücklicher Freigabe durch Trainer:in oder Administration sichtbar — er wird nie automatisch
            aktiviert. Bestimmte sicherheitsrelevante Aktionen (z. B. die Freigabe eines Trainingsplans) werden
            in einem Protokoll festgehalten, das nur Trainer:innen und Administration einsehen können.
          </p>
          <p>
            <strong>Datenexport & Löschung:</strong> Unter „Profil“ kannst du jederzeit einen vollständigen
            Export deiner Portaldaten als Datei herunterladen sowie die Löschung deines Kontos beantragen; die
            Löschanfrage geht an dein Trainerteam zur Bearbeitung. Portaldaten werden für die Dauer deiner
            aktiven Mitgliedschaft im Portal gespeichert und nach einer Kontolöschung entfernt, soweit keine
            gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </LegalSection>

        <LegalSection id="gesundheitsdaten" label="Gesundheitsbezogene Angaben">
          <p>
            Angaben zu Beschwerden, Verletzungen, Körpermaßen, Körperfettanteil, Muskelmasse oder daraus
            abgeleiteten Trainingsanpassungen können Gesundheitsdaten im Sinne von Art. 9 DSGVO sein. Dafür
            gilt zusätzlich:
          </p>
          <ul>
            <li>Wir verarbeiten diese Angaben nur mit deiner gesonderten, ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO) — die entsprechende Checkbox bei der Erstanalyse ist nicht vorangekreuzt.</li>
            <li>Zeitpunkt und Stand jeder Einwilligung (erteilt/widerrufen) werden protokolliert.</li>
            <li>Du kannst die Einwilligung jederzeit unter „Profil → Datenschutz“ widerrufen — die Verarbeitung deiner Gesundheitsangaben wird dann eingestellt.</li>
            <li>Ein Mitgliedskonto setzt nicht automatisch sämtliche freiwilligen Gesundheitsfelder voraus — jedes Feld ist optional.</li>
            <li>Wir nutzen diese Angaben ausschließlich zur Trainingsanpassung, nicht zu Werbezwecken.</li>
            <li>Andere Mitglieder haben keinen Zugriff auf diese Angaben; Trainer:innen sehen ausschließlich die ihnen zugewiesenen Mitglieder.</li>
            <li>Export und Löschung sind wie im Abschnitt <a href="#mitgliederportal">Mitgliederportal</a> beschrieben jederzeit möglich.</li>
          </ul>
          <p>
            Trainingspläne und die im Portal dargestellten Inhalte ersetzen keine medizinische Beratung. Bei
            akuten Beschwerden oder gesundheitlichen Einschränkungen ist vor dem Training ärztlicher Rat
            einzuholen.
          </p>
        </LegalSection>

        <LegalSection id="cookies" label="Cookies & Einwilligungsmanagement">
          <p>
            Wir unterscheiden zwischen technisch notwendigen Cookies (laufen immer, keine Einwilligung
            erforderlich) und Diensten, die erst nach deiner aktiven Zustimmung laden. Deine Auswahl kannst du
            jederzeit über den Link „Cookie-Einstellungen“ im Footer ändern; sie wird lokal in deinem Browser
            gespeichert (nicht auf unserem Server) und ist jederzeit widerrufbar.
          </p>
          <h3>Technisch notwendig</h3>
          <ul>
            <li>
              <strong>Supabase-Sitzungs-Cookie:</strong> hält dich im Mitgliederportal bzw. Admin-Bereich
              angemeldet. Ohne dieses Cookie funktioniert die Anmeldung nicht.
            </li>
            <li>
              <strong>„sp_visitor“:</strong> ein rein technisches Cookie mit einer zufällig erzeugten Kennung
              (kein Name, keine IP-Adresse, keine sonstigen personenbezogenen Daten), das uns eine grobe
              wöchentliche Besucherzahl für die interne Auswertung zeigt — ohne externen Analyse-Dienst und
              ohne Weitergabe an Dritte. Wird nicht auf /admin-Seiten gesetzt.
            </li>
          </ul>
          <h3>Externe Medien</h3>
          <p>Erst nach Zustimmung: die Anfahrtskarte (siehe <a href="#karte">Anfahrtskarte</a>).</p>
          <h3>Statistik & Marketing</h3>
          <p>
            Aktuell setzen wir keinerlei Statistik-, Analyse-, Marketing- oder Werbe-Tracking ein (siehe auch{" "}
            <a href="#analyse">Analyse &amp; Tracking</a>) — diese Kategorien stehen im Cookie-Banner bereits
            bereit, sind aber derzeit leer.
          </p>
        </LegalSection>

        <LegalSection id="karte" label="Anfahrtskarte (OpenStreetMap)">
          <p>
            Auf der Kontaktseite kannst du optional eine interaktive Karte von OpenStreetMap laden. Sie wird
            nicht automatisch eingebunden, sondern erst nach deinem aktiven Klick bzw. deiner Zustimmung im
            Cookie-Banner. Dabei werden deine IP-Adresse und weitere Zugriffsdaten an die OpenStreetMap
            Foundation übertragen (Art. 6 Abs. 1 lit. a DSGVO). Ohne deine Zustimmung zeigen wir nur die Adresse
            als Text sowie einen Link, der Google Maps in einem neuen Tab öffnet (reine Weiterleitung, kein
            eingebettetes Element, daher keine Einwilligung erforderlich).
          </p>
        </LegalSection>

        <LegalSection id="bewertungen" label="Google-Bewertungen">
          <p>
            Die auf der Startseite angezeigte Sternebewertung und Bewertungsanzahl rufen wir serverseitig über
            die Google Places API ab. Dabei wird keine Verbindung von deinem Browser zu Google aufgebaut — es
            handelt sich um eine reine Server-zu-Server-Abfrage öffentlich einsehbarer Kennzahlen unseres
            Google-Maps-Eintrags, ohne dass dabei personenbezogene Daten von dir verarbeitet werden.
          </p>
        </LegalSection>

        <LegalSection id="email" label="E-Mail-Versand">
          <p>
            Für automatische E-Mails (Eingangsbestätigung bei einer Anfrage, interne Benachrichtigung an unser
            Team) nutzen wir den Versanddienst <strong>Resend</strong> (Resend, Inc., USA). Verarbeitet werden
            dabei Empfänger-E-Mail-Adresse, Name und der Inhalt der jeweiligen Nachricht, ausschließlich für den
            Versandvorgang selbst (Art. 6 Abs. 1 lit. b und f DSGVO). Als US-Anbieter ist eine Datenübermittlung
            in die USA möglich; Resend verpflichtet sich vertraglich auf ein angemessenes Schutzniveau.
          </p>
        </LegalSection>

        <LegalSection id="schriftarten" label="Schriftarten">
          <p>
            Diese Website nutzt die Schriftart „Poppins“ ausschließlich selbst gehostet, ausgeliefert von
            unserem eigenen Server. Es findet keine Verbindung zu Google Fonts, deren Servern (fonts.googleapis.com,
            fonts.gstatic.com) oder anderen externen Schriftarten-Anbietern statt.
          </p>
        </LegalSection>

        <LegalSection id="videos" label="Videos">
          <p>
            Alle Videos auf dieser Website (u. a. Imagefilm, Trainingsclips) sind lokale Videodateien, die direkt
            von unserem Server ausgeliefert werden — es handelt sich um keine YouTube-, TikTok- oder
            Instagram-Einbettungen. Mit Ausnahme des stummgeschalteten Hintergrundvideos im Startbereich starten
            alle Videos erst, wenn du aktiv auf „Abspielen“ klickst; vorher wird nur ein Vorschaubild geladen,
            und es findet keine Verbindung zu einem externen Video-Anbieter statt.
          </p>
        </LegalSection>

        <LegalSection id="rechner" label="Ziel-Kompass & Kalorienrechner">
          <p>
            Der Gesundheits- und Kalorienrechner auf der öffentlichen Website läuft vollständig lokal in deinem
            Browser. Deine Eingaben (z. B. Alter, Größe, Gewicht) werden nicht gespeichert und nicht an einen
            Server übertragen. Die Ergebnisse ersetzen keine medizinische Beratung.
          </p>
        </LegalSection>

        <LegalSection id="analyse" label="Analyse & Tracking">
          <p>
            Wir setzen aktuell <strong>kein</strong> Analyse- oder Marketingwerkzeug ein — insbesondere keine
            Google Analytics, kein Vercel Analytics/Speed Insights, keinen Meta-Pixel und keinen TikTok-Pixel.
            Sollte sich das künftig ändern, wird der jeweilige Dienst hier ergänzt und läuft — wie im
            Cookie-Banner vorgesehen — erst nach deiner Zustimmung in der Kategorie „Statistik“ bzw.
            „Marketing“.
          </p>
        </LegalSection>

        <LegalSection id="rechte" label="Deine Rechte">
          <p>Du hast im Rahmen der gesetzlichen Vorgaben das Recht auf:</p>
          <ul>
            <li>Auskunft über die von uns verarbeiteten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p>
            Für Mitgliederportal-Daten stehen dir Export und Kontolöschung direkt unter „Profil“ zur Verfügung;
            für alles andere genügt eine Nachricht an {contact.email}.
          </p>
        </LegalSection>

        <LegalSection id="aufsicht" label="Aufsichtsbehörde">
          <p>
            Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für
            unseren Sitz in Baden-Württemberg ist:
          </p>
          <p>
            Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (LfDI)
            <br />
            <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noreferrer">
              www.baden-wuerttemberg.datenschutz.de
            </a>
          </p>
        </LegalSection>

        <div className="mt-8 rounded-2xl border border-paper/10 bg-anthracite p-5 text-sm text-paper/60">
          <p className="font-display text-xs uppercase tracking-wide text-paper/40">Zur Beachtung</p>
          <p className="mt-2">
            Diese Erklärung wurde strukturiert anhand der tatsächlich eingesetzten Dienste erstellt, ersetzt
            aber keine rechtliche Prüfung durch eine sachkundige Stelle. Insbesondere die Aufbewahrungsfrist für
            Anfragen (siehe „Kontaktformular“) sollte konkret festgelegt werden.
          </p>
        </div>

        <LegalConfirmationNotice />

        <p className="mt-8 text-xs text-paper/30">
          Diese Seite bezieht ihre Diensteliste aus einer zentralen Konfiguration ({privacyServices.length}{" "}
          erfasste Dienste) — Details je Dienst (Empfänger, Region, Speicherdauer) liegen den obenstehenden
          Abschnitten zugrunde.
        </p>
      </LegalPageShell>
    </>
  );
}
