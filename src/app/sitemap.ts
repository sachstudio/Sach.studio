import type { MetadataRoute } from "next";
import { getPublishedCaseStudies, getPublishedPosts } from "@/db/queries";
import { buildSitemapEntries } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [studies, posts] = await Promise.all([getPublishedCaseStudies(), getPublishedPosts()]);
  return buildSitemapEntries({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    studies,
    posts,
  });
}
