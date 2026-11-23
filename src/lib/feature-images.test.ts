import { describe, expect, it } from "vitest";
import { groupFeatureImages, normalizeFeatureImages } from "./feature-images";
import { validateCaseStudy } from "./validation";

describe("normalizeFeatureImages", () => {
  it("turns old plain addresses into rectangles", () => {
    expect(normalizeFeatureImages(["/images/a.webp"])).toEqual([{ url: "/images/a.webp", shape: "rectangle" }]);
  });

  it("keeps a chosen shape", () => {
    expect(normalizeFeatureImages([{ url: "/images/a.webp", shape: "square" }])).toEqual([{ url: "/images/a.webp", shape: "square" }]);
  });

  it("falls back to rectangle for an unknown shape and ignores junk", () => {
    expect(normalizeFeatureImages([{ url: "/images/a.webp", shape: "wide" }, 7, null])).toEqual([{ url: "/images/a.webp", shape: "rectangle" }]);
    expect(normalizeFeatureImages(undefined)).toEqual([]);
  });
});

describe("groupFeatureImages", () => {
  const sq = (n: number) => ({ url: `/images/s${n}.webp`, shape: "square" as const });
  const rect = (n: number) => ({ url: `/images/r${n}.webp`, shape: "rectangle" as const });

  it("pairs neighbouring squares and keeps rectangles on their own row", () => {
    const rows = groupFeatureImages([sq(1), sq(2), rect(1), sq(3)]);
    expect(rows.map((r) => r.map((i) => i.url))).toEqual([["/images/s1.webp", "/images/s2.webp"], ["/images/r1.webp"], ["/images/s3.webp"]]);
  });

  it("returns no rows for no images", () => {
    expect(groupFeatureImages([])).toEqual([]);
  });
});

describe("validateCaseStudy feature images", () => {
  const base = { slug: "acme", title: "Acme", category: "websites" };

  it("accepts the shape and defaults old strings to rectangle", () => {
    const result = validateCaseStudy({ ...base, featureImages: ["/images/a.webp", { url: "/images/b.webp", shape: "square" }] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.featureImages).toEqual([
        { url: "/images/a.webp", shape: "rectangle" },
        { url: "/images/b.webp", shape: "square" },
      ]);
    }
  });

  it("rejects an image address from another site", () => {
    const result = validateCaseStudy({ ...base, featureImages: [{ url: "https://evil.example/x.png", shape: "square" }] });
    expect(result.ok).toBe(false);
  });
});
