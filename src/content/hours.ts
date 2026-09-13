/**
 * Central opening-hours data. Every "open now" widget on the site reads from here —
 * never hardcode hours anywhere else.
 *
 * IMPORTANT: `confirmed` is `false` because the live sportpark-pollack.de site could not
 * be crawled from this build environment (network egress to the domain is blocked).
 * The hours below are a plausible placeholder shape, not verified data. Until the client
 * confirms real hours (see TODO_CLIENT.md) the UI shows "Öffnungszeiten bitte prüfen"
 * instead of a computed open/closed status, so nothing false is ever published.
 */
export type DayHours = { open: string; close: string } | null;

export const openingHours: Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  DayHours
> = {
  mon: { open: "08:00", close: "22:00" },
  tue: { open: "08:00", close: "22:00" },
  wed: { open: "08:00", close: "22:00" },
  thu: { open: "08:00", close: "22:00" },
  fri: { open: "08:00", close: "21:00" },
  sat: { open: "09:00", close: "14:00" },
  sun: null,
};

export const hoursConfirmed = false;

export const dayLabels: Record<keyof typeof openingHours, string> = {
  mon: "Montag",
  tue: "Dienstag",
  wed: "Mittwoch",
  thu: "Donnerstag",
  fri: "Freitag",
  sat: "Samstag",
  sun: "Sonntag",
};

const DAY_KEYS: (keyof typeof openingHours)[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export type OpenStatus =
  | { kind: "unconfirmed" }
  | { kind: "open"; closesAt: string }
  | { kind: "closed"; opensAt?: string; opensOn?: string };

/** Compute today's open/closed status in Europe/Berlin, independent of server timezone. */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  if (!hoursConfirmed) return { kind: "unconfirmed" };

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekdayShort = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const nowMinutes = hour * 60 + minute;

  const weekdayMap: Record<string, keyof typeof openingHours> = {
    Sun: "sun",
    Mon: "mon",
    Tue: "tue",
    Wed: "wed",
    Thu: "thu",
    Fri: "fri",
    Sat: "sat",
  };
  const todayKey = weekdayMap[weekdayShort] ?? "mon";
  const todayIndex = DAY_KEYS.indexOf(todayKey);
  const today = openingHours[todayKey];

  if (today) {
    const [openH, openM] = today.open.split(":").map(Number);
    const [closeH, closeM] = today.close.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      return { kind: "open", closesAt: today.close };
    }
    if (nowMinutes < openMinutes) {
      return { kind: "closed", opensAt: today.open };
    }
  }

  // Find the next day with hours
  for (let i = 1; i <= 7; i++) {
    const key = DAY_KEYS[(todayIndex + i) % 7];
    const day = openingHours[key];
    if (day) {
      return { kind: "closed", opensAt: day.open, opensOn: dayLabels[key] };
    }
  }
  return { kind: "closed" };
}
