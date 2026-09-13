"use client";

import { motion } from "motion/react";
import { TexturePanel, type TextureVariant } from "@/components/shared/TexturePanel";
import { PulseLine, type PulseZone } from "@/components/shared/PulseLine";

const worlds: {
  title: string;
  copy: string;
  texture: TextureVariant;
  zone: PulseZone;
}[] = [
  {
    title: "Kraft & Performance",
    copy: "Freihanteln, Plate-Loaded und Technogym auf 1.200 m² – für alle, die an ihre Grenzen und darüber hinaus wollen.",
    texture: "performance",
    zone: "performance",
  },
  {
    title: "Rücken & Beweglichkeit",
    copy: "FIVE trainiert gezielt, was dein Rücken im Alltag braucht – kurz, klar strukturiert, wirksam.",
    texture: "health",
    zone: "health",
  },
  {
    title: "Körperanalyse & Fortschritt",
    copy: "Die InBody 270 zeigt dir, woraus dein Körper wirklich besteht – nicht nur, was die Waage sagt.",
    texture: "health",
    zone: "health",
  },
  {
    title: "Kampfkunst & Selbstvertrauen",
    copy: "Karate, Kinderkarate und Selbstverteidigung – angeleitet von einem erfahrenen Gewaltschutztrainer.",
    texture: "kampfkunst",
    zone: "kampfkunst",
  },
  {
    title: "Regeneration & Balance",
    copy: "brainLight, Yoga und die Chillout-Lounge – Erholung ist Teil des Trainings, nicht sein Gegenteil.",
    texture: "regeneration",
    zone: "regeneration",
  },
];

export function TrainingWorlds() {
  return (
    <section className="bg-ink py-16 sm:py-24" aria-label="Trainingswelten im Sportpark Pollack">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Fünf Trainingswelten. Ein Sportpark.
        </h2>
      </div>

      <div className="mt-10 flex flex-col">
        {worlds.map((world, i) => (
          <motion.div
            key={world.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8"
          >
            <TexturePanel
              variant={world.texture}
              className={`aspect-[4/3] w-full rounded-2xl lg:aspect-[5/4] ${i % 2 === 1 ? "lg:order-2" : ""}`}
              label={world.title}
            />
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-paper/40">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-display text-3xl font-semibold text-paper sm:text-4xl">
                {world.title}
              </h3>
              <p className="mt-4 max-w-md text-paper/70">{world.copy}</p>
              <PulseLine zone={world.zone} className="mt-6 max-w-xs" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
