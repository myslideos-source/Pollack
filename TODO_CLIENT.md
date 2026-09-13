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

## 2. Nutzungsrechte für Fotos & Videos

Sobald echtes Bild-/Videomaterial bereitgestellt wird: Bitte schriftlich bestätigen, dass die
Nutzungsrechte für die Verwendung auf der neuen Website vorliegen (inkl. Rechte an abgebildeten
Personen/Mitgliedern, Musik in Videos, Marken Dritter wie Technogym/Milon/FIVE/InBody-Logos).
Ohne diese Bestätigung sollten keine personenbezogenen Aufnahmen veröffentlicht werden.

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

Im Auftrag als „sofern auf der aktuellen Seite weiterhin bestätigt" markiert. Da die
Bestandsseite nicht eingesehen werden konnte, wurde dieser Programmpunkt **nicht** in die neue
Regeneration-Seite aufgenommen. Bitte bestätigen, ob das Hydrojet weiterhin angeboten wird —
dann ergänzen wir es in `src/content/programs.ts`.

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
