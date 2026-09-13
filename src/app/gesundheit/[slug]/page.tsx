import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/shared/ProgramDetail";
import { getProgram, programsByCategory } from "@/content/programs";

export function generateStaticParams() {
  return programsByCategory("gesundheit").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program || program.category !== "gesundheit") return {};
  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/gesundheit/${program.slug}` },
  };
}

export default async function GesundheitProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program || program.category !== "gesundheit") notFound();
  return <ProgramDetail program={program} />;
}
