import { describe, expect, it } from "vitest";
import { validateCaseStudy, validatePost, type CaseStudyInput } from "./validation";

const base: CaseStudyInput = {
  slug: "acme-website-redesign",
  title: "Acme: Website Redesign",
  subtitle: "",
  clientName: "Acme",
  clientLogoUrl: "",
  category: "websites",
  tags: [],
  statusLabel: null,
  displayDate: null,
  heroImageUrl: "",
  cardImageUrl: "/images/projects/acme-card.webp",
  figmaUrl: "",
  liveUrl: "",
  about: "",
  bannerImageUrl: "",
  problemIntro: "",
  problems: [],
  solutionIntro: "",
  solutions: [],
  featureImages: [],
  resultsText: "",
  stats: [],
  galleryImages: [],
  conclusion: "",
  summary: "A short summary.",
  metaTitle: "Acme Website Redesign | Sach",
  metaDescription: "How Sach Studio redesigned Acme.",
  isFeatured: false,
  status: "draft",
  sortOrder: 0,
  isPlaceholder: false,
};

describe("validateCaseStudy", () => {
  it("accepts a valid draft", () => {
    const result = validateCaseStudy(base);
    expect(result.ok).toBe(true);
  });

  it("rejects a meta title over 55 characters and names the field and the limit", () => {
    const result = validateCaseStudy({ ...base, metaTitle: "x".repeat(56) });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.metaTitle).toContain("55");
      expect(result.errors.metaTitle).toContain("56");
    }
  });

  it("rejects a meta description over 157 characters", () => {
    const result = validateCaseStudy({ ...base, metaDescription: "x".repeat(158) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.metaDescription).toContain("157");
  });

  it("rejects four result stats", () => {
    const stat = { value: "10%", label: "More leads" };
    const result = validateCaseStudy({ ...base, stats: [stat, stat, stat, stat] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.stats).toContain("3");
  });

  it("rejects a slug with capitals or spaces and explains the format", () => {
    const result = validateCaseStudy({ ...base, slug: "Acme Site" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.slug).toMatch(/lowercase letters, numbers and hyphens/i);
  });

  it("rejects an unknown category", () => {
    const result = validateCaseStudy({ ...base, category: "branding" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.category).toBeDefined();
  });

  it("requires a card image and summary before publishing, but not for drafts", () => {
    const incomplete = { ...base, cardImageUrl: "", summary: "" };
    expect(validateCaseStudy({ ...incomplete, status: "draft" }).ok).toBe(true);
    const published = validateCaseStudy({ ...incomplete, status: "published" });
    expect(published.ok).toBe(false);
    if (!published.ok) {
      expect(published.errors.cardImageUrl).toMatch(/before you publish/i);
      expect(published.errors.summary).toMatch(/before you publish/i);
    }
  });
});

describe("validatePost", () => {
  const post = {
    slug: "why-design-matters",
    title: "Why Design Matters",
    excerpt: "",
    coverImageUrl: "/images/blogs/x.webp",
    body: "Body",
    displayDate: "10 Feb 2025",
    status: "draft" as const,
    sortOrder: 0,
    isPlaceholder: false,
  };

  it("accepts a valid post", () => {
    expect(validatePost(post).ok).toBe(true);
  });

  it("requires a title", () => {
    const result = validatePost({ ...post, title: "  " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.title).toMatch(/title/i);
  });

  it("requires body text before publishing", () => {
    const result = validatePost({ ...post, body: "", status: "published" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.body).toMatch(/before you publish/i);
  });
});

describe("image addresses", () => {
  const blob = "https://abc123.public.blob.vercel-storage.com/case-studies/cover-x1y2.png";

  it("accepts an uploaded image from Vercel Blob and a site path", () => {
    expect(validateCaseStudy({ ...base, cardImageUrl: blob }).ok).toBe(true);
    expect(validateCaseStudy({ ...base, cardImageUrl: "/images/projects/a.webp" }).ok).toBe(true);
  });

  it("rejects an image from any other website, because the site only loads images it hosts", () => {
    const result = validateCaseStudy({ ...base, cardImageUrl: "https://evil.example/x.png" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.cardImageUrl).toMatch(/upload/i);
  });

  it("rejects a protocol-relative address that would load from another host", () => {
    expect(validateCaseStudy({ ...base, cardImageUrl: "//evil.example/x.png" }).ok).toBe(false);
  });

  it("applies the same rule to feature and gallery images", () => {
    expect(validateCaseStudy({ ...base, galleryImages: ["https://evil.example/x.png"] }).ok).toBe(false);
    expect(validateCaseStudy({ ...base, galleryImages: [blob] }).ok).toBe(true);
  });
});
