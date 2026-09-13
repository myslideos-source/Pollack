/**
 * Central registry for real Sportpark Pollack photo/video assets.
 *
 * The client supplied a first batch of real photos directly in the chat (see
 * MEDIA_AUDIT.md for provenance and usage-rights status — confirmation still pending,
 * TODO_CLIENT.md #2). Everything else here stays `null`/empty because sportpark-pollack.de
 * itself remains unreachable from this build environment. Drop further optimized files
 * into /public/media/... and extend this file — no component changes required beyond that.
 */
export const heroMedia = {
  videoSrc: null as string | null,
  videoSrcWebm: null as string | null,
  posterSrc: null as string | null,
  /** Wide composition for tablet/desktop hero backgrounds. */
  imageDesktopSrc: "/media/hero/hero-desktop.webp" as string | null,
  /** Portrait crop of the same photo, framed on both people, for phone viewports. */
  imageMobileSrc: "/media/hero/hero-mobile.webp" as string | null,
  imageAlt: "Trainer bespricht mit einer Kundin im Sportpark Pollack ihren Trainingsplan",
};

export type GalleryCategory = "studio" | "fitness" | "gesundheit" | "kampfkunst" | "community" | "regeneration";

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  title: string;
  type: "image" | "video";
  src: string | null;
  poster?: string | null;
  alt?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "studio-hero",
    category: "studio",
    title: "Studio",
    type: "image",
    src: "/media/hero/hero-desktop.webp",
    alt: "Trainer bespricht mit einer Kundin im Sportpark Pollack ihren Trainingsplan",
  },
  {
    id: "fitness-kabelzug",
    category: "fitness",
    title: "Fitness",
    type: "image",
    src: "/media/training/fitness-mann.webp",
    alt: "Mann trainiert an einem geführten Kraftgerät im Sportpark Pollack",
  },
  {
    id: "gesundheit-five",
    category: "gesundheit",
    title: "Gesundheit",
    type: "image",
    src: "/media/gesundheit/five-bambus-moos.webp",
    alt: "Der neue FIVE Rücken- und Gelenkbereich mit Bambus- und Mooswänden im Sportpark Pollack",
  },
  {
    id: "kampfkunst-kinderkarate",
    category: "kampfkunst",
    title: "Kampfkunst",
    type: "image",
    src: "/media/kampfkunst/kinderkarate.webp",
    alt: "Kind trainiert Kinderkarate am Kickschild im Sportpark Pollack",
  },
];
