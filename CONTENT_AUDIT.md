# Content Audit — Alte vs. neue Seitenstruktur

## Warum auch dieser Audit eingeschränkt ist

Wie in MEDIA_AUDIT.md beschrieben, war `sportpark-pollack.de` aus dieser Build-Umgebung heraus
nicht erreichbar (Netzwerk-Egress-Policy blockiert die Domain). Die im Auftrag geforderte
Analyse der ~18 Bestandsseiten (Inhalte, Struktur, Formulierungen) konnte deshalb nicht anhand
der echten Seite erfolgen. Alle neuen Texte wurden auf Basis der im Auftrag selbst genannten
Fakten neu geschrieben — durchgehend in „Du"-Ansprache, ohne erfundene Fakten, Bewertungen oder
Mitgliederzahlen. Wörtliche alte Formulierungen konnten nicht übernommen werden, da der
Ausgangstext nicht vorlag.

## URL-Mapping (alt → neu)

Zentral gepflegt in `src/content/legacy-redirects.ts`, technisch umgesetzt als 301-Redirects in
`next.config.ts`.

| Alte URL | Neue URL | Status |
|---|---|---|
| `/` | `/` | unverändert |
| `/preise` | `/preise` | unverändert |
| `/more-und-esn` | `/regeneration/more-nutrition-esn` | umgezogen |
| `/Programm/Probetraining` | `/training/probetraining` | umgezogen |
| `/programm/probetraining` | `/training/probetraining` | umgezogen |
| `/programm/fitness` | `/training/fitness` | umgezogen |
| `/programm/milon` | `/gesundheit/milon` | umgezogen |
| `/programm/five` | `/gesundheit/five` | umgezogen |
| `/programm/inbody` | `/gesundheit/inbody` | umgezogen |
| `/programm/karate` | `/kampfkunst/karate` | umgezogen |
| `/programm/kinderkarate` | `/kampfkunst/kinderkarate` | umgezogen |
| `/programm/selbstverteidigung` | `/kampfkunst/selbstverteidigung` | umgezogen |
| `/programm/massage` | `/regeneration/massage` | umgezogen |
| `/programm/yoga` | `/regeneration/yoga` | umgezogen |
| `/solarium` | `/regeneration/solarium` | umgezogen |
| `/ueberuns` | `/ueber-uns` | umgezogen |
| `/kontakt` | `/kontakt` | unverändert |
| `/impressum` | `/impressum` | unverändert |
| `/datenschutzerklärung`, `/datenschutzerklaerung` | `/datenschutz` | umgezogen |

## Neue Seitenstruktur

```
/                       Startseite (Hero, Zielauswahl, Trainingswelten, Erweiterung 2026,
                        Gesundheits-Teaser, Jürgen Pollack, Galerie, Preise-Teaser, Abschluss-CTA)
/training               Übersicht: Fitness, Technogym, Plate-Loaded/Hardcore Area, Probetraining
/training/fitness
/training/technogym
/training/plate-loaded
/training/probetraining
/gesundheit             Übersicht (Milon, FIVE, InBody) + Sportpark Ziel-Kompass Rechner
/gesundheit/milon
/gesundheit/five
/gesundheit/inbody
/kampfkunst              Übersicht (Karate, Kinderkarate, Selbstverteidigung) + Qualifikationen
/kampfkunst/karate
/kampfkunst/kinderkarate
/kampfkunst/selbstverteidigung
/regeneration             Übersicht (Massage/brainLight, Yoga, Solarium) + More Nutrition/Hansefit
/regeneration/massage
/regeneration/yoga
/regeneration/solarium
/regeneration/more-nutrition-esn
/preise                    Alle Tarife
/ueber-uns                   Studio-Story + Jürgen Pollack
/kontakt                      Kontaktwege, Öffnungszeiten, Karte, Formular, Probetraining-Anfrage
/trainingsfinder                4-Fragen-Kurzquiz (verlinkt vom Hero-CTA „Meinen Bereich finden")
/impressum
/datenschutz
```

## Nicht übernommene Inhalte

- **Hydrojet-Massageliege**: im Auftrag als „sofern auf der aktuellen Seite weiterhin
  bestätigt" markiert. Da die aktuelle Seite nicht geprüft werden konnte, wurde dieser Punkt
  **nicht** in die neue Regeneration-Seite aufgenommen. Siehe TODO_CLIENT.md.
- **„Neu seit 2026" / Abschlussstatus der Erweiterung**: Der Auftrag verweist auf „Ab Juli
  2026" auf der Bestandsseite. Da nicht geprüft werden konnte, ob die Erweiterung inzwischen
  abgeschlossen ist, verwendet die neue Seite bewusst „Erweiterung ab Juli 2026" statt einer
  unbestätigten Abschlussmeldung. Siehe TODO_CLIENT.md.
- **Alte Template-Platzhalter** („Beyond Boundaries", „Nature's Symphony", „Faces of
  Humanity" etc.): konnten naturgemäß nicht geprüft/entfernt werden, da die Bestandsseite nicht
  zugänglich war — es wurde aber durchgehend darauf geachtet, in der neuen Seite selbst keine
  Platzhalter-, Lorem-Ipsum- oder unbeschrifteten Button-Texte zu verwenden.

## Ton & Sprache

Alle Texte konsequent in direkter „Du"-Ansprache, ohne Superlative ohne Beleg, ohne erfundene
Kundenstimmen oder Mitgliederzahlen. Fakten, die nicht im Auftrag genannt und nicht anderweitig
bestätigt waren (Preise, exakte Öffnungszeiten, genaue m²-Angabe der Erweiterung als
abgeschlossen), wurden nicht erfunden, sondern als offene Punkte in TODO_CLIENT.md
dokumentiert.
