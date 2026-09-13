/**
 * Central registry for real Sportpark Pollack photo/video assets.
 *
 * Every path here is `null` because this build could not reach sportpark-pollack.de
 * (network egress to the domain is blocked in this environment) and so could not run
 * the media audit / download step described in the brief. See MEDIA_AUDIT.md for the
 * full explanation and TODO_CLIENT.md for what's needed to finish this.
 *
 * The components that consume this file (HeroMedia, VideoGallery, ProgramMedia) are
 * already built to use a real asset the moment a path is filled in here — drop the
 * optimized files into /public/media/... and update the paths below, no component
 * changes required.
 */
export const heroMedia = {
  videoSrc: null as string | null,
  videoSrcWebm: null as string | null,
  posterSrc: null as string | null,
};

export type GalleryCategory = "studio" | "fitness" | "gesundheit" | "kampfkunst" | "community" | "regeneration";

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  title: string;
  type: "image" | "video";
  src: string | null;
  poster?: string | null;
};

/** Populate once real media is downloaded and approved for use (see TODO_CLIENT.md). */
export const galleryItems: GalleryItem[] = [];
