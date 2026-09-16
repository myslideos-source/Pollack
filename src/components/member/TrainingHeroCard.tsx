import Image from "next/image";
import { SpCheckCircle, SpArrowRight } from "@/components/icons/sportpark";

/**
 * The member dashboard's "today's training" photo hero — the single most important visual
 * element per the mockup. All copy is real HTML overlaid on the photo (never baked into the
 * image itself), so it stays translatable/accessible and never goes stale.
 */
export function TrainingHeroCard({
  trainerFirstName,
  dayTitle,
  durationMin,
  exerciseCount,
  approved,
  imageSrc,
  imageAlt,
  focalX,
  focalY,
  href,
}: {
  trainerFirstName: string | null;
  dayTitle: string;
  durationMin: number | null;
  exerciseCount: number;
  approved: boolean;
  imageSrc: string;
  imageAlt: string;
  focalX: number;
  focalY: number;
  href: string;
}) {
  return (
    <div
      className="relative h-[460px] w-full overflow-hidden rounded-sp-xl border border-sp-red-border sm:h-[500px]"
      style={{ boxShadow: "var(--shadow-sp-red)" }}
    >
      <div className="absolute inset-0 animate-sp-hero-zoom motion-reduce:animate-none">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 640px) 480px, 100vw"
          className="object-cover"
          style={{ objectPosition: `${focalX}% ${focalY}%` }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,6,6,0.94) 0%, rgba(5,6,6,0.72) 42%, rgba(5,6,6,0.20) 75%), linear-gradient(0deg, rgba(5,6,6,0.92) 0%, rgba(5,6,6,0.10) 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sp-text-secondary">
              {trainerFirstName ? `Von deinem Trainer ${trainerFirstName}` : "Von deinem Trainer"}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-sp-text-muted">Heute</p>
          </div>
          {approved ? (
            <span className="flex items-center gap-1.5 rounded-full border border-sp-green/40 bg-sp-green-soft px-3 py-1.5 text-xs font-medium text-sp-green">
              <SpCheckCircle size={14} strokeWidth={2} />
              Freigegeben
            </span>
          ) : null}
        </div>

        <div>
          <h2 className="sp-headline text-[44px] font-extrabold uppercase leading-[0.95] text-sp-text sm:text-[52px]">
            {dayTitle}
          </h2>
          <p className="mt-2 text-sm font-medium text-sp-text-secondary">
            {durationMin ? `${durationMin} Min · ` : ""}
            {exerciseCount} {exerciseCount === 1 ? "Übung" : "Übungen"}
          </p>

          <a
            href={href}
            className="mt-5 inline-flex h-[60px] items-center gap-2 rounded-full bg-sp-red px-7 font-ui text-sm font-semibold uppercase tracking-wide text-sp-text transition-transform duration-150 hover:bg-sp-red-light active:scale-[0.98]"
          >
            Training starten
            <SpArrowRight size={18} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}
