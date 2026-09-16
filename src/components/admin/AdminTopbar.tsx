"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Eye, UploadCloud, CheckCircle2, ChevronDown } from "lucide-react";
import type { Profile } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions/auth";
import { publishAllDraftsAction, type PublishActionState } from "@/app/admin/actions/publish";
import { IconButton, MemberAvatar } from "@/components/sportpark/ui";
import { SpSearch, SpBell } from "@/components/icons/sportpark";

const ROLE_LABEL: Record<string, string> = { admin: "Administrator", redakteur: "Redakteur" };

function greeting(hour: number): string {
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export function AdminTopbar({
  profile,
  inboxCount,
  draftCount,
  onMenuClick,
}: {
  profile: Profile;
  inboxCount: number;
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
  const firstName = profile.full_name.split(" ")[0];

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    if (typeof query === "string" && query.trim()) {
      router.push(`/admin/anfragen?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="flex min-h-16 shrink-0 items-center gap-3 border-b border-sp-border bg-sp-bg px-4 py-2.5 sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sp-text lg:hidden"
        aria-label="Menü öffnen"
      >
        <Menu size={20} />
      </button>

      <div className="hidden min-w-0 lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sp-text-muted">Sportpark Verwaltung</p>
        <h1 className="sp-headline text-2xl font-bold leading-tight text-sp-text">
          {greeting(new Date().getHours())}, {firstName}
        </h1>
        <p className="text-xs text-sp-text-secondary">Hier hast du heute alles im Blick.</p>
      </div>

      <form onSubmit={handleSearch} className="hidden min-w-0 max-w-xs flex-1 md:block lg:ml-auto">
        <label className="relative block">
          <SpSearch size={16} strokeWidth={1.8} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sp-text-muted" />
          <input
            name="q"
            type="search"
            placeholder="Suchen …"
            className="w-full rounded-full border border-sp-border bg-sp-surface-1 py-2.5 pl-10 pr-4 text-sm text-sp-text placeholder:text-sp-text-muted outline-none focus:border-sp-red"
          />
        </label>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <div className="hidden items-center gap-2 text-xs text-sp-text-muted xl:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${pendingCount > 0 ? "bg-sand" : "bg-sp-green"}`} aria-hidden="true" />
          {pendingCount > 0 ? `${pendingCount} Entwurf/Entwürfe ungespeichert` : "Alle Änderungen gespeichert"}
        </div>

        <a
          href="/admin/preview-enable"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-full border border-sp-border px-3 py-2 text-xs text-sp-text-secondary transition-colors hover:border-sp-border-strong hover:text-sp-text sm:flex"
        >
          <Eye size={14} /> Vorschau
        </a>

        <form action={publishAction}>
          <button
            type="submit"
            disabled={publishPending || pendingCount === 0}
            title={pendingCount === 0 ? "Keine Entwürfe zum Veröffentlichen." : undefined}
            className="hidden items-center gap-1.5 rounded-full bg-sp-red px-3 py-2 text-xs font-medium text-sp-text transition-colors hover:bg-sp-red-light disabled:opacity-40 sm:flex"
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

        <IconButton icon={SpBell} label="Benachrichtigungen" badge={inboxCount > 0} />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 hover:bg-white/[0.04] sm:pr-2"
            aria-expanded={menuOpen}
          >
            <MemberAvatar fullName={profile.full_name} size={34} />
            <span className="hidden text-left lg:block">
              <span className="block text-sm leading-tight text-sp-text">{profile.full_name}</span>
              <span className="block text-xs leading-tight text-sp-text-muted">{ROLE_LABEL[profile.role] ?? profile.role}</span>
            </span>
            <ChevronDown size={14} className="hidden text-sp-text-muted sm:block" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-12 z-10 w-48 rounded-sp-sm border border-sp-border bg-sp-surface-1 p-1.5 shadow-sp-card">
              <form action={signOutAction}>
                <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-sp-text-secondary hover:bg-white/[0.04] hover:text-sp-text">
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
