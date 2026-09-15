/**
 * Legacy URL → new URL mapping, consumed by next.config.ts redirects().
 * Keep this the single source of truth so old links and search rankings survive the relaunch.
 *
 * The public site is a one-page site as of the Etappe-2 relaunch: former subpages now live as
 * anchor sections on the homepage. Order matters — Next.js checks entries in order and uses the
 * first match, so specific paths must be listed before any wildcard that would also match them.
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  // Kontaktformular / Probetraining
  { source: "/more-und-esn", destination: "/#partner" },
  { source: "/regeneration/more-nutrition-esn", destination: "/#partner" },
  { source: "/Programm/Probetraining", destination: "/#probetraining" },
  { source: "/programm/probetraining", destination: "/#probetraining" },
  { source: "/training/probetraining", destination: "/#probetraining" },

  // Training → Kraft & Performance
  { source: "/programm/fitness", destination: "/#kraft-performance" },
  { source: "/training", destination: "/#kraft-performance" },
  { source: "/training/:slug*", destination: "/#kraft-performance" },

  // Gesundheit → Rücken & Beweglichkeit / Körperanalyse & Fortschritt
  { source: "/programm/milon", destination: "/#koerperanalyse-fortschritt" },
  { source: "/programm/five", destination: "/#ruecken-beweglichkeit" },
  { source: "/programm/inbody", destination: "/#koerperanalyse-fortschritt" },
  { source: "/gesundheit/milon", destination: "/#koerperanalyse-fortschritt" },
  { source: "/gesundheit/five", destination: "/#ruecken-beweglichkeit" },
  { source: "/gesundheit/inbody", destination: "/#koerperanalyse-fortschritt" },
  { source: "/gesundheit", destination: "/#gesundheit" },

  // Kampfkunst → Kampfkunst & Selbstvertrauen
  { source: "/programm/karate", destination: "/#kampfkunst-selbstvertrauen" },
  { source: "/programm/kinderkarate", destination: "/#kampfkunst-selbstvertrauen" },
  { source: "/programm/selbstverteidigung", destination: "/#kampfkunst-selbstvertrauen" },
  { source: "/kampfkunst", destination: "/#kampfkunst-selbstvertrauen" },
  { source: "/kampfkunst/:slug*", destination: "/#kampfkunst-selbstvertrauen" },

  // Regeneration → Regeneration & Balance
  { source: "/programm/massage", destination: "/#regeneration-balance" },
  { source: "/programm/yoga", destination: "/#regeneration-balance" },
  { source: "/solarium", destination: "/#regeneration-balance" },
  { source: "/regeneration", destination: "/#regeneration-balance" },
  { source: "/regeneration/:slug*", destination: "/#regeneration-balance" },

  // Weitere zusammengelegte Unterseiten
  { source: "/partner-produkte", destination: "/#partner" },
  { source: "/preise", destination: "/#preise" },
  { source: "/ueber-uns", destination: "/#ueber-uns" },
  { source: "/ueberuns", destination: "/#ueber-uns" },
  { source: "/kontakt", destination: "/#kontakt" },
  { source: "/trainingsfinder", destination: "/#zielfinder" },

  // Rechtliches
  { source: "/datenschutzerklärung", destination: "/datenschutz" },
  { source: "/datenschutzerklaerung", destination: "/datenschutz" },
];
