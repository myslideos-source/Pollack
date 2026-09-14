import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/shared/ProgramDetail";
import { getProgram, programsByCategory } from "@/content/programs";
import { mergeProgramWithSection } from "@/lib/content/program-merge";

export function generateStaticParams() {
  return programsByCategory("kampfkunst").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const base = getProgram(slug);
  if (!base || base.category !== "kampfkunst") return {};
  const program = await mergeProgramWithSection(base);
  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/kampfkunst/${program.slug}` },
  };
}

export default async function KampfkunstProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getProgram(slug);
  if (!base || base.category !== "kampfkunst") notFound();
  const program = await mergeProgramWithSection(base);
  return <ProgramDetail program={program} />;
}
