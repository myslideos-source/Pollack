# Content-Migration — Alte Website → Relaunch

## Wichtiger Vorbehalt

Diese Tabelle wurde **nicht** durch einen automatisierten Crawl von `sportpark-pollack.de`
erstellt — der Netzwerkzugriff auf die Domain ist in dieser Build-Umgebung durch eine
Organisationsrichtlinie blockiert (siehe README.md, MEDIA_AUDIT.md). Die Spalte „Vorhandene
Inhalte (laut Auftrag)" gibt deshalb wieder, was der Auftraggeber in den beiden Aufgabenstellungen
dieses Chats explizit als Inhalt der jeweiligen Altseite beschrieben hat — nicht, was tatsächlich
wortwörtlich auf der alten Seite stand. Es wurde nichts über diese Angaben hinaus erfunden.

Original-Bildmaterial **von der alten Website** konnte weiterhin nicht eingebaut werden (Zugriff
blockiert, die hochgeladene ZIP war zu groß für den Chat-Upload). Der Auftraggeber hat
stattdessen in zwei Lieferungen neun echte Fotos direkt im Chat bereitgestellt (Hero-/
Beratungsszene, Fitness ×2, FIVE-Bereich, Kinderkarate, Solarium, Hardcore Area, Gruppenfoto) —
diese sind bereits eingebaut, siehe Tabelle unten und MEDIA_AUDIT.md (inkl. der Anmerkung zum
Hero-Bild-Wechsel). Für alle übrigen Bildflächen (Milon, InBody, Karate, Selbstverteidigung,
Massage, Yoga, Jürgen Pollack im Porträt, MORE Nutrition/ESN) zeigt die Seite weiterhin die
abstrakte `TexturePanel`-Platzhalterkomponente. Sobald weiteres Material vorliegt, richtet sich
der Einbau nach der Checkliste in MEDIA_AUDIT.md.

## Migrationstabelle

| Alte Unterseite | Vorhandene Inhalte (laut Auftrag) | Neue Zielseite | Übernommene Informationen | Verwendete Bilder | Verwendete Videos | Überarbeiteter Status | Offene Angaben |
|---|---|---|---|---|---|---|---|
| `/` | Startseite mit Claim, Kernangeboten, Kennzahlen | `/` | Claim „Stark. Beweglich. Bereit.", alle Kennzahlen (1.200 m², 6 Zonen, 40+ Parkplätze, seit 1987), Zielauswahl, alle Programmbereiche, Partner (Hansefit, MORE/ESN), Öffnungszeiten- und Kontaktvorschau | Hero: Frau am Kabelzug (art-direktionierter Mobile-/Desktop-Crop); Trainingswelten und Gallery zeigen zusätzlich Hardcore-Area-, FIVE-, Kinderkarate-, Fitness-, Solarium- und Gruppenfoto | Keine (Hero-Video-Slot vorbereitet, kein echtes Video verfügbar) | Vollständig neu strukturiert, 16 Abschnitte gemäß Vorgabe | Hero-Video |
| `/preise` | Tarife: Monatsbeitrag, Schülerpreis, Getränkeflat, Aufnahme-/Servicepauschale, Winterpaket, Schnuppermonat, Zehnerkarte, InBody, Selbstverteidigung, Personaltraining, Sondertarife, Öffnungszeiten | `/preise` | Alle genannten Tarifkategorien als Karten übernommen (als „Preis auf Anfrage", da keine Zahlen bestätigt); Öffnungszeiten-Tabelle eingebettet; Hansefit-Hinweis | Keine | Keine | Neu strukturiert, um falsche/unklare Zuordnung der Altseite zu vermeiden | Alle konkreten Preise, Feiertagsregelung im Detail (siehe TODO_CLIENT.md) |
| `/more-und-esn` | MORE Nutrition- und ESN-Produkte, Produktbilder, Produktvideo | `/partner-produkte` (Redirect von `/more-und-esn` und `/regeneration/more-nutrition-esn`) | Editorial-Bereich mit MORE-Nutrition- und ESN-Sektion, „bei uns im Sportpark erhältlich"-Hinweis, kein Online-Verkauf | Keine (Produktbilder pending) | Keine (Produktvideo pending) | Sprachlich komplett neu geschrieben, gekürzt, in Du-Ansprache, kein 1:1-Kopieren der Altseite | Echte Produktbilder und Produktvideo (Upload durch Auftraggeber erforderlich) |
| `/Programm/Probetraining` | Infos zum Probetraining | `/training/probetraining` | Ablauf, unverbindlicher Charakter, Terminvereinbarung per Telefon/WhatsApp | Keine | Keine | Neu geschrieben | — |
| `/programm/fitness` | Fitness/Krafttraining: Kraftaufbau, Muskelaufbau, Kondition, Gewichtsreduktion, Vitalität, Technogym, Plate-Loaded | `/training/fitness` | Alle genannten Trainingsziele, Technogym- und Plate-Loaded-Erwähnung, Zielgruppen (Anfänger bis erfahrene Athleten) | Foto: Frau am Kabelzug (`fitness-frau.webp`) | Keine | Deutlich erweitert (Faktenleiste ergänzt) | Weitere Fotos der Trainingsfläche; `/training/technogym` nutzt zusätzlich `fitness-mann.webp` |
| `/programm/milon` | Milon-Zirkel: geführtes Zirkeltraining, Kraft/Ausdauer, gelenkschonend, zeitsparend, Alters-/Leistungsgruppen, Betreuung | `/gesundheit/milon` | Alle genannten Punkte vollständig übernommen | Keine | Keine | Erweitert | Gerätefotos |
| `/programm/five` | FIVE: Rücken-/Gelenkkonzept, Beweglichkeit, Muskel-/Fasziensystem, geführte Rückwärtsbewegungen, neuer Gesundheitsbereich ca. 60 m² | `/gesundheit/five` | Alle genannten Punkte übernommen, Größenangabe (~60 m², ab Erweiterung 2026) ergänzt, Heilversprechen bewusst vermieden | Foto: FIVE-Bereich mit Bambus-/Mooswand und Kaminfeuer-Optik (`five-bambus-moos.webp`) — exakte Übereinstimmung mit der beschriebenen Erweiterungs-Atmosphäre, auch auf der Erweiterung-2026-Sektion der Startseite verwendet | Keine | Erweitert, seriöser formuliert | Weitere Fotos aus dem Trainingsbetrieb (Geräte in Nutzung) |
| `/programm/inbody` | InBody 270: Körperfett, Muskel-Fett-Analyse, Wasserhaushalt, Viszeralfett, Protein-/Mineralgehalt, Grundumsatz, Zielgewicht, Beratung, Mitglieder-/Nichtmitgliederpreis | `/gesundheit/inbody` | Alle genannten Analysewerte übernommen; Zitat „Ein Online-Rechner kann deinen Bedarf schätzen. InBody zeigt genauer, wie sich dein Körper zusammensetzt." ergänzt; Verlinkung zum Ziel-Kompass-Rechner | Keine | Keine | Deutlich erweitert (Faktenleiste, Zitat) | Mitglieder-/Nichtmitgliederpreis |
| `/programm/karate` | Karate: Anfänger/Fortgeschrittene, Kondition, Kraft, Schnelligkeit, Beweglichkeit, Konzentration, Respekt, Jürgen-Pollack-Erfahrung, 2. DAN, 200+ Lehrgänge, Boxen/Kickboxen/Krav Maga/Bodenkampf/Kyusho | `/kampfkunst/karate` | Alle genannten Trainingsinhalte und Jürgen-Pollack-Qualifikationen übernommen; Hinweis auf kommendes Kickboxen-Angebot (Erweiterung 2026) auf der Kampfkunst-Übersicht ergänzt | Keine | Keine | Deutlich erweitert | Trainingsfotos |
| `/programm/kinderkarate` | Kinderkarate: Mindestalter, Selbstvertrauen, Selbstbehauptung, Grenzen, Schulweg/Pausenhof, Disziplin, Respekt | `/kampfkunst/kinderkarate` | Alle genannten pädagogischen Ziele übernommen, bewusst ohne Angstmache formuliert | Foto: Kind beim Kick gegen ein Kickschild (`kinderkarate.webp`) — Modellfreigabe für dieses Foto noch ausstehend, siehe TODO_CLIENT.md #2 | Keine | Deutlich erweitert | Genaues Mindestalter; schriftliche Modellfreigabe |
| `/programm/selbstverteidigung` | Grundlagenkurs, Aufbaukurs, Kursdauer, Zielgruppen, Gefahrenerkennung, Stimme/Körpersprache, Flucht, Stressdrills, Personaltraining, Kursgebühren | `/kampfkunst/selbstverteidigung` | Grundlagen-/Aufbaukurs-Struktur, alle genannten Trainingsinhalte, Personaltraining-Hinweis übernommen; keine Kriminalstatistiken/reißerische Aussagen verwendet | Keine | Keine | Deutlich erweitert | Kursdauer, Zielgruppen-Details, Kursgebühren |
| `/programm/massage` | brainLight-Regenerationssystem, Massagesessel, individuelle Programme (Licht/Ton), Hydrojet, eigener Massageraum | `/regeneration/massage` | brainLight, individuell wählbare Programme, eigener Massageraum übernommen; keine medizinischen Wirkversprechen | Keine | Keine | Erweitert, vorsichtiger formuliert | Ob Hydrojet aktuell (unabhängig von der Erweiterung 2026) bereits im Angebot ist |
| `/programm/yoga` | NINYASA Yoga, Trainerin Nina, Atemübungen, Meditation, Yogastile, Kinderyoga, Kurstage/Uhrzeiten, Kontaktdaten | `/regeneration/yoga` | NINYASA-Marke, Nina als Trainerin, Atemübungen/Meditation/Yogastile, Kinderyoga-Angebot übernommen | Keine | Keine | Deutlich erweitert | Kurstage, Uhrzeiten, Altersgruppe Kinderyoga, direkte Kontaktdaten von Nina |
| `/solarium` | Ergoline-Solarium, UV-/Rotlicht, Hauttypenanalyse, ab 18, UV-Schutzbrille, Sicherheitshinweise | `/regeneration/solarium` | Alle Sicherheitshinweise vollständig übernommen, als FAQ-Akkordeon aufbereitet statt Fließtext | Foto: Ergoline-Solarium mit blauer Beleuchtung (`solarium.webp`) — exakte Übereinstimmung mit der Beschreibung | Keine | Neu strukturiert (Akkordeon) | — |
| `/ueberuns` | Studio-Geschichte, familiengeführt, Jürgen Pollack: Inhaber/Geschäftsführer, seit 1987, Fitness/Bodybuilding/Reha-Erfahrung, C-/B-Trainer, Vital Coach, Ernährungsberater, FIVE Basic Coach, Selbstverteidigungslehrer, Gewaltschutztrainer, Karate 2. DAN, UVSV-Fachkraft | `/ueber-uns` | Vollständige Studio-Story plus alle genannten Qualifikationen; großer Storytelling-Bereich statt kleiner Mitarbeiterkarte | Keine | Keine (Bild-/Video-Slot vorbereitet) | Deutlich erweitert (3 Story-Absätze statt 1) | Porträtfoto/Video von Jürgen Pollack |
| `/kontakt` | Adresse, Telefon, E-Mail, WhatsApp, Anfahrt, Kontaktformular | `/kontakt` | Alle Kontaktdaten, Anfahrtskarte (consent-gated), Kontaktformular, Öffnungszeiten | Keine | Keine | Erweitert (zusätzlich jetzt auch auf der Startseite verkürzt vorhanden) | — |
| `/impressum` | Pflichtangaben | `/impressum` | Struktur nach § 5 TMG aufgebaut, vorhandene Kontaktdaten übernommen | Keine | Keine | Strukturiert neu aufgebaut, nicht juristisch geprüft | USt-ID, Rechtsform, Verbraucherschlichtung (siehe TODO_CLIENT.md) |
| `/datenschutzerklärung` | Datenschutzhinweise | `/datenschutz` | Struktur nach DSGVO-Standardgliederung, tatsächlich eingesetzte Dienste (Schriften, Kontaktformular, Karte, WhatsApp, Ziel-Kompass) korrekt beschrieben | Keine | Keine | Strukturiert neu aufgebaut, nicht juristisch geprüft | Hosting-Anbieter, allgemeine juristische Prüfung |

## Neue Seiten ohne direkte alte Entsprechung

| Neue Seite | Grund |
|---|---|
| `/training`, `/gesundheit`, `/kampfkunst`, `/regeneration` | Neue Kategorie-Übersichtsseiten zur Bündelung der bisherigen Einzel-Programmseiten |
| `/training/technogym`, `/training/plate-loaded` | Aus dem Fitness-Inhalt der Altseite herausgelöst, da eigenständig relevant für SEO und Nutzerführung. `/training/plate-loaded` zeigt das „Hardcore Area"-Foto (`hardcore-area.webp`), exakte Übereinstimmung mit der Beschreibung |
| `/gesundheit` (mit Ziel-Kompass-Rechner) | Neuer interaktiver Gesundheitsrechner, den es auf der Altseite laut Auftrag nicht gab |
| `/trainingsfinder` | Neues 4-Fragen-Tool, das es auf der Altseite laut Auftrag nicht gab |
| `/partner-produkte` | Neue eigenständige Partnerseite (Hansefit, MORE Nutrition, ESN) gemäß Vorgabe |

## Sichtbare Endkontrolle

| Prüfpunkt | Status |
|---|---|
| Sind Hansefit, MORE Nutrition und ESN auf der Startseite? | ✅ Abschnitte 9 (`PartnerHansefit`) und 10 (`MoreNutritionEsnTeaser`) in `src/app/page.tsx` |
| Haben MORE und ESN einen eigenen Produktbereich? | ✅ `/partner-produkte` |
| Wurden die vorhandenen Produktbilder verwendet? | ❌ Nicht möglich — keine Produktbilder verfügbar (Zugriff blockiert, ZIP zu groß). Dokumentiert in MEDIA_AUDIT.md/TODO_CLIENT.md |
| Wurde das vorhandene Produktvideo eingebunden? | ❌ Nicht möglich — aus demselben Grund |
| Sind Fitness, Milon, FIVE und InBody ausreichend erklärt? | ✅ Deutlich erweiterte Programmtexte mit Faktenleisten |
| Sind Karate, Kinderkarate und Selbstverteidigung vollständig enthalten? | ✅ Inklusive Grundlagen-/Aufbaukurs-Struktur und Jürgen-Pollack-Hintergrund |
| Sind Massage, Yoga und Solarium enthalten? | ✅ Inklusive NINYASA/Nina, Solarium-Sicherheits-Akkordeon |
| Ist Jürgen Pollack mit Qualifikationen und Geschichte enthalten? | ✅ Großer Storytelling-Bereich auf Startseite und `/ueber-uns`, 14 Qualifikationen |
| Sind Öffnungszeiten und Preise enthalten? | ✅ Eigene Startseiten-Sektion, `/preise`, Footer — Werte selbst als unbestätigter Platzhalter markiert (siehe TODO_CLIENT.md) |
| Sind sämtliche Kontaktdaten vorhanden? | ✅ Telefon, WhatsApp, E-Mail, Adresse — auf Startseite, `/kontakt`, Footer |
| Wurden keine Fakten, Preise, Bewertungen oder Partner erfunden? | ✅ Alle Preise „Preis auf Anfrage"; keine Bewertungen/Mitgliederzahlen; Partner (Hansefit, MORE, ESN) nur mit den vom Auftraggeber genannten Fakten beschrieben |
| Funktionieren alle Verlinkungen und Buttons? | ✅ Build, Lint und interne Link-Stichprobe fehlerfrei (siehe QA-Abschnitt in TODO_CLIENT.md-Update) |
