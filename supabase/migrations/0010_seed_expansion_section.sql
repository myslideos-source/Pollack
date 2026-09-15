-- Makes the homepage "Erweiterung ab Juli 2026" section admin-editable (previously hardcoded in
-- src/content/expansion.ts, including a stray internal "Siehe TODO_CLIENT.md." note that was
-- visible to public site visitors). Seeded with the exact content already live so nothing
-- changes visually until an admin edits it via /admin/website.

insert into public.website_sections (slug, section_key, page, title, content, sort_order, visible)
values (
  $str$home.expansion$str$,
  $str$expansion$str$,
  $str$home$str$,
  $str$Startseite – Erweiterung 2026$str$,
  $json${
    "eyebrow": "Erweiterung ab Juli 2026",
    "headline": "Der Sportpark wächst.",
    "intro": "Wir bauen den Sportpark Pollack weiter aus – mehr Fläche, mehr Ausstattung, mehr Raum für Training, Gesundheit, Kampfkunst und Regeneration.",
    "atmosphereNote": "Gestalterisch setzen wir auf eine ruhige, natürliche Atmosphäre: Mooswände, Bambus-Elemente und eine Kaminfeuer-Optik sollen den Regenerationsbereich spürbar von der Trainingsfläche abheben.",
    "statusNote": "Aktueller Umsetzungsstand: ab Juli 2026.",
    "groupTraining": ["Zusätzliche 150 m² Trainingsfläche", "Neue Hardcore Area mit Technogym Plate-Loaded Maschinen"],
    "groupGesundheit": ["Eigenes FIVE Rücken- und Gelenkzentrum auf rund 60 m²"],
    "groupKampfkunst": ["Größere Kampfsport-Area für Karate, Kickboxen und Selbstverteidigung"],
    "groupRegeneration": ["Massageraum Deluxe mit brainLight-Massagesessel und Hydrojet-Massageliege", "Chillout-Lounge mit Proteinshakes und Cappuccino"]
  }$json$::jsonb,
  5,
  true
)
on conflict (slug) do nothing;
