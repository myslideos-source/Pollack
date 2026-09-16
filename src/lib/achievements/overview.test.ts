import { describe, expect, it } from "vitest";
import { computeCurrentTier, computeLastUnlocked, computeNextUp } from "./overview";

describe("computeCurrentTier", () => {
  it("picks the highest unlocked tier", () => {
    const tier = computeCurrentTier([
      { tier: "bronze", unlockedAt: "2026-01-01" },
      { tier: "gold", unlockedAt: "2026-02-01" },
      { tier: "silber", unlockedAt: "2026-03-01" },
    ]);
    expect(tier).toBe("gold");
  });

  it("ignores tiers that aren't unlocked yet", () => {
    const tier = computeCurrentTier([
      { tier: "bronze", unlockedAt: "2026-01-01" },
      { tier: "platin", unlockedAt: null },
    ]);
    expect(tier).toBe("bronze");
  });

  it("ignores achievements without a tier", () => {
    const tier = computeCurrentTier([{ tier: null, unlockedAt: "2026-01-01" }]);
    expect(tier).toBeNull();
  });

  it("returns null when nothing is unlocked", () => {
    expect(computeCurrentTier([{ tier: "gold", unlockedAt: null }])).toBeNull();
    expect(computeCurrentTier([])).toBeNull();
  });
});

describe("computeLastUnlocked", () => {
  it("picks the most recently unlocked achievement, not the last in the list", () => {
    const result = computeLastUnlocked([
      { slug: "old", unlockedAt: "2026-01-01T00:00:00Z" },
      { slug: "newest", unlockedAt: "2026-06-01T00:00:00Z" },
      { slug: "middle", unlockedAt: "2026-03-01T00:00:00Z" },
    ]);
    expect(result?.slug).toBe("newest");
  });

  it("ignores locked achievements", () => {
    const result = computeLastUnlocked([
      { slug: "locked", unlockedAt: null },
      { slug: "unlocked", unlockedAt: "2026-01-01T00:00:00Z" },
    ]);
    expect(result?.slug).toBe("unlocked");
  });

  it("returns null when nothing is unlocked", () => {
    expect(computeLastUnlocked([{ slug: "a", unlockedAt: null }])).toBeNull();
    expect(computeLastUnlocked([])).toBeNull();
  });
});

describe("computeNextUp", () => {
  it("picks the locked achievement closest to completion", () => {
    const result = computeNextUp([
      { slug: "far", unlockedAt: null, isSecret: false, isManual: false, threshold: 100, progress: 5 },
      { slug: "close", unlockedAt: null, isSecret: false, isManual: false, threshold: 4, progress: 3 },
    ]);
    expect(result?.slug).toBe("close");
  });

  it("excludes already-unlocked achievements", () => {
    const result = computeNextUp([{ slug: "done", unlockedAt: "2026-01-01", isSecret: false, isManual: false, threshold: 10, progress: 10 }]);
    expect(result).toBeNull();
  });

  it("excludes secret achievements — no spoiler countdown", () => {
    const result = computeNextUp([{ slug: "secret", unlockedAt: null, isSecret: true, isManual: false, threshold: 1, progress: 0 }]);
    expect(result).toBeNull();
  });

  it("excludes manual achievements — no automatic progress to show", () => {
    const result = computeNextUp([{ slug: "manual", unlockedAt: null, isSecret: false, isManual: true, threshold: null, progress: 0 }]);
    expect(result).toBeNull();
  });

  it("excludes achievements without a real threshold", () => {
    const result = computeNextUp([{ slug: "no-threshold", unlockedAt: null, isSecret: false, isManual: false, threshold: null, progress: 3 }]);
    expect(result).toBeNull();
  });

  it("returns null when there are no candidates", () => {
    expect(computeNextUp([])).toBeNull();
  });
});
