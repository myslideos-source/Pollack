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

Das zweite hochgeladene Bild (Hero-Mockup/Referenzscreenshot mit „STARK. BEWEGLICH. BEREIT.“)
wurde **nicht** als Asset in die Website übernommen — es diente als kreative Referenz für Ton,
Layout und Farbgebung, ist aber ein Mockup/Screenshot und kein für die Veröffentlichung
freigegebenes Produktfoto.

## Wo eigentlich echte Fotos/Videos stehen müssten

Alle in Abschnitt 4 des Auftrags genannten Medienarten fehlen komplett:

- Hero-Imagefilm (Startseite)
- Bilder/Videos zu Fitness, Milon, FIVE, Karate, Selbstverteidigung, Jürgen Pollack/Über uns,
  MORE Nutrition & ESN (inkl. des vorhandenen Produktvideos)
- Sämtliche Programmfotos, Studio-Aufnahmen, Team-/Trainerfotos
- Das offizielle Hansefit-Logo (im neuen Partnerbereich auf der Startseite und auf
  `/partner-produkte` aktuell durch einen Text-Schriftzug ersetzt, siehe TODO_CLIENT.md Punkt 15)

**Anstatt neue Stock-Fotos zu verwenden (was der Auftrag explizit ausschließt) oder Platzhalter
zu bauen, die wie echte Fotos aussehen und damit täuschen könnten, wurde eine bewusst
abstrakte Platzhalterfläche gebaut:** die `TexturePanel`-Komponente
(`src/components/shared/TexturePanel.tsx`). Sie erzeugt pro Themenbereich (Performance,
Health, Kampfkunst, Regeneration, Community) einen markenkonsistenten Gradient/Grid-Hintergrund
per CSS/SVG — kein Foto, keine Datei, kein Download nötig, aber auch keine Irreführung.

Jede Stelle, an der im Konzept ein echtes Foto oder Video vorgesehen ist (Hero, Trainingswelten,
Jürgen-Pollack-Feature, Gallery, Programmkarten), rendert aktuell ein `TexturePanel`.

## Video

`src/content/media.ts` definiert die zentrale Medien-Registry für Hero-Video und Galerie:

```ts
export const heroMedia = {
  videoSrc: null,
  videoSrcWebm: null,
  posterSrc: null,
};
export const galleryItems: GalleryItem[] = [];
```

Die `Hero`-Komponente (`src/components/home/Hero.tsx`) ist bereits vollständig für ein echtes
Video vorbereitet: `autoPlay muted loop playsInline preload="metadata"`, Poster-Fallback, ein
sichtbarer Ton-an/aus-Schalter, `motion-reduce:hidden` für `prefers-reduced-motion`
(zeigt dann automatisch nur das Poster/TexturePanel). Sobald echte Dateien vorliegen, genügt es,
sie unter `public/media/...` abzulegen und die Pfade in `media.ts` einzutragen — keine
Komponentenänderung nötig.

## Sobald echtes Material vorliegt — Checkliste für den nächsten Schritt

1. Nutzungsrechte für jedes Foto/Video schriftlich bestätigen (siehe TODO_CLIENT.md).
2. Dateien in Originalauflösung ablegen, Duplikate per Hash entfernen.
3. Für Web als WebP/AVIF (Bilder) bzw. H.264 MP4 + Poster-JPG (Videos) exportieren.
4. Pfade in `src/content/media.ts` (`heroMedia`, `galleryItems`) eintragen.
5. `TexturePanel`-Aufrufe an den entsprechenden Stellen durch echte `<Image>`/`<video>`
   ersetzen (die Komponenten sind so geschnitten, dass das lokal, Datei für Datei, möglich ist).
6. Alt-Texte pro Bild ergänzen (aktuell nur für Logo/Icons vergeben, da keine weiteren Bilder
   existieren).
