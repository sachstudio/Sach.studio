import { connection } from "next/server";
import { CaseStudyTable } from "@/components/admin/CaseStudyTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";
import { formatEdited } from "@/lib/admin-list";

export default async function AdminCaseStudiesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const { q } = await searchParams;
  const studies = await (await getRepo()).adminListCaseStudies();

  return (
    <CaseStudyTable
      initialQuery={Array.isArray(q) ? (q[0] ?? "") : (q ?? "")}
      rows={studies.map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        category: s.category,
        status: s.status,
        isPlaceholder: s.isPlaceholder,
        cardImageUrl: s.cardImageUrl,
        edited: formatEdited(s.updatedAt),
        editedAt: s.updatedAt.toISOString(),
      }))}
    />
  );
}
