type Env = Record<string, string | undefined>;

/**
 * The public address of the site, used for the sitemap, robots and share previews.
 * Order: NEXT_PUBLIC_SITE_URL (your own domain), then Vercel's production address, then localhost.
 */
export function siteUrl(env: Env = process.env): string {
  const set = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (set) return set.replace(/\/+$/, "");
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}
