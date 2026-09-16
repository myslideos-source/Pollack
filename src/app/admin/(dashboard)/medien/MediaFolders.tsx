"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Folder, FolderPlus, Pencil, Trash2, X, Check } from "lucide-react";
import { createMediaFolderAction, renameMediaFolderAction, deleteMediaFolderAction } from "@/app/admin/actions/media";

export type MediaFolder = { id: string; name: string; count: number };

export function MediaFolders({ folders, unassignedCount }: { folders: MediaFolder[]; unassignedCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get("ordner");

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function selectFolder(id: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("ordner", id);
    else params.delete("ordner");
    router.push(`/admin/medien?${params.toString()}`);
  }

  function submitCreate() {
    if (!newName.trim()) return;
    const fd = new FormData();
    fd.set("name", newName.trim());
    startTransition(async () => {
      const res = await createMediaFolderAction(fd);
      if (res.error) setError(res.error);
      else {
        setNewName("");
        setCreating(false);
        setError(null);
        if (res.id) selectFolder(res.id);
      }
    });
  }

  function submitRename(id: string) {
    if (!editName.trim()) return;
    const fd = new FormData();
    fd.set("id", id);
    fd.set("name", editName.trim());
    startTransition(async () => {
      const res = await renameMediaFolderAction(fd);
      if (res.error) setError(res.error);
      else {
        setEditingId(null);
        setError(null);
      }
    });
  }

  function submitDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteMediaFolderAction(fd);
      setConfirmDeleteId(null);
      if (activeFolderId === id) selectFolder(null);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => selectFolder(null)}
          className={`rounded-full px-3 py-1.5 text-xs ${!activeFolderId ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"}`}
        >
          Alle
        </button>

        {folders.map((f) =>
          editingId === f.id ? (
            <div key={f.id} className="flex items-center gap-1 rounded-full border border-paper/15 bg-ink px-2 py-1">
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitRename(f.id)}
                className="w-28 bg-transparent text-xs text-paper outline-none"
              />
              <button type="button" onClick={() => submitRename(f.id)} disabled={isPending} className="text-moss hover:text-moss/80">
                <Check size={13} />
              </button>
              <button type="button" onClick={() => setEditingId(null)} className="text-paper/40 hover:text-paper">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div
              key={f.id}
              className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                activeFolderId === f.id ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"
              }`}
            >
              <button type="button" onClick={() => selectFolder(f.id)} className="flex items-center gap-1.5">
                <Folder size={12} /> {f.name} <span className="opacity-60">({f.count})</span>
              </button>
              {confirmDeleteId === f.id ? (
                <span className="ml-1 flex items-center gap-1">
                  <button type="button" onClick={() => submitDelete(f.id)} disabled={isPending} className="underline">
                    löschen?
                  </button>
                  <button type="button" onClick={() => setConfirmDeleteId(null)}>
                    <X size={11} />
                  </button>
                </span>
              ) : (
                <span className="ml-0.5 hidden items-center gap-1 group-hover:flex">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(f.id);
                      setEditName(f.name);
                    }}
                    aria-label={`${f.name} umbenennen`}
                  >
                    <Pencil size={11} />
                  </button>
                  <button type="button" onClick={() => setConfirmDeleteId(f.id)} aria-label={`${f.name} löschen`}>
                    <Trash2 size={11} />
                  </button>
                </span>
              )}
            </div>
          ),
        )}

        {unassignedCount > 0 ? (
          <button
            type="button"
            onClick={() => selectFolder("__none__")}
            className={`rounded-full px-3 py-1.5 text-xs ${activeFolderId === "__none__" ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"}`}
          >
            Ohne Ordner ({unassignedCount})
          </button>
        ) : null}

        {creating ? (
          <div className="flex items-center gap-1 rounded-full border border-paper/15 bg-ink px-2 py-1">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCreate()}
              placeholder="Ordnername"
              className="w-28 bg-transparent text-xs text-paper outline-none placeholder:text-paper/30"
            />
            <button type="button" onClick={submitCreate} disabled={isPending} className="text-moss hover:text-moss/80">
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setNewName("");
              }}
              className="text-paper/40 hover:text-paper"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-paper/25 px-3 py-1.5 text-xs text-paper/60 hover:border-paper/40 hover:text-paper"
          >
            <FolderPlus size={13} /> Ordner erstellen
          </button>
        )}
      </div>
      {error ? <p className="mt-2 text-xs text-red">{error}</p> : null}
    </div>
  );
}
