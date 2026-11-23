import { connection } from "next/server";
import { PostTable } from "@/components/admin/PostTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";
import { formatEdited } from "@/lib/admin-list";

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const { q } = await searchParams;
  const posts = await (await getRepo()).adminListPosts();

  return (
    <PostTable
      initialQuery={Array.isArray(q) ? (q[0] ?? "") : (q ?? "")}
      rows={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        isPlaceholder: p.isPlaceholder,
        coverImageUrl: p.coverImageUrl,
        edited: formatEdited(p.updatedAt),
        editedAt: p.updatedAt.toISOString(),
      }))}
    />
  );
}
