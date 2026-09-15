import { Hero, type HeroContent } from "@/components/home/Hero";
import { Imagefilm, type ImagefilmContent } from "@/components/home/Imagefilm";
import { TrustStats } from "@/components/home/TrustStats";
import { GoogleReviewsBadge } from "@/components/home/GoogleReviewsBadge";
import { GoalSelector } from "@/components/home/GoalSelector";
import { ZielFinderSection } from "@/components/home/ZielFinderSection";
import { Journey30Days } from "@/components/home/Journey30Days";
import { TrainingWorlds, type TrainingWorldWithPrograms } from "@/components/home/TrainingWorlds";
import { HealthTeaser } from "@/components/home/HealthTeaser";
import { Expansion2026, type ExpansionContent } from "@/components/home/Expansion2026";
import { PollackFeature, type OwnerContent } from "@/components/home/PollackFeature";
import { MemberPortalTeaser } from "@/components/home/MemberPortalTeaser";
import { CommunityShoutout } from "@/components/home/CommunityShoutout";
import { PartnerHansefit } from "@/components/home/PartnerHansefit";
import { MoreNutritionEsnTeaser } from "@/components/home/MoreNutritionEsnTeaser";
import { Gallery } from "@/components/home/Gallery";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { HomeOpeningHours } from "@/components/home/HomeOpeningHours";
import { HomeContact } from "@/components/home/HomeContact";
import { FinalCta } from "@/components/home/FinalCta";
import { getSection, sectionField } from "@/lib/content/sections";
import { resolveMedia, resolveMediaSrc } from "@/lib/content/media";
import { expansion2026 } from "@/content/expansion";
import { getProgram, type Program } from "@/content/programs";
import { mergeProgramWithSection } from "@/lib/content/program-merge";
import { TRAINING_WORLD_DEFS } from "@/content/training-worlds";

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
  const [desktop, mobile] = await Promise.all([resolveMedia(c.image), resolveMedia(c.imageMobile)]);
  return {
    headline: sectionField.str(c, "headline") ?? FALLBACK_HERO.headline,
    subline: sectionField.str(c, "subline") ?? FALLBACK_HERO.subline,
    ctaPrimaryLabel: sectionField.str(c, "ctaPrimaryLabel") ?? FALLBACK_HERO.ctaPrimaryLabel,
    ctaSecondaryLabel: sectionField.str(c, "ctaSecondaryLabel") ?? FALLBACK_HERO.ctaSecondaryLabel,
    imageDesktopSrc: desktop?.src ?? null,
    imageDesktopFocalX: desktop?.focalX ?? 50,
    imageDesktopFocalY: desktop?.focalY ?? 50,
    imageMobileSrc: mobile?.src ?? null,
    imageMobileFocalX: mobile?.focalX ?? 50,
    imageMobileFocalY: mobile?.focalY ?? 50,
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

const FALLBACK_EXPANSION: ExpansionContent = {
  eyebrow: expansion2026.eyebrow,
  headline: expansion2026.headline,
  intro: expansion2026.intro,
  atmosphereNote: expansion2026.atmosphereNote,
  statusNote: expansion2026.statusNote,
  groups: expansion2026.groups.map((g) => ({ title: g.title, items: [...g.items] })),
  image: null,
};

async function loadExpansion(): Promise<ExpansionContent> {
  const section = await getSection("home.expansion");
  if (!section) return FALLBACK_EXPANSION;
  const c = section.content;
  const image = await resolveMedia(c.image);
  const groupDefs: { key: string; title: string }[] = [
    { key: "groupTraining", title: FALLBACK_EXPANSION.groups[0]?.title ?? "Training" },
    { key: "groupGesundheit", title: FALLBACK_EXPANSION.groups[1]?.title ?? "Gesundheit" },
    { key: "groupKampfkunst", title: FALLBACK_EXPANSION.groups[2]?.title ?? "Kampfkunst" },
    { key: "groupRegeneration", title: FALLBACK_EXPANSION.groups[3]?.title ?? "Regeneration" },
  ];
  const groups = groupDefs
    .map((g, i) => ({ title: g.title, items: sectionField.list(c, g.key).length > 0 ? sectionField.list(c, g.key) : FALLBACK_EXPANSION.groups[i]?.items ?? [] }))
    .filter((g) => g.items.length > 0);
  return {
    eyebrow: sectionField.str(c, "eyebrow") ?? FALLBACK_EXPANSION.eyebrow,
    headline: sectionField.str(c, "headline") ?? FALLBACK_EXPANSION.headline,
    intro: sectionField.str(c, "intro") ?? FALLBACK_EXPANSION.intro,
    atmosphereNote: sectionField.str(c, "atmosphereNote") ?? FALLBACK_EXPANSION.atmosphereNote,
    statusNote: sectionField.str(c, "statusNote") ?? FALLBACK_EXPANSION.statusNote,
    groups: groups.length > 0 ? groups : FALLBACK_EXPANSION.groups,
    image: image?.src ?? null,
    imageFocalX: image?.focalX ?? 50,
    imageFocalY: image?.focalY ?? 50,
  };
}

async function loadOwner(): Promise<OwnerContent | null> {
  const section = await getSection("home.owner");
  if (!section) return null;
  const c = section.content;
  const portrait = await resolveMedia(c.portrait);
  return {
    name: sectionField.str(c, "name") ?? "",
    role: sectionField.str(c, "role") ?? "",
    intro: sectionField.str(c, "intro") ?? "",
    story: sectionField.str(c, "story") ?? "",
    qualifications: sectionField.list(c, "qualifications"),
    portrait: portrait?.src ?? null,
    portraitFocalX: portrait?.focalX ?? 50,
    portraitFocalY: portrait?.focalY ?? 50,
  };
}

async function loadTrainingWorlds(): Promise<TrainingWorldWithPrograms[]> {
  return Promise.all(
    TRAINING_WORLD_DEFS.map(async (world) => {
      const programs = await Promise.all(
        world.programSlugs.map(async (slug) => {
          const base = getProgram(slug);
          return base ? mergeProgramWithSection(base) : null;
        }),
      );
      return { ...world, programs: programs.filter((p): p is Program => p !== null) };
    }),
  );
}

export default async function HomePage() {
  const [hero, imagefilm, trustStats, owner, expansion, trainingWorlds] = await Promise.all([
    loadHero(),
    loadImagefilm(),
    loadTrustStats(),
    loadOwner(),
    loadExpansion(),
    loadTrainingWorlds(),
  ]);

  return (
    <>
      <Hero content={hero} />
      {imagefilm ? <Imagefilm content={imagefilm} /> : null}
      {trustStats.length > 0 ? <TrustStats items={trustStats} /> : null}
      <GoogleReviewsBadge />
      <ZielFinderSection />
      <GoalSelector />
      <Journey30Days />
      <TrainingWorlds worlds={trainingWorlds} />
      <HealthTeaser />
      <Expansion2026 content={expansion} />
      {owner ? <PollackFeature content={owner} /> : null}
      <MemberPortalTeaser />
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
