import Link from "next/link";
import { MediaPanel } from "@/components/shared/MediaPanel";
import type { TextureVariant } from "@/components/shared/TexturePanel";

const categories: {
  title: string;
  href: string;
  texture: TextureVariant;
  big?: boolean;
  image?: string;
  imageAlt?: string;
}[] = [
  {
    title: "Studio",
    href: "/training",
    texture: "performance",
    big: true,
    image: "/media/hero/hero-desktop.webp",
    imageAlt: "Trainer bespricht mit einer Kundin im Sportpark Pollack ihren Trainingsplan",
  },
  {
    title: "Fitness",
    href: "/training",
    texture: "performance",
    image: "/media/training/fitness-mann.webp",
    imageAlt: "Mann trainiert an einem geführten Kraftgerät im Sportpark Pollack",
  },
  {
    title: "Gesundheit",
    href: "/gesundheit",
    texture: "health",
    image: "/media/gesundheit/five-bambus-moos.webp",
    imageAlt: "Der neue FIVE Rücken- und Gelenkbereich mit Bambus- und Mooswänden im Sportpark Pollack",
  },
  {
    title: "Kampfkunst",
    href: "/kampfkunst",
    texture: "kampfkunst",
    image: "/media/kampfkunst/kinderkarate.webp",
    imageAlt: "Kind trainiert Kinderkarate am Kickschild im Sportpark Pollack",
  },
  {
    title: "Community",
    href: "/ueber-uns",
    texture: "community",
    image: "/media/community/team-gruppe.webp",
    imageAlt: "Trainer und Mitglieder gemeinsam im Sportpark Pollack",
  },
  {
    title: "Regeneration",
    href: "/regeneration",
    texture: "regeneration",
    big: true,
    image: "/media/regeneration/solarium.webp",
    imageAlt: "Das Ergoline-Solarium im Sportpark Pollack",
  },
];

/**
 * Category explorer standing in for the full video/photo gallery described in the brief.
 * All six tiles now show real Sportpark photos (see MEDIA_AUDIT.md).
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
          weiteres Material freigegeben ist.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative overflow-hidden rounded-2xl ${cat.big ? "col-span-2 aspect-[16/9] lg:aspect-[16/10]" : "aspect-square lg:aspect-[4/3]"}`}
            >
              <MediaPanel
                src={cat.image}
                alt={cat.imageAlt}
                variant={cat.texture}
                className="relative h-full w-full transition-transform duration-500 group-hover:scale-105"
                sizes={cat.big ? "100vw" : "(min-width: 1024px) 33vw, 50vw"}
              />
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
