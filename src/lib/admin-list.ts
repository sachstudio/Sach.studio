import { CATEGORIES, type CategorySlug } from "./categories";

export type CategoryFilter = "all" | CategorySlug;

const editedFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata", // the studio works in Bangalore
});

/** "23 Nov 2026": when something was last edited, in the studio's time zone. */
export function formatEdited(date: Date): string {
  return editedFormat.format(date);
}

/** The case studies in one category (or all of them), keeping their order. */
export function filterByCategory<T extends { category: CategorySlug }>(items: T[], filter: CategoryFilter): T[] {
  return filter === "all" ? items : items.filter((item) => item.category === filter);
}

/**
 * A sorted copy of the rows. With no key the original order is kept. Text sorts ignoring case, numbers
 * by value, and rows that tie stay in their original order.
 */
export function sortRows<T>(rows: T[], key: ((row: T) => string | number) | null, direction: "asc" | "desc"): T[] {
  if (!key) return rows;
  const sign = direction === "asc" ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index, value: key(row) }))
    .sort((a, b) => {
      const x = typeof a.value === "string" ? a.value.toLowerCase() : a.value;
      const y = typeof b.value === "string" ? b.value.toLowerCase() : b.value;
      if (x < y) return -sign;
      if (x > y) return sign;
      return a.index - b.index;
    })
    .map((entry) => entry.row);
}

/** The page buttons to show: first, last and three around the current page, with null marking a gap. */
export function pageNumbers(current: number, count: number): (number | null)[] {
  const shown = new Set<number>([1, count]);
  const start = Math.min(Math.max(current - 1, 1), Math.max(count - 2, 1));
  for (let p = start; p <= Math.min(start + 2, count); p++) shown.add(p);
  const sorted = [...shown].sort((a, b) => a - b);
  const result: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
    result.push(p);
  });
  return result;
}

/** Items where any of the picked text fields contains the query (ignoring case and outer spaces). */
export function filterByQuery<T>(items: T[], query: string, pick: (item: T) => string[]): T[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) => pick(item).some((text) => text.toLowerCase().includes(needle)));
}

export type Page<T> = { items: T[]; page: number; pageCount: number; from: number; to: number; total: number };

/** One page of a list. A page number that no longer exists (after a search) is moved to the nearest real one. */
export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    page: current,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
    total,
  };
}

export type StatusFilter = "all" | "published" | "draft";

/** The published ones, the drafts, or everything, keeping the original order. */
export function filterByStatus<T extends { status: "draft" | "published" }>(items: T[], filter: StatusFilter): T[] {
  return filter === "all" ? items : items.filter((item) => item.status === filter);
}

/** How many items each status filter would show. */
export function countByStatus(items: { status: "draft" | "published" }[]): Record<StatusFilter, number> {
  const published = items.filter((item) => item.status === "published").length;
  return { all: items.length, published, draft: items.length - published };
}

/** How many items each filter would show, including categories that have none yet. */
export function countByCategory(items: { category: CategorySlug }[]): Record<CategoryFilter, number> {
  const counts = { all: items.length } as Record<CategoryFilter, number>;
  for (const { slug } of CATEGORIES) counts[slug] = items.filter((item) => item.category === slug).length;
  return counts;
}
