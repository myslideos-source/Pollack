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

## Admin-Bereich (`/admin`)

Der frühere, passwortgeschützte GitHub-Upload unter `/admin/upload` wurde durch einen
vollständigen, Supabase-gestützten Admin-Bereich ersetzt: geschützter Login mit Rollen
(Admin/Redakteur), Anfragenverwaltung, Termine, ein einfacher Inhaltseditor mit
Entwurf-und-Veröffentlichen-Workflow für Startseite und Trainingsbereiche, eine
Medienbibliothek (Supabase Storage), Preise/Öffnungszeiten/Partner & Produkte/Team,
Benutzerverwaltung, Änderungsverlauf und Einstellungen.

**Siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) für die vollständige Einrichtung** (Supabase-Projekt,
Umgebungsvariablen, ersten Admin-Nutzer anlegen) und **[ADMIN_MANUAL.md](./ADMIN_MANUAL.md)** für eine
kurze Bedienungsanleitung für Jürgen und sein Team.

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
    admin/                  Geschützter Admin-Bereich (siehe SUPABASE_SETUP.md)
      (auth)/                 Login, Passwort vergessen, Passwort zurücksetzen
      (dashboard)/            Dashboard, Anfragen, Termine, Website, Medien, Angebote,
                               Öffnungszeiten, Partner, Team, Benutzer, Verlauf, Einstellungen
      actions/                Server Actions für alle Admin-Mutationen
    actions/                  Server Actions für öffentliche Formulare (Kontakt/Probetraining)
  components/
    layout/              Header, Footer, mobile CTA-Leiste
    home/                 Startseiten-Sektionen (Hero, Trainingswelten, Gallery, …)
    shared/                Wiederverwendbare Bausteine (Button, PulseLine, TexturePanel, …)
    admin/                  Admin-UI-Bausteine (Sidebar, Topbar, MediaPicker, ListEditor, …)
    calculator/             Sportpark Ziel-Kompass (Gesundheitsrechner)
  content/                  Ursprüngliche statische Inhalte (Blaupause für die DB-Seed-Daten;
                              einige Seiten lesen weiterhin direkt von hier, siehe unten)
  lib/
    supabase/                 Client-Factories (Browser/Server/Middleware/Service-Role) +
                               generierte Datenbanktypen
    content/                   Server-seitige Leseschicht: liest website_sections/offers/
                                opening_hours/partners/products für die öffentlichen Seiten
    validation/                 Zod-Schemas für Formulare
    auth.ts, email.ts, opening-hours.ts, website-sections-schema.ts, offer-categories.ts
  fonts/                     Selbst gehostete woff2-Dateien (Poppins)
supabase/
  migrations/                SQL-Migrationen (Schema, Storage-Buckets, RLS-Fixes, Seed-Daten)
```

Redaktionell laufend gepflegte Inhalte (Preise, Öffnungszeiten, Trainingsbereiche, Partner,
Team, Startseiten-Hero) liegen in Supabase und werden über `/admin` bearbeitet — siehe
`src/lib/content/` für die Leseseite. Inhalte ohne eigenes Admin-Formular (z. B. Google-
Bewertungen, Kategorie-Kacheln, Erweiterung-2026-Teaser) bleiben vorerst in `src/content/*.ts`.

## Design-System — „Der Puls des Sportparks“

- Farben als CSS-Variablen in `src/app/globals.css` (`--color-ink`, `--color-red`,
  `--color-moss`, `--color-sand`, …), per Tailwind v4 `@theme inline` als Utilities
  (`bg-ink`, `text-red`, `bg-moss`, …) verfügbar.
- Schrift: Poppins für Headlines (`font-display`) und Fließtext (`font-body`) — selbst
  gehostet aus `src/fonts/`, keine Google-Fonts-Anfrage zur Laufzeit.
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

Siehe **TODO_CLIENT.md** für die ursprüngliche Liste (Preise, Öffnungszeiten, Fotos) und
**SUPABASE_SETUP.md** (Abschnitt „Bekannte Einschränkungen“) für die aktuellen, den Admin-Bereich
betreffenden Punkte. Kurzfassung:

1. Alle Preise zeigen weiterhin „Preis auf Anfrage" (keine verifizierten Zahlen verfügbar) —
   jetzt aber über `/admin/angebote` pflegbar.
2. Öffnungszeiten sind aus einer Websuche übernommen (mehrere unabhängige Verzeichnis-Einträge
   stimmten überein), nicht per Screenshot aus dem eigenen Google-Business-Profil verifiziert —
   jetzt aber über `/admin/oeffnungszeiten` korrigierbar, ohne dass Code geändert werden muss.
3. Rechtstexte (Impressum/Datenschutz) sind strukturiert aufgebaut, aber nicht juristisch
   geprüft.
4. Bilder/Videos, die aus den ursprünglichen statischen Inhalten in die Datenbank übernommen
   wurden, verweisen weiterhin auf die vorhandenen Dateien unter `public/media/…` (nicht auf die
   Medienbibliothek) — ein Admin kann sie jederzeit über den Inhaltseditor durch eine über
   `/admin/medien` hochgeladene Datei ersetzen.
