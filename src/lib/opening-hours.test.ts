import { describe, expect, it } from "vitest";
import { isOpenNow, type OpeningHour, type SpecialOpeningHour } from "./opening-hours";

const HOURS: OpeningHour[] = [
  { weekday: "mon", closed: false, open_time: "08:30:00", close_time: "12:30:00", sort_order: 0 },
  { weekday: "mon", closed: false, open_time: "14:30:00", close_time: "22:00:00", sort_order: 1 },
  { weekday: "sat", closed: false, open_time: "08:30:00", close_time: "14:00:00", sort_order: 0 },
  { weekday: "sun", closed: false, open_time: "10:00:00", close_time: "13:00:00", sort_order: 0 },
];

function at(isoWithoutZone: string): Date {
  return new Date(isoWithoutZone);
}

describe("isOpenNow", () => {
  it("reports open with today's closing time during the morning block", () => {
    // Monday 10:00 — inside the 08:30–12:30 block, not Sunday's unrelated 13:00 close.
    const { open, closesAt } = isOpenNow(HOURS, [], at("2026-09-14T10:00:00"));
    expect(open).toBe(true);
    expect(closesAt).toBe("12:30:00");
  });

  it("reports closed during the midday gap between blocks", () => {
    // Monday 13:00 — after the morning block closes, before the evening block opens.
    const { open, closesAt } = isOpenNow(HOURS, [], at("2026-09-14T13:00:00"));
    expect(open).toBe(false);
    expect(closesAt).toBeNull();
  });

  it("reports open with the evening block's closing time in the evening", () => {
    // Monday 20:00 — inside the 14:30–22:00 block.
    const { open, closesAt } = isOpenNow(HOURS, [], at("2026-09-14T20:00:00"));
    expect(open).toBe(true);
    expect(closesAt).toBe("22:00:00");
  });

  it("never picks another weekday's block for today's status", () => {
    // Sunday 11:00 — must use Sunday's own 10:00–13:00 block, not Monday's 12:30/22:00.
    const { open, closesAt } = isOpenNow(HOURS, [], at("2026-09-13T11:00:00"));
    expect(open).toBe(true);
    expect(closesAt).toBe("13:00:00");
  });

  it("prefers an active special-hours override over the regular schedule", () => {
    const special: SpecialOpeningHour[] = [
      { date_from: "2026-09-14", date_to: "2026-09-14", closed: false, open_time: "09:00:00", close_time: "11:00:00", label: "Feiertag", note: null },
    ];
    const { open, closesAt, activeSpecial } = isOpenNow(HOURS, special, at("2026-09-14T10:00:00"));
    expect(open).toBe(true);
    expect(closesAt).toBe("11:00:00");
    expect(activeSpecial?.label).toBe("Feiertag");
  });
});
