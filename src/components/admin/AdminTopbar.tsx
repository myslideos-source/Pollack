"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, UploadCloud, CheckCircle2, ChevronDown, LogOut, Menu } from "lucide-react";
import type { Profile } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions/auth";
import { publishAllDraftsAction, type PublishActionState } from "@/app/admin/actions/publish";

const ROLE_LABEL: Record<string, string> = { admin: "Inhaber", redakteur: "Redakteur" };

export function AdminTopbar({
  profile,
  draftCount,
  onMenuClick,
}: {
  profile: Profile;
  draftCount: number;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [publishState, publishAction, publishPending] = useActionState<PublishActionState, FormData>(
    publishAllDraftsAction,
    { status: "idle" },
  );

  const pendingCount = publishState.status === "success" ? 0 : draftCount;

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    if (typeof query === "string" && query.trim()) {
      router.push(`/admin/anfragen?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-paper/10 bg-ink px-3 sm:gap-3 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-paper lg:hidden"
        aria-label="Menü öffnen"
      >
        <Menu size={20} />
      </button>

      <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 max-w-md md:block">
        <label className="relative block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper/40" />
          <input
            name="q"
            type="search"
            placeholder="Suchen … (z. B. Mitglieder, Anfragen, Inhalte)"
            className="w-full rounded-full border border-paper/15 bg-anthracite py-2 pl-9 pr-4 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-red"
          />
        </label>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="hidden items-center gap-2 text-xs text-paper/50 lg:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${pendingCount > 0 ? "bg-sand" : "bg-moss"}`} aria-hidden="true" />
          {pendingCount > 0 ? `${pendingCount} Entwurf/Entwürfe ungespeichert` : "Alle Änderungen gespeichert"}
        </div>

        <a
          href="/admin/preview-enable"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-paper/20 px-2.5 py-2 text-sm text-paper transition-colors hover:border-paper/40 sm:px-4"
        >
          <Eye size={15} /> <span className="hidden sm:inline">Vorschau</span>
        </a>

        <form action={publishAction}>
          <button
            type="submit"
            disabled={publishPending || pendingCount === 0}
            className="flex items-center gap-1.5 rounded-full bg-red px-2.5 py-2 text-sm font-medium text-paper transition-colors hover:bg-red-dark disabled:opacity-40 sm:px-4"
          >
            {publishState.status === "success" ? (
              <>
                <CheckCircle2 size={15} /> <span className="hidden sm:inline">Veröffentlicht</span>
              </>
            ) : (
              <>
                <UploadCloud size={15} />{" "}
                <span className="hidden sm:inline">{publishPending ? "Wird veröffentlicht …" : "Veröffentlichen"}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 text-sm text-paper hover:bg-paper/5 sm:pr-2"
            aria-expanded={menuOpen}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red/20 font-display text-sm text-red">
              {profile.full_name.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden text-left lg:block">
              <span className="block leading-tight">{profile.full_name}</span>
              <span className="block text-xs leading-tight text-paper/50">{ROLE_LABEL[profile.role] ?? profile.role}</span>
            </span>
            <ChevronDown size={14} className="hidden text-paper/40 sm:block" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-12 z-10 w-48 rounded-xl border border-paper/10 bg-anthracite p-1.5 shadow-xl">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-paper/80 hover:bg-paper/5 hover:text-paper"
                >
                  <LogOut size={15} /> Abmelden
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
