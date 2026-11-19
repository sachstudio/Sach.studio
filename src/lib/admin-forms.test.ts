import { describe, expect, it } from "vitest";
import { caseStudyToInput, isUuid, postToInput } from "./admin-forms";
import type { BlogPost, CaseStudy } from "@/db/schema";
import { validateCaseStudy, validatePost } from "./validation";

const now = new Date();

const study: CaseStudy = {
  id: "5b7f4c52-0b0a-4c8c-9d51-0e1b6a1d2c3e",
  slug: "acme",
  title: "Acme",
  subtitle: "",
  clientName: "Acme",
  clientLogoUrl: "",
  category: "websites",
  tags: ["a"],
  statusLabel: "LIVE",
  displayDate: null,
  heroImageUrl: "",
  cardImageUrl: "/images/projects/acme.webp",
  figmaUrl: "",
  liveUrl: "",
  about: "About",
  bannerImageUrl: "",
  problemIntro: "",
  problems: [{ lead: "L", text: "T" }],
  solutionIntro: "",
  solutions: [],
  featureImages: [],
  resultsText: "",
  stats: [],
  galleryImages: [],
  conclusion: "",
  summary: "Summary",
  metaTitle: "",
  metaDescription: "",
  isFeatured: true,
  sortOrder: 30,
  status: "published",
  isPlaceholder: false,
  publishedAt: now,
  createdAt: now,
  updatedAt: now,
};

const post: BlogPost = {
  id: "5b7f4c52-0b0a-4c8c-9d51-0e1b6a1d2c3f",
  slug: "why",
  title: "Why",
  excerpt: "",
  coverImageUrl: "/a.webp",
  body: "Body",
  displayDate: "5 Mar 2026",
  sortOrder: 10,
  status: "draft",
  isPlaceholder: true,
  publishedAt: null,
  createdAt: now,
  updatedAt: now,
};

describe("caseStudyToInput", () => {
  it("keeps the editable fields, including sort order, and drops ids and timestamps", () => {
    const input = caseStudyToInput(study);
    expect(input).not.toHaveProperty("id");
    expect(input).not.toHaveProperty("createdAt");
    expect(input).not.toHaveProperty("updatedAt");
    expect(input).not.toHaveProperty("publishedAt");
    expect(input.slug).toBe("acme");
    expect(input.sortOrder).toBe(30);
    expect(input.status).toBe("published");
  });

  it("produces values the validator accepts, so saving an unchanged form succeeds", () => {
    expect(validateCaseStudy(caseStudyToInput(study)).ok).toBe(true);
  });
});

describe("postToInput", () => {
  it("round-trips through the validator", () => {
    const input = postToInput(post);
    expect(input).not.toHaveProperty("id");
    expect(validatePost(input).ok).toBe(true);
    expect(input.isPlaceholder).toBe(true);
  });
});

describe("isUuid", () => {
  it("accepts a UUID and rejects anything else so bad addresses 404 instead of erroring", () => {
    expect(isUuid("5b7f4c52-0b0a-4c8c-9d51-0e1b6a1d2c3e")).toBe(true);
    expect(isUuid("not-an-id")).toBe(false);
    expect(isUuid("")).toBe(false);
    expect(isUuid("5b7f4c52-0b0a-4c8c-9d51-0e1b6a1d2c3e; DROP TABLE")).toBe(false);
  });
});

describe("empty form values", () => {
  it("start a new case study and post as drafts the validator can only fault for missing title and slug", async () => {
    const { emptyCaseStudy, emptyPost } = await import("./admin-forms");
    const study = validateCaseStudy(emptyCaseStudy());
    expect(study.ok).toBe(false);
    if (!study.ok) expect(Object.keys(study.errors).sort()).toEqual(["slug", "title"]);
    expect(emptyCaseStudy().status).toBe("draft");
    expect(emptyPost().status).toBe("draft");
  });

  it("are not defined in a client module, because server pages call them (a build error otherwise)", async () => {
    const { readFileSync } = await import("node:fs");
    const helper = readFileSync("src/lib/admin-forms.ts", "utf8");
    expect(helper).not.toMatch(/^\s*["']use client["']/m);
    for (const file of ["src/components/admin/CaseStudyForm.tsx", "src/components/admin/PostForm.tsx"]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/export function empty/);
    }
  });
});
