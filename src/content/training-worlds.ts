import type { TextureVariant } from "@/components/shared/TexturePanel";
import type { PulseZone } from "@/components/shared/PulseLine";

export type TrainingWorldDef = {
  id: string;
  title: string;
  copy: string;
  texture: TextureVariant;
  zone: PulseZone;
  image?: string;
  imageAlt?: string;
  programSlugs: string[];
};

export const TRAINING_WORLD_DEFS: TrainingWorldDef[] = [
  {
    id: "kraft-performance",
    title: "Kraft & Performance",
    copy: "Freihanteln, Plate-Loaded und Technogym auf 1.200 m² – für alle, die an ihre Grenzen und darüber hinaus wollen.",
    texture: "performance",
    zone: "performance",
    image: "/media/training/hardcore-area.webp",
    imageAlt: "Die Hardcore Area mit Plate-Loaded-Maschinen und freien Gewichten im Sportpark Pollack",
    programSlugs: ["fitness", "technogym", "plate-loaded"],
  },
  {
    id: "ruecken-beweglichkeit",
    title: "Rücken & Beweglichkeit",
    copy: "FIVE trainiert gezielt, was dein Rücken im Alltag braucht – kurz, klar strukturiert, wirksam.",
    texture: "health",
    zone: "health",
    image: "/media/gesundheit/five-bambus-moos.webp",
    imageAlt: "Der neue FIVE Rücken- und Gelenkbereich mit Bambus- und Mooswänden im Sportpark Pollack",
    programSlugs: ["five"],
  },
  {
    id: "koerperanalyse-fortschritt",
    title: "Körperanalyse & Fortschritt",
    copy: "Die InBody 270 zeigt dir, woraus dein Körper wirklich besteht – nicht nur, was die Waage sagt.",
    texture: "health",
    zone: "health",
    programSlugs: ["inbody", "milon"],
  },
  {
    id: "kampfkunst-selbstvertrauen",
    title: "Kampfkunst & Selbstvertrauen",
    copy: "Karate, Kinderkarate und Selbstverteidigung – angeleitet von einem erfahrenen Gewaltschutztrainer.",
    texture: "kampfkunst",
    zone: "kampfkunst",
    image: "/media/kampfkunst/kinderkarate.webp",
    imageAlt: "Kind trainiert Kinderkarate am Kickschild im Sportpark Pollack",
    programSlugs: ["karate", "kinderkarate", "selbstverteidigung"],
  },
  {
    id: "regeneration-balance",
    title: "Regeneration & Balance",
    copy: "brainLight, Yoga und die Chillout-Lounge – Erholung ist Teil des Trainings, nicht sein Gegenteil.",
    texture: "regeneration",
    zone: "regeneration",
    programSlugs: ["massage", "yoga", "solarium"],
  },
];
