import "server-only";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Section/program media fields hold either a plain static path (e.g. "/media/hero/…webp",
 * carried over from the pre-CMS content so the site looks identical on day one) or a media
 * library row's UUID once an admin re-selects the field via MediaPicker. This resolves either
 * form to a URL the browser can load directly.
 */
export async function resolveMediaSrc(value: unknown): Promise<string | null> {
  if (typeof value !== "string" || value.length === 0) return null;
  if (!UUID_RE.test(value)) return value;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("storage_bucket, storage_path")
    .eq("id", value)
    .maybeSingle();
  if (error) console.error("[resolveMediaSrc]", error);
  if (!data) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${data.storage_bucket}/${data.storage_path}`;
}
