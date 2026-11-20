import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CaseStudyView } from "@/components/works/CaseStudyView";
import { getRepo } from "@/db";
import { isUuid } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function PreviewCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await gateAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const repo = await getRepo();
  const study = await repo.adminGetCaseStudy(id);
  if (!study) notFound();
  const related = await repo.listRelatedCaseStudies(study.slug, 3);

  return (
    <div className="-mx-4 -my-8 bg-gradient-to-b from-blue-100 via-neutral-50 to-neutral-50 sm:-mx-6">
      <p className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-900">
        Preview: {study.status === "published" ? "this page is live" : "this case study is a draft and not visible on the website"}.
      </p>
      <CaseStudyView study={study} related={related} />
    </div>
  );
}
