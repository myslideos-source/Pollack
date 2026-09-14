/**
 * Social-Proof-Content von Christian Wolf (Fitness-Content-Creator, @christian.wolf auf
 * TikTok/Instagram), der den Sportpark Pollack besucht und dort ein Shoutout gedreht hat.
 * Die zwei Video-Clips wurden dem Auftraggeber von Christian Wolf zur Verfügung gestellt und
 * uns direkt im Chat als Screen-Recordings übergeben (siehe MEDIA_AUDIT.md für Provenienz und
 * den offenen Punkt zur Repost-Bestätigung in TODO_CLIENT.md).
 */
export const christianWolfShoutout = {
  name: "Christian Wolf",
  handle: "@christian.wolf",
  platform: "TikTok & Instagram",
  quote: "Shoutout Sportpark Pollack!",
  intro:
    "Christian Wolf, Fitness-Content-Creator mit über einer Million Followern, war live bei uns im Sportpark und hat sich vor Ort selbst ein Bild gemacht – vom Training bis zum MORE-Nutrition-Regal.",
  video: {
    src: "/media/video/christian-wolf-shoutout.mp4",
    poster: "/media/video/christian-wolf-shoutout-poster.webp",
    label: "Christian Wolf zu Besuch im Sportpark Pollack",
  },
  productVideo: {
    src: "/media/video/christian-wolf-more-nutrition.mp4",
    poster: "/media/video/christian-wolf-more-nutrition-poster.webp",
    label: "Christian Wolf zeigt unser MORE-Nutrition-Regal",
  },
} as const;
