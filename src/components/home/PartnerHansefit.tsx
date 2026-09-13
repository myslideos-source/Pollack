import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { hansefit } from "@/content/partners";

/**
 * Official Hansefit logo file has not been supplied yet (see MEDIA_AUDIT.md) — the
 * wordmark below is a placeholder text lockup, not the real brand mark. Swap the
 * <span> block for an <Image> of the official logo once it is provided.
 */
export function PartnerHansefit() {
  return (
    <section className="bg-surface py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
          Partner, die zu unserem Anspruch passen
        </span>
        <div className="mt-6 grid gap-10 rounded-3xl border border-ink/10 bg-paper p-8 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div className="flex items-center justify-center rounded-2xl border border-ink/10 bg-ink/5 p-10">
            <span className="font-display text-4xl font-extrabold uppercase tracking-tight text-ink sm:text-5xl">
              Hanse<span className="text-red">fit</span>
            </span>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {hansefit.headline}
            </h2>
            <p className="mt-4 max-w-xl text-ink/70">{hansefit.description}</p>
            <Button href="/kontakt#anfrage" variant="primary" className="mt-6">
              {hansefit.cta} <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
