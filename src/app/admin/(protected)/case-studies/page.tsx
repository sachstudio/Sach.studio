import Link from "next/link";
import { connection } from "next/server";
import { CaseStudyTable } from "@/components/admin/CaseStudyTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";
import { formatEdited } from "@/lib/admin-list";

export default async function AdminCaseStudiesPage() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const studies = await (await getRepo()).adminListCaseStudies();

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-neutral-950">Case studies</h1>
        <Link href="/admin/case-studies/new" className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
          New case study
        </Link>
      </div>
      <CaseStudyTable
        rows={studies.map((s) => ({
          id: s.id,
          title: s.title,
          slug: s.slug,
          category: s.category,
          status: s.status,
          isPlaceholder: s.isPlaceholder,
          edited: formatEdited(s.updatedAt),
        }))}
      />
    </section>
  );
}
