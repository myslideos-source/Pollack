import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/shared/ProgramDetail";
import { getProgram, programsByCategory } from "@/content/programs";

export function generateStaticParams() {
  return programsByCategory("regeneration").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program || program.category !== "regeneration") return {};
  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/regeneration/${program.slug}` },
  };
}

export default async function RegenerationProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program || program.category !== "regeneration") notFound();
  return <ProgramDetail program={program} />;
}
