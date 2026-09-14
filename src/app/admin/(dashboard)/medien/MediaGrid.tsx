"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, X, Check, Crosshair } from "lucide-react";
import { updateMediaAction, deleteMediaAction } from "@/app/admin/actions/media";
import { FocalPointEditor } from "./FocalPointEditor";

type MediaItem = {
  id: string;
  title: string;
  alt_text: string | null;
  area: string | null;
  file_type: string;
  storage_bucket: string;
  storage_path: string;
  file_size: number;
  width: number | null;
  height: number | null;
  crop: unknown;
  created_at: string;
};

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

function publicUrl(item: Pick<MediaItem, "storage_bucket" | "storage_path">): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${item.storage_bucket}/${item.storage_path}`;
}

function readCrop(crop: unknown): { x: number; y: number } {
  if (crop && typeof crop === "object") {
    const { x, y } = crop as { x?: unknown; y?: unknown };
    return { x: typeof x === "number" ? x : 50, y: typeof y === "number" ? y : 50 };
  }
  return { x: 50, y: 50 };
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function EditRow({ item, onDone }: { item: MediaItem; onDone: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [altText, setAltText] = useState(item.alt_text ?? "");
  const [area, setArea] = useState(item.area ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    const fd = new FormData();
    fd.set("id", item.id);
    fd.set("title", title);
    fd.set("altText", altText);
    fd.set("area", area);
    startTransition(async () => {
      const res = await updateMediaAction(fd);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <div className="space-y-2 p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel"
        className="w-full rounded-lg border border-paper/15 bg-ink px-2.5 py-1.5 text-xs text-paper"
      />
      <input
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        placeholder="Alt-Text (Barrierefreiheit)"
        className="w-full rounded-lg border border-paper/15 bg-ink px-2.5 py-1.5 text-xs text-paper"
      />
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full rounded-lg border border-paper/15 bg-ink px-2.5 py-1.5 text-xs text-paper"
      >
        {AREAS.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-[11px] text-red">{error}</p> : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-1 rounded-full bg-red px-3 py-1.5 text-[11px] font-medium text-paper hover:bg-red-dark disabled:opacity-60"
        >
          <Check size={12} /> Speichern
        </button>
        <button type="button" onClick={onDone} className="flex items-center gap-1 text-[11px] text-paper/50 hover:text-paper">
          <X size={12} /> Abbrechen
        </button>
      </div>
    </div>
  );
}

export function MediaGrid({ items, usedIds }: { items: MediaItem[]; usedIds: string[] }) {
  const used = new Set(usedIds);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [focalEditingId, setFocalEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unused">("all");
  const [isPending, startTransition] = useTransition();
  const focalEditingItem = items.find((i) => i.id === focalEditingId) ?? null;

  const visible = filter === "unused" ? items.filter((i) => !used.has(i.id)) : items;

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteMediaAction(fd);
      setConfirmDeleteId(null);
    });
  }

  if (items.length === 0) {
    return <p className="mt-6 text-center text-sm text-paper/40">Noch keine Medien hochgeladen.</p>;
  }

  return (
    <div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs ${filter === "all" ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"}`}
        >
          Alle
        </button>
        <button
          type="button"
          onClick={() => setFilter("unused")}
          className={`rounded-full px-3 py-1.5 text-xs ${filter === "unused" ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"}`}
        >
          Nicht verwendet
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
            <div className="relative aspect-video bg-ink">
              {item.file_type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin media library thumbnail
                <img src={publicUrl(item)} alt={item.alt_text ?? ""} className="h-full w-full object-cover" />
              ) : (
                <video
                  src={publicUrl(item)}
                  className="h-full w-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
              )}
              {!used.has(item.id) ? (
                <span className="absolute left-2 top-2 rounded-full border border-sand/40 bg-ink/80 px-2 py-0.5 text-[10px] text-sand">
                  Nicht verwendet
                </span>
              ) : null}
            </div>

            {editingId === item.id ? (
              <EditRow item={item} onDone={() => setEditingId(null)} />
            ) : (
              <div className="p-3">
                <p className="truncate text-sm text-paper">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-paper/40">
                  {formatSize(item.file_size)}
                  {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
                  {item.area ? ` · ${AREAS.find((a) => a.value === item.area)?.label ?? item.area}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="flex items-center gap-1 text-[11px] text-paper/60 hover:text-paper"
                  >
                    <Pencil size={12} /> Bearbeiten
                  </button>
                  {item.file_type === "image" ? (
                    <button
                      type="button"
                      onClick={() => setFocalEditingId(item.id)}
                      className="flex items-center gap-1 text-[11px] text-paper/60 hover:text-paper"
                    >
                      <Crosshair size={12} /> Bildausschnitt
                    </button>
                  ) : null}
                  {confirmDeleteId === item.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        className="text-[11px] text-red hover:text-red-dark"
                      >
                        Wirklich löschen?
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[11px] text-paper/40 hover:text-paper"
                      >
                        Abbrechen
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="flex items-center gap-1 text-[11px] text-paper/60 hover:text-red"
                    >
                      <Trash2 size={12} /> Löschen
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filter === "unused" && visible.length === 0 ? (
        <p className="mt-6 text-center text-sm text-paper/40">Alle Medien werden aktuell verwendet.</p>
      ) : null}

      {focalEditingItem ? (
        <FocalPointEditor
          mediaId={focalEditingItem.id}
          src={publicUrl(focalEditingItem)}
          title={focalEditingItem.title}
          initial={readCrop(focalEditingItem.crop)}
          onClose={() => setFocalEditingId(null)}
        />
      ) : null}
    </div>
  );
}
