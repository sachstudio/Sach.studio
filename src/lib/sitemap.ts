export type SitemapEntry = { url: string; lastModified?: Date };

type StudyRef = { slug: string; about: string; updatedAt: Date };
type PostRef = { slug: string; updatedAt: Date };

const STATIC_PATHS = [
  "/",
  "/about",
  "/works",
  "/blogs",
  "/contact",
  "/conditions/privacy-policy",
  "/conditions/terms-conditions",
  "/conditions/payment-cancellation",
];

/**
 * Every public address. Callers pass only published rows, so drafts never appear; case studies with no
 * body text have no page and are skipped. The thank-you page and /admin are never listed.
 */
export function buildSitemapEntries(input: {
  siteUrl: string;
  studies: StudyRef[];
  posts: PostRef[];
}): SitemapEntry[] {
  const base = input.siteUrl.replace(/\/+$/, "");
  const entries: SitemapEntry[] = STATIC_PATHS.map((path) => ({ url: path === "/" ? `${base}/` : `${base}${path}` }));

  for (const s of input.studies) {
    if (s.about.trim()) entries.push({ url: `${base}/works/${s.slug}`, lastModified: s.updatedAt });
  }
  for (const p of input.posts) {
    entries.push({ url: `${base}/blogs/${p.slug}`, lastModified: p.updatedAt });
  }
  return entries;
}
