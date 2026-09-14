import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { siteConfig, contact as staticContact } from "@/content/site";
import { googleReviews } from "@/content/reviews";
import { loadContact } from "@/lib/content/contact";
import { loadOpeningHours } from "@/lib/content/opening-hours-data";
import { recordPageView } from "@/lib/content/analytics";

/**
 * Shell for the public marketing site only — header, footer, mobile CTA bar and the
 * HealthClub structured data. Lives in its own route group so /admin (a sibling of this
 * group, not a descendant) never inherits any of it; the admin area has its own shell
 * (AdminShell) and must not show the public nav.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, { hours, special }, , cookieStore] = await Promise.all([
    loadContact(),
    loadOpeningHours(),
    recordPageView(),
    cookies(),
  ]);
  const previewActive = cookieStore.get("sp_preview")?.value === "1";

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
