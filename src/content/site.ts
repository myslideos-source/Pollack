export const siteConfig = {
  name: "Sportpark Pollack",
  claim: "Stark. Beweglich. Bereit.",
  tagline: "Fitness, Gesundheit und Kampfkunst – persönlich begleitet im Sportpark Pollack.",
  url: "https://www.sportpark-pollack.de",
  locale: "de-DE",
  foundedYear: 1987,
} as const;

export const contact = {
  name: "Sportpark Pollack",
  street: "Hohe Straße 12",
  zip: "74579",
  city: "Fichtenau",
  region: "Baden-Württemberg",
  country: "DE",
  phone: "07962 7113970",
  phoneDisplay: "07962 / 71 13 970",
  phoneHref: "tel:+4979627113970",
  email: "info@sportpark-pollack.de",
  whatsapp: "+491728644603",
  whatsappDisplay: "0172 / 86 44 603",
  whatsappHref: "https://wa.me/491728644603",
  // Coordinates are approximate (Fichtenau, Hohe Straße) and pending client confirmation
  // before use in structured data — see TODO_CLIENT.md.
  lat: 49.1155,
  lng: 10.0086,
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${contact.whatsapp.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

export const primaryNav = [
  { label: "Start", href: "/" },
  { label: "Training", href: "/#kraft-performance" },
  { label: "Gesundheit", href: "/#gesundheit" },
  { label: "Kampfkunst", href: "/#kampfkunst-selbstvertrauen" },
  { label: "Regeneration", href: "/#regeneration-balance" },
  { label: "Partner", href: "/#partner" },
  { label: "Preise", href: "/#preise" },
  { label: "Über uns", href: "/#ueber-uns" },
  { label: "Kontakt", href: "/#kontakt" },
] as const;

export const trustStats = [
  { value: "1.200", unit: "m²", label: "moderne Trainingsfläche" },
  { value: "6", unit: "", label: "Trainingszonen" },
  { value: "40+", unit: "", label: "Parkplätze direkt vor Ort" },
  { value: siteConfig.foundedYear.toString(), unit: "", label: "Erfahrung seit" },
] as const;
