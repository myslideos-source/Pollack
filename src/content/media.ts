/**
 * Central registry for the Sportpark Pollack hero photo/video.
 *
 * The client supplied real photos directly in the chat across two batches (see
 * MEDIA_AUDIT.md for provenance and usage-rights status — confirmation still pending,
 * TODO_CLIENT.md #2). Everything else stays `null` because sportpark-pollack.de itself
 * remains unreachable from this build environment. To add a hero video later, drop the
 * optimized file into /public/media/hero/ and set `videoSrc` below — no component change
 * needed, `Hero.tsx` already prefers video over the image when `videoSrc` is set.
 *
 * Per-program and per-gallery-tile images live next to their own content instead of here:
 * see the `image`/`imageAlt` fields on entries in `src/content/programs.ts`, and the
 * `categories` array in `src/components/home/Gallery.tsx`.
 */
export const heroMedia = {
  videoSrc: null as string | null,
  videoSrcWebm: null as string | null,
  posterSrc: null as string | null,
  /** Wide composition for tablet/desktop hero backgrounds. */
  imageDesktopSrc: "/media/hero/hero2-desktop.webp" as string | null,
  /** Portrait crop of the same photo, framed on the subject, for phone viewports. */
  imageMobileSrc: "/media/hero/hero2-mobile.webp" as string | null,
  imageAlt: "Frau trainiert am Kabelzug im Sportpark Pollack",
};
