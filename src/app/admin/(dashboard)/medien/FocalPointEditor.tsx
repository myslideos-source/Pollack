"use client";

import { useRef, useState, useTransition } from "react";
import { Crosshair, X, Check } from "lucide-react";
import { updateMediaCropAction } from "@/app/admin/actions/media";

type Point = { x: number; y: number };

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Lets an admin pick which part of a photo must stay visible when it gets cropped by
 * object-cover at a different aspect ratio than the original (e.g. a wide desktop hero image
 * on a tall mobile screen). Clicking/dragging on the full, uncropped image sets the focal
 * point; the two preview strips on the right show the result at the aspect ratios actually
 * used on the site, so it's obvious whether a person is still in frame before saving.
 */
export function FocalPointEditor({
  mediaId,
  src,
  title,
  initial,
  onClose,
}: {
  mediaId: string;
  src: string;
  title: string;
  initial: Point;
  onClose: () => void;
}) {
  const [point, setPoint] = useState<Point>(initial);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function setFromPointer(clientX: number, clientY: number) {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
    setPoint({ x: Math.round(x), y: Math.round(y) });
  }

  function handleSave() {
    const fd = new FormData();
    fd.set("id", mediaId);
    fd.set("x", String(point.x));
    fd.set("y", String(point.y));
    startTransition(async () => {
      const res = await updateMediaCropAction(fd);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  const objectPosition = `${point.x}% ${point.y}%`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-paper/10 bg-anthracite p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg text-paper">
            <Crosshair size={18} /> Bildausschnitt — {title}
          </h3>
          <button type="button" onClick={onClose} className="text-paper/50 hover:text-paper">
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-xs text-paper/50">
          Klicke oder ziehe auf dem Bild an die Stelle, die immer sichtbar bleiben soll (z. B. ein Gesicht). Die
          Vorschauen rechts zeigen, wie das Bild auf der Website zugeschnitten wird.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <div
            className="relative select-none overflow-hidden rounded-xl border border-paper/15 bg-ink"
            onPointerDown={(e) => {
              setDragging(true);
              setFromPointer(e.clientX, e.clientY);
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (dragging) setFromPointer(e.clientX, e.clientY);
            }}
            onPointerUp={() => setDragging(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- interactive picker needs direct pointer coordinates against the natural image box */}
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              className="max-h-[60vh] w-full cursor-crosshair object-contain"
            />
            <span
              className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red bg-red/30 shadow-[0_0_0_2px_rgba(255,255,255,0.6)]"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-wide text-paper/40">Vorschau — Porträt/Karte</p>
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-paper/15 bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element -- live crop preview, not a real page image */}
                <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition }} />
              </div>
            </div>
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-wide text-paper/40">Vorschau — Breitbild/Hero</p>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-paper/15 bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element -- live crop preview, not a real page image */}
                <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition }} />
              </div>
            </div>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red">{error}</p> : null}

        <div className="mt-5 flex items-center gap-3 border-t border-paper/10 pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
          >
            <Check size={15} /> {isPending ? "Speichert …" : "Bildausschnitt speichern"}
          </button>
          <button type="button" onClick={onClose} className="text-sm text-paper/50 hover:text-paper">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
