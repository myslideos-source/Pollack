"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { christianWolfShoutout as cw } from "@/content/community";

/**
 * Both Christian Wolf clips are portrait (720×1280) phone recordings, so they share one
 * vertical "phone frame" card with tabs to switch between them — rather than forcing the
 * second clip into a wide grid tile elsewhere, which used to crop its actual subject
 * (the MORE Nutrition shelf) out of frame. `key={active}` forces VideoPlayer to remount on
 * tab switch, so a playing clip resets to its poster instead of continuing off-screen.
 */
export function CommunityShoutout() {
  const [active, setActive] = useState(0);
  const clip = cw.clips[active];

  return (
    <section id="christian-wolf" className="bg-anthracite py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div className="order-2 lg:order-1">
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
            Das sagt die Community
          </span>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            &bdquo;{cw.quote}&ldquo;
          </h2>
          <p className="mt-5 max-w-lg text-paper/75">{cw.intro}</p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/5 py-2 pl-2 pr-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red text-paper">
              <Sparkles size={18} />
            </span>
            <span>
              <span className="block font-display text-sm uppercase tracking-wide text-paper">
                {cw.name}
              </span>
              <span className="block text-xs text-paper/55">
                {cw.handle} &middot; {cw.platform}
              </span>
            </span>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[300px] lg:order-2">
          <VideoPlayer
            key={clip.id}
            src={clip.src}
            poster={clip.poster}
            label={clip.label}
            className="aspect-[9/16] w-full rounded-3xl border border-paper/10 shadow-2xl"
          />
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Video auswählen">
            {cw.clips.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-2 font-display text-xs uppercase tracking-wide transition-colors ${
                  i === active
                    ? "bg-red text-paper"
                    : "border border-paper/20 text-paper/60 hover:border-paper/40 hover:text-paper"
                }`}
              >
                {c.tabLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
