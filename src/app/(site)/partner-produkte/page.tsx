import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { TexturePanel } from "@/components/shared/TexturePanel";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { loadPartners, loadProducts } from "@/lib/content/partners-data";

export const metadata: Metadata = {
  title: "Partner & Produkte",
  description:
    "Hansefit, MORE Nutrition und ESN im Sportpark Pollack: Partner-Trainingsmöglichkeit und ausgewählte Produkte direkt vor Ort in Fichtenau.",
  alternates: { canonical: "/partner-produkte" },
};

export default async function PartnerProduktePage() {
  const [partners, products] = await Promise.all([loadPartners(), loadProducts()]);
  const hansefit = partners.find((p) => p.name === "Hansefit");
  const more = products.find((p) => p.name === "MORE Nutrition");
  const esn = products.find((p) => p.name === "ESN");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Partner & Produkte", href: "/partner-produkte" }])} />
      <PageHero
        eyebrow="Partner, die zu unserem Anspruch passen"
        title="Partner & Produkte"
        intro="Hansefit ermöglicht dir flexibles Training bei uns vor Ort. MORE Nutrition und ESN begleiten dich über das Training hinaus."
        texture="community"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Partner & Produkte" }]}
      />

      <section className="bg-surface py-14 text-ink sm:py-20">
        <Container>
          <div className="grid gap-10 rounded-3xl border border-ink/10 bg-paper p-8 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <div className="flex items-center justify-center rounded-2xl border border-ink/10 bg-ink/5 p-10">
              <span className="font-display text-4xl font-extrabold uppercase tracking-tight text-ink sm:text-5xl">
                Hanse<span className="text-red">fit</span>
              </span>
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {hansefit ? `Mit ${hansefit.name} im Sportpark Pollack trainieren.` : "Hansefit"}
              </h2>
              <p className="mt-4 max-w-xl text-ink/70">{hansefit?.description}</p>
              <Button href="/kontakt#anfrage" variant="primary" className="mt-6">
                {hansefit ? `Mit ${hansefit.name} trainieren` : "Kontakt aufnehmen"} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
            Nach dem Training
          </span>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Dein Training endet nicht am letzten Satz.
          </h2>
          <p className="mt-4 max-w-2xl text-paper/70">
            Ernährung ist Teil des Trainingserfolgs. Deshalb findest du bei uns vor Ort ausgewählte Produkte von
            MORE Nutrition und ESN – für den Shake direkt nach dem Training oder den Snack für unterwegs.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <MediaPanel
              src={more?.imageSrc ?? "/media/partner/more-nutrition.webp"}
              alt="MORE Nutrition Chunky Proteinriegel-Dosen im Sportpark Pollack"
              variant="community"
              className="relative col-span-2 aspect-[16/9] w-full rounded-2xl lg:col-span-2 lg:row-span-2 lg:aspect-auto"
              label="Aufmacherbild"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <TexturePanel variant="performance" className="aspect-square w-full rounded-2xl" label="Produktbild 1" />
            <TexturePanel variant="performance" className="aspect-square w-full rounded-2xl" label="Produktbild 2" />
            <TexturePanel variant="performance" className="aspect-square w-full rounded-2xl" label="Produktbild 3" />
            <TexturePanel variant="community" className="aspect-[4/3] w-full rounded-2xl" label="Produktvideo" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {more ? (
              <div className="rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
                <h3 className="font-display text-xl uppercase tracking-wide text-paper">{more.name}</h3>
                <p className="mt-3 text-sm text-paper/65">{more.description}</p>
              </div>
            ) : null}
            {esn ? (
              <div className="rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
                <h3 className="font-display text-xl uppercase tracking-wide text-paper">{esn.name}</h3>
                <p className="mt-3 text-sm text-paper/65">{esn.description}</p>
              </div>
            ) : null}
          </div>

          <p className="mt-8 text-sm text-paper/50">
            Bei uns im Sportpark erhältlich – kein Online-Verkauf über diese Website.
          </p>
          <p className="mt-2 text-xs text-paper/40">
            Video vom Regal-Besuch:{" "}
            <Link href="/#christian-wolf" className="underline underline-offset-2 hover:text-paper/70">
              auf der Startseite ansehen
            </Link>
            .
          </p>

          <div className="mt-8">
            <Button href="/kontakt">
              Kontakt aufnehmen <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
