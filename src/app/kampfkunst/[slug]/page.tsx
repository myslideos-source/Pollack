import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/shared/ProgramDetail";
import { getProgram, programsByCategory } from "@/content/programs";

export function generateStaticParams() {
  return programsByCategory("kampfkunst").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program || program.category !== "kampfkunst") return {};
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
  const program = getProgram(slug);
  if (!program || program.category !== "kampfkunst") notFound();
  return <ProgramDetail program={program} />;
}
