/**
 * Sportpark Ziel-Kompass — calorie estimate logic.
 *
 * Uses the Mifflin-St Jeor equation (Mifflin MD, St Jeor ST, et al. 1990), one of the
 * most widely validated resting-metabolic-rate formulas for healthy adults. Everything
 * here is a pure function: no network calls, no storage — the calling component runs
 * it entirely client-side and never persists or transmits the inputs.
 *
 * This is an estimate, not a diagnosis. It intentionally refuses to produce a target
 * calorie recommendation for minors, pregnancy, disclosed eating-disorder history, or
 * disclosed relevant medical conditions — see `canRecommendTarget`.
 */

export type CalculationBasis = "male" | "female" | "average";
export type ActivityLevel = "low" | "moderate" | "high" | "very_high";
export type TrainingFrequency = "0" | "1-2" | "3-4" | "5-6" | "7+";
export type Goal = "maintain" | "lose" | "build";

export type HealthCalculatorInput = {
  age: number;
  heightCm: number;
  weightKg: number;
  basis: CalculationBasis;
  activityLevel: ActivityLevel;
  trainingFrequency: TrainingFrequency;
  goal: Goal;
  isMinor: boolean;
  isPregnant: boolean;
  hasEatingDisorderHistory: boolean;
  hasRelevantConditions: boolean;
};

export type HealthCalculatorResult = {
  bmr: number;
  tdee: number;
  activityFactor: number;
  target: number | null;
  deltaFromTdee: number;
  canRecommendTarget: boolean;
  blockedReason: BlockedReason | null;
};

export type BlockedReason = "minor" | "pregnant" | "eating_disorder" | "medical_condition";

const ACTIVITY_BASE: Record<ActivityLevel, number> = {
  low: 1.2,
  moderate: 1.375,
  high: 1.55,
  very_high: 1.725,
};

const FREQUENCY_BONUS: Record<TrainingFrequency, number> = {
  "0": 0,
  "1-2": 0.05,
  "3-4": 0.125,
  "5-6": 0.2,
  "7+": 0.275,
};

const MIN_PAL = 1.2;
const MAX_PAL = 2.0;

const ABSOLUTE_MIN_CALORIES = 1200;
const MAX_DEFICIT_RATIO = 0.2;
const MAX_DEFICIT_KCAL = 500;
const MAX_SURPLUS_RATIO = 0.15;
const MAX_SURPLUS_KCAL = 400;

export function calculateBmr(basis: CalculationBasis, weightKg: number, heightCm: number, age: number): number {
  const male = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const female = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  if (basis === "male") return male;
  if (basis === "female") return female;
  return (male + female) / 2;
}

export function calculateActivityFactor(activityLevel: ActivityLevel, trainingFrequency: TrainingFrequency): number {
  const raw = ACTIVITY_BASE[activityLevel] + FREQUENCY_BONUS[trainingFrequency];
  return Math.min(MAX_PAL, Math.max(MIN_PAL, raw));
}

export function canRecommendTarget(input: Pick<
  HealthCalculatorInput,
  "isMinor" | "isPregnant" | "hasEatingDisorderHistory" | "hasRelevantConditions"
>): { allowed: boolean; reason: BlockedReason | null } {
  if (input.isMinor) return { allowed: false, reason: "minor" };
  if (input.isPregnant) return { allowed: false, reason: "pregnant" };
  if (input.hasEatingDisorderHistory) return { allowed: false, reason: "eating_disorder" };
  if (input.hasRelevantConditions) return { allowed: false, reason: "medical_condition" };
  return { allowed: true, reason: null };
}

export function calculateTarget(tdee: number, goal: Goal, bmr: number): number {
  if (goal === "maintain") return Math.round(tdee);

  if (goal === "lose") {
    const deficit = Math.min(tdee * MAX_DEFICIT_RATIO, MAX_DEFICIT_KCAL);
    const target = tdee - deficit;
    return Math.round(Math.max(target, bmr, ABSOLUTE_MIN_CALORIES));
  }

  // goal === "build"
  const surplus = Math.min(tdee * MAX_SURPLUS_RATIO, MAX_SURPLUS_KCAL);
  return Math.round(tdee + surplus);
}

export function runHealthCalculator(input: HealthCalculatorInput): HealthCalculatorResult {
  const bmr = calculateBmr(input.basis, input.weightKg, input.heightCm, input.age);
  const activityFactor = calculateActivityFactor(input.activityLevel, input.trainingFrequency);
  const tdee = bmr * activityFactor;

  const { allowed, reason } = canRecommendTarget(input);
  const target = allowed ? calculateTarget(tdee, input.goal, bmr) : null;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    activityFactor,
    target,
    deltaFromTdee: target !== null ? target - Math.round(tdee) : 0,
    canRecommendTarget: allowed,
    blockedReason: reason,
  };
}
