import Link from "next/link";
import { ArrowRight, ClipboardCheck, Dumbbell, TrendingUp, MessageCircle, Bell, Home, ClipboardList, User } from "lucide-react";
import { Button } from "@/components/shared/Button";

const BENEFITS = [
  { icon: ClipboardCheck, label: "Persönlicher Trainingsplan" },
  { icon: Dumbbell, label: "Training digital dokumentieren" },
  { icon: TrendingUp, label: "Fortschritte jederzeit verfolgen" },
  { icon: MessageCircle, label: "Direkter Kontakt zum Trainer" },
];

/**
 * A stylised illustration of the member dashboard — deliberately not a real screenshot (the
 * portal has no production data to show here), built from the same design tokens as the actual
 * /mitglied UI so it reads as an honest preview rather than a fabricated product photo.
 */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] rounded-[2.5rem] border-[6px] border-anthracite bg-ink p-2 shadow-2xl sm:w-[300px]">
      <div className="mx-auto mb-1 h-5 w-24 rounded-full bg-anthracite" />
      <div className="overflow-hidden rounded-[2rem] bg-ink">
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="font-display text-[10px] uppercase tracking-wide text-paper/50">Sportpark Pollack</span>
          <Bell size={13} className="text-paper/40" />
        </div>
        <div className="px-4 pt-3">
          <p className="font-display text-base font-bold text-paper">Guten Morgen, Domenico</p>
          <p className="mt-0.5 text-[11px] text-paper/50">Bereit für dein Training?</p>
        </div>
        <div className="mx-4 mt-3 rounded-xl border border-paper/10 bg-anthracite p-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-moss/30 bg-moss/10 px-2 py-0.5 text-[9px] text-moss">
            Von Jürgen freigegeben
          </span>
          <p className="mt-2 font-display text-sm font-bold text-paper">Heute: Oberkörper</p>
          <p className="text-[10px] text-paper/50">45 Min. · 6 Übungen</p>
          <div className="mt-2 rounded-full bg-red px-3 py-1.5 text-center text-[10px] font-medium text-paper">Training starten</div>
        </div>
        <div className="mx-4 mt-3 grid grid-cols-3 gap-1.5">
          {["3", "4.820 kg", "7"].map((v, i) => (
            <div key={i} className="rounded-lg border border-paper/10 bg-anthracite py-2 text-center">
              <p className="font-display text-xs font-bold text-paper">{v}</p>
            </div>
          ))}
        </div>
        <div className="mx-4 mb-4 mt-3 h-14 rounded-xl border border-paper/10 bg-anthracite" />
        <div className="flex items-center justify-around border-t border-paper/10 py-2.5">
          {[Home, ClipboardList, Dumbbell, TrendingUp, User].map((Icon, i) => (
            <Icon key={i} size={14} className={i === 0 ? "text-red" : "text-paper/30"} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MemberPortalTeaser() {
  return (
    <section className="bg-anthracite py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">Mitgliederportal</span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-paper sm:text-4xl lg:text-5xl">
            Dein Training. Dein Fortschritt. Dein Sportpark.
          </h2>
          <p className="mt-5 max-w-xl text-paper/70">
            Als Mitglied erhältst du deinen persönlichen digitalen Trainingsbereich – mit individuellem
            Trainingsplan, Fortschrittsübersicht und direkter Betreuung durch unsere Trainer.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b.label} className="flex items-center gap-2.5 text-sm text-paper/80">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
                  <b.icon size={15} />
                </span>
                {b.label}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/login" variant="primary">
              Mitglieder-Login <ArrowRight size={16} />
            </Button>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-paper/20 px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:border-paper/40"
            >
              Portal entdecken
            </Link>
          </div>
        </div>
        <PhoneMockup />
      </div>
    </section>
  );
}
