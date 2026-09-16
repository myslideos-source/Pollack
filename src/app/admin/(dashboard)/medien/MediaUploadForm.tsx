"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadMediaFile } from "@/lib/media/upload";

export function MediaUploadForm({
  folders,
  defaultFolderId,
  onUploaded,
}: {
  folders: { id: string; name: string }[];
  defaultFolderId?: string | null;
  onUploaded?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [folderId, setFolderId] = useState(defaultFolderId ?? "");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);

    for (const file of Array.from(files)) {
      setProgress(`Lädt hoch: ${file.name} …`);
      const res = await uploadMediaFile(file, { folderId: folderId || null });
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
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="rounded-full border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        >
          <option value="">Kein Ordner</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
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
