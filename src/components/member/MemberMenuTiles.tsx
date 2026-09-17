import Link from "next/link";
import { ClipboardList, TrendingUp, Activity, Trophy, MessageSquare, User, ChevronRight, type LucideIcon } from "lucide-react";

type Tile = {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: boolean;
};

function unreadMessagesSubtitle(count: number): string {
  if (count === 0) return "Keine neue Nachricht";
  if (count === 1) return "1 neue Nachricht";
  return `${count} neue Nachrichten`;
}

export function MemberMenuTiles({ unreadMessageCount }: { unreadMessageCount: number }) {
  const tiles: Tile[] = [
    { href: "/mitglied/trainingsplan", title: "Trainingsplan", subtitle: "Dein aktueller Plan", icon: ClipboardList },
    { href: "/mitglied/fortschritt", title: "Fortschritt", subtitle: "Auswertung & Ziele", icon: TrendingUp },
    { href: "/mitglied/profil#koerperwerte", title: "Körperanalyse", subtitle: "Werte & Termine", icon: Activity },
    { href: "/mitglied/erfolge", title: "Erfolge", subtitle: "Abzeichen ansehen", icon: Trophy },
    { href: "/mitglied/nachrichten", title: "Nachrichten", subtitle: unreadMessagesSubtitle(unreadMessageCount), icon: MessageSquare, badge: unreadMessageCount > 0 },
    { href: "/mitglied/profil", title: "Profil", subtitle: "Daten & Einstellungen", icon: User },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((tile, i) => {
        const Icon = tile.icon;
        return (
          <Link
            key={tile.href}
            href={tile.href}
            style={{ animationDelay: `${i * 35}ms` }}
            className="flex min-h-[128px] animate-[fade-up_0.4s_ease-out_both] flex-col justify-between rounded-[21px] border border-sp-border bg-sp-surface-1 p-4 transition-transform duration-150 active:scale-[0.98] motion-reduce:animate-none motion-reduce:transition-none"
          >
            <div className="flex items-start justify-between">
              <span className="relative flex h-9 w-9 items-center justify-center text-sp-red">
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                {tile.badge ? <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-sp-red ring-2 ring-sp-surface-1" aria-hidden="true" /> : null}
              </span>
              <ChevronRight size={16} className="mt-1 text-sp-text-muted" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[16.5px] font-semibold text-sp-text">{tile.title}</p>
              <p className="mt-0.5 text-[13.5px] text-sp-text-secondary">{tile.subtitle}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
