import { Hero } from "@/components/home/Hero";
import { Imagefilm } from "@/components/home/Imagefilm";
import { TrustStats } from "@/components/home/TrustStats";
import { GoogleReviewsBadge } from "@/components/home/GoogleReviewsBadge";
import { GoalSelector } from "@/components/home/GoalSelector";
import { TrainingWorlds } from "@/components/home/TrainingWorlds";
import { HealthTeaser } from "@/components/home/HealthTeaser";
import { Expansion2026 } from "@/components/home/Expansion2026";
import { PollackFeature } from "@/components/home/PollackFeature";
import { CommunityShoutout } from "@/components/home/CommunityShoutout";
import { PartnerHansefit } from "@/components/home/PartnerHansefit";
import { MoreNutritionEsnTeaser } from "@/components/home/MoreNutritionEsnTeaser";
import { Gallery } from "@/components/home/Gallery";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { HomeOpeningHours } from "@/components/home/HomeOpeningHours";
import { HomeContact } from "@/components/home/HomeContact";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Imagefilm />
      <TrustStats />
      <GoogleReviewsBadge />
      <GoalSelector />
      <TrainingWorlds />
      <HealthTeaser />
      <Expansion2026 />
      <PollackFeature />
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
