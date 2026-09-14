import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaPanel } from "@/components/shared/MediaPanel";

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
  const firstStoryParagraph = content.story.split("\n\n")[0];
  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
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
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            {content.name}
          </h2>
          <p className="mt-5 max-w-xl text-paper/75">{content.intro}</p>
          <p className="mt-3 max-w-xl text-paper/75">{firstStoryParagraph}</p>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-paper/70 sm:grid-cols-2">
            {content.qualifications.slice(0, 8).map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                {q}
              </li>
            ))}
          </ul>
          <Link
            href="/ueber-uns"
            className="mt-6 inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide text-red hover:text-red-dark"
          >
            Seine ganze Geschichte lesen <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
