import { draftMode } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { ViewTracker } from "@/components/shared/ViewTracker";
import { siteConfig, contact as staticContact } from "@/content/site";
import { googleReviews } from "@/content/reviews";
import { loadContact } from "@/lib/content/contact";
import { loadOpeningHours } from "@/lib/content/opening-hours-data";

/**
 * Shell for the public marketing site only — header, footer, mobile CTA bar and the
 * HealthClub structured data. Lives in its own route group so /admin (a sibling of this
 * group, not a descendant) never inherits any of it; the admin area has its own shell
 * (AdminShell) and must not show the public nav.
 *
 * Deliberately reads no cookies/headers here (page views go through a client-side beacon —
 * see ViewTracker — and preview state through Draft Mode, not a cookie() read) so this layout,
 * and every public page under it, can be statically rendered and cached instead of hitting
 * Supabase on every single request. Admin edits already bust this cache immediately via
 * revalidatePath, so the hourly revalidate below is just a safety net for anything
 * date-dependent (like a special-hours entry that should stop applying once its date range
 * ends) rather than the primary way content updates show up.
 */
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, { hours, special }, { isEnabled: previewActive }] = await Promise.all([
    loadContact(),
    loadOpeningHours(),
    draftMode(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      postalCode: contact.zip,
      addressLocality: contact.city,
      addressCountry: staticContact.country,
    },
    areaServed: "Fichtenau, Crailsheim, Hohenlohekreis",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleReviews.rating,
      reviewCount: googleReviews.reviewCount,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ViewTracker />
      {previewActive ? <PreviewBanner /> : null}
      <Header contact={contact} hours={hours} special={special} />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer contact={contact} hours={hours} />
      <MobileCtaBar contact={contact} />
      <WhatsAppFloatingButton contact={contact} />
    </>
  );
}
