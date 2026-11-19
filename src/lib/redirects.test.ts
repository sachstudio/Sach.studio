import { describe, expect, it } from "vitest";
import { legacyRedirects } from "./redirects";

function resolve(path: string): string | null {
  // First matching rule wins, the way Next.js applies them.
  for (const rule of legacyRedirects) {
    const pattern = new RegExp("^" + rule.source.replace(/:[a-z]+/g, "([^/]+)") + "$");
    const match = path.match(pattern);
    if (match) return rule.destination.replace(/:[a-z]+/g, () => match[1] ?? "");
  }
  return null;
}

describe("legacy Framer URLs", () => {
  it("send the old page addresses to their new homes", () => {
    expect(resolve("/about-us")).toBe("/about");
    expect(resolve("/project")).toBe("/works");
    expect(resolve("/contact-us")).toBe("/contact");
  });

  it("send each old case study to its new address", () => {
    expect(resolve("/projects/hasiru-dala-innovations")).toBe("/works/hasiru-dala-innovations-website-redesign");
    expect(resolve("/projects/gulf-cv-writers-landing-more-interviews")).toBe("/works/gulf-cv-writers-website-design");
    expect(resolve("/projects/master-systems-visualizing-marine-automated-solutions")).toBe(
      "/works/master-systems-maritime-automation-website",
    );
  });

  it("send the Arizona concept (which has no case study page) and unknown old projects to the Works list", () => {
    expect(resolve("/projects/arizona-business-loan-page-design-visualisation")).toBe("/works");
    expect(resolve("/projects/something-else")).toBe("/works");
  });

  it("send the four old blog addresses, including the -copy ones, to the clean post addresses", () => {
    expect(resolve("/blogs/why-design-matters-copy")).toBe("/blogs/use-of-ai");
    expect(resolve("/blogs/why-design-matters-copy-copy")).toBe("/blogs/importance-of-marketing");
    expect(resolve("/blogs/why-design-matters-copy-copy-copy")).toBe("/blogs/use-of-social-media");
  });

  it("leave current addresses alone, including the first blog post and the legal pages", () => {
    expect(resolve("/blogs/why-design-matters")).toBeNull();
    expect(resolve("/conditions/privacy-policy")).toBeNull();
    expect(resolve("/works/hasiru-dala-innovations-website-redesign")).toBeNull();
    expect(resolve("/")).toBeNull();
  });

  it("are permanent redirects with unique sources and absolute destinations", () => {
    const sources = legacyRedirects.map((r) => r.source);
    expect(new Set(sources).size).toBe(sources.length);
    for (const rule of legacyRedirects) {
      expect(rule.permanent).toBe(true);
      expect(rule.destination.startsWith("/")).toBe(true);
    }
  });
});
