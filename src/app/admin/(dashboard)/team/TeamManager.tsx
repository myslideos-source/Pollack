"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Crown, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveTeamMemberAction, deleteTeamMemberAction } from "@/app/admin/actions/team";

type Member = {
  id: string;
  name: string;
  role_title: string | null;
  bio: string | null;
  photo_media_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  focus_areas: unknown;
  qualifications: unknown;
  is_owner: boolean;
  visible: boolean;
};

function toLines(value: unknown): string {
  return Array.isArray(value) ? (value as string[]).join("\n") : "";
}

function MemberForm({ member, onDone }: { member?: Member; onDone: () => void }) {
  const [photoMediaId, setPhotoMediaId] = useState<string | null>(member?.photo_media_id ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (member) formData.set("id", member.id);
    if (photoMediaId) formData.set("photoMediaId", photoMediaId);
    startTransition(async () => {
      const res = await saveTeamMemberAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div>
        <label className="mb-1 block text-xs text-paper/50">Foto</label>
        <MediaPicker value={photoMediaId} onChange={setPhotoMediaId} fileType="image" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Name</label>
          <input
            name="name"
            defaultValue={member?.name}
            required
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Position</label>
          <input
            name="roleTitle"
            defaultValue={member?.role_title ?? ""}
            placeholder="z. B. Inhaber & Trainer"
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Beschreibung</label>
        <textarea
          name="bio"
          defaultValue={member?.bio ?? ""}
          rows={4}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Qualifikationen (eine pro Zeile)</label>
          <textarea
            name="qualifications"
            defaultValue={toLines(member?.qualifications)}
            rows={4}
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Schwerpunkte (eine pro Zeile)</label>
          <textarea
            name="focusAreas"
            defaultValue={toLines(member?.focus_areas)}
            rows={4}
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Kontakt E-Mail</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={member?.contact_email ?? ""}
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Kontakt Telefon</label>
          <input
            name="contactPhone"
            defaultValue={member?.contact_phone ?? ""}
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="isOwner" defaultChecked={member?.is_owner} /> Inhaber-Profil
        </label>
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="visible" defaultChecked={member?.visible ?? true} /> Sichtbar
        </label>
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

export function TeamManager({ members }: { members: Member[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteTeamMemberAction(fd);
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
          <Plus size={16} /> Neues Teammitglied
        </button>
      ) : (
        <MemberForm onDone={() => setAdding(false)} />
      )}

      <div className="space-y-3">
        {members.map((member) =>
          editingId === member.id ? (
            <MemberForm key={member.id} member={member} onDone={() => setEditingId(null)} />
          ) : (
            <div key={member.id} className="flex items-center justify-between gap-4 rounded-2xl border border-paper/10 bg-anthracite p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-paper">{member.name}</p>
                  {member.is_owner ? <Crown size={13} className="text-sand" /> : null}
                </div>
                {member.role_title ? <p className="mt-0.5 text-xs text-paper/40">{member.role_title}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {member.visible ? <Eye size={15} className="text-paper/30" /> : <EyeOff size={15} className="text-paper/30" />}
                <button type="button" onClick={() => setEditingId(member.id)} className="text-paper/50 hover:text-paper">
                  <Pencil size={15} />
                </button>
                {confirmDeleteId === member.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
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
                  <button type="button" onClick={() => setConfirmDeleteId(member.id)} className="text-paper/50 hover:text-red">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {members.length === 0 ? <p className="text-sm text-paper/40">Noch keine Teammitglieder angelegt.</p> : null}
      </div>
    </div>
  );
}
