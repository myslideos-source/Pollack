"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, X, Check, EyeOff, Eye } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { AchievementIcon, type AchievementTier } from "@/components/achievements/AchievementIcon";
import { ACHIEVEMENT_ICONS } from "@/components/achievements/icon-map";
import { CATEGORY_LABELS, TIER_LABELS } from "@/components/achievements/category-labels";
import { saveAchievementAction, setAchievementActiveAction } from "@/app/admin/actions/achievements";

type Achievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon_key: string;
  custom_icon_media_id: string | null;
  metric_type: string;
  threshold: number | null;
  tier: string | null;
  parent_achievement_id: string | null;
  is_manual: boolean;
  is_secret: boolean;
  is_active: boolean;
  sort_order: number;
  share_text: string | null;
  valid_from: string | null;
  valid_until: string | null;
};

const inputClass = "w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper";
const labelClass = "mb-1 block text-xs text-paper/50";

function toDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

function AchievementForm({ achievement, allAchievements, onDone }: { achievement?: Achievement; allAchievements: Achievement[]; onDone: () => void }) {
  const [customIconMediaId, setCustomIconMediaId] = useState<string | null>(achievement?.custom_icon_media_id ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (achievement) formData.set("id", achievement.id);
    if (customIconMediaId) formData.set("customIconMediaId", customIconMediaId);
    startTransition(async () => {
      const res = await saveAchievementAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Slug (eindeutig, z. B. &quot;erster-schritt&quot;)</label>
          <input name="slug" defaultValue={achievement?.slug} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Titel</label>
          <input name="title" defaultValue={achievement?.title} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Beschreibung (dient auch als Hinweis, wie der Erfolg erreicht wird)</label>
        <textarea name="description" defaultValue={achievement?.description} rows={2} required className={inputClass} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Kategorie</label>
          <select name="category" defaultValue={achievement?.category ?? "einstieg"} className={inputClass}>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Stufe (optional)</label>
          <select name="tier" defaultValue={achievement?.tier ?? ""} className={inputClass}>
            <option value="">Keine Stufe</option>
            {Object.entries(TIER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Vorherige Stufe (Verkettung)</label>
          <select name="parentAchievementId" defaultValue={achievement?.parent_achievement_id ?? ""} className={inputClass}>
            <option value="">Keine</option>
            {allAchievements
              .filter((a) => a.id !== achievement?.id)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.slug})
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Icon</label>
          <select name="iconKey" defaultValue={achievement?.icon_key ?? "medal"} className={inputClass}>
            {Object.keys(ACHIEVEMENT_ICONS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Messwert-Typ (intern, z. B. &quot;workout_count&quot;)</label>
          <input name="metricType" defaultValue={achievement?.metric_type ?? "manual"} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Zielwert (leer bei manueller Vergabe)</label>
          <input name="threshold" type="number" step="1" defaultValue={achievement?.threshold ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Eigenes SVG-Icon (überschreibt die Auswahl oben)</label>
        <MediaPicker value={customIconMediaId} onChange={setCustomIconMediaId} fileType="image" />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-paper/10 bg-ink p-3">
        <AchievementIcon iconKey={achievement?.icon_key ?? "medal"} customIconSrc={null} tier={(achievement?.tier as AchievementTier | undefined) ?? null} size="sm" />
        <span className="text-xs text-paper/50">Vorschau (Freigeschaltet-Ansicht, ohne eigenes SVG)</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Gültig ab (optional)</label>
          <input name="validFrom" type="date" defaultValue={toDateInput(achievement?.valid_from ?? null)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Gültig bis (optional, zeitlich begrenzter Erfolg)</label>
          <input name="validUntil" type="date" defaultValue={toDateInput(achievement?.valid_until ?? null)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Freigabe-Text (für die Teilen-Karte)</label>
        <input name="shareText" defaultValue={achievement?.share_text ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Reihenfolge (kleiner = weiter vorne)</label>
        <input name="sortOrder" type="number" defaultValue={achievement?.sort_order ?? 0} className={`${inputClass} max-w-[120px]`} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-paper/80">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isManual" defaultChecked={achievement?.is_manual ?? false} /> Nur manuell vergeben
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isSecret" defaultChecked={achievement?.is_secret ?? false} /> Geheimer Erfolg
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={achievement?.is_active ?? true} /> Aktiv
        </label>
      </div>

      {error ? <p className="text-xs text-red">{error}</p> : null}

      <div className="flex items-center gap-2">
        <button type="submit" disabled={isPending} className="flex items-center gap-1 rounded-full bg-red px-4 py-2 text-xs font-medium text-paper hover:bg-red-dark disabled:opacity-60">
          <Check size={13} /> {isPending ? "Speichert …" : "Speichern"}
        </button>
        <button type="button" onClick={onDone} className="flex items-center gap-1 text-xs text-paper/50 hover:text-paper">
          <X size={13} /> Abbrechen
        </button>
      </div>
    </form>
  );
}

export function AchievementsManager({ achievements }: { achievements: Achievement[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleActive(a: Achievement) {
    const fd = new FormData();
    fd.set("id", a.id);
    fd.set("active", (!a.is_active).toString());
    startTransition(async () => {
      await setAchievementActiveAction(fd);
    });
  }

  const grouped = achievements.reduce<Record<string, Achievement[]>>((acc, a) => {
    (acc[a.category] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div>
      {creating ? (
        <div className="mb-4">
          <AchievementForm allAchievements={achievements} onDone={() => setCreating(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mb-4 flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-medium text-paper hover:bg-red-dark"
        >
          <Plus size={15} /> Erfolg anlegen
        </button>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h2 className="mb-2 font-display text-xs uppercase tracking-wide text-paper/50">{CATEGORY_LABELS[category] ?? category}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((a) =>
              editingId === a.id ? (
                <div key={a.id} className="sm:col-span-2">
                  <AchievementForm achievement={a} allAchievements={achievements} onDone={() => setEditingId(null)} />
                </div>
              ) : (
                <div key={a.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${a.is_active ? "border-paper/10 bg-anthracite" : "border-paper/5 bg-anthracite/40 opacity-60"}`}>
                  <AchievementIcon iconKey={a.icon_key} tier={a.tier as AchievementTier | null} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-paper">{a.title}</p>
                    <p className="mt-0.5 text-xs text-paper/40">
                      {a.slug} {a.tier ? `· ${TIER_LABELS[a.tier]}` : ""} {a.is_manual ? "· manuell" : ""} {a.is_secret ? "· geheim" : ""}
                      {!a.is_active ? " · deaktiviert" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditingId(a.id)} className="text-paper/50 hover:text-paper" aria-label="Bearbeiten">
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => toggleActive(a)}
                      className="text-paper/50 hover:text-paper"
                      aria-label={a.is_active ? "Deaktivieren" : "Aktivieren"}
                    >
                      {a.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
