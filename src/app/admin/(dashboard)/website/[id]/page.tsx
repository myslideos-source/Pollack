import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SectionEditor } from "./SectionEditor";

export const metadata: Metadata = { title: "Bereich bearbeiten" };

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: section }, { data: draft }] = await Promise.all([
    supabase.from("website_sections").select("*").eq("id", id).maybeSingle(),
    supabase.from("website_drafts").select("*").eq("section_id", id).maybeSingle(),
  ]);

  if (!section) notFound();

  const effective = draft
    ? { ...section, content: draft.content, visible: draft.visible, sort_order: draft.sort_order }
    : section;

  return (
    <SectionEditor
      section={effective as never}
      hasDraft={Boolean(draft)}
    />
  );
}
