import { describe, expect, it } from "vitest";
import {
  calculateActivityFactor,
  calculateBmr,
  calculateTarget,
  canRecommendTarget,
  runHealthCalculator,
} from "./health-calculator";

describe("calculateBmr (Mifflin-St Jeor)", () => {
  it("computes the male formula correctly", () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(calculateBmr("male", 80, 180, 30)).toBeCloseTo(1780);
  });

  it("computes the female formula correctly", () => {
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    expect(calculateBmr("female", 60, 165, 25)).toBeCloseTo(1345.25);
  });

  it("averages both formulas for the neutral basis", () => {
    const male = calculateBmr("male", 70, 170, 40);
    const female = calculateBmr("female", 70, 170, 40);
    expect(calculateBmr("average", 70, 170, 40)).toBeCloseTo((male + female) / 2);
  });
});

describe("calculateActivityFactor", () => {
  it("returns the sedentary baseline with no training", () => {
    expect(calculateActivityFactor("low", "0")).toBeCloseTo(1.2);
  });

  it("adds a frequency bonus on top of the base level", () => {
    expect(calculateActivityFactor("moderate", "3-4")).toBeCloseTo(1.375 + 0.125);
  });

  it("never exceeds the physiologically plausible PAL ceiling", () => {
    expect(calculateActivityFactor("very_high", "7+")).toBeLessThanOrEqual(2.0);
  });

  it("never drops below the sedentary floor", () => {
    expect(calculateActivityFactor("low", "0")).toBeGreaterThanOrEqual(1.2);
  });
});

describe("calculateTarget", () => {
  it("returns TDEE unchanged for the maintain goal", () => {
    expect(calculateTarget(2400, "maintain", 1600)).toBe(2400);
  });

  it("applies a capped moderate deficit for weight loss", () => {
    // 20% of 2000 = 400, below the 500 kcal cap, above the BMR/1200 floors
    expect(calculateTarget(2000, "lose", 1400)).toBe(1600);
  });

  it("caps the deficit at 500 kcal even for very high TDEE", () => {
    expect(calculateTarget(4000, "lose", 1800)).toBe(3500);
  });

  it("never recommends a deficit below the BMR floor", () => {
    const target = calculateTarget(1500, "lose", 1450);
    expect(target).toBeGreaterThanOrEqual(1450);
  });

  it("never drops below the 1200 kcal absolute safety floor", () => {
    const target = calculateTarget(1250, "lose", 1000);
    expect(target).toBeGreaterThanOrEqual(1200);
  });

  it("applies a capped moderate surplus for muscle building", () => {
    // 15% of 2000 = 300, below the 400 kcal cap
    expect(calculateTarget(2000, "build", 1500)).toBe(2300);
  });

  it("caps the surplus at 400 kcal even for very high TDEE", () => {
    expect(calculateTarget(4000, "build", 2000)).toBe(4400);
  });
});

describe("canRecommendTarget", () => {
  const base = {
    isMinor: false,
    isPregnant: false,
    hasEatingDisorderHistory: false,
    hasRelevantConditions: false,
  };

  it("allows a recommendation when nothing is flagged", () => {
    expect(canRecommendTarget(base)).toEqual({ allowed: true, reason: null });
  });

  it("blocks minors", () => {
    expect(canRecommendTarget({ ...base, isMinor: true })).toEqual({ allowed: false, reason: "minor" });
  });

  it("blocks pregnancy", () => {
    expect(canRecommendTarget({ ...base, isPregnant: true })).toEqual({ allowed: false, reason: "pregnant" });
  });

  it("blocks disclosed eating-disorder history", () => {
    expect(canRecommendTarget({ ...base, hasEatingDisorderHistory: true })).toEqual({
      allowed: false,
      reason: "eating_disorder",
    });
  });

  it("blocks disclosed relevant medical conditions", () => {
    expect(canRecommendTarget({ ...base, hasRelevantConditions: true })).toEqual({
      allowed: false,
      reason: "medical_condition",
    });
  });
});

describe("runHealthCalculator (integration)", () => {
  const baseInput = {
    age: 35,
    heightCm: 178,
    weightKg: 82,
    basis: "male" as const,
    activityLevel: "moderate" as const,
    trainingFrequency: "3-4" as const,
    goal: "lose" as const,
    isMinor: false,
    isPregnant: false,
    hasEatingDisorderHistory: false,
    hasRelevantConditions: false,
  };

  it("produces a full estimate for an eligible adult", () => {
    const result = runHealthCalculator(baseInput);
    expect(result.bmr).toBeGreaterThan(0);
    expect(result.tdee).toBeGreaterThan(result.bmr);
    expect(result.canRecommendTarget).toBe(true);
    expect(result.target).not.toBeNull();
    expect(result.blockedReason).toBeNull();
  });

  it("suppresses the target (but not BMR/TDEE) for a minor", () => {
    const result = runHealthCalculator({ ...baseInput, isMinor: true, age: 16 });
    expect(result.canRecommendTarget).toBe(false);
    expect(result.target).toBeNull();
    expect(result.blockedReason).toBe("minor");
  });

  it("suppresses the target for disclosed eating-disorder history regardless of goal", () => {
    const result = runHealthCalculator({ ...baseInput, hasEatingDisorderHistory: true, goal: "maintain" });
    expect(result.target).toBeNull();
    expect(result.blockedReason).toBe("eating_disorder");
  });
});
