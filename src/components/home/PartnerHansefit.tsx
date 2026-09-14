import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { loadPartners } from "@/lib/content/partners-data";

export async function PartnerHansefit() {
  const partners = await loadPartners();
  const hansefit = partners.find((p) => p.name === "Hansefit");
  if (!hansefit) return null;
  return (
    <section className="bg-surface py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
          Partner, die zu unserem Anspruch passen
        </span>
        <div className="mt-6 grid gap-10 rounded-3xl border border-ink/10 bg-paper p-8 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div className="flex items-center justify-center rounded-2xl border border-ink/10 bg-ink/5 p-10">
            <Image
              src="/media/partner/hansefit-logo.webp"
              alt="Hansefit Logo"
              width={974}
              height={620}
              className="h-auto w-full max-w-[220px]"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Mit {hansefit.name} im Sportpark Pollack trainieren.
            </h2>
            <p className="mt-4 max-w-xl text-ink/70">{hansefit.description}</p>
            <Button href="/kontakt#anfrage" variant="primary" className="mt-6">
              Mit {hansefit.name} trainieren <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
