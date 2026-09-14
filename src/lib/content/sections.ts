import "server-only";
import { draftMode } from "next/headers";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type SectionContent = Record<string, unknown>;

/**
 * Reads one website_sections row by slug for public rendering. The live-content lookup always
 * uses the stateless public client (see lib/supabase/public.ts) so the common case — Draft Mode
 * off, i.e. every real visitor — never touches cookies() and can be statically cached. Only when
 * Next.js Draft Mode is on (see admin/actions/publish.ts togglePreviewModeAction — a signed-in-
 * staff-only preview) do we reach for the cookie-aware client, since website_drafts' RLS only
 * allows staff to read it. Draft Mode only forces dynamic, uncached rendering for that one
 * previewing session; every other visitor still gets the statically cached, published-only page.
 * A hidden result (live or draft) always renders as absent, never as an empty placeholder.
 */
export async function getSection(slug: string): Promise<{ content: SectionContent } | null> {
  const publicClient = createPublicClient();
  const { data: section, error } = await publicClient
    .from("website_sections")
    .select("id, content, visible")
    .eq("slug", slug)
    .maybeSingle();
  if (error) console.error(`[getSection:${slug}]`, error);
  if (!section) return null;

  const { isEnabled: preview } = await draftMode();

  if (preview) {
    const supabase = await createClient();
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
