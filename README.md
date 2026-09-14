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
muss, **MEDIA_AUDIT.md** für den Stand der Medien-Recherche und **CONTENT-MIGRATION.md** für die
Seite-für-Seite-Zuordnung der Inhalte von der alten zur neuen Website.

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

## Medien-Upload für den Auftraggeber (`/admin/upload`)

Damit der Auftraggeber Fotos/Videos nicht per Chat hochladen muss (dort gilt ein
Datei-Größenlimit, siehe TODO_CLIENT.md), gibt es eine interne, passwortgeschützte
Upload-Seite unter `/admin/upload`. Sie schreibt nicht in ein lokales Dateisystem (das würde
bei den meisten Hosting-Setups, z. B. Vercel Serverless Functions, beim nächsten Deployment
wieder verschwinden), sondern committet die Datei direkt per GitHub-Contents-API in dieses
Repository unter `public/media/<bereich>/`.

**Damit das funktioniert, müssen beim Hosting zwei Umgebungsvariablen gesetzt werden:**

| Variable | Bedeutung |
|---|---|
| `ADMIN_UPLOAD_PASSWORD` | Passwort für `/admin/upload`. Aktuell testweise mit `Sportpark2026!Pollack` vorbelegt (im Chat vom Auftraggeber als Platzhalter bestätigt) — bitte vor dem Go-Live durch ein eigenes, sicheres Passwort ersetzen. |
| `GITHUB_TOKEN` | Ein GitHub Personal Access Token (fine-grained, nur für dieses Repository, Berechtigung „Contents: Read and write") mit Schreibrecht auf `myslideos-source/Pollack`. Erstellbar unter GitHub → Settings → Developer settings → Fine-grained tokens. **Dieses Token kann nicht von Claude erzeugt werden** — es muss vom Repository-Owner selbst angelegt werden. |

Optional: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` überschreiben die Standardwerte
(`myslideos-source` / `Pollack` / der aktuelle Arbeits-Branch), falls das Repo verschoben oder
der Ziel-Branch geändert wird.

**Wichtige Einschränkungen:**

- Ohne die beiden Variablen antwortet der Upload mit einer klaren Fehlermeldung, statt still zu
  scheitern.
- Viele Hosting-Anbieter begrenzen die Größe von Anfragen an Serverless-Funktionen (bei Vercel
  z. B. je nach Tarif nur wenige MB). Für größere Videos kann das ein Limit sein — die Upload-Seite
  selbst begrenzt auf 25 MB pro Datei, das jeweilige Hosting-Limit kann aber niedriger liegen.
- Der Upload sortiert Dateien nur in `public/media/<bereich>/` ein. Wo genau eine Datei danach auf
  der Seite erscheint (welche Programmseite, welcher Bereich), ist weiterhin eine bewusste
  inhaltliche Entscheidung — bitte nach dem Upload kurz mitteilen, was hochgeladen wurde und wofür
  es gedacht ist, dann wird es gezielt eingebaut.
- Die Seite ist per `robots.txt` (`disallow: /admin`) und `noindex`-Meta von Suchmaschinen
  ausgeschlossen, ist aber nicht öffentlich beworben — das Passwort ist der einzige Schutz, also
  bitte ein wirklich sicheres Passwort setzen und das Token nicht teilen.

## Projektstruktur

```
src/
  app/                  Next.js App Router: Seiten, Layout, sitemap.ts, robots.ts
    training/           Übersicht + [slug]-Detailseiten
    gesundheit/          Übersicht (inkl. Ziel-Kompass-Rechner) + [slug]
    kampfkunst/           Übersicht + [slug]
    regeneration/          Übersicht + [slug]
    partner-produkte/       Hansefit, MORE Nutrition, ESN
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
