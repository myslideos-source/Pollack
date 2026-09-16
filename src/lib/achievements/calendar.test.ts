import { describe, expect, it } from "vitest";
import { berlinHour, berlinCalendarDay, isoWeekday, longestWeekStreak, maxCountInOneWeek } from "./calendar";

describe("berlinHour", () => {
  it("converts a winter (CET, UTC+1) instant to the correct local hour", () => {
    expect(berlinHour("2026-01-15T06:30:00Z")).toBe(7); // 07:30 Berlin
    expect(berlinHour("2026-01-15T07:00:00Z")).toBe(8); // 08:00 Berlin — no longer "early"
  });

  it("converts a summer (CEST, UTC+2) instant to the correct local hour", () => {
    expect(berlinHour("2026-07-15T05:30:00Z")).toBe(7); // 07:30 Berlin
    expect(berlinHour("2026-07-15T06:00:00Z")).toBe(8); // 08:00 Berlin
  });
});

describe("berlinCalendarDay", () => {
  it("rolls a late-UTC instant forward to the next Berlin-local day", () => {
    // 23:30 UTC on the 15th is already 00:30 CET on the 16th in Berlin.
    const day = berlinCalendarDay("2026-01-15T23:30:00Z");
    expect(day.toISOString().slice(0, 10)).toBe("2026-01-16");
  });

  it("keeps a mid-day instant on the same calendar day", () => {
    const day = berlinCalendarDay("2026-06-10T12:00:00Z");
    expect(day.toISOString().slice(0, 10)).toBe("2026-06-10");
  });
});

describe("isoWeekday", () => {
  it("identifies a known Monday and a known Saturday", () => {
    // 2024-01-01 is a Monday (ISO week 1 of 2024 starts here).
    expect(isoWeekday(berlinCalendarDay("2024-01-01T10:00:00Z"))).toBe(0);
    // 2024-01-06 is the following Saturday.
    expect(isoWeekday(berlinCalendarDay("2024-01-06T10:00:00Z"))).toBe(5);
  });
});

describe("maxCountInOneWeek", () => {
  it("counts three sessions landing in the same calendar week", () => {
    const count = maxCountInOneWeek([
      "2026-06-08T08:00:00Z", // Monday
      "2026-06-10T08:00:00Z", // Wednesday, same week
      "2026-06-13T08:00:00Z", // Saturday, same week
      "2026-06-15T08:00:00Z", // Monday, next week — doesn't count toward the first week
    ]);
    expect(count).toBe(3);
  });

  it("returns 0 for an empty list", () => {
    expect(maxCountInOneWeek([])).toBe(0);
  });
});

describe("longestWeekStreak", () => {
  it("finds the longest run, not just the most recent one", () => {
    // Two consecutive weeks (streak of 2), a gap, then three consecutive weeks (streak of 3).
    const streak = longestWeekStreak([
      "2026-02-02T08:00:00Z", // week A
      "2026-02-09T08:00:00Z", // week A+1
      "2026-03-02T08:00:00Z", // isolated week, far from the rest
      "2026-04-06T08:00:00Z", // week B
      "2026-04-13T08:00:00Z", // week B+1
      "2026-04-20T08:00:00Z", // week B+2
    ]);
    expect(streak).toBe(3);
  });

  it("stays correct across a year boundary", () => {
    // Three consecutive Mondays straddling the 2023 → 2024 new year.
    const streak = longestWeekStreak([
      "2023-12-27T08:00:00Z", // week of Mon 2023-12-25
      "2024-01-03T08:00:00Z", // week of Mon 2024-01-01
      "2024-01-10T08:00:00Z", // week of Mon 2024-01-08
    ]);
    expect(streak).toBe(3);
  });

  it("ignores duplicate sessions within the same week", () => {
    const streak = longestWeekStreak(["2026-05-04T08:00:00Z", "2026-05-05T08:00:00Z", "2026-05-06T08:00:00Z"]);
    expect(streak).toBe(1);
  });

  it("returns 0 for no sessions", () => {
    expect(longestWeekStreak([])).toBe(0);
  });
});
