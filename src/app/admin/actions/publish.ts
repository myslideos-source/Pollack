"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export type PublishActionState = { status: "idle" } | { status: "success"; count: number } | { status: "error"; message: string };

export async function publishAllDraftsAction(
  _prev: PublishActionState,
  _formData: FormData,
): Promise<PublishActionState> {
  const profile = await requireStaff();
  const supabase = await createClient();

  const { data: count, error } = await supabase.rpc("publish_all_drafts", { p_actor: profile.id });
  if (error) {
    return { status: "error", message: "Veröffentlichung fehlgeschlagen. Bitte erneut versuchen." };
  }

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "content.published",
    entity_type: "website_sections",
    summary: `${count ?? 0} Bereich(e) veröffentlicht.`,
  });

  // The public pages read live content server-side — bust the cache so the new version
  // appears immediately instead of waiting for the next natural revalidation.
  revalidatePath("/", "layout");

  return { status: "success", count: count ?? 0 };
}

/** Toggles a signed-in-only preview cookie so the public site renders pending drafts inline. */
export async function togglePreviewModeAction(enable: boolean): Promise<void> {
  await requireStaff();
  const cookieStore = await cookies();
  if (enable) {
    cookieStore.set("sp_preview", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 4 });
  } else {
    cookieStore.delete("sp_preview");
  }
}
