"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { countByCategory, filterByCategory, type CategoryFilter } from "@/lib/admin-list";
import { CATEGORIES, categoryLabel, type CategorySlug } from "@/lib/categories";
import { cn } from "@/lib/cn";

export type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  category: CategorySlug;
  status: "draft" | "published";
  isPlaceholder: boolean;
  /** Already formatted on the server, so the server and browser never disagree about the date. */
  edited: string;
};

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...CATEGORIES.map((c) => ({ value: c.slug as CategoryFilter, label: c.label })),
];

/** The case studies as a table, with one filter button per category. */
export function CaseStudyTable({ rows }: { rows: CaseStudyRow[] }) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const counts = countByCategory(rows);
  const visible = filterByCategory(rows, filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150",
                active
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-blue-500 hover:text-blue-600",
              )}
            >
              {label}{" "}
              <span className={cn("ml-0.5 tabular-nums", active ? "text-blue-100" : "text-neutral-500")}>{counts[value]}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-neutral-200 bg-white px-5 py-10 text-center text-neutral-500 shadow-card">
          No case studies yet. Add the first one with New case study.
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-neutral-200 bg-white px-5 py-10 text-center text-neutral-500 shadow-card">
          No case studies in {filter === "all" ? "this view" : categoryLabel(filter)} yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-card">
          <table aria-label="Case studies" className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <th scope="col" className="px-5 py-3 font-medium">Title</th>
                <th scope="col" className="px-5 py-3 font-medium">Category</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium">Edited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {visible.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-4">
                    <Link href={`/admin/case-studies/${row.id}`} className="font-medium text-neutral-900 hover:text-blue-600">
                      {row.title}
                    </Link>
                    <div className="mt-0.5 text-neutral-500">/works/{row.slug}</div>
                  </td>
                  <td className="px-5 py-4 text-neutral-700">{categoryLabel(row.category)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={row.status} needsContent={row.isPlaceholder} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-neutral-500">{row.edited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
