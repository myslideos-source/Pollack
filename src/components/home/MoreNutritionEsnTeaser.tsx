import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { TexturePanel } from "@/components/shared/TexturePanel";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { moreNutritionEsn } from "@/content/partners";

export function MoreNutritionEsnTeaser() {
  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
          MORE Nutrition &amp; ESN
        </span>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            {moreNutritionEsn.headline}
          </h2>
          <p className="max-w-md text-paper/60">{moreNutritionEsn.subline}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MediaPanel
            src="/media/partner/more-nutrition.webp"
            alt="MORE Nutrition Chunky Proteinriegel-Dosen im Sportpark Pollack"
            variant="community"
            className="relative col-span-2 aspect-[16/9] w-full rounded-2xl lg:col-span-2 lg:row-span-2 lg:aspect-auto"
            label="MORE Nutrition & ESN"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <TexturePanel variant="performance" className="aspect-square w-full rounded-2xl" label={moreNutritionEsn.more.name} />
          <TexturePanel variant="performance" className="aspect-square w-full rounded-2xl" label={moreNutritionEsn.esn.name} />
          <TexturePanel variant="community" className="col-span-2 aspect-[16/9] w-full rounded-2xl lg:col-span-2" label="Produktvideo" />
        </div>

        <p className="mt-6 max-w-2xl text-sm text-paper/60">{moreNutritionEsn.intro}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href="/partner-produkte" variant="primary">
            {moreNutritionEsn.cta} <ArrowRight size={16} />
          </Button>
          <Link href="/partner-produkte" className="text-sm text-paper/50 hover:text-paper/80">
            {moreNutritionEsn.availabilityNote}
          </Link>
        </div>
      </div>
    </section>
  );
}
