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

### Vierte Lieferung: zwei weitere Fotos + das erste Video

Der Auftraggeber hat vier weitere Dateien hochgeladen. Ein Bildvergleich (mittlerer Pixel-Diff,
da direkter Bytevergleich wegen erneuter WebP-Kompression nicht aussagekräftig ist) hat gezeigt:
Die ersten beiden Bilder sind **erneute Uploads der bereits vorhandenen Solarium- und
Hardcore-Area-Fotos** (Diff ≈ 2 von 255 — im Bereich normaler verlustbehafteter Kompression
desselben Bildes) und wurden deshalb nicht erneut verarbeitet. Die beiden übrigen Dateien sind
neu:

| Datei | Motiv | Verwendung | Status |
|---|---|---|---|
| `public/media/kampfkunst/karate-portrait.webp` | Person in rotem Karate-Gi, Kampfstellung, Spiegelreflexion, Boxsäcke im Hintergrund | `/kampfkunst/karate` | ✅ optimiert, unverändert — **Identität nicht bestätigt**, siehe Hinweis unten |
| `public/media/partner/more-nutrition.webp` | Gestapelte MORE-Nutrition-„Chunky"-Dosen im Regal, rote Akzentbeleuchtung | `/partner-produkte` (Aufmacherbild), Startseiten-Teaser „MORE Nutrition & ESN“ | ✅ optimiert, unverändert |

**Erstes echtes Video:** Der Auftraggeber hat außerdem ein 12-sekündiges Handyvideo (`.mov`,
1920×1080, mit Ton) von zwei Personen im Kampfsport-Training (Schlagtechniken gegen Kick-Pads)
bereitgestellt. Es wurde für das Web aufbereitet:

| Datei | Verarbeitung | Verwendung | Status |
|---|---|---|---|
| `public/media/video/karate.mp4` | Mit ffmpeg re-encodiert: auf 1280 px Breite skaliert, H.264 (CRF 23) + AAC-Audio, `faststart` für progressive Wiedergabe. Größe 7,2 MB → 3,9 MB | `/kampfkunst/karate` (neue `VideoPlayer`-Komponente) | ✅ verarbeitet |
| `public/media/video/karate-poster.webp` | Frame bei 3 s extrahiert, als WebP exportiert | Vorschaubild/Poster für dasselbe Video | ✅ verarbeitet |

Die neue `VideoPlayer`-Komponente (`src/components/shared/VideoPlayer.tsx`) lädt **kein einziges
Video-Byte**, bevor die Besucherin/der Besucher aktiv auf Play klickt — vor dem Klick steht nur
ein `<img>`-Poster mit Play-Button im DOM, kein `<video>`-Element. Das wurde per
Netzwerk-Request-Log verifiziert (0 Requests an `karate.mp4` vor dem Klick, 1 danach). Das
entspricht der Vorgabe „keine automatische Tonwiedergabe“ und „erst beim Öffnen … laden“ aus
dem ursprünglichen Auftrag.

**Hinweis zur Person auf dem Karate-Porträt:** Statur und Frisur entsprechen der Person auf dem
ursprünglichen Hero-Foto und dem Gruppenfoto — auch hier liegt Jürgen Pollack nahe, ist aber
nicht bestätigt. Auch dieses Foto wird deshalb ohne Namensnennung verwendet.

## Wo weiterhin echte Fotos/Videos fehlen

Fehlen weiterhin:

- Ein Hero-**Video** (aktuell zeigt der Hero ein Standbild, technisch aber vollständig für ein
  Video vorbereitet, siehe unten)
- Bilder/Videos zu Milon, InBody, Selbstverteidigung, Massage/brainLight, Yoga (Nina), Jürgen
  Pollack im Porträt (sofern das Karate-Foto nicht dafür bestätigt wird), ESN-Produktbild
- Fotos für die Gallery-Kachel „Community" ist jetzt belegt; kein offener Punkt mehr dort
- Das offizielle Hansefit-Logo ist jetzt hinterlegt (`public/media/partner/hansefit-logo.webp`,
  im Partnerbereich auf der Startseite und auf `/partner-produkte`); kein offener Punkt mehr dort

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

### Fünfte Lieferung: zwei Videos von Christian Wolf (Content-Creator, Besuch im Sportpark)

Der Auftraggeber hat zwei weitere Videos hochgeladen — beides Screen-Recordings von Instagram-/
TikTok-Story-Content des Fitness-Content-Creators **Christian Wolf** (`@christian.wolf`), der den
Sportpark besucht und dort ein Shoutout gedreht hat (Info vom Auftraggeber: „Christian Wolf war
im Sportpark"). Beide Quelldateien waren bereits vertikale 720×1280-Handyvideos mit Ton:

| Datei | Quelle | Inhalt | Verarbeitung | Verwendung |
|---|---|---|---|---|
| `public/media/video/christian-wolf-more-nutrition.mp4` (37,7 s, Original 3,8 MB → 4,6 MB nach Re-Encode) | `.mp4`-Upload | Screenshot des Sportpark-Instagram-Profils mit einem Reaktionsvideo von Christian Wolf, zeigt v. a. das reale MORE-Nutrition-Produktregal im Studio | Re-encodiert (H.264 CRF 24 + AAC 128k, `faststart`) | Produktvideo-Kachel im MORE-Nutrition-&-ESN-Bereich (Startseite + `/partner-produkte`) |
| `public/media/video/christian-wolf-shoutout.mp4` (98,4 s, Original 10,9 MB → 13,0 MB nach Re-Encode) | `.mov`-Upload | Christian Wolf spricht direkt in die Kamera im Sportpark-Trainingsbereich („Shoutout Sportpark pollack"), endet mit einem Foto von ihm mit einem Sportpark-Teammitglied | Re-encodiert (H.264 CRF 24 + AAC 128k, `faststart`) | Neue Startseiten-Sektion „Das sagt die Community" (`src/components/home/CommunityShoutout.tsx`), vertikale Video-Karte im Phone-Format |

Beide Poster-Frames wurden mit ffmpeg aus einem repräsentativen Moment extrahiert und als WebP
exportiert (`christian-wolf-more-nutrition-poster.webp`, `christian-wolf-shoutout-poster.webp`).
Die Videos laufen über dieselbe `VideoPlayer`-Komponente wie das Karate-Video — kein Video-Byte
lädt, bevor aktiv auf Play geklickt wird, kein automatischer Ton.

**Wichtiger Unterschied zu den bisherigen Fotos/Videos:** Das ist kein selbst produziertes
Sportpark-Material, sondern der Social-Media-Content eines Dritten (Christian Wolf), der uns vom
Auftraggeber weitergeleitet wurde. Beide Clips sind daher im UI sichtbar mit Name, Handle
(`@christian.wolf`) und Plattform gekennzeichnet — siehe **TODO_CLIENT.md Punkt 17** für den
offenen Punkt: eine ausdrückliche Repost-Freigabe von Christian Wolf liegt uns nicht vor und
sollte vor einem echten Go-Live eingeholt werden.

### Sechste Lieferung: der offizielle Sportpark-Imagefilm

Der Auftraggeber hat den professionell produzierten Sportpark-Imagefilm direkt als Datei
hochgeladen (nachdem der zuvor genannte externe CDN-Link wegen der Netzwerk-Restriktion dieser
Umgebung nicht erreichbar war, siehe TODO_CLIENT.md Punkt 1). Quelldatei: `.mov`, 1280×720,
81,6 s mit Ton, 23,9 MB — Drohnenaufnahme des Gebäudes, Interview-Ausschnitt, Motion-Graphics-
Kapitel zu Training/FIVE/Karate/Selbstverteidigung/Regeneration.

| Datei | Verarbeitung | Verwendung |
|---|---|---|
| `public/media/video/imagefilm.mp4` (81,6 s, 22,9 MB) | Re-encodiert: H.264 CRF 26 + AAC 112k, `faststart` | Vollständiger Film, lädt erst nach Klick auf Play |
| `public/media/video/imagefilm-teaser.mp4` (5 s, 505 KB, **ohne Ton**) | Ausschnitt 1,0–6,0 s (die Drohnen-Einstellung), auf 960 px Breite skaliert, H.264 CRF 30, kein Audiotrack | Stummer Ambient-Loop als Vorschau, bevor geklickt wird |
| `public/media/video/imagefilm-poster.webp` | Frame bei 3 s extrahiert, als WebP exportiert | Poster für beide Video-Elemente sowie `prefers-reduced-motion`-Fallback |

**Platzierung — neue Sektion direkt unter dem Hero:** `src/components/home/Imagefilm.tsx`, auf
der Startseite zwischen `Hero` und `TrustStats` eingebaut (`src/app/page.tsx`). Konzept: ein
großflächiger, dunkler Cinema-Ausschnitt mit dem stummen Drohnen-Loop als Ambient-Textur
(einzige Ausnahme neben dem Hero selbst, die automatisch abspielen darf — bewusst nur an dieser
prominenten Stelle direkt nach dem Hero), einem pulsierenden Play-Button (`animate-ping`, spielt
bewusst mit dem Marken-Motiv „Puls des Sportparks") und der Überschrift „Spür den Puls." Klick
lädt den vollständigen Film mit Ton und Steuerleiste nach — vorher wird kein Byte der 23-MB-Datei
angefragt (per Netzwerk-Request-Log verifiziert).

**Ein echter Bug wurde dabei gefunden und behoben:** Ohne einen expliziten `key`-Prop auf den
beiden `<video>`-Elementen (Vorschau-Loop vs. vollständiger Film) hat React beim Umschalten den
bestehenden DOM-Node wiederverwendet statt einen neuen zu erzeugen — der Browser lädt eine neue
`<source>` aber nicht automatisch nach, wenn nur das umgebende Element per DOM-Diffing
aktualisiert wird. Ergebnis: Nach Klick auf Play blieb `video.currentSrc` fälschlich auf der
Teaser-Datei stehen. Behoben durch `key="teaser"` / `key="full"` auf den beiden Video-Elementen
(erzwingt einen frischen DOM-Node) — per Netzwerk-Log verifiziert, dass nach dem Fix korrekt
`imagefilm.mp4` anstelle von `imagefilm-teaser.mp4` angefragt wird.

### Korrektur: Christian-Wolf-Regalvideo aus dem MORE-Nutrition-Grid entfernt, stattdessen Slider

Rückmeldung des Auftraggebers per Screenshot: Das Regal-Video
(`christian-wolf-more-nutrition.mp4`) wirkte im MORE-Nutrition-Grid „nicht schlau gewählt" — der
Grund war strukturell, nicht nur eine falsche Poster-Frame-Wahl. Beide Christian-Wolf-Clips sind
Hochformat-Aufnahmen (720×1280). Im MORE-Nutrition-Grid lief das Video aber in einer breiten
16:9- bzw. 4:3-Kachel mit `object-cover` — dadurch zeigte der sichtbare Ausschnitt *während der
gesamten Wiedergabe* (nicht nur im Standbild) durchgehend nur den mittleren Bildstreifen mit dem
„@ Christian Wolf"-Tag und einem abgeschnittenen Gesicht, nie das eigentliche Regal.

**Lösung:** Video aus dem MORE-Nutrition-Grid entfernt (Startseite + `/partner-produkte`), dort
wieder der ursprüngliche `TexturePanel`-Platzhalter „Produktvideo". Stattdessen zeigt die
Community-Sektion (`src/components/home/CommunityShoutout.tsx`) jetzt **beide** Clips als
Zwei-Tab-Slider im nativen Hochformat (kein Zuschnitt, `aspect-[9/16]`) — „Im Sportpark" (Talking-
Head-Shoutout) und „MORE-Nutrition-Regal" (Produktregal), umschaltbar per Klick, `key`-Prop pro
Clip setzt die Wiedergabe beim Wechsel zurück. `/partner-produkte` verlinkt jetzt stattdessen auf
`/#christian-wolf` mit dem Hinweistext „Video vom Regal-Besuch: auf der Startseite ansehen".

### Neues Foto: Jürgen-Pollack-Porträt (vom Auftraggeber als „Head Coach Bild" geliefert)

Professionelles Studio-Porträt (1122×1402, Halbtotale, verschränkte Arme, Kraftraum-Hintergrund
mit rotem Akzentlicht) ersetzt die bisherigen `TexturePanel`-Platzhalter an beiden Stellen, an
denen Jürgen Pollack redaktionell vorgestellt wird:

| Datei | Verwendung |
|---|---|
| `public/media/about/juergen-pollack-portrait.webp` (als WebP optimiert) | `PollackFeature.tsx` (Startseite) und `/ueber-uns` — beide über `MediaPanel` statt `TexturePanel`, gesteuert durch die neuen Felder `portraitSrc`/`portraitAlt` in `src/content/about.ts` |

Rollentext („Inhaber und Geschäftsführer") unverändert gelassen — die Bildunterschrift „Head
Coach" aus der Chat-Nachricht wurde nicht automatisch als neuer Rollentitel übernommen, da das
eine inhaltliche Entscheidung ist, keine reine Bildzuordnung. Falls „Head Coach" als offizieller
Titel neben oder anstelle von „Inhaber und Geschäftsführer" erscheinen soll, bitte kurz
bestätigen.
