import { Container } from "@/components/shared/Container";
import { TrainingFinder } from "@/components/home/TrainingFinder";

export function ZielFinderSection() {
  return (
    <section id="zielfinder" className="scroll-mt-20 bg-ink py-16 sm:py-24">
      <Container className="max-w-3xl">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-red">In 4 Fragen</span>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Meinen Bereich finden
        </h2>
        <p className="mt-3 text-paper/70">
          Kein Anmeldeformular, keine Diagnose – nur vier kurze Fragen, die dir zeigen, wo du im Sportpark am
          besten startest.
        </p>
        <div className="mt-8">
          <TrainingFinder />
        </div>
      </Container>
    </section>
  );
}
