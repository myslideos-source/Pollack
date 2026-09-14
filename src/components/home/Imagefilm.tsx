"use client";

import { useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { imagefilm } from "@/content/imagefilm";

/**
 * Cinematic full-bleed section directly below the Hero. Before interaction, a short muted
 * loop of the drone establishing shot plays as ambient texture (falls back to a static
 * poster under prefers-reduced-motion) — the only autoplay content besides the Hero itself,
 * a deliberate exception for this hero-adjacent placement. Clicking swaps in the full film
 * with sound; nothing beyond the small teaser loop loads before that click.
 */
export function Imagefilm() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative aspect-video w-full sm:aspect-[21/9]">
        {playing ? (
          <video
            key="full"
            className="absolute inset-0 h-full w-full object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={imagefilm.poster}
          >
            <source src={imagefilm.src} type="video/mp4" />
          </video>
        ) : (
          <>
            <video
              key="teaser"
              className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={imagefilm.poster}
            >
              <source src={imagefilm.teaserSrc} type="video/mp4" />
            </video>
            {/* eslint-disable-next-line @next/next/no-img-element -- reduced-motion fallback, no next/image benefit for a fixed background layer */}
            <img
              src={imagefilm.poster}
              alt=""
              className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/55" />

            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 text-center"
              aria-label={`Imagefilm abspielen — ${imagefilm.durationLabel}, mit Ton`}
            >
              <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                <span className="absolute inset-0 rounded-full bg-red/50 motion-safe:animate-ping" />
                <span className="relative flex h-full w-full items-center justify-center rounded-full bg-red text-paper shadow-2xl transition-transform group-hover:scale-110">
                  <Play size={30} fill="currentColor" className="ml-1" />
                </span>
              </span>
              <span>
                <span className="block font-display text-sm uppercase tracking-[0.3em] text-red">
                  {imagefilm.eyebrow}
                </span>
                <span className="mt-3 block font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-6xl">
                  {imagefilm.headline}
                </span>
                <span className="mt-3 flex items-center justify-center gap-2 text-sm text-paper/70">
                  <Volume2 size={14} aria-hidden="true" /> {imagefilm.durationLabel} &middot; mit Ton ansehen
                </span>
              </span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
