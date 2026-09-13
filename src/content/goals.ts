export type GoalId = "staerker" | "ruecken" | "abnehmen" | "beweglich" | "sicher";

export const goals: {
  id: GoalId;
  title: string;
  blurb: string;
  programSlugs: string[];
  accent: "performance" | "health" | "kampfkunst";
}[] = [
  {
    id: "staerker",
    title: "Stärker werden",
    blurb: "Kraft aufbauen mit freien Gewichten, Plate-Loaded und Technogym-Geräten.",
    programSlugs: ["fitness", "technogym", "plate-loaded"],
    accent: "performance",
  },
  {
    id: "ruecken",
    title: "Rücken entlasten",
    blurb: "Gezieltes Training gegen Verspannungen und Rückenschmerzen.",
    programSlugs: ["five", "milon", "inbody"],
    accent: "health",
  },
  {
    id: "abnehmen",
    title: "Gewicht reduzieren",
    blurb: "Effizientes Training und ehrliche Analyse statt Crash-Diäten.",
    programSlugs: ["fitness", "milon", "inbody"],
    accent: "health",
  },
  {
    id: "beweglich",
    title: "Beweglicher werden",
    blurb: "Mehr Bewegungsfreiheit für Alltag, Sport und Gelenke.",
    programSlugs: ["five", "yoga"],
    accent: "health",
  },
  {
    id: "sicher",
    title: "Sicherer fühlen",
    blurb: "Selbstbewusstsein und echte Selbstverteidigung aus der Kampfkunst.",
    programSlugs: ["karate", "kinderkarate", "selbstverteidigung"],
    accent: "kampfkunst",
  },
];
