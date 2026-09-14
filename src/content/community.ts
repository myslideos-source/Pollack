/**
 * Social-Proof-Content von Christian Wolf (Fitness-Content-Creator, @christian.wolf auf
 * TikTok/Instagram), der den Sportpark Pollack besucht und dort ein Shoutout gedreht hat.
 * Beide Video-Clips wurden dem Auftraggeber von Christian Wolf zur Verfügung gestellt und uns
 * direkt im Chat als Screen-Recordings übergeben (siehe MEDIA_AUDIT.md für Provenienz und den
 * offenen Punkt zur Repost-Bestätigung in TODO_CLIENT.md).
 *
 * Beide Quelldateien sind Hochformat (720×1280) — deshalb laufen sie hier als Zwei-Clip-Slider
 * im nativen Seitenverhältnis statt einzeln in ein breites 16:9-Grid gezwängt zu werden (das
 * hätte bei beiden Clips das eigentliche Motiv mittig abgeschnitten).
 */
export const christianWolfShoutout = {
  name: "Christian Wolf",
  handle: "@christian.wolf",
  platform: "TikTok & Instagram",
  quote: "Shoutout Sportpark Pollack!",
  intro:
    "Christian Wolf, Fitness-Content-Creator mit über einer Million Followern, war live bei uns im Sportpark und hat sich vor Ort selbst ein Bild gemacht – vom Training bis zum MORE-Nutrition-Regal.",
  clips: [
    {
      id: "shoutout",
      tabLabel: "Im Sportpark",
      label: "Christian Wolf zu Besuch im Sportpark Pollack",
      src: "/media/video/christian-wolf-shoutout.mp4",
      poster: "/media/video/christian-wolf-shoutout-poster.webp",
    },
    {
      id: "regal",
      tabLabel: "MORE-Nutrition-Regal",
      label: "Christian Wolf zeigt unser MORE-Nutrition-Regal",
      src: "/media/video/christian-wolf-more-nutrition.mp4",
      poster: "/media/video/christian-wolf-more-nutrition-poster.webp",
    },
  ],
} as const;
