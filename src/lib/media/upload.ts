"use client";

import { createClient } from "@/lib/supabase/client";
import { createMediaRecordAction } from "@/app/admin/actions/media";

/**
 * One place for "take a File, put it in Storage, create its media row" — used by both the
 * Medienverwaltung upload form and MediaPicker's inline upload (so a trainer/admin editing an
 * exercise, an achievement icon, a training day cover, etc. can upload straight from that form
 * instead of detouring through the media library first).
 */

export const ALLOWED_MEDIA_TYPES: Record<string, "image" | "video"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/avif": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
};

export const MAX_MEDIA_BYTES = 100 * 1024 * 1024;

function sanitizeFilename(name: string): string {
  const base = name.normalize("NFKD").replace(/[^\w.-]+/g, "-");
  return base.replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "datei";
}

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export async function uploadMediaFile(
  file: File,
  opts: { folderId?: string | null } = {},
): Promise<{ id?: string; error?: string }> {
  const fileType = ALLOWED_MEDIA_TYPES[file.type];
  if (!fileType) return { error: `Nicht unterstützter Dateityp: ${file.name}` };
  if (file.size > MAX_MEDIA_BYTES) return { error: `Datei zu groß (max. 100 MB): ${file.name}` };

  const supabase = createClient();
  const path = `${fileType}/${Date.now()}-${sanitizeFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("media-public").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (uploadError) return { error: `Upload fehlgeschlagen: ${file.name}` };

  const dims = fileType === "image" ? await readImageDimensions(file) : null;

  const fd = new FormData();
  fd.set("storageBucket", "media-public");
  fd.set("storagePath", path);
  fd.set("fileType", fileType);
  fd.set("mimeType", file.type);
  fd.set("fileSize", String(file.size));
  fd.set("title", file.name.replace(/\.[^.]+$/, ""));
  if (opts.folderId) fd.set("folderId", opts.folderId);
  if (dims) {
    fd.set("width", String(dims.width));
    fd.set("height", String(dims.height));
  }

  const res = await createMediaRecordAction(fd);
  if (res.error) return { error: res.error };
  return { id: res.id };
}
