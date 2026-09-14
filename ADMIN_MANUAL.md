# Admin-Bereich — kurze Anleitung

Diese Anleitung richtet sich an alle, die den Admin-Bereich unter `/admin` benutzen, um Anfragen
zu bearbeiten oder Inhalte auf der Website zu pflegen. Für die technische Einrichtung (Supabase,
Umgebungsvariablen, ersten Zugang anlegen) siehe SUPABASE_SETUP.md.

## Anmelden

Unter `www.sportpark-pollack.de/admin` mit der eigenen E-Mail-Adresse und dem Passwort anmelden.
Passwort vergessen → „Passwort vergessen" auf der Login-Seite, ein Link wird per E-Mail
zugeschickt. Es gibt **keine öffentliche Registrierung** — neue Zugänge werden ausschließlich von
einem Admin unter „Benutzer" eingeladen.

Es gibt zwei Rollen:

- **Admin**: voller Zugriff, inklusive Benutzerverwaltung und Einstellungen.
- **Redakteur**: Zugriff auf Anfragen, Termine und alle Inhalte — **nicht** auf Benutzer und
  Einstellungen.

## Dashboard

Zeigt auf einen Blick: neue Anfragen, anstehende Probetrainings, offene Rückrufe, zuletzt
bearbeitete Inhalte und ob es unveröffentlichte Änderungen gibt. Über die Kacheln geht es direkt
zum jeweiligen Bereich.

## Anfragen

Jede Anfrage über das Kontaktformular (inkl. Probetraining-Anfragen) landet automatisch hier —
mit Name, Kontaktdaten, gewünschtem Bereich, Nachricht und Status. Möglich sind: Suchen/Filtern,
als gelesen markieren, interne Notizen hinzufügen, Status ändern (Neu → Gelesen → In Bearbeitung
→ Rückruf geplant → Termin vereinbart → Erledigt/Abgesagt), einen Rückruftermin setzen, direkt
einen Termin daraus anlegen, als Spam markieren, archivieren, als CSV exportieren oder — für
DSGVO-Löschanfragen — vollständig und unwiderruflich löschen.

## Termine

Alle aus Anfragen erzeugten Termine sowie manuell angelegte, mit Status (geplant/bestätigt/
abgesagt/wahrgenommen).

## Website bearbeiten

Hier werden die editierbaren Abschnitte der Startseite und der Trainingsbereiche
(Fitness, Technogym, Plate-Loaded, Milon, FIVE, Körperanalyse, Karate, Kinderkarate,
Selbstverteidigung, Yoga, Regeneration) bearbeitet — Text, Bilder/Videos, Leistungslisten,
Sichtbarkeit und Reihenfolge.

**Wichtig: Entwurf und Veröffentlichen.** Jede Änderung wird zunächst nur als **Entwurf**
gespeichert — auf der echten Website ändert sich noch nichts. Erst der Klick auf
**„Veröffentlichen"** oben rechts (in der oberen Leiste, auf jeder Admin-Seite sichtbar) macht
alle offenen Entwürfe gleichzeitig live. Über „Vorschau" lässt sich der Entwurfsstand vorab genau
so ansehen, wie er nach dem Veröffentlichen aussehen würde — sichtbar nur für angemeldete
Mitarbeitende, nie für normale Besucher:innen. Ein Entwurf lässt sich jederzeit verwerfen, und die
zuletzt veröffentlichte Version eines Bereichs lässt sich mit einem Klick wiederherstellen.

## Bilder & Videos

Zentrale Medienbibliothek. Dateien hochladen (JPEG, PNG, WebP, AVIF, MP4, MOV — max. 100 MB),
Titel/Alt-Text/Bereich vergeben, danach überall im Inhaltseditor über „Aus Medienbibliothek
wählen" wiederverwenden. Nicht verwendete Dateien werden mit einem Hinweis markiert.

## Angebote & Preise

Mitgliedschaften, Probetraining-Angebote, Aktionen und Einmalzahlungen mit Titel, Beschreibung,
Leistungen, Preis bzw. Preishinweis, Gültigkeitszeitraum und „Empfohlen"-Kennzeichnung. Nur
veröffentlichte Angebote erscheinen auf `/preise` und in der Startseiten-Vorschau.

## Öffnungszeiten

Reguläre Wochenzeiten (mit optionaler zweiter Zeitspanne pro Tag, z. B. Mittagspause) sowie
Feiertage und temporäre Sonderöffnungszeiten. Der „Jetzt geöffnet"-Status auf der Website wird
automatisch aus diesen Angaben berechnet — es muss nirgends manuell nachgetragen werden, ob
gerade geöffnet ist.

## Partner & Produkte

Kooperationspartner (z. B. Hansefit) und Produkte (z. B. MORE Nutrition, ESN) mit Logo/Bild,
Beschreibung, Link und Sichtbarkeit. Es gibt bewusst keine Verkaufs- oder Bezahlfunktion — nur
eine Übersicht für Besucher:innen.

## Team

Trainer:innen-Profile inklusive des Inhaber-Profils von Jürgen Pollack — Foto, Position,
Beschreibung, Qualifikationen, Schwerpunkte, Kontakt.

## Benutzer (nur Admin)

Neue Zugänge per E-Mail-Einladung anlegen (Rolle Admin oder Redakteur), bestehende Rollen ändern,
Zugänge entfernen. Der eigene Zugang lässt sich weder in der Rolle ändern noch löschen.

## Änderungsverlauf

Nachvollziehbare Liste aller Änderungen — wer hat wann was geändert, inklusive
Veröffentlichungen. Über „Website bearbeiten" lässt sich die zuletzt veröffentlichte Version
eines Bereichs jederzeit wiederherstellen.

## Einstellungen (nur Admin)

Die Benachrichtigungs-E-Mail-Adresse, an die bei jeder neuen Anfrage eine Benachrichtigung geht.
