import Link from "next/link";
import type { SportparkIconProps } from "@/components/icons/sportpark";

/**
 * Shared primitives for the Sportpark member + admin redesign (design-system tokens in
 * globals.css: --sp-*). Kept framework-agnostic (no "use client") wherever no interactivity is
 * needed so server components can use them directly.
 */

type IconComponent = React.ComponentType<SportparkIconProps>;

export function PremiumCard({
  className = "",
  children,
  glow = false,
  as: Comp = "div",
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
  as?: "div" | "section";
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Comp
      className={`rounded-sp-lg border border-sp-border bg-sp-surface-1 shadow-sp-card ${glow ? "relative overflow-hidden" : ""} ${className}`}
      {...rest}
    >
      {glow ? (
        <span
          className="pointer-events-none absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
          style={{ background: "var(--sp-red-glow)" }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </Comp>
  );
}

export function PrimaryButton({
  href,
  icon: Icon,
  children,
  className = "",
  size = "md",
  type,
  ...rest
}: {
  href?: string;
  icon?: IconComponent;
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  type?: "button" | "submit";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full bg-sp-red font-ui font-semibold uppercase tracking-wide text-sp-text transition-all duration-150 hover:bg-sp-red-light active:scale-[0.98] disabled:opacity-50 ${
    size === "lg" ? "h-[60px] px-7 text-sm" : "h-11 px-5 text-xs"
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
        {Icon ? <Icon size={size === "lg" ? 20 : 16} strokeWidth={2} /> : null}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={base} {...rest}>
      {children}
      {Icon ? <Icon size={size === "lg" ? 20 : 16} strokeWidth={2} /> : null}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  active = false,
  badge = false,
  className = "",
  ...rest
}: {
  icon: IconComponent;
  label: string;
  active?: boolean;
  badge?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        active ? "text-sp-red" : "text-sp-text-secondary hover:text-sp-text"
      } ${className}`}
      {...rest}
    >
      <Icon size={22} strokeWidth={1.8} />
      {badge ? (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sp-red ring-2 ring-sp-bg" aria-hidden="true" />
      ) : null}
    </button>
  );
}

export function StatusBadge({
  tone = "neutral",
  icon: Icon,
  children,
  className = "",
}: {
  tone?: "neutral" | "positive" | "active" | "attention";
  icon?: IconComponent;
  children: React.ReactNode;
  className?: string;
}) {
  const toneClass = {
    neutral: "border-sp-border text-sp-text-secondary",
    positive: "border-sp-green/40 bg-sp-green-soft text-sp-green",
    active: "border-sp-red-border bg-sp-red-soft text-sp-red",
    attention: "border-sp-red-border bg-sp-red text-sp-text",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${toneClass} ${className}`}
    >
      {Icon ? <Icon size={13} strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  hintTone = "neutral",
  href,
}: {
  icon: IconComponent;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  hintTone?: "neutral" | "positive" | "attention";
  href?: string;
}) {
  const hintClass = { neutral: "text-sp-text-muted", positive: "text-sp-green", attention: "text-sp-red" }[hintTone];
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-sp-sm bg-sp-red-soft text-sp-red">
          <Icon size={20} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 sp-headline text-[34px] font-bold leading-none text-sp-text">{value}</p>
      <p className="mt-1.5 text-sm text-sp-text-secondary">{label}</p>
      {hint ? <p className={`mt-1 text-xs ${hintClass}`}>{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-sp-lg border border-sp-border bg-sp-surface-1 p-5 shadow-sp-card transition-colors hover:border-sp-border-strong">
        {content}
      </Link>
    );
  }
  return <div className="rounded-sp-lg border border-sp-border bg-sp-surface-1 p-5 shadow-sp-card">{content}</div>;
}

export function MemberAvatar({
  src,
  fullName,
  size = 36,
  className = "",
}: {
  src?: string | null;
  fullName: string;
  size?: number;
  className?: string;
}) {
  const initial = fullName.trim().slice(0, 1).toUpperCase() || "?";
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- small avatar thumbnail, next/image not worth the overhead here
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full border border-sp-border-strong object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-sp-border-strong bg-sp-surface-2 font-ui font-semibold text-sp-text ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: IconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-sp-lg border border-dashed border-sp-border px-6 py-10 text-center">
      {Icon ? (
        <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-sp-surface-2 text-sp-text-muted">
          <Icon size={20} strokeWidth={1.8} />
        </span>
      ) : null}
      <p className="text-sm font-medium text-sp-text">{title}</p>
      {description ? <p className="max-w-xs text-xs text-sp-text-muted">{description}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message = "Etwas ist schiefgelaufen. Bitte versuch es erneut." }: { message?: string }) {
  return (
    <div className="rounded-sp-lg border border-sp-red-border bg-sp-red-soft px-5 py-4 text-sm text-sp-red">{message}</div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-sp-sm bg-sp-surface-2 ${className}`} aria-hidden="true" />;
}
