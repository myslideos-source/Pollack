import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle, Star } from "lucide-react";
import { contact, primaryNav, siteConfig } from "@/content/site";
import { dayLabels, openingHours, hoursConfirmed } from "@/content/hours";
import { googleReviews } from "@/content/reviews";

function formatDay(ranges: { open: string; close: string }[]): string {
  if (ranges.length === 0) return "geschlossen";
  return ranges.map((r) => `${r.open}–${r.close}`).join(", ");
}

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Image
            src="/logo/sportpark-pollack-logo-white.webp"
            alt="Sportpark Pollack"
            width={200}
            height={69}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-paper/60">{siteConfig.tagline}</p>
          <a
            href={googleReviews.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-paper/60 hover:text-paper"
          >
            <Star size={14} className="fill-sand text-sand" aria-hidden="true" />
            {googleReviews.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })} &middot;{" "}
            {googleReviews.reviewCount} Bewertungen
          </a>
        </div>

        <nav aria-label="Footer Navigation">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-paper/50">Bereiche</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {primaryNav
              .filter((i) => i.href !== "/")
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/75 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-paper/50">Kontakt</h2>
          <ul className="mt-4 space-y-3 text-sm text-paper/75">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-red" aria-hidden="true" />
              <span>
                {contact.street}
                <br />
                {contact.zip} {contact.city}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-red" aria-hidden="true" />
              <a href={contact.phoneHref} className="hover:text-paper">
                {contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="shrink-0 text-red" aria-hidden="true" />
              <a href={contact.whatsappHref} target="_blank" rel="noreferrer" className="hover:text-paper">
                WhatsApp {contact.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-red" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-paper">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-paper/50">Öffnungszeiten</h2>
          {!hoursConfirmed ? (
            <p className="mt-4 text-sm text-paper/60">
              Aktuelle Öffnungszeiten bitte telefonisch oder per WhatsApp erfragen.
            </p>
          ) : (
            <ul className="mt-4 space-y-1.5 text-sm text-paper/75">
              {(Object.keys(dayLabels) as (keyof typeof dayLabels)[]).map((key) => (
                <li key={key} className="flex justify-between gap-4">
                  <span>{dayLabels[key]}</span>
                  <span>{formatDay(openingHours[key])}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/kontakt" className="mt-4 inline-block text-sm text-red hover:text-red-dark">
            Anfahrt &amp; Kontakt →
          </Link>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-paper/80">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-paper/80">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
