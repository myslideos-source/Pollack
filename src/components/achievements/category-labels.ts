export const CATEGORY_LABELS: Record<string, string> = {
  einstieg: "Einstieg",
  regelmaessigkeit: "Regelmäßigkeit",
  training: "Training",
  fortschritt: "Fortschritt",
  beweglichkeit_gesundheit: "Beweglichkeit & Gesundheit",
  kurse: "Kurse",
  kampfkunst: "Kampfkunst",
  mitgliedschaft: "Mitgliedschaft",
  trainer: "Trainer-Auszeichnung",
  geheim: "Geheim",
};

export const TIER_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silber: "Silber",
  gold: "Gold",
  platin: "Platin",
};

export const FILTER_CATEGORIES: { value: string; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "einstieg", label: "Einstieg" },
  { value: "regelmaessigkeit", label: "Regelmäßigkeit" },
  { value: "training", label: "Training" },
  { value: "fortschritt", label: "Fortschritt" },
  { value: "beweglichkeit_gesundheit", label: "Beweglichkeit & Gesundheit" },
  { value: "kurse", label: "Kurse" },
  { value: "kampfkunst", label: "Kampfkunst" },
  { value: "trainer", label: "Trainer-Auszeichnungen" },
  { value: "geheim", label: "Geheim" },
];
