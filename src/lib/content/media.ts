import "server-only";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ResolvedMedia = { src: string; focalX: number; focalY: number };

function publicUrl(storageBucket: string, storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${storageBucket}/${storagePath}`;
}

/**
 * Section/program media fields hold either a plain static path (e.g. "/media/hero/…webp",
 * carried over from the pre-CMS content so the site looks identical on day one) or a media
 * library row's UUID once an admin re-selects the field via MediaPicker. This resolves either
 * form to a URL the browser can load directly, plus the image's focal point (`media.crop`,
 * a {x,y} percentage pair the admin sets in the Medienbibliothek so an object-cover crop keeps
 * the right part of the photo in frame — e.g. a person's face — at every breakpoint). A raw
 * static path has no matching media row, so it always gets the centered default.
 */
export async function resolveMedia(value: unknown): Promise<ResolvedMedia | null> {
  if (typeof value !== "string" || value.length === 0) return null;
  if (!UUID_RE.test(value)) return { src: value, focalX: 50, focalY: 50 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("storage_bucket, storage_path, crop")
    .eq("id", value)
    .maybeSingle();
  if (error) console.error("[resolveMedia]", error);
  if (!data) return null;

  const crop = data.crop as { x?: number; y?: number } | null;
  return {
    src: publicUrl(data.storage_bucket, data.storage_path),
    focalX: typeof crop?.x === "number" ? crop.x : 50,
    focalY: typeof crop?.y === "number" ? crop.y : 50,
  };
}

/** Thin wrapper over {@link resolveMedia} for callers that only need the URL (video sources etc). */
export async function resolveMediaSrc(value: unknown): Promise<string | null> {
  const resolved = await resolveMedia(value);
  return resolved?.src ?? null;
}
