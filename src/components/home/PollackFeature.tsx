import { ArrowRight } from "lucide-react";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { Button } from "@/components/shared/Button";
import { studioStory } from "@/content/about";
import { siteConfig } from "@/content/site";

export type OwnerContent = {
  name: string;
  role: string;
  intro: string;
  story: string;
  qualifications: string[];
  portrait: string | null;
  portraitFocalX?: number;
  portraitFocalY?: number;
};

export function PollackFeature({ content }: { content: OwnerContent }) {
  const storyParagraphs = content.story.split("\n\n");
  return (
    <section id="ueber-uns" className="scroll-mt-20 bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">Seit {siteConfig.foundedYear}</span>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          {studioStory.headline}
        </h2>
        {studioStory.paragraphs.map((p) => (
          <p key={p} className="mt-4 max-w-2xl text-paper/70">
            {p}
          </p>
        ))}
        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-paper/10 bg-anthracite p-5 sm:grid-cols-4 sm:p-6">
          {studioStory.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs uppercase tracking-wide text-paper/45">{f.label}</dt>
              <dd className="mt-1 font-display text-lg text-paper">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <MediaPanel
          src={content.portrait}
          alt={content.name}
          variant="kampfkunst"
          className="relative aspect-[4/5] w-full rounded-2xl"
          label={content.name}
          sizes="(min-width: 1024px) 45vw, 100vw"
          focalX={content.portraitFocalX}
          focalY={content.portraitFocalY}
        />
        <div>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">{content.role}</span>
          <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
            {content.name}
          </h3>
          <p className="mt-5 max-w-xl text-paper/75">{content.intro}</p>
          {storyParagraphs.map((p) => (
            <p key={p} className="mt-3 max-w-xl text-paper/75">
              {p}
            </p>
          ))}
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-paper/70 sm:grid-cols-2">
            {content.qualifications.map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                {q}
              </li>
            ))}
          </ul>
          <Button href="/#probetraining" variant="primary" className="mt-6">
            Probetraining starten <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
