import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  isPlaceholder: boolean;
  /** Already formatted on the server. */
  edited: string;
};

/** The blog posts as a table. */
export function PostTable({ rows }: { rows: PostRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white px-5 py-10 text-center text-neutral-500 shadow-card">
        No posts yet. Add the first one with New post.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-card">
      <table aria-label="Blog posts" className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <th scope="col" className="px-5 py-3 font-medium">Title</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="px-5 py-3 font-medium">Edited</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-neutral-50">
              <td className="px-5 py-4">
                <Link href={`/admin/posts/${row.id}`} className="font-medium text-neutral-900 hover:text-blue-600">
                  {row.title}
                </Link>
                <div className="mt-0.5 text-neutral-500">/blogs/{row.slug}</div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={row.status} needsContent={row.isPlaceholder} />
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-neutral-500">{row.edited}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
