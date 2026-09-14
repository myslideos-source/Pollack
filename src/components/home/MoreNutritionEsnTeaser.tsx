import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { TexturePanel } from "@/components/shared/TexturePanel";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { loadProducts } from "@/lib/content/partners-data";

export async function MoreNutritionEsnTeaser() {
  const products = await loadProducts();
  const more = products.find((p) => p.name === "MORE Nutrition");
  const esn = products.find((p) => p.name === "ESN");
  if (!more && !esn) return null;
  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
          MORE Nutrition &amp; ESN
        </span>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Dein Training endet nicht am letzten Satz.
          </h2>
          <p className="max-w-md text-paper/60">
            Ausgewählte Produkte von MORE Nutrition und ESN – direkt bei uns im Sportpark.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MediaPanel
            src={more?.imageSrc ?? "/media/partner/more-nutrition.webp"}
            alt="MORE Nutrition Chunky Proteinriegel-Dosen im Sportpark Pollack"
            variant="community"
            className="relative col-span-2 aspect-[16/9] w-full rounded-2xl lg:col-span-2 lg:row-span-2 lg:aspect-auto"
            label="MORE Nutrition & ESN"
            sizes="(min-width: 1024px) 50vw, 100vw"
            focalX={more?.imageFocalX}
            focalY={more?.imageFocalY}
          />
          {more ? (
            <TexturePanel variant="performance" className="aspect-square w-full rounded-2xl" label={more.name} />
          ) : null}
          {esn ? (
            <MediaPanel
              src={esn.imageSrc}
              alt={`${esn.name} Produkte im Sportpark Pollack`}
              variant="performance"
              className="relative aspect-square w-full rounded-2xl"
              label={esn.name}
              sizes="(min-width: 1024px) 25vw, 50vw"
              focalX={esn.imageFocalX}
              focalY={esn.imageFocalY}
            />
          ) : null}
          <TexturePanel variant="community" className="col-span-2 aspect-[16/9] w-full rounded-2xl lg:col-span-2" label="Produktvideo" />
        </div>

        <p className="mt-6 max-w-2xl text-sm text-paper/60">
          Ernährung ist Teil des Trainingserfolgs. Deshalb findest du bei uns vor Ort ausgewählte Produkte von MORE
          Nutrition und ESN – für den Shake direkt nach dem Training oder den Snack für unterwegs.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href="/partner-produkte" variant="primary">
            Produkte vor Ort entdecken <ArrowRight size={16} />
          </Button>
          <Link href="/partner-produkte" className="text-sm text-paper/50 hover:text-paper/80">
            Bei uns im Sportpark erhältlich – kein Online-Verkauf über diese Website.
          </Link>
        </div>
      </div>
    </section>
  );
}
