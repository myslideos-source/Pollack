"use client";

import { useActionState, useState, useTransition } from "react";
import { UserPlus, Trash2, X, Shield, Loader2 } from "lucide-react";
import { inviteUserAction, updateUserRoleAction, deleteUserAction } from "@/app/admin/actions/users";

type UserRow = { id: string; email: string; full_name: string; role: string; created_at: string };

const ROLE_LABELS: Record<string, string> = { admin: "Admin", redakteur: "Redakteur" };

function InviteForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, isPending] = useActionState(inviteUserAction, null);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-moss/30 bg-moss/10 p-5 text-sm text-moss">
        {state.success}
        <button type="button" onClick={onDone} className="ml-3 text-paper/60 underline hover:text-paper">
          Schließen
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Name</label>
          <input name="fullName" required className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">E-Mail-Adresse</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Rolle</label>
        <select name="role" defaultValue="redakteur" className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper sm:w-64">
          <option value="redakteur">Redakteur (Inhalte & Anfragen)</option>
          <option value="admin">Admin (voller Zugriff)</option>
        </select>
      </div>
      {state?.error ? <p className="text-sm text-red">{state.error}</p> : null}
      <p className="text-xs text-paper/40">
        Es gibt keine öffentliche Registrierung — neue Nutzer erhalten eine Einladungs-E-Mail und legen dort ihr
        eigenes Passwort fest.
      </p>
      <div className="flex items-center gap-3 border-t border-paper/10 pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-full bg-red px-5 py-2 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          {isPending ? "Sendet Einladung …" : "Einladung senden"}
        </button>
        <button type="button" onClick={onDone} className="text-sm text-paper/50 hover:text-paper">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

export function UsersManager({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [adding, setAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(userId: string, role: string) {
    const fd = new FormData();
    fd.set("userId", userId);
    fd.set("role", role);
    startTransition(async () => {
      const res = await updateUserRoleAction(fd);
      if (res.error) setError(res.error);
      else setError(null);
    });
  }

  function handleDelete(userId: string) {
    const fd = new FormData();
    fd.set("userId", userId);
    startTransition(async () => {
      const res = await deleteUserAction(fd);
      if (res.error) setError(res.error);
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
          <UserPlus size={16} /> Nutzer einladen
        </button>
      ) : (
        <InviteForm onDone={() => setAdding(false)} />
      )}

      {error ? <p className="text-sm text-red">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
        {users.map((user) => (
          <div key={user.id} className="flex flex-wrap items-center gap-3 border-b border-paper/5 px-4 py-3 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm text-paper">
                {user.full_name}
                {user.id === currentUserId ? <span className="text-xs text-paper/40">(du)</span> : null}
              </p>
              <p className="truncate text-xs text-paper/50">{user.email}</p>
            </div>
            {user.id === currentUserId ? (
              <span className="flex items-center gap-1 rounded-full border border-paper/15 px-3 py-1.5 text-xs text-paper/60">
                <Shield size={12} /> {ROLE_LABELS[user.role] ?? user.role}
              </span>
            ) : (
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                disabled={isPending}
                className="rounded-full border border-paper/15 bg-ink px-3 py-1.5 text-xs text-paper"
              >
                <option value="redakteur">Redakteur</option>
                <option value="admin">Admin</option>
              </select>
            )}
            {user.id !== currentUserId ? (
              confirmDeleteId === user.id ? (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleDelete(user.id)} className="text-xs text-red hover:text-red-dark">
                    Wirklich löschen?
                  </button>
                  <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-paper/40 hover:text-paper">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDeleteId(user.id)} className="text-paper/50 hover:text-red">
                  <Trash2 size={15} />
                </button>
              )
            ) : (
              <span className="w-[15px]" />
            )}
          </div>
        ))}
        {users.length === 0 ? <p className="p-4 text-sm text-paper/40">Keine Nutzer gefunden.</p> : null}
      </div>
    </div>
  );
}
