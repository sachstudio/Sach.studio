import Link from "next/link";
import { connection } from "next/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getRepo } from "@/db";
import { categoryLabel } from "@/lib/categories";

function updated(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function EmptyRow({ text }: { text: string }) {
  return <li className="px-5 py-10 text-center text-neutral-500">{text}</li>;
}

export default async function AdminDashboard() {
  await connection(); // read the database at request time, never during the build
  const repo = await getRepo();
  const [studies, posts] = await Promise.all([repo.adminListCaseStudies(), repo.adminListPosts()]);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-4xl text-neutral-950">Case studies</h1>
          <Link href="/admin/case-studies/new" className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
            New case study
          </Link>
        </div>
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
          {studies.length === 0 && <EmptyRow text="No case studies yet. Add the first one with New case study." />}
          {studies.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/case-studies/${s.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50">
                <span className="flex flex-col gap-1">
                  <span className="font-medium text-neutral-900">{s.title}</span>
                  <span className="text-sm text-neutral-500">
                    {categoryLabel(s.category)} · /works/{s.slug}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <StatusBadge status={s.status} needsContent={s.isPlaceholder} />
                  <span className="text-sm text-neutral-500">Edited {updated(s.updatedAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-4xl text-neutral-950">Blog posts</h2>
          <Link href="/admin/posts/new" className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
            New post
          </Link>
        </div>
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
          {posts.length === 0 && <EmptyRow text="No posts yet. Add the first one with New post." />}
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/posts/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50">
                <span className="flex flex-col gap-1">
                  <span className="font-medium text-neutral-900">{p.title}</span>
                  <span className="text-sm text-neutral-500">/blogs/{p.slug}</span>
                </span>
                <span className="flex items-center gap-4">
                  <StatusBadge status={p.status} needsContent={p.isPlaceholder} />
                  <span className="text-sm text-neutral-500">Edited {updated(p.updatedAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
