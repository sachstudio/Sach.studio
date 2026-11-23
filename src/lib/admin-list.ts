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

/** How many items each filter would show, including categories that have none yet. */
export function countByCategory(items: { category: CategorySlug }[]): Record<CategoryFilter, number> {
  const counts = { all: items.length } as Record<CategoryFilter, number>;
  for (const { slug } of CATEGORIES) counts[slug] = items.filter((item) => item.category === slug).length;
  return counts;
}
