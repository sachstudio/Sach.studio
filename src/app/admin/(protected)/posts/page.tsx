import Link from "next/link";
import { connection } from "next/server";
import { PostTable } from "@/components/admin/PostTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";
import { formatEdited } from "@/lib/admin-list";

export default async function AdminPostsPage() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const posts = await (await getRepo()).adminListPosts();

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-neutral-950">Blog posts</h1>
        <Link href="/admin/posts/new" className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
          New post
        </Link>
      </div>
      <PostTable
        rows={posts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          isPlaceholder: p.isPlaceholder,
          edited: formatEdited(p.updatedAt),
        }))}
      />
    </section>
  );
}
