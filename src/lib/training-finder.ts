import { getProgram } from "@/content/programs";

export type FinderGoal = "staerker" | "ruecken" | "abnehmen" | "beweglich" | "sicher";
export type FinderLimitation = "keine" | "ruecken_gelenke" | "bewegung" | "keine_angabe";
export type FinderStyle = "frei" | "geführt" | "gruppe";
export type FinderTime = "kurz" | "klassisch" | "viel";

export type FinderAnswers = {
  goal: FinderGoal;
  limitation: FinderLimitation;
  style: FinderStyle;
  time: FinderTime;
};

const GOAL_PROGRAMS: Record<FinderGoal, string[]> = {
  staerker: ["fitness", "technogym", "plate-loaded"],
  ruecken: ["five", "milon"],
  abnehmen: ["milon", "fitness"],
  beweglich: ["five", "yoga"],
  sicher: ["karate", "selbstverteidigung"],
};

/**
 * Not a medical assessment — a light steer toward at most two Sportpark areas,
 * based on the stated goal and adjusted for a disclosed physical limitation or
 * a preferred training style. See TrainingFinder UI for the WhatsApp hand-off.
 */
export function recommendPrograms(answers: FinderAnswers) {
  let slugs = [...GOAL_PROGRAMS[answers.goal]];

  if (answers.limitation === "ruecken_gelenke" && !slugs.includes("five")) {
    slugs = ["five", slugs[0]];
  }

  if (answers.style === "geführt" && answers.goal === "staerker") {
    slugs = ["milon", "fitness"];
  }
  if (answers.style === "gruppe" && answers.goal !== "sicher" && answers.goal !== "ruecken") {
    slugs = [slugs[0], "yoga"];
  }

  const unique = Array.from(new Set(slugs)).slice(0, 2);
  return unique.map((slug) => getProgram(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}
