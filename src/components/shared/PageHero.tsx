import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TexturePanel, type TextureVariant } from "@/components/shared/TexturePanel";
import { MediaPanel } from "@/components/shared/MediaPanel";

export function PageHero({
  eyebrow,
  title,
  intro,
  texture = "performance",
  image,
  imageAlt,
  imageFocalX,
  imageFocalY,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  texture?: TextureVariant;
  image?: string;
  imageAlt?: string;
  imageFocalX?: number;
  imageFocalY?: number;
  breadcrumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-14 pt-28 sm:pb-20 sm:pt-36">
      {image ? (
        <MediaPanel
          src={image}
          alt={imageAlt}
          className="absolute inset-0"
          priority
          sizes="100vw"
          focalX={imageFocalX}
          focalY={imageFocalY}
        />
      ) : (
        <TexturePanel variant={texture} className="absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-paper/50">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight size={12} /> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-paper/80">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-paper/80">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        {eyebrow ? (
          <span className="mb-3 block font-display text-sm uppercase tracking-[0.3em] text-red">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl">
          {title}
        </h1>
        {intro ? <p className="mt-5 max-w-2xl text-paper/75 sm:text-lg">{intro}</p> : null}
      </div>
    </section>
  );
}
