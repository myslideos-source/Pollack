import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { loadPartners } from "@/lib/content/partners-data";

const HANSEFIT_STEPS = [
  { step: "1", text: "Hansefit-Mitgliedschaft über deinen Arbeitgeber oder direkt bei Hansefit haben." },
  { step: "2", text: "Im Sportpark Pollack vorbeikommen und dich mit deiner Hansefit-App bzw. -Karte ausweisen." },
  { step: "3", text: "Trainieren wie jedes andere Mitglied – ganz ohne separaten Vertrag bei uns." },
];

export async function PartnerHansefit() {
  const partners = await loadPartners();
  const hansefit = partners.find((p) => p.name === "Hansefit");
  if (!hansefit) return null;
  return (
    <section id="partner" className="scroll-mt-20 bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
          Partner, die zu unserem Anspruch passen
        </span>
        <div className="mt-6 grid gap-10 rounded-3xl border border-paper/10 bg-anthracite p-8 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div className="flex items-center justify-center rounded-2xl bg-paper p-10">
            <Image
              src="/media/partner/hansefit-logo.webp"
              alt="Hansefit Logo"
              width={974}
              height={620}
              className="h-auto w-full max-w-[220px]"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              Mit {hansefit.name} im Sportpark Pollack trainieren.
            </h2>
            <p className="mt-4 max-w-xl text-paper/70">{hansefit.description}</p>
            <ol className="mt-6 flex flex-col gap-3">
              {HANSEFIT_STEPS.map((s) => (
                <li key={s.step} className="flex items-start gap-3 text-sm text-paper/70">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red/15 font-display text-xs text-red">
                    {s.step}
                  </span>
                  {s.text}
                </li>
              ))}
            </ol>
            <Button href="/#anfrage" variant="primary" className="mt-6">
              Mit {hansefit.name} trainieren <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
