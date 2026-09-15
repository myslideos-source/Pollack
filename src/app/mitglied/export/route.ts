import { NextResponse } from "next/server";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/** Real GDPR data export: every row this member owns, as a downloadable JSON file. */
export async function GET() {
  const profile = await requireMember();
  const supabase = await createClient();

  const [memberProfile, consents, plans, measurements, sessions, messages] = await Promise.all([
    supabase.from("member_profiles").select("*").eq("id", profile.id).maybeSingle(),
    supabase.from("health_consents").select("event, policy_version, created_at").eq("member_id", profile.id),
    supabase.from("training_plans").select("id, status, version, notes, created_at").eq("member_id", profile.id),
    supabase.from("body_measurements").select("measured_at, weight_kg, body_fat_pct, chest_cm, waist_cm, hip_cm, notes").eq("member_id", profile.id),
    supabase.from("workout_sessions").select("id, started_at, completed_at, duration_min, total_volume_kg, feeling_note").eq("member_id", profile.id),
    supabase.from("coach_messages").select("sender_role, body, created_at").eq("member_id", profile.id),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    profile: { fullName: profile.full_name, email: profile.email },
    memberProfile: memberProfile.data,
    consents: consents.data,
    trainingPlans: plans.data,
    bodyMeasurements: measurements.data,
    workoutSessions: sessions.data,
    coachMessages: messages.data,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=meine-daten.json",
    },
  });
}
