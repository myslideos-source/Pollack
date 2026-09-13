import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaPanel } from "@/components/shared/MediaPanel";
import type { Program } from "@/content/programs";

export function ProgramGrid({ programs }: { programs: Program[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <Link
          key={program.slug}
          href={`/${program.category}/${program.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-paper/10 bg-anthracite transition-colors hover:border-paper/25"
        >
          <MediaPanel
            src={program.image}
            alt={program.imageAlt}
            variant={program.texture}
            className="relative aspect-[16/10] w-full"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-xl uppercase tracking-wide text-paper">{program.title}</h3>
            <p className="mt-2 flex-1 text-sm text-paper/65">{program.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 font-display text-sm uppercase tracking-wide text-red">
              Mehr erfahren
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
