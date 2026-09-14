"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

async function logAudit(params: {
  actorId: string;
  action: string;
  entityId: string;
  summary: string;
  previousValue?: unknown;
  newValue?: unknown;
}) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: params.actorId,
    action: params.action,
    entity_type: "website_section",
    entity_id: params.entityId,
    summary: params.summary,
    previous_value: params.previousValue as never,
    new_value: params.newValue as never,
  });
}

/**
 * Saves a section's edits as a draft (never touches the live, published website_sections row
 * directly) — one upsert per section, so re-saving just updates the same pending draft instead
 * of piling up rows. Publishing (see actions/publish.ts) is what copies drafts into the live
 * table for every section at once.
 */
export async function saveSectionDraftAction(
  sectionId: string,
  content: Record<string, unknown>,
  visible: boolean,
  sortOrder: number,
): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const supabase = await createClient();

  const { data: section } = await supabase.from("website_sections").select("title, content").eq("id", sectionId).single();

  const { error } = await supabase
    .from("website_drafts")
    .upsert(
      { section_id: sectionId, content: content as never, visible, sort_order: sortOrder, updated_by: profile.id },
      { onConflict: "section_id" },
    );

  if (error) return { error: "Entwurf konnte nicht gespeichert werden." };

  await logAudit({
    actorId: profile.id,
    action: "website_section.draft_saved",
    entityId: sectionId,
    summary: `Entwurf gespeichert: ${section?.title ?? sectionId}`,
    previousValue: section?.content,
    newValue: content,
  });

  revalidatePath("/admin/website");
  revalidatePath("/admin");
  return {};
}

export async function discardSectionDraftAction(sectionId: string): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const supabase = await createClient();
  const { data: section } = await supabase.from("website_sections").select("title").eq("id", sectionId).single();
  const { error } = await supabase.from("website_drafts").delete().eq("section_id", sectionId);
  if (error) return { error: "Entwurf konnte nicht verworfen werden." };

  await logAudit({
    actorId: profile.id,
    action: "website_section.draft_discarded",
    entityId: sectionId,
    summary: `Entwurf verworfen: ${section?.title ?? sectionId}`,
  });

  revalidatePath("/admin/website");
  revalidatePath("/admin");
  return {};
}

/**
 * Reordering is a visible content change, so — like every other edit — it goes through a
 * draft first rather than writing website_sections directly. Swapping two sections means both
 * need a draft row; for whichever of the two doesn't have one yet, this copies its current
 * live content across so the draft is a complete row, not a partial one.
 */
export async function reorderSectionAction(sectionId: string, siblingSectionId: string): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const supabase = await createClient();

  const [{ data: sections }, { data: drafts }] = await Promise.all([
    supabase.from("website_sections").select("id, title, content, sort_order, visible").in("id", [sectionId, siblingSectionId]),
    supabase.from("website_drafts").select("section_id, content, sort_order, visible").in("section_id", [sectionId, siblingSectionId]),
  ]);

  if (!sections || sections.length !== 2) return { error: "Reihenfolge konnte nicht geändert werden." };

  const current = (id: string) => drafts?.find((d) => d.section_id === id) ?? sections.find((s) => s.id === id)!;
  const a = sections.find((s) => s.id === sectionId)!;
  const b = sections.find((s) => s.id === siblingSectionId)!;
  const aState = current(sectionId);
  const bState = current(siblingSectionId);

  const { error } = await supabase.from("website_drafts").upsert(
    [
      { section_id: sectionId, content: aState.content, visible: aState.visible, sort_order: b.sort_order, updated_by: profile.id },
      { section_id: siblingSectionId, content: bState.content, visible: bState.visible, sort_order: a.sort_order, updated_by: profile.id },
    ],
    { onConflict: "section_id" },
  );
  if (error) return { error: "Reihenfolge konnte nicht geändert werden." };

  await logAudit({
    actorId: profile.id,
    action: "website_section.reordered",
    entityId: sectionId,
    summary: `Reihenfolge geändert: ${a.title ?? sectionId} ↔ ${b.title ?? siblingSectionId}`,
  });

  revalidatePath("/admin/website");
  return {};
}

export async function restoreLastPublishedAction(sectionId: string): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const supabase = await createClient();
  const { data: section } = await supabase.from("website_sections").select("title").eq("id", sectionId).single();

  const { data: restored, error } = await supabase.rpc("restore_last_version", {
    p_section_id: sectionId,
    p_actor: profile.id,
  });
  if (error) return { error: "Wiederherstellung fehlgeschlagen." };
  if (!restored) return { error: "Keine frühere Version vorhanden." };

  await logAudit({
    actorId: profile.id,
    action: "website_section.restored",
    entityId: sectionId,
    summary: `Letzte veröffentlichte Version wiederhergestellt: ${section?.title ?? sectionId}`,
  });

  revalidatePath("/admin/website");
  revalidatePath("/", "layout");
  return {};
}
