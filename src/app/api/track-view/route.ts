import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Records one page_views row for the anonymous "sp_visitor" cookie middleware assigns to every
 * public-site request. Deliberately a Route Handler hit from a client-side beacon (see
 * ViewTracker) rather than something called during page render: a Route Handler is always
 * request-scoped, so doing the cookies()/DB write here — instead of in the shared (site) layout,
 * where it used to live — no longer forces every public page into fully dynamic rendering just
 * to count a visit.
 */
export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sp_visitor")?.value;
  if (!sessionId) return NextResponse.json({ ok: false });

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("page_views").insert({ session_id: sessionId });
    if (error) console.error("[track-view]", error);
  } catch (error) {
    console.error("[track-view]", error);
  }

  return NextResponse.json({ ok: true });
}
