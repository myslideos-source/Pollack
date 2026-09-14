"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createMediaRecordAction } from "@/app/admin/actions/media";

const ALLOWED_TYPES: Record<string, "image" | "video"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/avif": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
};

const MAX_BYTES = 100 * 1024 * 1024;

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

const AREAS = [
  { value: "", label: "Kein Bereich" },
  { value: "hero", label: "Hero" },
  { value: "training", label: "Training" },
  { value: "gesundheit", label: "Gesundheit" },
  { value: "kampfkunst", label: "Kampfkunst" },
  { value: "regeneration", label: "Regeneration" },
  { value: "partner", label: "Partner & Produkte" },
  { value: "team", label: "Team" },
  { value: "community", label: "Community" },
];

export function MediaUploadForm({ onUploaded }: { onUploaded?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [area, setArea] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const fileType = ALLOWED_TYPES[file.type];
      if (!fileType) {
        setError(`Nicht unterstützter Dateityp: ${file.name}`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`Datei zu groß (max. 100 MB): ${file.name}`);
        continue;
      }

      setProgress(`Lädt hoch: ${file.name} …`);

      const path = `${fileType}/${Date.now()}-${sanitizeFilename(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("media-public").upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
      });

      if (uploadError) {
        setError(`Upload fehlgeschlagen: ${file.name}`);
        continue;
      }

      const dims = fileType === "image" ? await readImageDimensions(file) : null;

      const fd = new FormData();
      fd.set("storageBucket", "media-public");
      fd.set("storagePath", path);
      fd.set("fileType", fileType);
      fd.set("mimeType", file.type);
      fd.set("fileSize", String(file.size));
      fd.set("title", file.name.replace(/\.[^.]+$/, ""));
      fd.set("area", area);
      if (dims) {
        fd.set("width", String(dims.width));
        fd.set("height", String(dims.height));
      }

      const res = await createMediaRecordAction(fd);
      if (res.error) setError(res.error);
    }

    setProgress(null);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    onUploaded?.();
  }

  return (
    <div className="rounded-2xl border border-dashed border-paper/20 bg-anthracite p-6 text-center">
      <UploadCloud size={28} className="mx-auto text-paper/40" />
      <p className="mt-2 text-sm text-paper/70">Bilder oder Videos hochladen (JPEG, PNG, WebP, AVIF, MP4, MOV)</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="rounded-full border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        >
          {AREAS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
          {busy ? "Wird hochgeladen …" : "Dateien auswählen"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {progress ? <p className="mt-3 text-xs text-paper/50">{progress}</p> : null}
      {error ? <p className="mt-3 text-xs text-red">{error}</p> : null}
    </div>
  );
}
