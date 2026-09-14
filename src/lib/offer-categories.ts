/** Matches the offers.category check constraint in supabase/migrations/0001_initial_schema.sql. */
export const OFFER_CATEGORIES = ["mitgliedschaft", "probetraining", "aktion", "einmalig"] as const;

export const OFFER_CATEGORY_LABELS: Record<(typeof OFFER_CATEGORIES)[number], string> = {
  mitgliedschaft: "Mitgliedschaft",
  probetraining: "Probetraining / Einstieg",
  aktion: "Aktion",
  einmalig: "Einmalig",
};
