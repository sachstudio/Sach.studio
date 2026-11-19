import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { getRepo } from "@/db";
import { caseStudyToInput, isUuid } from "@/lib/admin-forms";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const study = await (await getRepo()).adminGetCaseStudy(id);
  if (!study) notFound();
  // `key` makes the form start fresh after a save redirects here with new data.
  return <CaseStudyForm key={`${id}-${study.updatedAt.getTime()}`} id={id} initial={caseStudyToInput(study)} />;
}
