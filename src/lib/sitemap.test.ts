import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "./sitemap";

const siteUrl = "https://sach.studio";
const updatedAt = new Date("2026-03-05T00:00:00Z");

describe("buildSitemapEntries", () => {
  const entries = buildSitemapEntries({
    siteUrl,
    studies: [
      { slug: "with-detail", about: "About text", updatedAt },
      { slug: "concept-card", about: "   ", updatedAt },
    ],
    posts: [{ slug: "why-design-matters", updatedAt }],
  });
  const urls = entries.map((e) => e.url);

  it("lists the public pages, the legal pages and the thank-you-free site map", () => {
    for (const path of ["/", "/about", "/works", "/blogs", "/contact", "/conditions/privacy-policy", "/conditions/terms-conditions", "/conditions/payment-cancellation"]) {
      expect(urls, path).toContain(`${siteUrl}${path}`);
    }
  });

  it("leaves out the thank-you page and everything under /admin", () => {
    expect(urls.some((u) => u.includes("/thank-you"))).toBe(false);
    expect(urls.some((u) => u.includes("/admin"))).toBe(false);
  });

  it("includes case studies that have a page and skips concept cards that do not", () => {
    expect(urls).toContain(`${siteUrl}/works/with-detail`);
    expect(urls).not.toContain(`${siteUrl}/works/concept-card`);
  });

  it("includes published posts", () => {
    expect(urls).toContain(`${siteUrl}/blogs/why-design-matters`);
  });

  it("has no duplicate addresses and no double slashes after the domain", () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url.replace("https://", "")).not.toContain("//");
  });

  it("tolerates a site address with a trailing slash", () => {
    const withSlash = buildSitemapEntries({ siteUrl: "https://sach.studio/", studies: [], posts: [] });
    expect(withSlash[0].url).toBe("https://sach.studio/");
    expect(withSlash.map((e) => e.url)).toContain("https://sach.studio/about");
  });
});
