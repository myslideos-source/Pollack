"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight, Check } from "lucide-react";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { PulseLine } from "@/components/shared/PulseLine";
import type { Program } from "@/content/programs";
import type { TrainingWorldDef } from "@/content/training-worlds";

export type TrainingWorldWithPrograms = TrainingWorldDef & { programs: Program[] };

export function TrainingWorlds({ worlds }: { worlds: TrainingWorldWithPrograms[] }) {
  const detailsRefs = useRef<Record<string, HTMLDetailsElement | null>>({});

  useEffect(() => {
    function openFromHash() {
      const el = detailsRefs.current[window.location.hash.slice(1)];
      if (el) el.open = true;
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <section id="trainingswelten" className="scroll-mt-20 bg-ink py-16 sm:py-24" aria-label="Trainingswelten im Sportpark Pollack">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Fünf Trainingswelten. Ein Sportpark.
        </h2>
      </div>

      <div className="mt-10 flex flex-col">
        {worlds.map((world, i) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <MediaPanel
                src={world.image}
                alt={world.imageAlt}
                variant={world.texture}
                className={`relative aspect-[4/3] w-full rounded-2xl lg:aspect-[5/4] ${i % 2 === 1 ? "lg:order-2" : ""}`}
                label={world.title}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <span className="font-display text-sm uppercase tracking-[0.3em] text-paper/40">0{i + 1}</span>
                <h3 className="mt-2 font-display text-3xl font-semibold text-paper sm:text-4xl">{world.title}</h3>
                <p className="mt-4 max-w-md text-paper/70">{world.copy}</p>
                <PulseLine zone={world.zone} className="mt-6 max-w-xs" />
              </div>
            </div>

            <details
              id={world.id}
              ref={(el) => {
                detailsRefs.current[world.id] = el;
              }}
              className="group/details mt-8 scroll-mt-24 rounded-2xl border border-paper/10 bg-anthracite"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-sm uppercase tracking-wide text-paper">
                Alle Leistungen in {world.title} ansehen
                <ChevronDown size={18} className="shrink-0 text-paper/50 transition-transform group-open/details:rotate-180" />
              </summary>
              <div className="grid gap-5 border-t border-paper/10 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {world.programs.map((program) => (
                  <div key={program.slug} className="flex flex-col rounded-2xl border border-paper/10 bg-ink p-5">
                    <h4 className="font-display text-lg uppercase tracking-wide text-paper">{program.title}</h4>
                    <p className="mt-2 text-sm text-paper/65">{program.summary}</p>
                    {program.bullets.length > 0 ? (
                      <ul className="mt-3 space-y-1.5">
                        {program.bullets.slice(0, 4).map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs text-paper/60">
                            <Check size={13} className="mt-0.5 shrink-0 text-red" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {program.facts && program.facts.length > 0 ? (
                      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-paper/45">
                        {program.facts.map((f) => (
                          <div key={f.label} className="flex gap-1">
                            <dt>{f.label}:</dt>
                            <dd className="text-paper/60">{f.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    {program.video ? (
                      <VideoPlayer
                        src={program.video.src}
                        poster={program.video.poster}
                        label={program.video.label}
                        className="mt-4 aspect-video w-full rounded-xl"
                      />
                    ) : null}
                    <Link
                      href="/#probetraining"
                      className="mt-4 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wide text-red hover:text-red-dark"
                    >
                      Probetraining starten <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
