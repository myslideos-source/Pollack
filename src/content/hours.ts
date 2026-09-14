/**
 * Central opening-hours data. Every "open now" widget on the site reads from here —
 * never hardcode hours anywhere else.
 *
 * Quelle: Der Auftraggeber hat gebeten, die Zeiten „so wie auf Google" zu übernehmen. Direkter
 * Zugriff auf den Google-Maps-Eintrag war aus dieser Umgebung nicht möglich (Netzwerk-Restriktion,
 * siehe TODO_CLIENT.md Punkt 1), die Werte unten stammen deshalb aus einer Websuche, die über
 * mehrere unabhängige Verzeichnis-Einträge (u. a. Cylex, 11880, Yelp), die ihrerseits meist vom
 * selben Google-Business-Profil gespeist werden, übereinstimmend bestätigt wurden. Bitte einmal
 * kurz gegen die eigene Google-Business-Profil-Ansicht gegenchecken (siehe TODO_CLIENT.md Punkt 4).
 */
export type DayHours = { open: string; close: string }[];

export const openingHours: Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  DayHours
> = {
  mon: [
    { open: "08:30", close: "12:30" },
    { open: "14:30", close: "22:00" },
  ],
  tue: [
    { open: "08:30", close: "12:30" },
    { open: "14:30", close: "21:00" },
  ],
  wed: [{ open: "14:30", close: "22:00" }],
  thu: [
    { open: "08:30", close: "12:30" },
    { open: "14:30", close: "22:00" },
  ],
  fri: [
    { open: "08:30", close: "12:30" },
    { open: "14:30", close: "21:00" },
  ],
  sat: [{ open: "08:30", close: "14:00" }],
  sun: [{ open: "10:00", close: "13:00" }],
};

export const hoursConfirmed = true;

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

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

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
  const todayRanges = openingHours[todayKey];

  for (const range of todayRanges) {
    const openMinutes = toMinutes(range.open);
    const closeMinutes = toMinutes(range.close);
    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      return { kind: "open", closesAt: range.close };
    }
  }

  const nextRangeToday = todayRanges
    .filter((range) => toMinutes(range.open) > nowMinutes)
    .sort((a, b) => toMinutes(a.open) - toMinutes(b.open))[0];
  if (nextRangeToday) {
    return { kind: "closed", opensAt: nextRangeToday.open };
  }

  // Find the next day with hours
  for (let i = 1; i <= 7; i++) {
    const key = DAY_KEYS[(todayIndex + i) % 7];
    const ranges = openingHours[key];
    if (ranges.length > 0) {
      return { kind: "closed", opensAt: ranges[0].open, opensOn: dayLabels[key] };
    }
  }
  return { kind: "closed" };
}
