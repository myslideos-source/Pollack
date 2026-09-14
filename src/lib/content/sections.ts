import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type SectionContent = Record<string, unknown>;

/**
 * Reads one website_sections row by slug for public rendering. When the signed-in-staff-only
 * "sp_preview" cookie is set (see admin/actions/publish.ts togglePreviewModeAction), an existing
 * draft overrides the live content/visible so staff can see the pending version — but the public
 * site must never show a half-finished draft, so a hidden result (live or draft) always renders
 * as absent, never as an empty placeholder.
 */
export async function getSection(slug: string): Promise<{ content: SectionContent } | null> {
  const supabase = await createClient();
  const { data: section, error } = await supabase
    .from("website_sections")
    .select("id, content, visible")
    .eq("slug", slug)
    .maybeSingle();
  if (error) console.error(`[getSection:${slug}]`, error);
  if (!section) return null;

  const cookieStore = await cookies();
  const preview = cookieStore.get("sp_preview")?.value === "1";

  if (preview) {
    const { data: draft } = await supabase
      .from("website_drafts")
      .select("content, visible")
      .eq("section_id", section.id)
      .maybeSingle();
    if (draft) {
      return draft.visible ? { content: draft.content as SectionContent } : null;
    }
  }

  return section.visible ? { content: section.content as SectionContent } : null;
}

function str(content: SectionContent, key: string): string | undefined {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function list(content: SectionContent, key: string): string[] {
  const v = content[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export const sectionField = { str, list };
