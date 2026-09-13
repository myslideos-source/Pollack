import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { GoalSelector } from "@/components/home/GoalSelector";
import { TrainingWorlds } from "@/components/home/TrainingWorlds";
import { Expansion2026 } from "@/components/home/Expansion2026";
import { HealthTeaser } from "@/components/home/HealthTeaser";
import { PollackFeature } from "@/components/home/PollackFeature";
import { Gallery } from "@/components/home/Gallery";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <GoalSelector />
      <TrainingWorlds />
      <Expansion2026 />
      <HealthTeaser />
      <PollackFeature />
      <Gallery />
      <PricingTeaser />
      <FinalCta />
    </>
  );
}
