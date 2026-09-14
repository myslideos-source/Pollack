import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MediaUploadForm } from "./MediaUploadForm";
import { MediaGrid } from "./MediaGrid";

export const metadata: Metadata = { title: "Bilder & Videos" };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function collectUuidStrings(value: unknown, into: Set<string>) {
  if (typeof value === "string") {
    if (UUID_RE.test(value)) into.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => collectUuidStrings(v, into));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((v) => collectUuidStrings(v, into));
  }
}

export default async function MedienPage() {
  await requireStaff();
  const supabase = await createClient();

  const [
    { data: media },
    { data: sections },
    { data: drafts },
    { data: partners },
    { data: products },
    { data: team },
  ] = await Promise.all([
    supabase.from("media").select("*").order("created_at", { ascending: false }),
    supabase.from("website_sections").select("content"),
    supabase.from("website_drafts").select("content"),
    supabase.from("partners").select("logo_media_id"),
    supabase.from("products").select("image_media_id"),
    supabase.from("team_members").select("photo_media_id"),
  ]);

  const usedIds = new Set<string>();
  (sections ?? []).forEach((s) => collectUuidStrings(s.content, usedIds));
  (drafts ?? []).forEach((d) => collectUuidStrings(d.content, usedIds));
  (partners ?? []).forEach((p) => p.logo_media_id && usedIds.add(p.logo_media_id));
  (products ?? []).forEach((p) => p.image_media_id && usedIds.add(p.image_media_id));
  (team ?? []).forEach((t) => t.photo_media_id && usedIds.add(t.photo_media_id));
  (media ?? []).forEach((m) => m.poster_media_id && usedIds.add(m.poster_media_id));

  const unusedCount = (media ?? []).filter((m) => !usedIds.has(m.id)).length;

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Bilder & Videos</h1>
        <p className="text-sm text-paper/60">
          Zentrale Medienbibliothek — hier hochgeladene Dateien können in der Website-Bearbeitung wiederverwendet
          werden.
        </p>
      </div>

      <div className="mt-6">
        <MediaUploadForm />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-paper">Alle Medien ({media?.length ?? 0})</h2>
          {unusedCount > 0 ? (
            <span className="rounded-full border border-sand/30 bg-sand/10 px-3 py-1 text-xs text-sand">
              {unusedCount} nicht verwendet
            </span>
          ) : null}
        </div>
        <MediaGrid items={media ?? []} usedIds={Array.from(usedIds)} />
      </div>
    </div>
  );
}
