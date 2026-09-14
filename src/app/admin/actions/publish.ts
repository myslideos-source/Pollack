"use server";

import { draftMode } from "next/headers";
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
  revalidatePath("/admin/medien");

  return { status: "success", count: count ?? 0 };
}

/**
 * Toggles Next.js's built-in Draft Mode so the public site renders pending drafts inline for
 * this signed-in staff session only. Unlike a plain cookie check, Draft Mode only opts *this*
 * request into dynamic, uncached rendering — every other visitor keeps getting the cached,
 * statically-rendered page, which is what lets the public site be cached at all.
 */
export async function togglePreviewModeAction(enable: boolean): Promise<void> {
  await requireStaff();
  const draft = await draftMode();
  if (enable) draft.enable();
  else draft.disable();
}
