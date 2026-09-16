import { SpBarChart, SpFlame } from "@/components/icons/sportpark";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * One flat stat card, three sections separated by thin dividers — deliberately NOT three tall
 * separate boxes (the master prompt calls that out explicitly as a mistake to avoid). The ring
 * animates its sweep in on first paint via the sp-ring keyframe (globals.css), driven purely by
 * CSS custom properties so no client JS is needed.
 */
export function WeeklyStatCard({
  sessionsThisWeek,
  weeklyGoal,
  volumeKg,
  streakDays,
}: {
  sessionsThisWeek: number;
  weeklyGoal: number;
  volumeKg: number;
  streakDays: number;
}) {
  const pct = weeklyGoal > 0 ? Math.min(1, sessionsThisWeek / weeklyGoal) : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="grid grid-cols-3 items-start divide-x divide-sp-border rounded-sp-lg border border-sp-border bg-sp-surface-1 shadow-sp-card">
      <div className="flex flex-col items-center gap-2 px-3 py-5">
        <div className="relative flex h-[64px] w-[64px] items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--sp-surface-3)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="var(--sp-red)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              className="animate-sp-ring motion-reduce:animate-none"
              style={
                {
                  "--sp-ring-circumference": CIRCUMFERENCE,
                  "--sp-ring-offset": offset,
                  strokeDashoffset: offset,
                } as React.CSSProperties
              }
            />
          </svg>
          <span className="sp-headline absolute text-lg font-bold text-sp-text">
            {sessionsThisWeek}/{weeklyGoal}
          </span>
        </div>
        <p className="text-center text-[11px] leading-tight text-sp-text-secondary">
          Wochenziel
          <br />
          Trainings diese Woche
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 px-3 py-5">
        <div className="flex h-[64px] flex-col items-center justify-center gap-1.5">
          <SpBarChart size={24} strokeWidth={1.8} className="text-sp-red" />
          <p className="sp-headline whitespace-nowrap text-xl font-bold text-sp-text">{volumeKg.toLocaleString("de-DE")} kg</p>
        </div>
        <p className="text-center text-[11px] leading-tight text-sp-text-secondary">
          Volumen
          <br />
          Bewegtes Gewicht
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 px-3 py-5">
        <div className="flex h-[64px] flex-col items-center justify-center gap-1.5">
          <SpFlame size={24} strokeWidth={1.8} className="text-sp-red" />
          <p className="sp-headline text-xl font-bold text-sp-text">{streakDays}</p>
        </div>
        <p className="text-center text-[11px] leading-tight text-sp-text-secondary">Tage Serie</p>
      </div>
    </div>
  );
}
