import { Sparkles } from "lucide-react";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { christianWolfShoutout as cw } from "@/content/community";

export function CommunityShoutout() {
  return (
    <section className="bg-anthracite py-16 sm:py-24">
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
            src={cw.video.src}
            poster={cw.video.poster}
            label={cw.video.label}
            className="aspect-[9/16] w-full rounded-3xl border border-paper/10 shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
