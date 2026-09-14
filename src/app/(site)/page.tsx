import { Hero, type HeroContent } from "@/components/home/Hero";
import { Imagefilm, type ImagefilmContent } from "@/components/home/Imagefilm";
import { TrustStats } from "@/components/home/TrustStats";
import { GoogleReviewsBadge } from "@/components/home/GoogleReviewsBadge";
import { GoalSelector } from "@/components/home/GoalSelector";
import { TrainingWorlds } from "@/components/home/TrainingWorlds";
import { HealthTeaser } from "@/components/home/HealthTeaser";
import { Expansion2026 } from "@/components/home/Expansion2026";
import { PollackFeature, type OwnerContent } from "@/components/home/PollackFeature";
import { CommunityShoutout } from "@/components/home/CommunityShoutout";
import { PartnerHansefit } from "@/components/home/PartnerHansefit";
import { MoreNutritionEsnTeaser } from "@/components/home/MoreNutritionEsnTeaser";
import { Gallery } from "@/components/home/Gallery";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { HomeOpeningHours } from "@/components/home/HomeOpeningHours";
import { HomeContact } from "@/components/home/HomeContact";
import { FinalCta } from "@/components/home/FinalCta";
import { getSection, sectionField } from "@/lib/content/sections";
import { resolveMediaSrc } from "@/lib/content/media";

const FALLBACK_HERO: HeroContent = {
  headline: "Stark. Beweglich. Bereit.",
  subline: "Fitness, Gesundheit und Kampfkunst – persönlich begleitet im Sportpark Pollack.",
  ctaPrimaryLabel: "Probetraining starten",
  ctaSecondaryLabel: "Meinen Bereich finden",
  imageDesktopSrc: null,
  imageMobileSrc: null,
};

const FALLBACK_IMAGEFILM: ImagefilmContent = {
  eyebrow: "Der Imagefilm",
  headline: "Spür den Puls.",
  durationLabel: "",
  video: null,
  teaserVideo: null,
  poster: null,
};

async function loadHero(): Promise<HeroContent> {
  const section = await getSection("home.hero");
  if (!section) return FALLBACK_HERO;
  const c = section.content;
  return {
    headline: sectionField.str(c, "headline") ?? FALLBACK_HERO.headline,
    subline: sectionField.str(c, "subline") ?? FALLBACK_HERO.subline,
    ctaPrimaryLabel: sectionField.str(c, "ctaPrimaryLabel") ?? FALLBACK_HERO.ctaPrimaryLabel,
    ctaSecondaryLabel: sectionField.str(c, "ctaSecondaryLabel") ?? FALLBACK_HERO.ctaSecondaryLabel,
    imageDesktopSrc: await resolveMediaSrc(c.image),
    imageMobileSrc: await resolveMediaSrc(c.imageMobile),
  };
}

async function loadImagefilm(): Promise<ImagefilmContent | null> {
  const section = await getSection("home.imagefilm");
  if (!section) return null;
  const c = section.content;
  return {
    eyebrow: sectionField.str(c, "eyebrow") ?? FALLBACK_IMAGEFILM.eyebrow,
    headline: sectionField.str(c, "headline") ?? FALLBACK_IMAGEFILM.headline,
    durationLabel: sectionField.str(c, "durationLabel") ?? "",
    video: await resolveMediaSrc(c.video),
    teaserVideo: await resolveMediaSrc(c.teaserVideo),
    poster: await resolveMediaSrc(c.poster),
  };
}

async function loadTrustStats(): Promise<string[]> {
  const section = await getSection("home.trust_stats");
  return section ? sectionField.list(section.content, "items") : [];
}

async function loadOwner(): Promise<OwnerContent | null> {
  const section = await getSection("home.owner");
  if (!section) return null;
  const c = section.content;
  return {
    name: sectionField.str(c, "name") ?? "",
    role: sectionField.str(c, "role") ?? "",
    intro: sectionField.str(c, "intro") ?? "",
    story: sectionField.str(c, "story") ?? "",
    qualifications: sectionField.list(c, "qualifications"),
    portrait: await resolveMediaSrc(c.portrait),
  };
}

export default async function HomePage() {
  const [hero, imagefilm, trustStats, owner] = await Promise.all([
    loadHero(),
    loadImagefilm(),
    loadTrustStats(),
    loadOwner(),
  ]);

  return (
    <>
      <Hero content={hero} />
      {imagefilm ? <Imagefilm content={imagefilm} /> : null}
      {trustStats.length > 0 ? <TrustStats items={trustStats} /> : null}
      <GoogleReviewsBadge />
      <GoalSelector />
      <TrainingWorlds />
      <HealthTeaser />
      <Expansion2026 />
      {owner ? <PollackFeature content={owner} /> : null}
      <CommunityShoutout />
      <PartnerHansefit />
      <MoreNutritionEsnTeaser />
      <Gallery />
      <PricingTeaser />
      <HomeOpeningHours />
      <HomeContact />
      <FinalCta />
    </>
  );
}
