import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { getRepo } from "@/db";
import { caseStudyToInput, isUuid } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await gateAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const study = await (await getRepo()).adminGetCaseStudy(id);
  if (!study) notFound();
  // No `key` on the form: re-creating it after a status change would throw away unsaved typing.
  return <CaseStudyForm id={id} initial={caseStudyToInput(study)} />;
}
