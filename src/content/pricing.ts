/**
 * Pricing data, centralized so it is written in exactly one place.
 *
 * None of the values below are confirmed: the live pricing page could not be crawled
 * from this build environment, and the task brief explicitly requires that prices
 * never be guessed or misassigned. Every tier therefore ships as "Preis auf Anfrage"
 * until the client supplies the real, current numbers — see TODO_CLIENT.md.
 */
export type PricingTier = {
  id: string;
  name: string;
  description: string;
  priceConfirmed: false;
  priceNote: "Preis auf Anfrage";
  features: string[];
};

export const pricingTiers: PricingTier[] = [
  {
    id: "monatsbeitrag",
    name: "Monatsbeitrag",
    description: "Reguläre Mitgliedschaft mit Zugang zur gesamten Trainingsfläche.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Zugang zu allen Trainingszonen", "Laufzeit und Konditionen auf Anfrage"],
  },
  {
    id: "schueler",
    name: "Schülerpreis",
    description: "Vergünstigte Mitgliedschaft für Schüler:innen.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Für Schüler:innen mit gültigem Nachweis"],
  },
  {
    id: "schnuppermonat",
    name: "Schnuppermonat",
    description: "Einen Monat unverbindlich reintesten.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Zeitlich begrenzter Einstieg ohne lange Bindung"],
  },
  {
    id: "winterpaket",
    name: "Winterpaket",
    description: "Saisonales Trainingspaket.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Saisonal verfügbar"],
  },
  {
    id: "zehnerkarte",
    name: "Zehnerkarte",
    description: "Zehn Trainingseinheiten flexibel nutzbar.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Flexibel, ohne feste Mitgliedschaft"],
  },
  {
    id: "inbody",
    name: "InBody-Analyse",
    description: "Einzelne Körperanalyse mit der InBody 270.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Auch ohne Mitgliedschaft buchbar"],
  },
  {
    id: "selbstverteidigung",
    name: "Selbstverteidigungskurse",
    description: "Kursreihe Selbstverteidigung.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Angeleitet von Jürgen Pollack"],
  },
  {
    id: "personaltraining",
    name: "Personaltraining",
    description: "1:1-Betreuung nach deinem Ziel.",
    priceConfirmed: false,
    priceNote: "Preis auf Anfrage",
    features: ["Individuelle Terminplanung"],
  },
];

export const pricingExtras = [
  { id: "getraenkeflat", label: "Getränkeflat", note: "Preis auf Anfrage" },
  { id: "aufnahmepauschale", label: "Aufnahme- und Servicepauschale", note: "Preis auf Anfrage" },
] as const;

export const hansefit = {
  active: true,
  name: "Hansefit",
  description:
    "Der Sportpark Pollack ist Hansefit-Partner. Details zur Nutzung und den enthaltenen Leistungen erfährst du bei uns vor Ort oder direkt bei Hansefit.",
};
