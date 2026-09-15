import { WEEKDAYS } from "@/lib/opening-hours";

const JS_INDEX_WEEKDAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Client-safe weekday helpers — kept out of lib/member/data.ts (which is server-only) so
 *  client components like PlanEditor can use them without pulling server code into the bundle. */
export function weekdayLabel(weekday: string): string {
  return WEEKDAYS.find((w) => w.value === weekday)?.label ?? weekday;
}

export function todayWeekday(): string {
  return JS_INDEX_WEEKDAY[new Date().getDay()];
}
