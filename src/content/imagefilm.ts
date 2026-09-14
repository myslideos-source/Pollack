/**
 * Der offizielle Sportpark-Imagefilm, vom Auftraggeber direkt im Chat als Video-Datei
 * übergeben (professionell produziert: Drohnenaufnahme des Gebäudes, Interview, Schnitt
 * durch alle Trainingsbereiche). Siehe MEDIA_AUDIT.md für Provenienz/Verarbeitung.
 */
export const imagefilm = {
  /** Vollständiger Film inkl. Ton — lädt erst, sobald aktiv auf Play geklickt wird. */
  src: "/media/video/imagefilm.mp4",
  /** Kurzer, tonloser Ausschnitt (Drohnenaufnahme) als Ambient-Loop unterhalb des Heros. */
  teaserSrc: "/media/video/imagefilm-teaser.mp4",
  poster: "/media/video/imagefilm-poster.webp",
  durationLabel: "1:22 Min",
  eyebrow: "Der Imagefilm",
  headline: "Spür den Puls.",
  sublabel: "Der Sportpark Pollack in eineinhalb Minuten — mit Ton ansehen.",
} as const;
