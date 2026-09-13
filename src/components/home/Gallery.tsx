import Link from "next/link";
import { TexturePanel, type TextureVariant } from "@/components/shared/TexturePanel";

const categories: { title: string; href: string; texture: TextureVariant; big?: boolean }[] = [
  { title: "Studio", href: "/training", texture: "performance", big: true },
  { title: "Fitness", href: "/training", texture: "performance" },
  { title: "Gesundheit", href: "/gesundheit", texture: "health" },
  { title: "Kampfkunst", href: "/kampfkunst", texture: "kampfkunst" },
  { title: "Community", href: "/ueber-uns", texture: "community" },
  { title: "Regeneration", href: "/regeneration", texture: "regeneration", big: true },
];

/**
 * Category explorer standing in for the full video/photo gallery described in the brief.
 * Real Sportpark photography and video could not be sourced in this build (see
 * MEDIA_AUDIT.md) — once approved assets land, swap TexturePanel for real thumbnails/
 * video posters here and wire up the lightbox.
 */
export function Gallery() {
  return (
    <section className="bg-ink py-16 sm:py-24" aria-label="Der Sportpark in Bewegung">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Der Sportpark in Bewegung
        </h2>
        <p className="mt-3 max-w-xl text-paper/60">
          Ein Einblick in unsere Bereiche – die vollständige Bild- und Videogalerie folgt, sobald
          aktuelles Material freigegeben ist.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative overflow-hidden rounded-2xl ${cat.big ? "col-span-2 aspect-[16/9] lg:aspect-[16/10]" : "aspect-square lg:aspect-[4/3]"}`}
            >
              <TexturePanel variant={cat.texture} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                <span className="font-display text-lg uppercase tracking-wide text-paper sm:text-xl">
                  {cat.title}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
