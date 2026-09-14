import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Records one page_views row against the anonymous "sp_visitor" cookie middleware assigns to
 * every public-site request (see lib/supabase/middleware.ts). Best-effort and silent: a failure
 * here must never affect the page render, so every error is caught and only logged.
 */
export async function recordPageView(): Promise<void> {
  // Left outside the try/catch, like every other loader's cookies()/createClient() call: Next.js
  // uses a thrown DYNAMIC_SERVER_USAGE signal internally to detect this route needs dynamic
  // rendering (e.g. during the static-generation trial pass for generateStaticParams routes) —
  // swallowing it here would hide that signal from Next's own bail-out logic.
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sp_visitor")?.value;
  if (!sessionId) return;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("page_views").insert({ session_id: sessionId });
    if (error) console.error("[recordPageView]", error);
  } catch (error) {
    console.error("[recordPageView]", error);
  }
}
