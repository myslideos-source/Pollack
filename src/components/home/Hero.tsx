"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ChevronRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { TexturePanel } from "@/components/shared/TexturePanel";
import { heroMedia } from "@/content/media";

export type HeroContent = {
  headline: string;
  subline: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  imageDesktopSrc: string | null;
  imageMobileSrc: string | null;
};

export function Hero({ content }: { content: HeroContent }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const hasVideo = Boolean(heroMedia.videoSrc);
  const imageDesktopSrc = content.imageDesktopSrc ?? heroMedia.imageDesktopSrc;
  const imageMobileSrc = content.imageMobileSrc ?? heroMedia.imageMobileSrc;

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {hasVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroMedia.posterSrc ?? undefined}
          >
            {heroMedia.videoSrc ? <source src={heroMedia.videoSrc} type="video/mp4" /> : null}
          </video>
        ) : imageDesktopSrc ? (
          // Art-directed crop per breakpoint via <picture>: the browser only fetches the
          // source that matches, so phones never download the wide desktop composition.
          <picture>
            {imageMobileSrc ? <source media="(max-width: 639px)" srcSet={imageMobileSrc} /> : null}
            <img
              src={imageDesktopSrc}
              alt={heroMedia.imageAlt}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </picture>
        ) : (
          <TexturePanel variant="performance" className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      {hasVideo ? (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute right-4 top-24 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 bg-ink/50 text-paper backdrop-blur-sm motion-reduce:hidden sm:right-6"
          aria-label={muted ? "Ton einschalten" : "Ton ausschalten"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      ) : null}

      <div className="relative z-10 w-full px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <span className="mb-4 inline-block font-display text-sm uppercase tracking-[0.3em] text-red">
            Fitness · Gesundheit · Kampfkunst
          </span>
          <h1 className="font-display text-[15vw] font-extrabold leading-[0.9] tracking-tight text-paper sm:text-7xl lg:text-8xl">
            {content.headline
              .split(/(?<=\.)\s+/)
              .filter(Boolean)
              .map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
          </h1>
          <p className="mt-6 max-w-md text-base text-paper/80 sm:text-lg">{content.subline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/kontakt#probetraining" variant="primary">
              {content.ctaPrimaryLabel} <ChevronRight size={16} />
            </Button>
            <Button href="/trainingsfinder" variant="secondary">
              {content.ctaSecondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
