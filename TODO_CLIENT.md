# Offene Punkte für den Auftraggeber (Sportpark Pollack)

Diese Liste enthält ausschließlich Punkte, die eine Entscheidung oder Bestätigung durch den
Auftraggeber brauchen — keine technischen Aufgaben. Ohne die Punkte 1–4 sollte die Seite
**nicht live geschaltet** werden, weil sonst falsche Preise/Zeiten/rechtliche Angaben öffentlich
stehen würden.

## 1. Netzwerkzugriff auf die Live-Website war blockiert — größte Einschränkung dieses Relaunches

Diese Build-Umgebung konnte `sportpark-pollack.de` nicht erreichen (Organisationsrichtlinie
blockiert den Zugriff, HTTP 403 am Egress-Proxy). Dadurch fehlen:

- der geforderte automatisierte Medien-Audit der Bestandsseite,
- der Download aller echten Fotos und der ca. 12 Videos,
- die Übernahme der exakten alten Texte/Struktur als Referenz.

**Nächster Schritt:** Entweder (a) diese Aufgabe in einer Umgebung mit Zugriff auf die Domain
fortsetzen, oder (b) uns die Original-Mediendateien (Fotos, Videos, ggf. ein Export der
Bestandsseite) direkt zur Verfügung stellen. Danach kann Abschnitt 4 des ursprünglichen Auftrags
(Medien-Audit, Download, Einbau) nachgeholt werden — die technische Architektur dafür steht
bereits (`src/content/media.ts`, siehe MEDIA_AUDIT.md).

**Update 1:** Ein Versuch, die Original-Bilder per ZIP-Upload im Chat bereitzustellen, ist am
Datei-Upload-Limit gescheitert (ZIP zu groß).

**Update 2:** Der Auftraggeber hat daraufhin fünf einzelne Fotos direkt im Chat hochgeladen
(Trainer-Beratungsszene, Frau am Kabelzug, Mann an Kraftgerät, FIVE-Bereich mit Bambus/Moos,
Kind beim Kinderkarate). Diese fünf sind eingebaut (siehe MEDIA_AUDIT.md).

**Update 3:** Vier weitere Fotos wurden hochgeladen (Solarium, Gruppenfoto mit drei Personen,
Kraftraum/„Hardcore Area", nochmals die Frau am Kabelzug — laut Bildvergleich identisch mit
einem bereits vorhandenen Foto). Auf ausdrücklichen Wunsch ist die Frau am Kabelzug jetzt das
Hero-Bild; die anderen drei sind bei Solarium, Plate-Loaded/Hardcore Area und der Gallery-Kachel
„Community" eingebaut. Für alles Weitere gilt weiterhin: entweder (a) die ZIP in kleinere Pakete
aufteilen (z. B. pro Bereich: `milon.zip`, `inbody.zip`, `karate.zip`, `selbstverteidigung.zip`,
`massage.zip`, `yoga.zip`, `pollack-portrait.zip`, `more-esn.zip`, `hansefit-logo.zip`) oder
(b) weitere einzelne Bilder direkt als Chat-Anhänge hochladen.

## 2. Nutzungsrechte für Fotos & Videos

**Betrifft jetzt alle neun bereits eingebauten Fotos**, nicht nur zukünftiges Material: Bitte
schriftlich bestätigen, dass die Nutzungsrechte für die Verwendung auf der neuen Website
vorliegen — insbesondere:

- die Rechte an den abgebildeten Personen (Modellfreigabe), **besonders für das Kind auf dem
  Kinderkarate-Foto** (`public/media/kampfkunst/kinderkarate.webp`), das aktuell bereits live auf
  `/kampfkunst`, `/kampfkunst/kinderkarate` und der Startseite zu sehen ist,
- die Rechte an den erwachsenen Personen auf dem bisherigen Hero-/Beratungsfoto (jetzt Gallery
  „Studio"), auf den beiden Kabelzug-/Kraftgerät-Fotos und auf dem Gruppenfoto mit drei Personen
  (Gallery „Community"),
- bei künftigem Material zusätzlich: Musik in Videos, Marken Dritter wie Technogym/Milon/FIVE/
  InBody-Logos.

Ohne diese Bestätigung sollten die bereits eingebauten personenbezogenen Aufnahmen **vor einem
echten Go-Live** noch einmal geprüft werden.

## 2a. Identität der mittleren Person auf dem Gruppenfoto (Gallery „Community")

Der Mann in der Bildmitte des Gruppenfotos (`public/media/community/team-gruppe.webp`) hat
dieselbe Statur/Frisur wie die Person auf dem ursprünglichen Hero-/Beratungsfoto — es liegt nahe,
dass es sich um **Jürgen Pollack** handelt. Das wurde bisher nicht ausdrücklich bestätigt, daher
wird auf der Website aktuell **keine Identität behauptet** (weder Name noch Rolle zu den
abgebildeten Personen). Bitte bestätigen: Ist das Jürgen Pollack, und wer sind die beiden
anderen Personen (Mitglieder, Trainer:innen, Familie)? Falls gewünscht, verschieben wir dieses
Foto danach gezielt in den persönlichen Jürgen-Pollack-Bereich auf der Startseite und
`/ueber-uns` statt der aktuell neutralen Gallery-Kachel „Community".

## 3. Preise

**Alle Preise auf der neuen Seite zeigen aktuell „Preis auf Anfrage"** (`src/content/pricing.ts`,
`priceConfirmed: false`). Keine der im Auftrag genannten Zahlen konnte verifiziert werden, weil
die bestehende Preisseite nicht zugänglich war. Bitte für jede Position die aktuellen,
verbindlichen Werte liefern:

- Monatsbeitrag (inkl. Laufzeit/Kündigungsfrist)
- Schülerpreis
- Schnuppermonat
- Winterpaket
- Zehnerkarte
- InBody-Analyse (Einzeltermin)
- Selbstverteidigungskurse
- Personaltraining
- Getränkeflat
- Aufnahme- und Servicepauschale
- Sondertarife (z. B. Paare/Familien/Firmen) — welche gibt es konkret, und zu welchen Konditionen?

## 4. Öffnungszeiten

`src/content/hours.ts` enthält aktuell einen **unbestätigten Platzhalter**
(`hoursConfirmed = false`), damit die Seite niemals einen falschen „Jetzt geöffnet"/„Geschlossen"-
Status anzeigt — stattdessen erscheint überall „Öffnungszeiten prüfen". Bitte die tatsächlichen,
aktuellen Öffnungszeiten (Mo–So, inkl. eventueller Mittagspausen) sowie ggf. reguläre
Feiertagsregelungen mitteilen. Danach genügt es, `openingHours` in `src/content/hours.ts`
anzupassen und `hoursConfirmed` auf `true` zu setzen — der Rest (Live-Status im Header, Footer,
Kontaktseite) aktualisiert sich automatisch.

## 5. Erweiterung 2026 — Umsetzungsstand

Die Bestandsseite spricht laut Auftrag von „Ab Juli 2026". Es konnte nicht geprüft werden, ob
die Erweiterung (zusätzliche 150 m², neue Technogym Plate-Loaded Maschinen, FIVE-Zentrum,
größere Kampfsport-Area, Massageraum Deluxe, Chillout-Lounge) inzwischen abgeschlossen ist. Die
neue Seite formuliert deshalb bewusst zurückhaltend „Erweiterung ab Juli 2026", nicht „Neu seit
2026". Bitte mitteilen, ob die Erweiterung fertiggestellt ist — dann passen wir Formulierung und
Bildmaterial entsprechend an (`src/components/home/Expansion2026.tsx`).

## 6. Hydrojet-Massageliege

Als Teil der Erweiterung 2026 (Massageraum Deluxe) ist das Hydrojet bereits in
`src/content/expansion.ts` als geplante Ergänzung aufgeführt. Unklar ist aber, ob es **schon
heute**, unabhängig von der Erweiterung, im laufenden Betrieb zur Verfügung steht — im Auftrag
als „sofern aktuell bestätigt" markiert. Deshalb taucht es auf der aktuellen
`/regeneration/massage`-Seite als bestehendes Angebot noch nicht auf. Bitte bestätigen, ob es
schon jetzt nutzbar ist — dann ergänzen wir es in `src/content/programs.ts`.

## 7. Rechtstexte (Impressum & Datenschutzerklärung)

Impressum und Datenschutzerklärung wurden **strukturiert neu aufgebaut** (Pflichtangaben nach
§ 5 TMG bzw. DSGVO-Standardgliederung), aber **nicht von einer sachkundigen Stelle geprüft**.
Offene Punkte:

- Umsatzsteuer-Identifikationsnummer (fehlt aktuell komplett)
- Handelsregistereintrag/Rechtsform, falls zutreffend (Einzelunternehmen vs. andere Rechtsform)
- Endgültige Formulierung zur Verbraucherschlichtung (§ 36 VSBG)
- Konkreter Hosting-Anbieter für den Datenschutz-Abschnitt „Hosting & Server-Logfiles", sobald
  das finale Deployment-Ziel feststeht
- Allgemeine juristische Prüfung beider Seiten vor Veröffentlichung

## 8. Standort-Koordinaten

Die in `src/content/site.ts` hinterlegten Koordinaten (`lat`/`lng`) für die Anfahrtskarte sind
eine ungefähre Schätzung anhand der Adresse und **nicht vermessen bestätigt**. Für Produktion
bitte die exakten Koordinaten prüfen oder die statische Karte/den Google-Maps-Link stichprobenhaft
testen.

## 9. Kontaktformular ohne Backend

Es ist aktuell kein Formular-Anbieter (z. B. Formspree, Netlify Forms, eigenes Backend)
konfiguriert. Das Formular auf `/kontakt` öffnet stattdessen das lokale E-Mail-Programm des
Besuchers mit vorausgefüllter Nachricht (`mailto:`) — funktioniert ohne weitere Einrichtung,
ist aber kein „echtes" serverseitiges Formular. Telefon, WhatsApp und E-Mail sind vollständig
funktionsfähig. Falls ein klassisches Formular gewünscht ist: bitte Anbieter/Endpoint nennen,
dann wird `src/components/shared/ContactForm.tsx` entsprechend angebunden.

## 10. Social-Media- und Bewertungs-Links

Im Auftrag nicht genannt und daher nicht ergänzt (z. B. Instagram/Facebook, Google-Bewertungen).
Bitte mitteilen, ob und welche Profile verlinkt werden sollen.

## 11. Kinderkarate — Mindestalter

`src/content/programs.ts` (Slug `kinderkarate`) markiert das genaue Mindestalter für den
Einstieg als offen. Bitte das aktuelle Mindestalter mitteilen, damit es auf der Seite konkret
genannt werden kann.

## 12. Selbstverteidigung — Kursdauer, Zielgruppen, Kursgebühren

Grundlagen- und Aufbaukurs sind inhaltlich beschrieben (`src/content/programs.ts`, Slug
`selbstverteidigung`), aber die genaue Kursdauer, feinere Zielgruppen-Abgrenzung und die
aktuellen Kursgebühren fehlen. Kursgebühren erscheinen aktuell nur indirekt über die generelle
„Preis auf Anfrage"-Regelung auf `/preise`.

## 13. Yoga & Kinderyoga — Kurszeiten, Altersgruppe, Ninas Kontaktdaten

`src/content/about.ts` (`yogaTrainerin`) und `src/content/programs.ts` (Slug `yoga`) markieren
als offen: aktuelle Kurstage und Uhrzeiten, die Altersgruppe für Kinderyoga sowie direkte
Kontaktdaten von Nina, falls Anfragen nicht über die allgemeinen Sportpark-Kontaktdaten laufen
sollen. Da sich Kurszeiten häufiger ändern können, empfehlen wir, uns diese Angaben zentral
mitzuteilen, damit sie an einer Stelle (`src/content/programs.ts`) gepflegt werden.

## 14. InBody — Mitglieder- und Nichtmitgliederpreis

`src/content/programs.ts` (Slug `inbody`) markiert offen, ob und wie stark sich der Preis für
Mitglieder und Nichtmitglieder unterscheidet. Aktuell zeigt `/preise` dafür einheitlich „Preis
auf Anfrage".

## 15. Hansefit — Logo-Datei und genaue Konditionen

Der neue Hansefit-Partnerbereich auf der Startseite und auf `/partner-produkte`
(`src/components/home/PartnerHansefit.tsx`, `src/app/partner-produkte/page.tsx`) verwendet
aktuell **kein echtes Hansefit-Logo**, sondern einen Text-Schriftzug als Platzhalter — die
offizielle Logodatei liegt uns nicht vor. Bitte das offizielle Hansefit-Logo (Vektor- oder
hochauflösende PNG-Datei) sowie ggf. Hansefit-Markenrichtlinien zur Verfügung stellen. Zusätzlich
bestätigen: Gelten für Hansefit-Mitglieder bei uns besondere Einschränkungen (Zeiten, Bereiche),
die auf der Seite erwähnt werden sollten? Aktuell wird bewusst nichts über die vom Auftraggeber
genannte Kernaussage („Hansefit-Mitglieder können bei uns trainieren") hinaus behauptet.

## 16. MORE Nutrition & ESN — Produktbilder und Produktvideo

`/partner-produkte` und der Startseiten-Teaser (`src/components/home/MoreNutritionEsnTeaser.tsx`)
sind vollständig für echte Produktbilder und das vorhandene Produktvideo vorbereitet (Layout mit
Aufmacherbild, mehreren Produktbildern und einer Videofläche), zeigen aber aktuell nur
TexturePanel-Platzhalter, da uns die Original-Dateien noch nicht vorliegen (siehe Punkt 1).
