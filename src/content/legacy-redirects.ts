/**
 * Legacy URL → new URL mapping, consumed by next.config.ts redirects().
 * Keep this the single source of truth so old links and search rankings survive the relaunch.
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/more-und-esn", destination: "/regeneration/more-nutrition-esn" },
  { source: "/Programm/Probetraining", destination: "/training/probetraining" },
  { source: "/programm/probetraining", destination: "/training/probetraining" },
  { source: "/programm/fitness", destination: "/training/fitness" },
  { source: "/programm/milon", destination: "/gesundheit/milon" },
  { source: "/programm/five", destination: "/gesundheit/five" },
  { source: "/programm/inbody", destination: "/gesundheit/inbody" },
  { source: "/programm/karate", destination: "/kampfkunst/karate" },
  { source: "/programm/kinderkarate", destination: "/kampfkunst/kinderkarate" },
  { source: "/programm/selbstverteidigung", destination: "/kampfkunst/selbstverteidigung" },
  { source: "/programm/massage", destination: "/regeneration/massage" },
  { source: "/programm/yoga", destination: "/regeneration/yoga" },
  { source: "/solarium", destination: "/regeneration/solarium" },
  { source: "/ueberuns", destination: "/ueber-uns" },
  { source: "/datenschutzerklärung", destination: "/datenschutz" },
  { source: "/datenschutzerklaerung", destination: "/datenschutz" },
];
