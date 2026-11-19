// @vitest-environment node
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRepo } from "./repo";
import { seedCaseStudies, seedPosts } from "./seed-data";
import { seedDatabase } from "./seed";
import { createTestDb } from "./test-db";
import { validateCaseStudy, validatePost } from "@/lib/validation";

describe("seed content", () => {
  it("passes the same validation the admin uses", () => {
    for (const s of seedCaseStudies) {
      const result = validateCaseStudy(s);
      expect(result.ok, `${s.slug}: ${JSON.stringify(!result.ok && result.errors)}`).toBe(true);
    }
    for (const p of seedPosts) {
      const result = validatePost(p);
      expect(result.ok, `${p.slug}: ${JSON.stringify(!result.ok && result.errors)}`).toBe(true);
    }
  });

  it("only references images that exist in public/", () => {
    const refs: string[] = [];
    for (const s of seedCaseStudies) {
      refs.push(s.clientLogoUrl, s.heroImageUrl, s.cardImageUrl, s.bannerImageUrl, ...s.featureImages, ...s.galleryImages);
    }
    for (const p of seedPosts) refs.push(p.coverImageUrl);
    for (const ref of refs.filter(Boolean)) {
      expect(existsSync(path.join(process.cwd(), "public", ref)), ref).toBe(true);
    }
  });

  it("seeds the four designed case studies plus three concept projects", () => {
    const slugs = seedCaseStudies.map((s) => s.slug);
    expect(slugs).toContain("hasiru-dala-innovations-website-redesign");
    expect(slugs).toContain("gulf-cv-writers-website-design");
    expect(slugs).toContain("cosmion-community-clubhouse-website-design");
    expect(slugs).toContain("master-systems-maritime-automation-website");
    expect(seedCaseStudies).toHaveLength(7);
    expect(seedPosts.map((p) => p.slug)).toEqual([
      "why-design-matters",
      "use-of-ai",
      "importance-of-marketing",
      "use-of-social-media",
    ]);
  });

  it("is idempotent: running twice does not duplicate or change counts", async () => {
    const db = await createTestDb();
    await seedDatabase(db as never);
    await seedDatabase(db as never);
    const repo = createRepo(db as never);
    expect(await repo.adminListCaseStudies()).toHaveLength(7);
    expect(await repo.adminListPosts()).toHaveLength(4);
  });

  it("publishes everything and flags content that still needs the owner's text", async () => {
    const db = await createTestDb();
    await seedDatabase(db as never);
    const repo = createRepo(db as never);
    const published = await repo.listPublishedCaseStudies();
    expect(published).toHaveLength(7);
    const hasiru = await repo.getPublishedCaseStudy("hasiru-dala-innovations-website-redesign");
    expect(hasiru?.isPlaceholder).toBe(false);
    expect(hasiru?.stats.map((s) => s.value)).toEqual(["42%", "180%", "35+"]);
    const master = await repo.getPublishedCaseStudy("master-systems-maritime-automation-website");
    expect(master?.isPlaceholder).toBe(true);
    expect((await repo.listPublishedPosts()).every((p) => p.isPlaceholder)).toBe(true);
  });

  it("keeps the Works grid order from the design: Hasiru, Gulf, Master Systems, then Cosmion", async () => {
    const db = await createTestDb();
    await seedDatabase(db as never);
    const repo = createRepo(db as never);
    const websites = await repo.listPublishedCaseStudies({ category: "websites" });
    expect(websites.slice(0, 4).map((s) => s.slug)).toEqual([
      "hasiru-dala-innovations-website-redesign",
      "gulf-cv-writers-website-design",
      "master-systems-maritime-automation-website",
      "cosmion-community-clubhouse-website-design",
    ]);
    const webApps = await repo.listPublishedCaseStudies({ category: "web-apps-dashboard" });
    expect(webApps).toHaveLength(2);
  });
});
