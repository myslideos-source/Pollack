/**
 * Pure calendar math for the achievement engine — no DB access, so it's unit-testable on its
 * own. Every "early session" / "weekend session" / "calendar week" judgment happens in the
 * Sportpark's local timezone, never the server's, since a server can run in UTC while a 7am
 * session in Fichtenau is still "early" or "late" depending on the season (CET/CEST).
 */

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

export const TIMEZONE = "Europe/Berlin";

export function berlinHour(iso: string): number {
  return parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, hour: "2-digit", hour12: false }).format(new Date(iso)), 10);
}

/** The Berlin-local calendar day of an instant, as a UTC midnight Date — a stable anchor for
 *  weekday/week-number math that doesn't drift with the server's own timezone. */
export function berlinCalendarDay(iso: string): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(
    new Date(iso),
  );
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return new Date(`${y}-${m}-${d}T00:00:00Z`);
}

/** ISO weekday, Monday=0 … Sunday=6. */
export function isoWeekday(day: Date): number {
  return (day.getUTCDay() + 6) % 7;
}

export function mondayOfWeek(day: Date): Date {
  const d = new Date(day);
  d.setUTCDate(d.getUTCDate() - isoWeekday(day));
  return d;
}

/** A global, ever-increasing week index (Monday-anchored) — consecutive calendar weeks always
 *  differ by exactly 1, which is all the streak math below needs. */
export function weekIndex(day: Date): number {
  return Math.floor(mondayOfWeek(day).getTime() / WEEK_MS);
}

/** Longest run of consecutive calendar weeks containing at least one of the given instants. */
export function longestWeekStreak(isoDates: string[]): number {
  const weeks = Array.from(new Set(isoDates.map((d) => weekIndex(berlinCalendarDay(d))))).sort((a, b) => a - b);
  let best = weeks.length > 0 ? 1 : 0;
  let current = best;
  for (let i = 1; i < weeks.length; i++) {
    current = weeks[i] === weeks[i - 1] + 1 ? current + 1 : 1;
    best = Math.max(best, current);
  }
  return best;
}

/** Highest count of the given instants falling in any single calendar week. */
export function maxCountInOneWeek(isoDates: string[]): number {
  const perWeek = new Map<number, number>();
  for (const d of isoDates) {
    const wk = weekIndex(berlinCalendarDay(d));
    perWeek.set(wk, (perWeek.get(wk) ?? 0) + 1);
  }
  return Math.max(0, ...perWeek.values());
}
