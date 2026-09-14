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
„Community" eingebaut.

**Update 4:** Vier weitere Dateien wurden hochgeladen: zwei davon waren erneute Uploads des
Solarium- und Hardcore-Area-Fotos (laut Bildvergleich, nicht erneut verarbeitet), zwei waren neu
(Karate-Porträt, MORE-Nutrition-Produktregal) und eine war das **erste Video** — ein 12-Sekunden-
Kampfsport-Trainingsclip, der für `/kampfkunst/karate` aufbereitet wurde (siehe MEDIA_AUDIT.md).

**Update 5:** Der Versuch, den „Sportpark Imagefilm 2025" über einen vom Auftraggeber
bereitgestellten direkten Download-Link herunterzuladen, ist am selben Netzwerk-Egress-Problem
wie Punkt 1 gescheitert (die Video-CDN-Domain `vid-cdn.website-editor.net` ist ebenfalls blockiert,
403 am Egress-Proxy) — das bestätigt: Es handelt sich um eine generelle Netzwerkrichtlinie dieser
Umgebung, nicht um eine Sperre nur einzelner Domains. Als Konsequenz wurde eine dauerhafte Lösung
gebaut, siehe Punkt 1a.

## 1a. Neu: interne Upload-Seite unter `/admin/upload`

Damit künftige Uploads nicht mehr am Chat-Größenlimit scheitern, gibt es jetzt eine
passwortgeschützte Upload-Seite direkt auf der Website (`/admin/upload`), die Dateien per
GitHub-API direkt in dieses Repository committet. **Bevor sie benutzt werden kann, muss der
Auftraggeber zwei Dinge selbst einrichten** (kann von Claude aus dieser Umgebung nicht erzeugt
werden):

1. **Ein GitHub Personal Access Token erstellen** (GitHub → Settings → Developer settings →
   Fine-grained tokens → „Generate new token", Repository-Zugriff nur auf `Pollack`, Berechtigung
   „Contents: Read and write"). Dieses Token als Umgebungsvariable `GITHUB_TOKEN` beim Hosting
   (z. B. Vercel-Projekteinstellungen) hinterlegen.
2. **Ein eigenes Upload-Passwort festlegen** und als Umgebungsvariable `ADMIN_UPLOAD_PASSWORD`
   setzen. Aktuell ist testweise `Sportpark2026!Pollack` als Platzhalter hinterlegt (vom
   Auftraggeber im Chat als Platzhalter bestätigt) — **bitte vor dem Go-Live durch ein eigenes,
   sicheres Passwort ersetzen**, sonst kann jede Person mit diesem Passwort Dateien in das
   Repository committen.

Details, Grenzen (u. a. Datei-Größenlimits je nach Hosting-Anbieter) und der genaue Ablauf stehen
in README.md unter „Medien-Upload für den Auftraggeber". Wichtig: Der Upload sortiert Dateien nur
in den gewählten Bereichsordner ein — wo genau eine Datei danach auf der Seite erscheint, bleibt
eine bewusste Entscheidung und wird erst nach einer kurzen Rückmeldung im Chat eingebaut, nicht
automatisch.

**Getestet:** Die Passwortprüfung und die Anfrageverarbeitung wurden erfolgreich getestet. Der
eigentliche GitHub-Commit-Schritt wurde mit dem sitzungsinternen Zugangstoken dieser
Build-Umgebung angetestet — das ist technisch kein für die GitHub-REST-API gültiges Token (der
Commit schlug dadurch erwartungsgemäß mit „Bad credentials" fehl), bestätigt aber, dass Pfad,
Anfrageformat und die Verbindung zu GitHub korrekt funktionieren. Der vollständige End-to-End-Test
ist erst mit einem echten, vom Auftraggeber erstellten Token möglich.

Für alles Weitere gilt weiterhin: entweder (a) die ZIP in kleinere Pakete aufteilen (z. B. pro
Bereich: `milon.zip`, `inbody.zip`, `selbstverteidigung.zip`, `massage.zip`, `yoga.zip`,
`more-esn-produktvideo.zip`, `hansefit-logo.zip`), (b) weitere einzelne Dateien direkt als
Chat-Anhänge hochladen, oder (c) sobald `/admin/upload` eingerichtet ist, direkt darüber
hochladen — das umgeht das Chat-Größenlimit vollständig.

## 2. Nutzungsrechte für Fotos & Videos

**Betrifft jetzt alle elf bereits eingebauten Fotos und das eine eingebaute Video**, nicht nur
zukünftiges Material: Bitte schriftlich bestätigen, dass die Nutzungsrechte für die Verwendung
auf der neuen Website vorliegen — insbesondere:

- die Rechte an den abgebildeten Personen (Modellfreigabe), **besonders für das Kind auf dem
  Kinderkarate-Foto** (`public/media/kampfkunst/kinderkarate.webp`), das aktuell bereits live auf
  `/kampfkunst`, `/kampfkunst/kinderkarate` und der Startseite zu sehen ist,
- die Rechte an den erwachsenen Personen auf dem bisherigen Hero-/Beratungsfoto (jetzt Gallery
  „Studio"), auf den beiden Kabelzug-/Kraftgerät-Fotos, auf dem Gruppenfoto mit drei Personen
  (Gallery „Community"), auf dem Karate-Porträt (`/kampfkunst/karate`) sowie an den **zwei
  Personen im neuen Karate-Trainingsvideo** (`public/media/video/karate.mp4`),
- bei künftigem Material zusätzlich: Musik in Videos, Marken Dritter wie Technogym/Milon/FIVE/
  InBody-Logos, sowie die auf dem Solarium-Foto sichtbare Strand-Wandtapete (Fremddesign an der
  Wand, keine Sportpark-eigene Gestaltung — falls das eine Rolle spielt).

Ohne diese Bestätigung sollten die bereits eingebauten personenbezogenen Aufnahmen und das Video
**vor einem echten Go-Live** noch einmal geprüft werden.

## 2a. Identität der Person auf Gruppenfoto, Hero und Karate-Porträt

Drei verschiedene Aufnahmen (Gruppenfoto `team-gruppe.webp`, das ursprüngliche Hero-/
Beratungsfoto, und jetzt auch das Karate-Porträt `karate-portrait.webp`) zeigen erkennbar
dieselbe Person — Statur, Frisur und Gesichtszüge stimmen überein. Es liegt nahe, dass es sich um
**Jürgen Pollack** handelt (das Karate-Porträt passt besonders gut zu seiner im Auftrag
genannten Qualifikation „Karate 2. DAN"). Das wurde bisher nicht ausdrücklich bestätigt, daher
wird auf der Website aktuell **keine Identität behauptet** (weder Name noch Rolle zu den
abgebildeten Personen). Bitte bestätigen: Ist das Jürgen Pollack, und wer sind die beiden
anderen Personen auf dem Gruppenfoto (Mitglieder, Trainer:innen, Familie)? Falls bestätigt,
verschieben wir das Karate-Porträt und/oder das Gruppenfoto gezielt in den persönlichen
Jürgen-Pollack-Bereich auf der Startseite und `/ueber-uns`, statt sie nur neutral auf den
jeweiligen Fachseiten bzw. in der Gallery zu zeigen.

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

**Update:** Auf Wunsch des Auftraggebers („Öffnungszeiten bitte übernehmen so wie auf Google")
sind jetzt konkrete Zeiten in `src/content/hours.ts` hinterlegt und `hoursConfirmed = true`
gesetzt — der Live-Status im Header, Footer und auf der Kontaktseite rechnet damit jetzt
tatsächlich „Jetzt geöffnet"/„Geschlossen".

| Tag | Zeiten |
|---|---|
| Montag | 08:30–12:30, 14:30–22:00 |
| Dienstag | 08:30–12:30, 14:30–21:00 |
| Mittwoch | 14:30–22:00 |
| Donnerstag | 08:30–12:30, 14:30–22:00 |
| Freitag | 08:30–12:30, 14:30–21:00 |
| Samstag | 08:30–14:00 |
| Sonntag | 10:00–13:00 |

**Wichtige Einschränkung:** Ein direkter Zugriff auf den Google-Business-Profil-Eintrag war aus
dieser Umgebung nicht möglich (dieselbe Netzwerk-Restriktion wie bei sportpark-pollack.de, siehe
Punkt 1). Die obigen Werte stammen aus einer Websuche, die über mehrere unabhängige
Verzeichnis-Einträge (Cylex, 11880, Yelp u. a. — meist selbst vom Google-Business-Profil
gespeist) übereinstimmend bestätigt wurden, sind also mit hoher Wahrscheinlichkeit korrekt, aber
**nicht per Screenshot aus dem eigenen Google-Profil verifiziert**. Bitte einmal kurz gegen die
eigene Google-Maps-Ansicht gegenchecken, bevor die Seite live geht — und eventuelle reguläre
Feiertagsregelungen mitteilen (aktuell zeigt die Seite dazu nur den generischen Hinweis „An
Feiertagen können abweichende Öffnungszeiten gelten").

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

Instagram/Facebook im Auftrag nicht genannt und daher nicht verlinkt. Bitte mitteilen, ob und
welche Profile verlinkt werden sollen. Google-Bewertungen sind jetzt eingebunden — siehe Punkt 18.

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

## 15. Hansefit — genaue Konditionen

Das offizielle Hansefit-Logo ist inzwischen hinterlegt (`public/media/partner/hansefit-logo.webp`,
eingebunden auf der Startseite und auf `/partner-produkte`). Weiterhin offen: Gelten für
Hansefit-Mitglieder bei uns besondere Einschränkungen (Zeiten, Bereiche), die auf der Seite
erwähnt werden sollten? Aktuell wird bewusst nichts über die vom Auftraggeber genannte
Kernaussage („Hansefit-Mitglieder können bei uns trainieren") hinaus behauptet.

## 16. MORE Nutrition & ESN — Produktbilder und Produktvideo

`/partner-produkte` und der Startseiten-Teaser (`src/components/home/MoreNutritionEsnTeaser.tsx`)
zeigen jetzt das Aufmacherfoto und das Christian-Wolf-Regalvideo (siehe Punkt 17). Für die zwei
einzelnen Produktbild-Kacheln („MORE Nutrition", „ESN") fehlen weiterhin eigene Fotos — bis dahin
zeigen sie TexturePanel-Platzhalter.

## 17. Christian Wolf — Video-Shoutout: Repost-Bestätigung ausstehend

Die zwei neuen Videos (`public/media/video/christian-wolf-shoutout.mp4` und
`public/media/video/christian-wolf-more-nutrition.mp4`) sind Screen-Recordings von
Instagram/TikTok-Story-Content des Fitness-Content-Creators **Christian Wolf** (`@christian.wolf`),
der den Sportpark besucht und dort ein Shoutout gedreht hat. Sie wurden uns direkt vom
Auftraggeber übergeben, nicht von Christian Wolf selbst.

Das ist rechtlich ein anderer Fall als die eigenen Studiofotos: Hier geht es um fremden Content
(Bild, Stimme, Marke „Christian Wolf") eines Dritten, der öffentlich auf Social Media gepostet
wurde. Ein öffentlicher Shoutout-Post ist in der Regel als Einverständnis zur Erwähnung gedacht,
deckt aber nicht automatisch einen **Repost auf einer fremden Website** ab. Bitte vor dem
Go-Live entweder

- eine kurze Freigabe von Christian Wolf einholen (z. B. per DM/E-Mail: „Dürfen wir deinen
  Shoutout-Clip auf unserer Website zeigen?"), oder
- die Videos durch ein Standbild/Zitat ersetzen, falls keine Rückmeldung kommt.

Beide Videos sind bereits mit Namen, Handle (`@christian.wolf`) und Plattform (TikTok &
Instagram) als Quelle gekennzeichnet (`src/content/community.ts`,
`src/components/home/CommunityShoutout.tsx`), das ersetzt aber keine echte Freigabe.

## 18. Google-Bewertungen: jetzt mit echten Zahlen und echten Zitaten bestätigt

Auf Wunsch des Auftraggebers eingebaut: ein Sterne-Badge unter den Trust-Stats auf der
Startseite sowie im Footer, beide mit Link zur echten Google-Maps-Seite des Sportparks
(`src/content/reviews.ts`, funktioniert ohne Place-ID über Googles offizielles
`maps/search`-URL-Format — Besucher:innen landen direkt beim echten Eintrag und können dort
selbst eine Bewertung lesen/abgeben). Zusätzlich als `aggregateRating` im strukturierten
Daten-Markup (`src/app/layout.tsx`) hinterlegt. Darunter läuft jetzt außerdem ein
Kachel-Karussell mit sieben echten Rezensionszitaten nach links (`GoogleReviewsBadge.tsx`,
pausiert bei Hover, zeigt bei `prefers-reduced-motion` eine statische, umbrechende Reihe statt
der Endlos-Animation).

**Update:** Der Auftraggeber hat **4,9 von 5 Sternen bei 56 Bewertungen** per Screenshot direkt
aus dem eigenen Google-Maps-Profil bestätigt (ersetzt den vorherigen, nur über Websuche
cross-referenzierten Platzhalterwert von 5,0/6). Ebenso sieben Rezensionszitate (Ulrich
Vigenschow, Benjamin Blumenstock, Thomas Hercher, Tobias Müller, Danny Müller, Adrian sowie eine
Rezension ohne im Screenshot sichtbaren Namen, dort als „Google-Nutzer" ausgewiesen) — echte, vom
Auftraggeber per Screenshot übergebene Google-Rezensionen. Laut Auftraggeber gibt es noch mehr
Bewertungen als die sieben gezeigten (56 insgesamt) — bei Bedarf gerne weitere Screenshots
schicken, dann werden sie in `src/content/reviews.ts` (Array `reviews`) ergänzt; das Karussell
übernimmt neue Einträge automatisch, ohne Komponentenänderung.
