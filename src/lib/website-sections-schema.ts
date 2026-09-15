/**
 * Defines which friendly fields the admin editor shows for each `section_key` — this is what
 * keeps the editor from ever showing raw JSON: every website_sections.content value is typed
 * against one of these schemas, and the editor renders exactly the fields listed here.
 */
export type FieldType = "text" | "textarea" | "richtext" | "list" | "boolean" | "media" | "link";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
};

export const SECTION_FIELD_SCHEMAS: Record<string, FieldDef[]> = {
  hero: [
    { key: "headline", label: "Hero-Überschrift", type: "text" },
    { key: "subline", label: "Unterzeile", type: "textarea" },
    { key: "ctaPrimaryLabel", label: "Call-to-Action (primär)", type: "text" },
    { key: "ctaSecondaryLabel", label: "Call-to-Action (sekundär)", type: "text" },
    { key: "image", label: "Hero-Bild (Desktop)", type: "media" },
    { key: "imageMobile", label: "Hero-Bild (Mobil)", type: "media" },
  ],
  imagefilm: [
    { key: "eyebrow", label: "Kicker-Text", type: "text" },
    { key: "headline", label: "Überschrift", type: "text" },
    { key: "durationLabel", label: "Laufzeit-Anzeige", type: "text" },
    { key: "video", label: "Video", type: "media" },
    { key: "teaserVideo", label: "Vorschau-Loop (stumm)", type: "media" },
    { key: "poster", label: "Poster-Bild", type: "media" },
  ],
  trust_stats: [{ key: "items", label: "Kennzahlen (Wert · Einheit · Bezeichnung)", type: "list" }],
  program: [
    { key: "title", label: "Titel", type: "text" },
    { key: "shortDescription", label: "Kurzbeschreibung", type: "textarea" },
    { key: "description", label: "Ausführlicher Text", type: "richtext" },
    { key: "features", label: "Leistungen", type: "list" },
    { key: "ctaLabel", label: "Call-to-Action-Text", type: "text" },
    { key: "image", label: "Bild", type: "media" },
    { key: "video", label: "Video (optional)", type: "media" },
  ],
  owner: [
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Rolle", type: "text" },
    { key: "intro", label: "Einleitung", type: "textarea" },
    { key: "story", label: "Geschichte", type: "richtext" },
    { key: "qualifications", label: "Qualifikationen", type: "list" },
    { key: "portrait", label: "Porträtfoto", type: "media" },
  ],
  expansion: [
    { key: "eyebrow", label: "Kicker-Text", type: "text" },
    { key: "headline", label: "Überschrift", type: "text" },
    { key: "intro", label: "Einleitung", type: "textarea" },
    { key: "atmosphereNote", label: "Hinweis zur Gestaltung/Atmosphäre", type: "textarea" },
    { key: "statusNote", label: "Status-Hinweis (z. B. \"ab Juli 2026\")", type: "text" },
    { key: "groupTraining", label: "Training – Punkte", type: "list" },
    { key: "groupGesundheit", label: "Gesundheit – Punkte", type: "list" },
    { key: "groupKampfkunst", label: "Kampfkunst – Punkte", type: "list" },
    { key: "groupRegeneration", label: "Regeneration – Punkte", type: "list" },
    { key: "image", label: "Bild", type: "media" },
  ],
  faq: [{ key: "items", label: "Fragen & Antworten (Frage — Antwort)", type: "list" }],
  notice: [
    { key: "text", label: "Hinweistext", type: "textarea" },
    { key: "active", label: "Aktiv anzeigen", type: "boolean" },
  ],
  contact: [
    { key: "street", label: "Straße & Hausnummer", type: "text" },
    { key: "zip", label: "PLZ", type: "text" },
    { key: "city", label: "Ort", type: "text" },
    { key: "phone", label: "Telefonnummer", type: "text" },
    { key: "email", label: "E-Mail-Adresse", type: "text" },
    { key: "whatsapp", label: "WhatsApp-Nummer", type: "text" },
    { key: "instagramUrl", label: "Instagram-Link", type: "link" },
    { key: "facebookUrl", label: "Facebook-Link", type: "link" },
  ],
  generic: [
    { key: "eyebrow", label: "Kicker-Text", type: "text" },
    { key: "headline", label: "Überschrift", type: "text" },
    { key: "body", label: "Text", type: "richtext" },
  ],
};

/** The canonical set of editable sections — also the blueprint for seeding website_sections. */
export const WEBSITE_SECTION_DEFS: {
  slug: string;
  sectionKey: keyof typeof SECTION_FIELD_SCHEMAS;
  page: string;
  title: string;
  sortOrder: number;
}[] = [
  { slug: "home.hero", sectionKey: "hero", page: "home", title: "Startseite – Hero", sortOrder: 0 },
  { slug: "home.imagefilm", sectionKey: "imagefilm", page: "home", title: "Startseite – Imagefilm", sortOrder: 1 },
  { slug: "home.trust_stats", sectionKey: "trust_stats", page: "home", title: "Startseite – Kennzahlen", sortOrder: 2 },
  { slug: "home.owner", sectionKey: "owner", page: "home", title: "Startseite – Jürgen Pollack", sortOrder: 3 },
  { slug: "home.notice", sectionKey: "notice", page: "home", title: "Startseite – Hinweisbanner", sortOrder: 4 },
  { slug: "home.expansion", sectionKey: "expansion", page: "home", title: "Startseite – Erweiterung 2026", sortOrder: 5 },

  { slug: "program.fitness", sectionKey: "program", page: "training", title: "Training – Fitness", sortOrder: 0 },
  { slug: "program.technogym", sectionKey: "program", page: "training", title: "Training – Technogym", sortOrder: 1 },
  { slug: "program.plate-loaded", sectionKey: "program", page: "training", title: "Training – Plate-Loaded / Hardcore Area", sortOrder: 2 },
  { slug: "program.milon", sectionKey: "program", page: "gesundheit", title: "Gesundheit – Milon", sortOrder: 0 },
  { slug: "program.five", sectionKey: "program", page: "gesundheit", title: "Gesundheit – FIVE", sortOrder: 1 },
  { slug: "program.inbody", sectionKey: "program", page: "gesundheit", title: "Gesundheit – Körperanalyse (InBody)", sortOrder: 2 },
  { slug: "program.karate", sectionKey: "program", page: "kampfkunst", title: "Kampfkunst – Karate", sortOrder: 0 },
  { slug: "program.kinderkarate", sectionKey: "program", page: "kampfkunst", title: "Kampfkunst – Kinderkarate", sortOrder: 1 },
  { slug: "program.selbstverteidigung", sectionKey: "program", page: "kampfkunst", title: "Kampfkunst – Selbstverteidigung", sortOrder: 2 },
  { slug: "program.yoga", sectionKey: "program", page: "regeneration", title: "Regeneration – Yoga", sortOrder: 0 },
  { slug: "program.regeneration", sectionKey: "program", page: "regeneration", title: "Regeneration – Massage & Entspannung", sortOrder: 1 },

  { slug: "site.faq", sectionKey: "faq", page: "kontakt", title: "Häufige Fragen", sortOrder: 0 },
  { slug: "site.contact", sectionKey: "contact", page: "kontakt", title: "Kontaktdaten", sortOrder: 1 },
];
