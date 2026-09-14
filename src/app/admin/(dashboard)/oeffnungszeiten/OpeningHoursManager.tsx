"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { WEEKDAYS } from "@/lib/opening-hours";
import { saveWeekdayHoursAction, saveSpecialHoursAction, deleteSpecialHoursAction } from "@/app/admin/actions/opening-hours";

type Hour = { weekday: string; closed: boolean; open_time: string | null; close_time: string | null };
type Special = {
  id: string;
  label: string;
  date_from: string;
  date_to: string | null;
  closed: boolean;
  open_time: string | null;
  close_time: string | null;
  note: string | null;
};

function WeekdayRow({ day, hour }: { day: (typeof WEEKDAYS)[number]; hour: Hour | undefined }) {
  const [closed, setClosed] = useState(hour?.closed ?? false);
  const [openTime, setOpenTime] = useState(hour?.open_time?.slice(0, 5) ?? "");
  const [closeTime, setCloseTime] = useState(hour?.close_time?.slice(0, 5) ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    const fd = new FormData();
    fd.set("weekday", day.value);
    if (closed) fd.set("closed", "on");
    fd.set("openTime", openTime);
    fd.set("closeTime", closeTime);
    startTransition(async () => {
      await saveWeekdayHoursAction(fd);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-paper/5 px-4 py-3 last:border-b-0">
      <span className="w-28 text-sm text-paper">{day.label}</span>
      <label className="flex items-center gap-1.5 text-xs text-paper/60">
        <input
          type="checkbox"
          checked={closed}
          onChange={(e) => {
            setClosed(e.target.checked);
            setSaved(false);
          }}
        />
        Geschlossen
      </label>
      {!closed ? (
        <>
          <input
            type="time"
            value={openTime}
            onChange={(e) => {
              setOpenTime(e.target.value);
              setSaved(false);
            }}
            className="rounded-lg border border-paper/15 bg-ink px-2 py-1.5 text-sm text-paper"
          />
          <span className="text-paper/40">–</span>
          <input
            type="time"
            value={closeTime}
            onChange={(e) => {
              setCloseTime(e.target.value);
              setSaved(false);
            }}
            className="rounded-lg border border-paper/15 bg-ink px-2 py-1.5 text-sm text-paper"
          />
        </>
      ) : null}
      <button
        type="button"
        onClick={save}
        disabled={isPending}
        className="ml-auto rounded-full border border-paper/15 px-3 py-1.5 text-xs text-paper/70 hover:text-paper disabled:opacity-60"
      >
        {isPending ? "Speichert …" : saved ? "Gespeichert" : "Speichern"}
      </button>
    </div>
  );
}

function SpecialForm({ item, onDone }: { item?: Special; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (item) formData.set("id", item.id);
    startTransition(async () => {
      const res = await saveSpecialHoursAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Bezeichnung</label>
          <input
            name="label"
            defaultValue={item?.label}
            placeholder="z. B. Weihnachtsfeiertage"
            required
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-paper/50">Von</label>
            <input
              name="dateFrom"
              type="date"
              defaultValue={item?.date_from}
              required
              className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-paper/50">Bis (optional)</label>
            <input
              name="dateTo"
              type="date"
              defaultValue={item?.date_to ?? ""}
              className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1.5 text-sm text-paper">
          <input type="checkbox" name="closed" defaultChecked={item?.closed} /> Geschlossen
        </label>
        <input
          name="openTime"
          type="time"
          defaultValue={item?.open_time?.slice(0, 5) ?? ""}
          className="rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
        <span className="text-paper/40">–</span>
        <input
          name="closeTime"
          type="time"
          defaultValue={item?.close_time?.slice(0, 5) ?? ""}
          className="rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Hinweis (optional)</label>
        <input
          name="note"
          defaultValue={item?.note ?? ""}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      {error ? <p className="text-sm text-red">{error}</p> : null}
      <div className="flex items-center gap-3 border-t border-paper/10 pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-red px-5 py-2 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {isPending ? "Speichert …" : "Speichern"}
        </button>
        <button type="button" onClick={onDone} className="text-sm text-paper/50 hover:text-paper">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

export function OpeningHoursManager({ hours, special }: { hours: Hour[]; special: Special[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteSpecialHoursAction(fd);
      setConfirmDeleteId(null);
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg text-paper">Reguläre Öffnungszeiten</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
          {WEEKDAYS.map((day) => (
            <WeekdayRow key={day.value} day={day} hour={hours.find((h) => h.weekday === day.value)} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-paper">Feiertage & Sonderzeiten</h2>
          {!adding ? (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-medium text-paper hover:bg-red-dark"
            >
              <Plus size={15} /> Eintrag hinzufügen
            </button>
          ) : null}
        </div>

        {adding ? (
          <div className="mt-3">
            <SpecialForm onDone={() => setAdding(false)} />
          </div>
        ) : null}

        <div className="mt-3 space-y-3">
          {special.map((item) =>
            editingId === item.id ? (
              <SpecialForm key={item.id} item={item} onDone={() => setEditingId(null)} />
            ) : (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-paper/10 bg-anthracite p-4">
                <div>
                  <p className="text-sm text-paper">{item.label}</p>
                  <p className="text-xs text-paper/50">
                    {new Date(item.date_from).toLocaleDateString("de-DE")}
                    {item.date_to ? ` – ${new Date(item.date_to).toLocaleDateString("de-DE")}` : ""}
                    {" · "}
                    {item.closed ? "Geschlossen" : `${item.open_time?.slice(0, 5)} – ${item.close_time?.slice(0, 5)}`}
                  </p>
                  {item.note ? <p className="mt-0.5 text-xs text-paper/40">{item.note}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button type="button" onClick={() => setEditingId(item.id)} className="text-paper/50 hover:text-paper">
                    <Pencil size={15} />
                  </button>
                  {confirmDeleteId === item.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        className="text-xs text-red hover:text-red-dark disabled:opacity-60"
                      >
                        Löschen?
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-paper/40 hover:text-paper">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmDeleteId(item.id)} className="text-paper/50 hover:text-red">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ),
          )}
          {special.length === 0 ? <p className="text-sm text-paper/40">Keine Sonderöffnungszeiten hinterlegt.</p> : null}
        </div>
      </div>
    </div>
  );
}
