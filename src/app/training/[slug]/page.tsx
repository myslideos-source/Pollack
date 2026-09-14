import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/shared/ProgramDetail";
import { getProgram, programsByCategory } from "@/content/programs";
import { mergeProgramWithSection } from "@/lib/content/program-merge";

export function generateStaticParams() {
  return programsByCategory("training").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const base = getProgram(slug);
  if (!base || base.category !== "training") return {};
  const program = await mergeProgramWithSection(base);
  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/training/${program.slug}` },
  };
}

export default async function TrainingProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getProgram(slug);
  if (!base || base.category !== "training") notFound();
  const program = await mergeProgramWithSection(base);
  return <ProgramDetail program={program} />;
}
