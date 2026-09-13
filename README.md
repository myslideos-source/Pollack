# Sportpark Pollack — Website Relaunch

Premium-Relaunch der Website für den Sportpark Pollack (Fichtenau) — Next.js 16 (App Router),
TypeScript, Tailwind CSS v4, selbst gehostete Schriften, Motion (Framer Motion) für Animationen.

## Wichtiger Hinweis zu diesem Build

Dieses Projekt wurde in einer Umgebung erstellt, deren Netzwerkzugriff auf
`sportpark-pollack.de` von der Organisationsrichtlinie blockiert ist (403 am Egress-Proxy).
**Die geforderte Analyse/Crawling der bestehenden Live-Website und der Download ihrer
Bilder/Videos konnten deshalb nicht durchgeführt werden.** Alles, was hier steht, basiert auf:

- den Fakten, die im Auftrag selbst explizit genannt wurden (Adresse, Telefon, E-Mail,
  WhatsApp, Qualifikationen von Jürgen Pollack, Programmliste, Farbwerte, Seitenstruktur),
- den zwei mitgelieferten Referenzbildern (Logo, Hero-Mockup),
- sinnvollen, klar als vorläufig gekennzeichneten Platzhaltern überall dort, wo echte Daten
  (Preise, Öffnungszeiten, Fotos, Videos) nicht verifizierbar waren.

Siehe **TODO_CLIENT.md** für alles, was vor dem Go-Live noch vom Auftraggeber bestätigt werden
muss, und **MEDIA_AUDIT.md** für den Stand der Medien-Recherche.

## Schnellstart

```bash
npm install
npm run dev       # http://localhost:3000
```

## Weitere Befehle

```bash
npm run build      # Production Build (Next.js)
npm run start       # Production Server (nach build)
npm run lint         # ESLint
npx tsc --noEmit      # TypeScript-Prüfung
npm run test           # Vitest (Unit-Tests, u. a. Ziel-Kompass-Rechner)
```

Alle vier Prüfungen laufen aktuell fehlerfrei durch.

## Deployment

Das Projekt ist ein Standard-Next.js-App-Router-Projekt und Vercel-kompatibel
(`vercel deploy` bzw. Verbindung des Git-Repos mit Vercel genügt, keine Sonderkonfiguration
nötig). Node ≥ 20 wird empfohlen.

## Projektstruktur

```
src/
  app/                  Next.js App Router: Seiten, Layout, sitemap.ts, robots.ts
    training/           Übersicht + [slug]-Detailseiten
    gesundheit/          Übersicht (inkl. Ziel-Kompass-Rechner) + [slug]
    kampfkunst/           Übersicht + [slug]
    regeneration/          Übersicht + [slug] + more-nutrition-esn
    preise/ ueber-uns/ kontakt/ trainingsfinder/ impressum/ datenschutz/
  components/
    layout/              Header, Footer, mobile CTA-Leiste
    home/                 Startseiten-Sektionen (Hero, Trainingswelten, Gallery, …)
    shared/                Wiederverwendbare Bausteine (Button, PulseLine, TexturePanel, …)
    calculator/             Sportpark Ziel-Kompass (Gesundheitsrechner)
  content/                  Zentrale Inhalte als TypeScript-Dateien (site, hours, programs,
                              pricing, about, goals, categories, legacy-redirects, media)
  lib/                       Reine Logik: health-calculator.ts, training-finder.ts,
                              breadcrumb.ts, fonts.ts
  fonts/                     Selbst gehostete woff2-Dateien (Barlow Condensed, Manrope)
```

Inhalte zentral pflegen: Preise in `src/content/pricing.ts`, Öffnungszeiten in
`src/content/hours.ts`, Programme/Texte in `src/content/programs.ts`,
Kontaktdaten in `src/content/site.ts`. Keine dieser Angaben ist an mehreren Stellen dupliziert.

## Design-System — „Der Puls des Sportparks“

- Farben als CSS-Variablen in `src/app/globals.css` (`--color-ink`, `--color-red`,
  `--color-moss`, `--color-sand`, …), per Tailwind v4 `@theme inline` als Utilities
  (`bg-ink`, `text-red`, `bg-moss`, …) verfügbar.
- Display-Schrift: Barlow Condensed (`font-display`), Body: Manrope (`font-body`) — beide
  selbst gehostet aus `src/fonts/`, keine Google-Fonts-Anfrage zur Laufzeit.
- `PulseLine`-Komponente (`src/components/shared/PulseLine.tsx`): die wiederkehrende
  Puls-Linie, die beim Scrollen in den Viewport von Rot (Performance) zu Moosgrün (Gesundheit)
  wechselt. Respektiert `prefers-reduced-motion`.
- `TexturePanel` (`src/components/shared/TexturePanel.tsx`): abstrakte, marken-konsistente
  Platzhalterfläche für Bereiche ohne echtes Foto-/Videomaterial (siehe MEDIA_AUDIT.md) —
  bewusst kein Stock-Foto, sondern ein Gradient/Grid-Muster je Themenfarbe.

## Barrierefreiheit

- Sichtbare Fokuszustände (`:focus-visible`) global gesetzt.
- „Zum Inhalt springen“-Link im Header.
- Alle interaktiven Elemente per Tastatur erreichbar (Buttons, Goal-Selector, Trainingsfinder,
  Ziel-Kompass-Formular).
- `prefers-reduced-motion` wird von PulseLine, TrustStats-Zähler und Hero-Video respektiert.
- Semantisches HTML (`nav`, `main`, `fieldset`/`legend`, `dl`, Breadcrumb-Navigation).

## SEO

- Individuelle `metadata` (Title, Description, `alternates.canonical`) pro Seite.
- `HealthClub`-Structured-Data im Root-Layout, `BreadcrumbList`-Structured-Data pro Unterseite.
- `src/app/sitemap.ts` und `src/app/robots.ts` (Next.js Metadata-API, erzeugen
  `/sitemap.xml` und `/robots.txt`).
- 301-Redirects von allen alten URLs in `next.config.ts`, gespeist aus
  `src/content/legacy-redirects.ts`.

## Bekannte Einschränkungen dieses Builds

Siehe **TODO_CLIENT.md** für die vollständige Liste. Kurzfassung:

1. Keine echten Fotos/Videos des Sportparks verbaut (Netzwerkzugriff blockiert) — Architektur
   dafür ist vorbereitet (`src/content/media.ts`, `HeroMedia`-Logik in `Hero.tsx`).
2. Alle Preise zeigen „Preis auf Anfrage“ (keine verifizierten Zahlen verfügbar).
3. Öffnungszeiten sind ein unbestätigter Platzhalter (`hoursConfirmed = false` in
   `src/content/hours.ts`) — die UI zeigt deshalb bewusst „Öffnungszeiten prüfen“ statt eines
   berechneten (ggf. falschen) Status.
4. Kontaktformular nutzt aktuell einen `mailto:`-Fallback statt eines echten Formular-Backends.
5. Rechtstexte (Impressum/Datenschutz) sind strukturiert aufgebaut, aber nicht juristisch
   geprüft.
