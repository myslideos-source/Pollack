import "server-only";
import type { Program } from "@/content/programs";
import { getSection, sectionField } from "@/lib/content/sections";
import { resolveMediaSrc } from "@/lib/content/media";

/**
 * Maps a static content/programs.ts slug to its website_sections slug. Only programs that are
 * part of the admin's editable "Website bearbeiten" area are listed here — Probetraining and
 * Solarium have no admin-editable counterpart yet and always render from the static file.
 */
const SECTION_SLUG_BY_PROGRAM_SLUG: Record<string, string> = {
  fitness: "program.fitness",
  technogym: "program.technogym",
  "plate-loaded": "program.plate-loaded",
  milon: "program.milon",
  five: "program.five",
  inbody: "program.inbody",
  karate: "program.karate",
  kinderkarate: "program.kinderkarate",
  selbstverteidigung: "program.selbstverteidigung",
  yoga: "program.yoga",
  massage: "program.regeneration",
};

/**
 * Overlays admin-edited fields (title, short/long description, features, image, video) from
 * website_sections onto the static Program blueprint, which still supplies everything the
 * simple admin editor doesn't model yet (facts strip, pull-quote, FAQ, open questions). Returns
 * the static program unchanged if there's no matching section, or if the section is hidden.
 */
export async function mergeProgramWithSection(base: Program): Promise<Program> {
  const sectionSlug = SECTION_SLUG_BY_PROGRAM_SLUG[base.slug];
  if (!sectionSlug) return base;

  const section = await getSection(sectionSlug);
  if (!section) return base;
  const c = section.content;

  const description = sectionField.str(c, "description");
  const features = sectionField.list(c, "features");
  const image = await resolveMediaSrc(c.image);
  const video = await resolveMediaSrc(c.video);

  return {
    ...base,
    title: sectionField.str(c, "title") ?? base.title,
    summary: sectionField.str(c, "shortDescription") ?? base.summary,
    description: description ? description.split("\n\n") : base.description,
    bullets: features.length > 0 ? features : base.bullets,
    image: image ?? base.image,
    video: video ? { src: video, poster: base.video?.poster ?? image ?? base.image ?? "", label: base.video?.label ?? base.title } : base.video,
  };
}
