import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "moss";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-red text-paper hover:bg-red-dark",
  secondary: "border border-paper/30 text-paper hover:border-paper/60 hover:bg-paper/5",
  ghost: "text-paper/80 hover:text-paper underline underline-offset-4",
  moss: "bg-moss text-ink hover:bg-moss-dark hover:text-paper",
};

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm uppercase tracking-wide transition-colors ${VARIANT_CLASS[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    const external = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
