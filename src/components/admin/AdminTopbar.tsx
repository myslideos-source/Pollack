"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Eye, UploadCloud, CheckCircle2, ChevronDown, Search } from "lucide-react";
import type { Profile } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions/auth";
import { publishAllDraftsAction, type PublishActionState } from "@/app/admin/actions/publish";
import { NotificationMenu, type AdminNotification } from "@/components/admin/NotificationMenu";

const ROLE_LABEL: Record<string, string> = { admin: "Administrator", redakteur: "Redakteur" };

function greeting(hour: number): string {
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export function AdminTopbar({
  profile,
  draftCount,
  notifications,
  onMenuClick,
}: {
  profile: Profile;
  draftCount: number;
  notifications: AdminNotification[];
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [publishState, publishAction, publishPending] = useActionState<PublishActionState, FormData>(
    publishAllDraftsAction,
    { status: "idle" },
  );

  const pendingCount = publishState.status === "success" ? 0 : draftCount;
  const firstName = profile.full_name.split(" ")[0];

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    if (typeof query === "string" && query.trim()) {
      router.push(`/trainer/mitglieder?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-admin-border bg-admin-bg px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-admin-text min-[1200px]:hidden"
        aria-label="Menü öffnen"
      >
        <Menu size={20} />
      </button>

      <div className="hidden min-w-0 min-[1200px]:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-admin-text-muted">Admin Bereich</p>
        <h1 className="mt-0.5 text-2xl font-semibold leading-tight text-admin-text">
          {greeting(new Date().getHours())}, {firstName}
        </h1>
        <p className="mt-0.5 text-sm text-admin-text-secondary">Hier ist dein Überblick für heute.</p>
      </div>

      <form onSubmit={handleSearch} className="hidden min-w-0 max-w-[400px] flex-1 md:block min-[1200px]:ml-auto">
        <label className="relative block">
          <Search size={17} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-admin-text-muted" />
          <input
            name="q"
            type="search"
            placeholder="Mitglieder, Pläne oder Übungen suchen …"
            className="h-12 w-full rounded-full border border-admin-border bg-admin-card pl-11 pr-4 text-sm text-admin-text placeholder:text-admin-text-muted outline-none transition-colors focus:border-admin-border-hover"
          />
        </label>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <div className="hidden items-center gap-2 text-xs text-admin-text-muted xl:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${pendingCount > 0 ? "bg-sand" : "bg-admin-green"}`} aria-hidden="true" />
          {pendingCount > 0 ? `${pendingCount} Entwurf/Entwürfe ungespeichert` : "Alle Änderungen gespeichert"}
        </div>

        <a
          href="/admin/preview-enable"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-full border border-admin-border px-3 py-2 text-xs text-admin-text-secondary transition-colors hover:border-admin-border-hover hover:text-admin-text sm:flex"
        >
          <Eye size={14} /> Vorschau
        </a>

        <form action={publishAction}>
          <button
            type="submit"
            disabled={publishPending || pendingCount === 0}
            title={pendingCount === 0 ? "Keine Entwürfe zum Veröffentlichen." : undefined}
            className="hidden items-center gap-1.5 rounded-full bg-admin-red px-3 py-2 text-xs font-medium text-admin-text transition-colors hover:bg-admin-red-dark disabled:opacity-40 sm:flex"
          >
            {publishState.status === "success" ? (
              <>
                <CheckCircle2 size={14} /> Veröffentlicht
              </>
            ) : (
              <>
                <UploadCloud size={14} /> {publishPending ? "…" : "Veröffentlichen"}
              </>
            )}
          </button>
        </form>

        <NotificationMenu notifications={notifications} />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 hover:bg-white/[0.04] sm:pr-2"
            aria-expanded={menuOpen}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-admin-card-elevated text-sm font-semibold text-admin-text">
              {profile.full_name.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden text-left min-[1200px]:block">
              <span className="block text-sm leading-tight text-admin-text">{profile.full_name}</span>
              <span className="block text-xs leading-tight text-admin-text-muted">{ROLE_LABEL[profile.role] ?? profile.role}</span>
            </span>
            <ChevronDown size={14} className="hidden text-admin-text-muted sm:block" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-12 z-10 w-48 rounded-admin border border-admin-border bg-admin-card-elevated p-1.5 shadow-admin">
              <form action={signOutAction}>
                <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-admin-text-secondary hover:bg-white/[0.04] hover:text-admin-text">
                  Abmelden
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
