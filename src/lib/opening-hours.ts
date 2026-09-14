export const WEEKDAYS = [
  { value: "montag", label: "Montag" },
  { value: "dienstag", label: "Dienstag" },
  { value: "mittwoch", label: "Mittwoch" },
  { value: "donnerstag", label: "Donnerstag" },
  { value: "freitag", label: "Freitag" },
  { value: "samstag", label: "Samstag" },
  { value: "sonntag", label: "Sonntag" },
] as const;

export type OpeningHour = {
  weekday: string;
  closed: boolean;
  open_time: string | null;
  close_time: string | null;
};

export type SpecialOpeningHour = {
  date_from: string;
  date_to: string | null;
  closed: boolean;
  open_time: string | null;
  close_time: string | null;
  label: string;
  note: string | null;
};

/**
 * Computes "Jetzt geöffnet" from regular weekly hours, overridden by any
 * special_opening_hours entry whose date range covers `now`.
 */
export function isOpenNow(
  regular: OpeningHour[],
  special: SpecialOpeningHour[],
  now: Date = new Date(),
): { open: boolean; activeSpecial: SpecialOpeningHour | null } {
  const todayStr = now.toISOString().slice(0, 10);
  const activeSpecial = special.find((s) => s.date_from <= todayStr && (!s.date_to || s.date_to >= todayStr)) ?? null;

  const source = activeSpecial ?? findRegularForToday(regular, now);
  if (!source || source.closed || !source.open_time || !source.close_time) {
    return { open: false, activeSpecial };
  }

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = source.open_time.split(":").map(Number);
  const [closeH, closeM] = source.close_time.split(":").map(Number);
  const open = minutesNow >= openH * 60 + openM && minutesNow < closeH * 60 + closeM;
  return { open, activeSpecial };
}

function findRegularForToday(regular: OpeningHour[], now: Date): OpeningHour | null {
  const idx = (now.getDay() + 6) % 7; // 0 = Montag
  const weekday = WEEKDAYS[idx].value;
  return regular.find((r) => r.weekday === weekday) ?? null;
}
