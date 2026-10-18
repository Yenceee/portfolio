import { projectDetails } from "@/data/projectDetails";
import ProjectDetail from "@/components/sections/ProjectDetail";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = projectDetails.find((p) => p.slug === slug);
  if (!detail) return notFound();
  return <ProjectDetail detail={detail} />;
}

export async function generateStaticParams() {
  const { projectDetails } = await import("@/data/projectDetails");
  return projectDetails.map((p) => ({ slug: p.slug }));
}
