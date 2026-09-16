/**
 * Local fallback cover photos for a training day's hero image, keyed by keywords found in the
 * day title (e.g. "Unterkörper", "Rücken & Bizeps"). Used only when a trainer hasn't set an
 * explicit cover_media_id via the plan editor — real, already-licensed Sportpark studio photos,
 * never a hotlinked or invented image (the master prompt explicitly forbids both a hero without
 * a photo and random external image sources).
 */
export type CoverImage = { src: string; alt: string; focalX: number; focalY: number };

const KEYWORD_COVERS: { pattern: RegExp; cover: CoverImage }[] = [
  {
    pattern: /unterkörper|beine|bein\b|quadrizeps|waden/i,
    cover: { src: "/media/training/hardcore-area.webp", alt: "Trainingsbereich mit Beinpresse im Sportpark Pollack", focalX: 62, focalY: 55 },
  },
  {
    pattern: /oberkörper|rücken|bizeps|trizeps|arm|schulter|brust|zug/i,
    cover: { src: "/media/training/fitness-mann.webp", alt: "Mitglied trainiert den Rücken am Klimmzug-Gerät", focalX: 60, focalY: 40 },
  },
  {
    pattern: /ganzkörper|cardio|ausdauer|kondition/i,
    cover: { src: "/media/training/fitness-frau.webp", alt: "Mitglied trainiert am Kabelzug im Sportpark Pollack", focalX: 55, focalY: 42 },
  },
];

const DEFAULT_COVER: CoverImage = {
  src: "/media/training/hardcore-area.webp",
  alt: "Trainingsbereich im Sportpark Pollack",
  focalX: 50,
  focalY: 50,
};

export function defaultCoverForTitle(title: string): CoverImage {
  return KEYWORD_COVERS.find((k) => k.pattern.test(title))?.cover ?? DEFAULT_COVER;
}
