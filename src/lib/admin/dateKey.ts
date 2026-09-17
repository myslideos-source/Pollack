const berlinFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" });

/**
 * Calendar-day key (YYYY-MM-DD) in the gym's own timezone, not the host's. The server this
 * runs on may be UTC while the browser is whatever the admin's device is set to — using a
 * fixed Europe/Berlin zone on both sides is what keeps "today" and "which day did this
 * check-in fall on" consistent between the two, instead of drifting near midnight.
 */
export function dateKeyBerlin(date: Date): string {
  return berlinFormatter.format(date);
}
