export const WEEKDAYS = [
  { value: "mon", label: "Montag" },
  { value: "tue", label: "Dienstag" },
  { value: "wed", label: "Mittwoch" },
  { value: "thu", label: "Donnerstag" },
  { value: "fri", label: "Freitag" },
  { value: "sat", label: "Samstag" },
  { value: "sun", label: "Sonntag" },
] as const;

export type OpeningHour = {
  weekday: string;
  closed: boolean;
  open_time: string | null;
  close_time: string | null;
  sort_order: number;
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
 * Computes "Jetzt geöffnet" from the regular weekly hours (which may list several time ranges
 * per weekday, e.g. a morning and an evening block with a midday closure in between), overridden
 * by any special_opening_hours entry whose date range covers `now`.
 */
export function isOpenNow(
  regular: OpeningHour[],
  special: SpecialOpeningHour[],
  now: Date = new Date(),
): { open: boolean; activeSpecial: SpecialOpeningHour | null } {
  const todayStr = now.toISOString().slice(0, 10);
  const activeSpecial = special.find((s) => s.date_from <= todayStr && (!s.date_to || s.date_to >= todayStr)) ?? null;

  if (activeSpecial) {
    return { open: isWithinRange(now, activeSpecial), activeSpecial };
  }

  const todayRanges = findRegularForToday(regular, now);
  const open = todayRanges.some((r) => isWithinRange(now, r));
  return { open, activeSpecial: null };
}

function isWithinRange(now: Date, range: { closed: boolean; open_time: string | null; close_time: string | null }): boolean {
  if (range.closed || !range.open_time || !range.close_time) return false;
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = range.open_time.split(":").map(Number);
  const [closeH, closeM] = range.close_time.split(":").map(Number);
  return minutesNow >= openH * 60 + openM && minutesNow < closeH * 60 + closeM;
}

function findRegularForToday(regular: OpeningHour[], now: Date): OpeningHour[] {
  const idx = (now.getDay() + 6) % 7; // 0 = Montag
  const weekday = WEEKDAYS[idx].value;
  return regular.filter((r) => r.weekday === weekday).sort((a, b) => a.sort_order - b.sort_order);
}
