import { MessageCircle, CalendarCheck, Compass, KeyRound, ClipboardList, Dumbbell, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";

const STEPS = [
  {
    day: "Tag 0",
    title: "Anfragen",
    description:
      "Kontaktformular, Anruf oder WhatsApp – dein Probetraining ist in wenigen Minuten angefragt.",
    icon: MessageCircle,
  },
  {
    day: "Tag 1–2",
    title: "Termin bestätigt",
    description: "Unser Team meldet sich persönlich zurück und vereinbart deinen Termin vor Ort.",
    icon: CalendarCheck,
  },
  {
    day: "Dein Probetraining",
    title: "Reinschnuppern",
    description: "Rundgang durch alle Trainingsbereiche und ein erstes Training gemeinsam mit einem Trainer.",
    icon: Compass,
  },
  {
    day: "Bei Anmeldung",
    title: "Zugang zum Mitgliederportal",
    description: "Mit der Mitgliedschaft bekommst du deinen persönlichen Login für den digitalen Trainingsbereich.",
    icon: KeyRound,
  },
  {
    day: "Erste Woche",
    title: "Erstanalyse & Trainingsplan",
    description:
      "Ein kurzer Fragebogen zu deinen Zielen – danach stellt dein Trainer deinen individuellen Trainingsplan zusammen.",
    icon: ClipboardList,
  },
  {
    day: "Woche 2–4",
    title: "Trainieren mit Begleitung",
    description: "Der aktive Trainingsmodus im Portal führt dich Übung für Übung durchs Training.",
    icon: Dumbbell,
  },
  {
    day: "Tag 30",
    title: "Erster Fortschritts-Check",
    description: "Im Portal siehst du schwarz auf weiß, was sich in den ersten vier Wochen verändert hat.",
    icon: TrendingUp,
  },
] as const;

export function Journey30Days() {
  return (
    <section id="erste-30-tage" className="scroll-mt-20 bg-anthracite py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">Dein Start bei uns</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Deine ersten 30 Tage
          </h2>
          <p className="mt-3 text-paper/70">
            Vom ersten Kontakt bis zum ersten Fortschritts-Check – so läuft dein Einstieg im Sportpark Pollack
            ganz konkret ab.
          </p>
        </div>

        <ol className="relative mt-12 flex flex-col gap-8 sm:gap-10">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[19px] w-px bg-paper/15 sm:left-[23px]"
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 sm:gap-6">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/15 bg-ink text-red sm:h-12 sm:w-12">
                <step.icon size={18} />
              </span>
              <div className="pt-1">
                <span className="font-display text-xs uppercase tracking-[0.2em] text-paper/45">
                  {step.day} · Schritt {i + 1}
                </span>
                <h3 className="mt-1 font-display text-xl font-semibold text-paper sm:text-2xl">{step.title}</h3>
                <p className="mt-1.5 max-w-lg text-sm text-paper/70 sm:text-base">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button href="/#probetraining">Jetzt Probetraining anfragen</Button>
        </div>
      </Container>
    </section>
  );
}
