# Supabase-Einrichtung für den Admin-Bereich

Der Admin-Bereich (`/admin`) und alle redaktionell pflegbaren Inhalte (Anfragen, Website-Texte,
Medien, Preise, Öffnungszeiten, Partner, Team) laufen über ein eigenes Supabase-Projekt. Dieses
Dokument beschreibt die komplette Einrichtung — sowohl den aktuellen Stand (bereits eingerichtet)
als auch, falls nötig, wie man alles in einem neuen Supabase-Projekt von Grund auf aufsetzt.

## 1. Aktueller Stand

Für dieses Projekt wurde bereits ein dediziertes Supabase-Projekt angelegt (`sportpark-pollack`,
Region `eu-central-1`, Frankfurt) und alle Migrationen unter `supabase/migrations/` wurden darauf
angewendet:

| Migration | Inhalt |
|---|---|
| `0001_initial_schema.sql` | Alle Tabellen, RLS-Policies, Hilfsfunktionen (`is_staff`, `is_admin`, …), `submit_inquiry()`, `publish_all_drafts()`, `restore_last_version()` |
| `0002_storage_buckets.sql` | Storage-Buckets `media-public` (öffentlich lesbar) und `avatars` |
| `0003_advisor_fixes.sql` | Behebt alle von Supabase-Advisors gemeldeten Sicherheits-/Performance-Hinweise |
| `0004_notification_email_getter.sql` | `get_notification_email()`-Funktion + Start-Wert für die Benachrichtigungs-E-Mail |
| `0005_seed_content.sql` | Übernimmt die ursprünglichen Website-Inhalte (Startseite, Trainingsbereiche, Preise, Öffnungszeiten, Partner, Team) in die Datenbank |

Das Projekt ist betriebsbereit. **Was noch manuell zu tun ist, steht in Abschnitt 3.**

## 2. Von Grund auf einrichten (falls ein neues Projekt nötig wird)

1. Auf [supabase.com](https://supabase.com) ein neues Projekt anlegen (Region z. B. Frankfurt
   `eu-central-1`, für DSGVO-Konformität).
2. Unter **Project Settings → API** die `Project URL` und den `anon`/`public`-Key kopieren →
   siehe Abschnitt 4 (Umgebungsvariablen).
3. Unter **Project Settings → API** zusätzlich den `service_role`-Key kopieren (geheim halten!)
   → ebenfalls Abschnitt 4.
4. Die fünf Migrationsdateien aus `supabase/migrations/` **in numerischer Reihenfolge** im
   SQL-Editor des Supabase-Dashboards ausführen (oder über die Supabase-CLI: `supabase db push`,
   sofern lokal mit dem Projekt verknüpft).
5. Weiter mit Abschnitt 3 (ersten Admin-Nutzer anlegen).

## 3. Manuelle Schritte (auch beim bestehenden Projekt noch nötig)

Diese Schritte kann Claude aus dieser Sitzung heraus **nicht** selbst ausführen, weil dafür der
`service_role`-Schlüssel nötig ist, der aus Sicherheitsgründen über kein Supabase-Tool ausgelesen
werden kann — er muss manuell aus dem Supabase-Dashboard kopiert werden.

### 3.1 Umgebungsvariablen setzen

`.env.local` (lokal) bzw. die Umgebungsvariablen des Hostings (z. B. Vercel → Project Settings →
Environment Variables) müssen die in `.env.example` gelisteten Werte enthalten — siehe
Abschnitt 4 für die vollständige Liste. `SUPABASE_SERVICE_ROLE_KEY` fehlt aktuell in
`.env.local` und muss aus dem Supabase-Dashboard (Project Settings → API → `service_role`)
eingetragen werden.

### 3.2 Ersten Admin-Nutzer anlegen

✅ **Erledigt.** Der erste Admin-Zugang (`d.musotto@t-online.de`) wurde bereits angelegt — Login
unter `/admin/login` mit dem vereinbarten Passwort möglich. Bitte das Passwort nach dem ersten
Login über „Passwort vergessen" auf der Login-Seite einmal selbst ändern, damit es nur noch dir
bekannt ist (es wurde für die Einrichtung kurz im Chat übertragen).

Die folgenden Schritte sind nur noch relevant, falls **künftig** ein weiterer Zugang ohne
funktionierenden Service-Role-Key (also ohne die Einladungsfunktion unter „Benutzer") angelegt
werden muss:

Es gibt bewusst **keine öffentliche Registrierung** — neue Nutzer:innen werden normalerweise
über `/admin/benutzer` eingeladen (siehe ADMIN_MANUAL.md). Alternativ lässt sich ein Zugang auch
manuell im Supabase-Dashboard anlegen:

1. Supabase-Dashboard → **Authentication → Users → Add user → Create new user**.
   E-Mail-Adresse und ein Startpasswort vergeben (z. B. Jürgens E-Mail-Adresse).
   „Auto Confirm User" aktivieren, damit keine Bestätigungs-Mail nötig ist.
2. Die neu erstellte Nutzer-ID (UUID) aus der Nutzerliste kopieren.
3. Im **SQL-Editor** einen passenden `profiles`-Eintrag anlegen (Platzhalter ersetzen):

   ```sql
   insert into public.profiles (id, email, full_name, role)
   values ('<user-uuid-aus-schritt-2>', '<email-aus-schritt-1>', 'Jürgen Pollack', 'admin');
   ```

4. Mit dieser E-Mail-Adresse und dem vergebenen Passwort unter `/admin/login` anmelden.
5. Direkt danach unter `/admin/einstellungen` das Passwort über „Passwort vergessen" auf ein
   eigenes, sicheres Passwort ändern (oder über das Supabase-Dashboard neu setzen).

Alle **weiteren** Nutzer:innen (z. B. Trainer:innen mit Redakteur-Rolle) können danach ganz normal
über `/admin/benutzer` eingeladen werden — dafür ist kein Dashboard-Zugriff mehr nötig, nur der
`SUPABASE_SERVICE_ROLE_KEY` in der Serverumgebung (siehe 3.1).

### 3.3 E-Mail-Versand (optional, aber empfohlen)

Ohne `RESEND_API_KEY` werden neue Anfragen weiterhin zuverlässig in der Datenbank gespeichert und
erscheinen im Admin-Bereich — es wird nur keine automatische Bestätigungs- oder
Benachrichtigungs-E-Mail verschickt. Für den E-Mail-Versand:

1. Konto bei [resend.com](https://resend.com) anlegen (kostenloser Tarif reicht für den Start).
2. Die Domain `sportpark-pollack.de` unter **Domains** hinzufügen und die angezeigten DNS-Einträge
   beim Domain-Provider setzen (Verifizierung kann einige Minuten bis Stunden dauern).
3. Unter **API Keys** einen neuen Schlüssel erstellen → als `RESEND_API_KEY` eintragen.
4. `RESEND_FROM_EMAIL` auf eine Adresse der verifizierten Domain setzen, z. B.
   `Sportpark Pollack <info@sportpark-pollack.de>`.
5. Unter `/admin/einstellungen` die Benachrichtigungs-E-Mail-Adresse prüfen/anpassen (an diese
   Adresse geht die Benachrichtigung bei jeder neuen Anfrage).

### 3.4 Medien der bereits übernommenen Inhalte

Die per Seed-Migration übernommenen Bilder/Videos (Hero, Trainingsbereiche, Jürgens Porträt, …)
verweisen weiterhin auf die vorhandenen Dateien unter `public/media/…`, **nicht** auf die neue
Medienbibliothek — der `service_role`-Schlüssel, der für einen automatischen Upload in Supabase
Storage nötig gewesen wäre, war in der Sitzung, in der die Inhalte übernommen wurden, nicht
verfügbar. Das ändert nichts an der Optik der Website (die Dateien werden weiterhin korrekt
angezeigt), schränkt aber ein: Diese Felder lassen sich im Inhaltseditor aktuell nicht über die
Medienbibliothek **auswählen** (nur neu **ersetzen**). Ein Admin kann jedes Feld jederzeit über
„Aus Medienbibliothek wählen" auf ein frisch unter `/admin/medien` hochgeladenes Bild/Video
umstellen — danach ist es vollständig in der Medienbibliothek verwaltet.

## 4. Umgebungsvariablen

Siehe `.env.example` für die vollständige, aktuell gültige Liste. Kurzüberblick:

| Variable | Pflicht | Wo zu finden |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ja | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ja | Project Settings → API → `anon`/`public` Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Ja (für Nutzerverwaltung) | Project Settings → API → `service_role` Key (geheim!) |
| `RESEND_API_KEY` | Optional | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Optional | Eigene, bei Resend verifizierte Absenderadresse |

`SUPABASE_SERVICE_ROLE_KEY` niemals mit `NEXT_PUBLIC_`-Präfix versehen oder im Browser verwenden
— er hebelt die Row-Level-Security vollständig aus. Er wird ausschließlich in
`src/lib/supabase/admin.ts` verwendet (Nutzer einladen/löschen), das per `server-only`-Import vor
versehentlicher Client-Nutzung geschützt ist.

## 5. Bekannte Einschränkungen

- **Der erste Admin-Nutzer wurde per SQL direkt in der Datenbank angelegt** (nicht über die
  offizielle `auth.admin.inviteUserByEmail`-API, da der `service_role`-Schlüssel dafür fehlte) —
  funktional identisch (bestätigter E-Mail-Login, `profiles`-Rolle `admin`), aber ungewöhnlicher
  Weg. Weitere Nutzer:innen sollten normal über `/admin/benutzer` eingeladen werden, sobald
  `SUPABASE_SERVICE_ROLE_KEY` gesetzt ist.
- **Login/Logout, Rollen und der vollständige Anfragen-zu-Veröffentlichung-Ablauf konnten in
  dieser Sitzung nicht Ende-zu-Ende im Browser getestet werden** — diese Sandbox-Umgebung hat
  keinen Netzwerkzugriff auf den Supabase-Host (Organisationsrichtlinie am Egress-Proxy).
  Verifiziert wurde stattdessen: TypeScript, ESLint und der Produktions-Build laufen fehlerfrei
  durch, alle RLS-Policies wurden direkt in der Datenbank als `anon`-Rolle gegengeprüft (siehe
  Commit-Historie), und der Code wurde sorgfältig gegen das tatsächliche Datenbankschema gelesen.
  Ein kurzer manueller Durchklick nach dem Deployment (Login, eine Test-Anfrage abschicken, einen
  Abschnitt bearbeiten und veröffentlichen) wird empfohlen.
- **Bilder-Zuschnitt (Crop) in der Medienbibliothek**: Die Datenbank-Spalte `media.crop` ist
  vorbereitet, es gibt aber noch keine Bedienoberfläche dafür — Bilder werden aktuell
  unbeschnitten verwendet.
- Siehe außerdem README.md („Bekannte Einschränkungen dieses Builds") für die ursprünglichen,
  vom Auftraggeber noch zu bestätigenden Punkte (Preise, Öffnungszeiten-Herkunft) — diese sind
  jetzt aber direkt im Admin-Bereich korrigierbar, ohne dass Code geändert werden muss.
