"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MediaItem = {
  id: string;
  title: string;
  alt_text: string | null;
  file_type: string;
  storage_bucket: string;
  storage_path: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function publicUrl(item: MediaItem): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${item.storage_bucket}/${item.storage_path}`;
}

export function MediaPicker({
  value,
  onChange,
  fileType,
}: {
  value: string | null;
  onChange: (mediaId: string | null) => void;
  fileType?: "image" | "video";
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);
  // Some fields still hold a plain static path (e.g. "/media/hero/hero2-desktop.webp") carried
  // over from the initial content seed rather than a media-library UUID — shown as a lightweight
  // preview instead of triggering a lookup that can only ever come back empty for a non-UUID id.
  const [rawPath, setRawPath] = useState<string | null>(null);

  // Determining whether `value` is a raw path or a media UUID is a plain synchronous check, not
  // an async lookup — resolved during render (this codebase's usual "adjust state during render"
  // pattern) rather than inside an effect. Only the real UUID case needs the effect below, for
  // the actual Supabase round trip.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (!value) {
      setSelected(null);
      setRawPath(null);
    } else if (!UUID_RE.test(value)) {
      setRawPath(value);
      setSelected(null);
    } else {
      setRawPath(null);
    }
  }

  useEffect(() => {
    if (!value || !UUID_RE.test(value)) return;
    const supabase = createClient();
    supabase
      .from("media")
      .select("id, title, alt_text, file_type, storage_bucket, storage_path")
      .eq("id", value)
      .maybeSingle()
      .then(({ data }) => setSelected(data));
  }, [value]);

  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setLoading(true);
  }

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    let query = supabase
      .from("media")
      .select("id, title, alt_text, file_type, storage_bucket, storage_path")
      .order("created_at", { ascending: false })
      .limit(60);
    if (fileType) query = query.eq("file_type", fileType);
    query.then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, [open, fileType]);

  return (
    <div>
      {selected ? (
        <div className="flex items-center gap-3 rounded-xl border border-paper/15 bg-ink p-2.5">
          {selected.file_type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail, next/image adds no benefit here
            <img src={publicUrl(selected)} alt="" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-paper/10 text-xs text-paper/50">Video</span>
          )}
          <span className="flex-1 truncate text-sm text-paper">{selected.title}</span>
          <button type="button" onClick={() => setOpen(true)} className="text-xs text-red hover:text-red-dark">
            Ändern
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setSelected(null);
            }}
            className="text-paper/40 hover:text-paper"
          >
            <X size={16} />
          </button>
        </div>
      ) : rawPath ? (
        <div className="flex items-center gap-3 rounded-xl border border-paper/15 bg-ink p-2.5">
          {fileType === "video" ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-paper/10 text-xs text-paper/50">Video</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail, next/image adds no benefit here
            <img src={rawPath} alt="" className="h-12 w-12 rounded-lg object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-paper">Aktuelle Datei</p>
            <p className="truncate text-xs text-paper/40">Noch nicht in der Medienbibliothek — {rawPath}</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="shrink-0 text-xs text-red hover:text-red-dark">
            Ändern
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-paper/20 py-4 text-sm text-paper/50 hover:border-paper/40 hover:text-paper/70"
        >
          <ImagePlus size={16} /> Aus Medienbibliothek wählen
        </button>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-paper/10 bg-anthracite p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-paper">Medium auswählen</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-paper/50 hover:text-paper">
                <X size={18} />
              </button>
            </div>

            {loading ? (
              <p className="mt-6 text-center text-sm text-paper/40">Lädt …</p>
            ) : items.length === 0 ? (
              <p className="mt-6 text-center text-sm text-paper/40">
                Noch keine Medien in der Bibliothek. Lade zuerst Dateien unter &bdquo;Bilder & Videos&ldquo; hoch.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setSelected(item);
                      setRawPath(null);
                      setOpen(false);
                    }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-paper/10 bg-ink"
                  >
                    {item.file_type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin picker grid thumbnail
                      <img src={publicUrl(item)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs text-paper/50">Video</span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 truncate bg-ink/80 px-2 py-1 text-left text-[11px] text-paper/80">
                      {item.title}
                    </span>
                    {value === item.id ? (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red text-paper">
                        <Check size={12} />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
