import { countByCategory } from "./admin-list";
import { CATEGORIES, type CategorySlug } from "./categories";

export type DashboardStudy = {
  id: string;
  title: string;
  category: CategorySlug;
  status: "draft" | "published";
  updatedAt: Date;
};

export type DashboardPost = {
  id: string;
  title: string;
  status: "draft" | "published";
  updatedAt: Date;
};

export type RecentItem = {
  kind: "Case study" | "Blog post";
  id: string;
  title: string;
  href: string;
  status: "draft" | "published";
  updatedAt: Date;
};

function tally(items: { status: "draft" | "published" }[]) {
  const published = items.filter((i) => i.status === "published").length;
  return { total: items.length, published, drafts: items.length - published };
}

/** Everything the admin home page shows, worked out from the case studies and posts. */
export function buildDashboard(studies: DashboardStudy[], posts: DashboardPost[]) {
  const studyTally = tally(studies);
  const counts = countByCategory(studies);

  const recent: RecentItem[] = [
    ...studies.map((s): RecentItem => ({ kind: "Case study", id: s.id, title: s.title, href: `/admin/case-studies/${s.id}`, status: s.status, updatedAt: s.updatedAt })),
    ...posts.map((p): RecentItem => ({ kind: "Blog post", id: p.id, title: p.title, href: `/admin/posts/${p.id}`, status: p.status, updatedAt: p.updatedAt })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return {
    studies: {
      ...studyTally,
      percentPublished: studyTally.total === 0 ? 0 : Math.round((studyTally.published / studyTally.total) * 100),
    },
    posts: tally(posts),
    byCategory: CATEGORIES.map((c) => ({ slug: c.slug, label: c.label, count: counts[c.slug] })),
    recent: recent.slice(0, 7),
    latest: recent[0] ?? null,
  };
}

/** "Good morning" and so on, by the hour in Indian time (the studio works in Bangalore). */
export function greetingFor(now: Date): string {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(now));
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}
