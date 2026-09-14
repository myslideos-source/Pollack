"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-play video: nothing but the poster image loads until the visitor actively
 * presses play (no `<video>` element exists in the DOM before that, so no video bytes
 * are fetched). Matches the brief's requirement that only the hero video may autoplay
 * (muted) — every other video loads on demand and never plays sound automatically.
 */
export function VideoPlayer({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={`relative overflow-hidden bg-ink ${className}`}>
        <video
          className="h-full w-full object-cover"
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative block overflow-hidden ${className}`}
      aria-label={`Video abspielen: ${label}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- lightweight poster-only element, no next/image benefit for a button background */}
      <img src={poster} alt="" className="h-full w-full object-cover" loading="lazy" />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/35">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red text-paper shadow-lg transition-transform group-hover:scale-110">
          <Play size={26} fill="currentColor" className="ml-1" />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-left">
        <span className="font-display text-sm uppercase tracking-wide text-paper">{label}</span>
      </span>
    </button>
  );
}
