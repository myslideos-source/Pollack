"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { savePartnerAction, deletePartnerAction } from "@/app/admin/actions/partners";

type Partner = {
  id: string;
  name: string;
  description: string | null;
  link_url: string | null;
  logo_media_id: string | null;
  visible: boolean;
};

function PartnerForm({ partner, onDone }: { partner?: Partner; onDone: () => void }) {
  const [logoMediaId, setLogoMediaId] = useState<string | null>(partner?.logo_media_id ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (partner) formData.set("id", partner.id);
    if (logoMediaId) formData.set("logoMediaId", logoMediaId);
    startTransition(async () => {
      const res = await savePartnerAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div>
        <label className="mb-1 block text-xs text-paper/50">Logo</label>
        <MediaPicker value={logoMediaId} onChange={setLogoMediaId} fileType="image" uploadFolderName="Partner & Produkte" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Name</label>
        <input
          name="name"
          defaultValue={partner?.name}
          required
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Beschreibung</label>
        <textarea
          name="description"
          defaultValue={partner?.description ?? ""}
          rows={2}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Link</label>
        <input
          name="linkUrl"
          type="url"
          defaultValue={partner?.link_url ?? ""}
          placeholder="https://…"
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-paper">
        <input type="checkbox" name="visible" defaultChecked={partner?.visible ?? true} /> Sichtbar auf der Website
      </label>
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

export function PartnersManager({ partners }: { partners: Partner[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deletePartnerAction(fd);
      setConfirmDeleteId(null);
    });
  }

  return (
    <div className="space-y-4">
      {!adding ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-paper hover:bg-red-dark"
        >
          <Plus size={16} /> Neuer Partner
        </button>
      ) : (
        <PartnerForm onDone={() => setAdding(false)} />
      )}

      <div className="space-y-3">
        {partners.map((partner) =>
          editingId === partner.id ? (
            <PartnerForm key={partner.id} partner={partner} onDone={() => setEditingId(null)} />
          ) : (
            <div key={partner.id} className="flex items-center justify-between gap-4 rounded-2xl border border-paper/10 bg-anthracite p-4">
              <div>
                <p className="text-sm text-paper">{partner.name}</p>
                {partner.description ? <p className="mt-0.5 text-xs text-paper/40">{partner.description}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {partner.visible ? <Eye size={15} className="text-paper/30" /> : <EyeOff size={15} className="text-paper/30" />}
                <button type="button" onClick={() => setEditingId(partner.id)} className="text-paper/50 hover:text-paper">
                  <Pencil size={15} />
                </button>
                {confirmDeleteId === partner.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(partner.id)}
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
                  <button type="button" onClick={() => setConfirmDeleteId(partner.id)} className="text-paper/50 hover:text-red">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {partners.length === 0 ? <p className="text-sm text-paper/40">Noch keine Partner angelegt.</p> : null}
      </div>
    </div>
  );
}
