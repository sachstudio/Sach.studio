import type { MetadataRoute } from "next";
import { getPublishedCaseStudies, getPublishedPosts } from "@/db/queries";
import { siteUrl } from "@/lib/site-url";
import { buildSitemapEntries } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [studies, posts] = await Promise.all([getPublishedCaseStudies(), getPublishedPosts()]);
  return buildSitemapEntries({
    siteUrl: siteUrl(),
    studies,
    posts,
  });
}
