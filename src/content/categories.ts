import type { ProgramCategory } from "@/content/programs";
import type { TextureVariant } from "@/components/shared/TexturePanel";

export const categoryMeta: Record<
  ProgramCategory,
  { title: string; eyebrow: string; intro: string; texture: TextureVariant; metaDescription: string }
> = {
  training: {
    title: "Training",
    eyebrow: "Kraft & Performance",
    intro:
      "Freihanteln, Plate-Loaded und Technogym auf 1.200 m² Trainingsfläche – für alle, die Fortschritt sehen und spüren wollen.",
    texture: "performance",
    metaDescription:
      "Krafttraining, Technogym und Plate-Loaded Area im Sportpark Pollack in Fichtenau – Fitnessstudio bei Crailsheim mit persönlicher Betreuung.",
  },
  gesundheit: {
    title: "Gesundheit",
    eyebrow: "Mehr als Muskeln",
    intro:
      "Milon, FIVE und InBody – gesundheitsorientiertes Training, das Rücken, Gelenke und Körperzusammensetzung im Blick hat.",
    texture: "health",
    metaDescription:
      "Rückentraining mit FIVE, Milon-Zirkel und InBody Körperanalyse in Fichtenau – gesundheitsorientiertes Training im Sportpark Pollack.",
  },
  kampfkunst: {
    title: "Kampfkunst",
    eyebrow: "Disziplin & Selbstvertrauen",
    intro:
      "Karate, Kinderkarate und Selbstverteidigung – angeleitet von Jürgen Pollack, Karate 2. DAN und ausgebildetem Gewaltschutztrainer.",
    texture: "kampfkunst",
    metaDescription:
      "Karate, Kinderkarate und Selbstverteidigung in Fichtenau – Kampfkunst im Sportpark Pollack, angeleitet von einem erfahrenen Trainer.",
  },
  regeneration: {
    title: "Regeneration",
    eyebrow: "Erholung als Teil des Trainings",
    intro:
      "brainLight-Massage, Yoga, Solarium und Chillout-Lounge – bei uns gehört Erholung genauso zum Training wie die Belastung selbst.",
    texture: "regeneration",
    metaDescription:
      "Massage, Yoga und Solarium im Sportpark Pollack in Fichtenau – Regeneration und Entspannung nach dem Training.",
  },
};
