# Media Audit — Sportpark Pollack Relaunch

## Warum dieser Audit anders aussieht als gefordert

Der Auftrag verlangt einen automatisierten Medien-Audit der bestehenden Website
(`sportpark-pollack.de`): alle `img`/`srcset`/`picture`/`video`/`poster`/CSS-Hintergründe
crawlen, Originale in höchster Auflösung herunterladen, Duplikate per Hash entfernen, als
WebP/AVIF optimieren und auf der neuen Seite wiederverwenden.

**Das konnte in dieser Build-Umgebung nicht durchgeführt werden.** Jeder Versuch,
`www.sportpark-pollack.de` zu erreichen — per `WebFetch`-Tool und per direktem `curl` —
wurde vom Netzwerk-Egress-Proxy der Umgebung mit `EGRESS_BLOCKED` bzw. HTTP 403
abgewiesen (Organisationsrichtlinie, nicht umgehbar und laut Vorgabe nicht zu umgehen).
Damit war weder das Crawlen der ~18 im Auftrag gelisteten Unterseiten noch der Download der
genannten ca. 12 Videos oder der Fotos möglich. Ein zweiter Versuch — den Zugriff erneut zu
prüfen sowie testweise über das Internet Archive (`web.archive.org`) auf eine historische Kopie
zuzugreifen — bestätigte, dass es sich um eine generelle Egress-Policy dieser Umgebung handelt
(nur eine kleine Allowlist wie npm/GitHub/Google Fonts ist erreichbar), nicht um eine gezielte
Sperre nur dieser Domain.

**Update:** Der Auftraggeber hat angeboten, eine ZIP-Datei mit allen Originalbildern
bereitzustellen. Der Upload ist am Datei-Größenlimit des Chats gescheitert. Empfohlener nächster
Schritt: die ZIP in kleinere, nach Bereich aufgeteilte Pakete zerlegen (z. B. `hero.zip`,
`fitness.zip`, `kampfkunst.zip`, `pollack.zip`, `more-esn.zip`) oder einzelne Bilder direkt als
Chat-Anhänge hochladen. Priorität siehe TODO_CLIENT.md Punkt 1.

Geprüft und erreichbar waren dagegen: `fonts.googleapis.com` / `fonts.gstatic.com` (→ Schriften
konnten reell heruntergeladen und selbst gehostet werden) sowie `registry.npmjs.org` /
`github.com` (→ normales Next.js-Tooling funktioniert).

## Was tatsächlich verwendet wurde

| Datei | Quelle | Verwendung | Status |
|---|---|---|---|
| `public/logo/sportpark-pollack-logo.webp` | Vom Nutzer im Chat hochgeladenes Logo-Bild | Footer, generell als Farbversion verfügbar | ✅ verarbeitet (Hintergrund entfernt, zugeschnitten, WebP) |
| `public/logo/sportpark-pollack-logo-white.webp` | Wie oben, in Weiß umgewandelt | Header (auf dunklem Grund) | ✅ verarbeitet |
| `public/logo/sportpark-pollack-logo.png` | Wie oben | Fallback/Referenz | ✅ |
| `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/icon-512.png` | Aus dem „SP“-Icon-Ausschnitt des Logos generiert | Browser-Tab-Icon, Homescreen-Icon | ✅ |

Das ursprünglich zweite hochgeladene Bild (Hero-Mockup/Referenzscreenshot mit „STARK. BEWEGLICH.
BEREIT.“) wurde **nicht** als Asset in die Website übernommen — es diente als kreative Referenz
für Ton, Layout und Farbgebung, ist aber ein Mockup/Screenshot und kein für die Veröffentlichung
freigegebenes Produktfoto.

### Zweite Lieferung: fünf echte Fotos (per Chat hochgeladen)

Der Auftraggeber hat fünf reale Aufnahmen aus dem Sportpark direkt im Chat bereitgestellt (nach
dem gescheiterten ZIP-Upload, siehe oben). Alle wurden verarbeitet (WebP, verlustbehaftete
Kompression ~82–84 %, keine Größenänderung außer beim Hero-Crop) und eingebaut:

| Datei | Motiv | Verwendung | Status |
|---|---|---|---|
| `public/media/hero/hero-desktop.webp` | Trainer bespricht mit einer Kundin den Trainingsplan (Weitwinkel) | Gallery „Studio“-Kachel (nicht mehr Hero, siehe dritte Lieferung unten) | ✅ optimiert, unverändert zugeschnitten |
| `public/media/hero/hero-mobile.webp` | Dieselbe Aufnahme, Hochformat-Ausschnitt auf beide Gesichter | Ungenutzt seit dem Hero-Wechsel (Datei bleibt erhalten, falls später wieder gebraucht) | ✅ eigens für Mobile zugeschnitten |
| `public/media/training/fitness-frau.webp` | Frau am Kabelzug (Rückenansicht) | Hero-Hintergrund (≥ 640px), `/training/fitness`, ProgramGrid-Karte „Fitness“ | ✅ optimiert, unverändert — jetzt Hero-Bild, siehe dritte Lieferung |
| `public/media/training/fitness-mann.webp` | Mann an geführtem Kraftgerät (Klimmzug-/Latzug-Maschine) | `/training/technogym`, Gallery „Fitness“-Kachel | ✅ optimiert, unverändert |
| `public/media/gesundheit/five-bambus-moos.webp` | FIVE-Bereich mit Bambuswand, Mooswand und Kaminfeuer-Optik | `/gesundheit/five`, Trainingswelten „Rücken & Beweglichkeit“, Erweiterung-2026-Sektion, Gallery „Gesundheit“-Kachel | ✅ optimiert, unverändert — exakte Übereinstimmung mit der im Auftrag beschriebenen Erweiterungs-Atmosphäre |
| `public/media/kampfkunst/kinderkarate.webp` | Kind trainiert Kick gegen ein „Lil' Dragon“-Kickschild | `/kampfkunst/kinderkarate`, Trainingswelten „Kampfkunst & Selbstvertrauen“, Gallery „Kampfkunst“-Kachel | ✅ optimiert, unverändert |

### Dritte Lieferung: vier weitere Fotos — Hero ausgetauscht

Der Auftraggeber hat vier weitere Fotos hochgeladen und dabei ausdrücklich gebeten, das letzte
davon (Frau am Kabelzug, Rückenansicht) als neues Hero-Bild zu verwenden. Ein Bildvergleich
(Pixel-Diff) hat bestätigt: Dieses Foto ist **identisch** mit dem bereits aus der zweiten
Lieferung eingebauten `fitness-frau.webp` — also keine neue Datei, sondern ein erneuter Upload
desselben Motivs. Entsprechend wurde `fitness-frau.webp` zum Hero-Bild gemacht (mit einem neuen,
eigens für dieses Motiv erzeugten Mobile-Crop) und das bisherige Hero-Foto (Trainer + Kundin)
auf die Gallery-Kachel „Studio“ verschoben, wo es weiterhin sichtbar bleibt.

| Datei | Motiv | Verwendung | Status |
|---|---|---|---|
| `public/media/hero/hero2-desktop.webp` | = `fitness-frau.webp`, volle Breite | Hero-Hintergrund (≥ 640px) | ✅ optimiert, unverändert zugeschnitten |
| `public/media/hero/hero2-mobile.webp` | Dieselbe Aufnahme, Hochformat-Ausschnitt auf die Person | Hero-Hintergrund (< 640px, per `<picture>`-`source`) | ✅ eigens für Mobile zugeschnitten |
| `public/media/regeneration/solarium.webp` | Ergoline-Solarium mit blauer Beleuchtung, Strand-Wandmotiv | `/regeneration/solarium`, Gallery „Regeneration“-Kachel | ✅ optimiert, unverändert — exakte Übereinstimmung mit der Solarium-Beschreibung (UV-/Rotlicht-Gerät) |
| `public/media/training/hardcore-area.webp` | Kraftraum mit Plate-Loaded-Geräten, roter LED-Akzentbeleuchtung | `/training/plate-loaded`, Trainingswelten „Kraft & Performance“, Gallery „Studio“-Kachel (Hintergrund-Kontext) | ✅ optimiert, unverändert — exakte Übereinstimmung mit der „Hardcore Area“-Beschreibung |
| `public/media/community/team-gruppe.webp` | Drei Personen (Trainer und zwei Mitglieder/Trainer) im Kraftraum | Gallery „Community“-Kachel | ✅ optimiert, unverändert — **Personen werden namentlich nicht identifiziert**, siehe TODO_CLIENT.md #2 |

**Hinweis zur mittleren Person auf dem Gruppenfoto:** Der Mann in der Bildmitte hat dieselbe
Statur/Frisur wie die Person auf dem ursprünglichen Hero-Foto (Trainer-Kunden-Beratung). Es liegt
nahe, dass es sich um Jürgen Pollack handelt, das wurde vom Auftraggeber aber nicht ausdrücklich
bestätigt. Um niemanden falsch zu benennen, wird auf der Website **keine Identität behauptet** —
weder hier noch im „Über uns“-Bereich. Falls dies tatsächlich Jürgen Pollack ist, bitte bestätigen
(siehe TODO_CLIENT.md), dann verschieben wir das Foto in den persönlichen Jürgen-Pollack-Bereich
auf der Startseite und `/ueber-uns` statt in die allgemeine Gallery.

**Wichtig — Nutzungsrechte weiterhin ungeklärt:** Diese Fotos wurden vom Auftraggeber selbst
bereitgestellt, aber eine ausdrückliche schriftliche Bestätigung der Nutzungsrechte (inkl. Rechte
an den abgebildeten Personen — Modellfreigabe für das Kind auf dem Kinderkarate-Foto ist hier
besonders relevant) steht noch aus. Siehe TODO_CLIENT.md Punkt 2. Die Fotos sind bereits
technisch eingebaut, damit der Fortschritt sichtbar ist — vor einem echten Go-Live muss Punkt 2
aber zwingend bestätigt werden.

**Hero-Crop für Mobile:** Das Originalfoto ist mit 1916×821 px sehr breit (~2,3:1). Für
Telefone wurde ein eigener Hochformat-Ausschnitt (820×1000 px, ~4:5) erzeugt, der auf beide
Gesichter zentriert ist, statt das breite Bild nur per CSS zu beschneiden. `Hero.tsx` liefert
beide Versionen über ein natives `<picture>`-Element mit `media`-Query aus — der Browser lädt
pro Endgerät nur die passende Datei (verifiziert: Mobile lädt ausschließlich `hero-mobile.webp`,
Desktop ausschließlich `hero-desktop.webp`, nie beide).

## Wo weiterhin echte Fotos/Videos fehlen

Trotz der fünf neuen Fotos fehlen weiterhin:

- Ein Hero-**Video** (aktuell zeigt der Hero ein Standbild, technisch aber vollständig für ein
  Video vorbereitet, siehe unten)
- Bilder/Videos zu Milon, InBody, Karate (Erwachsene), Selbstverteidigung, Massage/brainLight,
  Yoga (Nina), Solarium, Jürgen Pollack im Porträt, MORE Nutrition & ESN (inkl. Produktvideo)
- Fotos für die Gallery-Kacheln „Community“ und „Regeneration“
- Das offizielle Hansefit-Logo (im Partnerbereich auf der Startseite und auf
  `/partner-produkte` aktuell durch einen Text-Schriftzug ersetzt, siehe TODO_CLIENT.md Punkt 15)

**Für alle noch fehlenden Motive gilt weiterhin:** Anstatt neue Stock-Fotos zu verwenden (was der
Auftrag explizit ausschließt) oder Platzhalter zu bauen, die wie echte Fotos aussehen und damit
täuschen könnten, rendert dort weiterhin die bewusst abstrakte `TexturePanel`-Komponente
(`src/components/shared/TexturePanel.tsx`) — ein markenkonsistenter Gradient/Grid-Hintergrund
per CSS/SVG, kein Foto, keine Irreführung.

Die neue `MediaPanel`-Komponente (`src/components/shared/MediaPanel.tsx`) kapselt dieses
Verhalten: Sie zeigt automatisch das echte Foto, sobald eines im jeweiligen Content-Eintrag
hinterlegt ist, und fällt sonst auf `TexturePanel` zurück — genau dieser Mechanismus hat jetzt
die fünf neuen Fotos ohne Layout-Änderungen eingebaut.

## Video

`src/content/media.ts` definiert weiterhin die zentrale Medien-Registry für Hero und Galerie —
jetzt mit den fünf echten Fotos befüllt, das Video-Feld bleibt `null`:

```ts
export const heroMedia = {
  videoSrc: null,
  videoSrcWebm: null,
  posterSrc: null,
  imageDesktopSrc: "/media/hero/hero-desktop.webp",
  imageMobileSrc: "/media/hero/hero-mobile.webp",
  imageAlt: "…",
};
export const galleryItems: GalleryItem[] = [ /* 4 Einträge mit echten Fotos */ ];
```

Die `Hero`-Komponente (`src/components/home/Hero.tsx`) ist weiterhin vollständig für ein echtes
Video vorbereitet und nutzt es automatisch, sobald `videoSrc` gesetzt ist: `autoPlay muted loop
playsInline preload="metadata"`, Poster-Fallback, ein sichtbarer Ton-an/aus-Schalter,
`motion-reduce:hidden` für `prefers-reduced-motion`. Bis dahin zeigt sie das art-direktionierte
Foto (Desktop-/Mobile-Crop) über ein natives `<picture>`-Element.

## Sobald weiteres Material vorliegt — Checkliste für den nächsten Schritt

1. Nutzungsrechte für jedes Foto/Video schriftlich bestätigen (siehe TODO_CLIENT.md) — auch
   rückwirkend für die fünf bereits eingebauten Fotos.
2. Dateien in Originalauflösung ablegen, Duplikate per Hash entfernen.
3. Für Web als WebP/AVIF (Bilder) bzw. H.264 MP4 + Poster-JPG (Videos) exportieren.
4. Pfade in `src/content/media.ts` (`heroMedia.videoSrc`/`galleryItems`) bzw. direkt im
   jeweiligen Content-Eintrag (`Program.image` in `src/content/programs.ts`) eintragen.
5. Damit übernimmt `MediaPanel` (`src/components/shared/MediaPanel.tsx`) automatisch die
   Anzeige des echten Fotos anstelle von `TexturePanel` — keine Komponentenänderung nötig, das
   ist bereits an jeder relevanten Stelle so verdrahtet (ProgramGrid, ProgramDetail/PageHero,
   TrainingWorlds, Expansion2026, Gallery).
6. Alt-Texte pro Bild ergänzen (bereits für alle fünf neuen Fotos vergeben, siehe Tabelle oben).
