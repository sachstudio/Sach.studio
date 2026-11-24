// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { createRepo, type Repo } from "./repo";
import { createTestDb } from "./test-db";
import type { BookingInput } from "@/lib/cal-webhook";
import type { CaseStudyInput, PostInput, PricingPlanInput } from "@/lib/validation";

function study(overrides: Partial<CaseStudyInput> = {}): CaseStudyInput {
  return {
    slug: "acme-website",
    title: "Acme Website",
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
    summary: "Summary",
    metaTitle: "",
    metaDescription: "",
    isFeatured: false,
    status: "draft",
    sortOrder: 0,
    isPlaceholder: false,
    ...overrides,
  };
}

function post(overrides: Partial<PostInput> = {}): PostInput {
  return {
    slug: "why-design-matters",
    title: "Why Design Matters",
    excerpt: "",
    coverImageUrl: "/images/blogs/x.webp",
    body: "Some body text",
    displayDate: "10 Feb 2025",
    status: "draft",
    sortOrder: 0,
    isPlaceholder: false,
    ...overrides,
  };
}

let repo: Repo;

beforeEach(async () => {
  repo = createRepo(await createTestDb());
});

describe("case studies: public visibility", () => {
  it("never lists or returns a draft", async () => {
    await repo.saveCaseStudy(study({ slug: "draft-one", status: "draft" }));
    await repo.saveCaseStudy(study({ slug: "live-one", title: "Live One", status: "published" }));
    const slugs = (await repo.listPublishedCaseStudies()).map((s) => s.slug);
    expect(slugs).toEqual(["live-one"]);
    expect(await repo.getPublishedCaseStudy("draft-one")).toBeNull();
    expect((await repo.getPublishedCaseStudy("live-one"))?.title).toBe("Live One");
  });

  it("filters by category and by featured", async () => {
    await repo.saveCaseStudy(study({ slug: "a", status: "published", category: "websites", isFeatured: true }));
    await repo.saveCaseStudy(study({ slug: "b", status: "published", category: "mobile-apps" }));
    expect((await repo.listPublishedCaseStudies({ category: "mobile-apps" })).map((s) => s.slug)).toEqual(["b"]);
    expect((await repo.listPublishedCaseStudies({ featuredOnly: true })).map((s) => s.slug)).toEqual(["a"]);
    expect(await repo.listPublishedCaseStudies({ category: "logo-branding" })).toEqual([]);
  });

  it("lists related studies without the current one or any draft", async () => {
    await repo.saveCaseStudy(study({ slug: "one", status: "published" }));
    await repo.saveCaseStudy(study({ slug: "two", status: "published" }));
    await repo.saveCaseStudy(study({ slug: "hidden", status: "draft" }));
    const related = await repo.listRelatedCaseStudies("one", 3);
    expect(related.map((s) => s.slug)).toEqual(["two"]);
  });
});

describe("case studies: saving", () => {
  it("rejects a slug that is already taken and names it", async () => {
    await repo.saveCaseStudy(study({ slug: "taken", title: "First" }));
    const result = await repo.saveCaseStudy(study({ slug: "taken", title: "Second" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("taken");
      expect(result.error).toContain("First");
      expect(result.field).toBe("slug");
    }
  });

  it("rejects renaming an existing study to a taken slug but allows keeping its own", async () => {
    const a = await repo.saveCaseStudy(study({ slug: "alpha" }));
    await repo.saveCaseStudy(study({ slug: "beta" }));
    if (!a.ok) throw new Error("setup failed");
    const clash = await repo.saveCaseStudy(study({ slug: "beta" }), a.id);
    expect(clash.ok).toBe(false);
    const same = await repo.saveCaseStudy(study({ slug: "alpha", title: "Renamed title" }), a.id);
    expect(same.ok).toBe(true);
  });

  it("returns the previous slug when a published study is renamed", async () => {
    const saved = await repo.saveCaseStudy(study({ slug: "old-slug", status: "published" }));
    if (!saved.ok) throw new Error("setup failed");
    const renamed = await repo.saveCaseStudy(study({ slug: "new-slug", status: "published" }), saved.id);
    expect(renamed.ok && renamed.previousSlug).toBe("old-slug");
    expect(await repo.getPublishedCaseStudy("old-slug")).toBeNull();
    expect(await repo.getPublishedCaseStudy("new-slug")).not.toBeNull();
  });
});

describe("case studies: status and delete", () => {
  it("publishes and unpublishes, removing the study from public views", async () => {
    const saved = await repo.saveCaseStudy(study({ slug: "flip" }));
    if (!saved.ok) throw new Error("setup failed");
    expect(await repo.getPublishedCaseStudy("flip")).toBeNull();

    const published = await repo.setCaseStudyStatus(saved.id, "published");
    expect(published.ok).toBe(true);
    expect((await repo.getPublishedCaseStudy("flip"))?.publishedAt).toBeInstanceOf(Date);

    const unpublished = await repo.setCaseStudyStatus(saved.id, "draft");
    expect(unpublished.ok).toBe(true);
    expect(await repo.getPublishedCaseStudy("flip")).toBeNull();
    expect(await repo.listPublishedCaseStudies()).toEqual([]);
  });

  it("refuses to publish a study that has no card image and says why", async () => {
    const saved = await repo.saveCaseStudy(study({ slug: "no-card", cardImageUrl: "" }));
    if (!saved.ok) throw new Error("setup failed");
    const result = await repo.setCaseStudyStatus(saved.id, "published");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/card image/i);
  });

  it("deletes a study and returns its slug so pages can be refreshed", async () => {
    const saved = await repo.saveCaseStudy(study({ slug: "gone", status: "published" }));
    if (!saved.ok) throw new Error("setup failed");
    const result = await repo.deleteCaseStudy(saved.id);
    expect(result).toEqual({ ok: true, slug: "gone" });
    expect(await repo.getPublishedCaseStudy("gone")).toBeNull();
    expect(await repo.adminGetCaseStudy(saved.id)).toBeNull();
  });

  it("reports a missing study instead of throwing", async () => {
    const result = await repo.deleteCaseStudy("00000000-0000-4000-8000-000000000000");
    expect(result.ok).toBe(false);
  });
});

describe("blog posts", () => {
  it("hides drafts, shows published posts, and refuses a taken slug", async () => {
    await repo.savePost(post({ slug: "draft", status: "draft" }));
    await repo.savePost(post({ slug: "live", status: "published" }));
    expect((await repo.listPublishedPosts()).map((p) => p.slug)).toEqual(["live"]);
    expect(await repo.getPublishedPost("draft")).toBeNull();
    const clash = await repo.savePost(post({ slug: "live", title: "Other" }));
    expect(clash.ok).toBe(false);
  });

  it("refuses to publish a post without body text", async () => {
    const saved = await repo.savePost(post({ slug: "empty", body: "" }));
    if (!saved.ok) throw new Error("setup failed");
    const result = await repo.setPostStatus(saved.id, "published");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/post text/i);
  });

  it("deletes a post", async () => {
    const saved = await repo.savePost(post({ slug: "bye", status: "published" }));
    if (!saved.ok) throw new Error("setup failed");
    expect(await repo.deletePost(saved.id)).toEqual({ ok: true, slug: "bye" });
    expect(await repo.getPublishedPost("bye")).toBeNull();
  });
});

describe("bookings", () => {
  const booking = (overrides: Partial<BookingInput> = {}): BookingInput => ({
    calUid: "uid-1",
    title: "15 Min Meeting",
    eventTitle: "15 Min Meeting",
    startTime: new Date("2026-11-28T10:30:00.000Z"),
    endTime: new Date("2026-11-28T10:45:00.000Z"),
    status: "confirmed",
    attendeeName: "Asha Rao",
    attendeeEmail: "asha@example.com",
    attendeeTimezone: "Asia/Kolkata",
    notes: "",
    meetingUrl: "",
    ...overrides,
  });

  it("lists the latest call first", async () => {
    await repo.upsertBooking(booking({ calUid: "a", startTime: new Date("2026-11-20T10:00:00Z") }));
    await repo.upsertBooking(booking({ calUid: "b", startTime: new Date("2026-12-02T10:00:00Z") }));
    expect((await repo.adminListBookings()).map((b) => b.calUid)).toEqual(["b", "a"]);
  });

  it("updates the same booking when Cal.com sends it again, instead of adding a second row", async () => {
    await repo.upsertBooking(booking());
    await repo.upsertBooking(booking({ status: "cancelled" }));
    const rows = await repo.adminListBookings();
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe("cancelled");
  });

  it("marks the earlier booking as rescheduled when a new time replaces it", async () => {
    await repo.upsertBooking(booking({ calUid: "old" }));
    await repo.upsertBooking(booking({ calUid: "new", startTime: new Date("2026-11-30T10:00:00Z") }), "old");
    const byUid = Object.fromEntries((await repo.adminListBookings()).map((b) => [b.calUid, b.status]));
    expect(byUid).toEqual({ old: "rescheduled", new: "confirmed" });
  });
});

describe("pricing plans", () => {
  const plan = (overrides: Partial<PricingPlanInput> = {}): PricingPlanInput => ({
    name: "Websites",
    description: "Great sites",
    priceLabel: "Starting from",
    price: "$2,999",
    ctaLabel: "Book a 15min call",
    ctaHref: "#book-a-call",
    features: ["Timeline: 2 Weeks"],
    sortOrder: 10,
    status: "published",
    ...overrides,
  });

  it("only returns shown plans to the public site, in position order", async () => {
    await repo.savePricingPlan(plan({ name: "Second", sortOrder: 20 }));
    await repo.savePricingPlan(plan({ name: "First", sortOrder: 10 }));
    await repo.savePricingPlan(plan({ name: "Hidden", sortOrder: 5, status: "draft" }));
    expect((await repo.listPublishedPricingPlans()).map((p) => p.name)).toEqual(["First", "Second"]);
    expect((await repo.adminListPricingPlans()).map((p) => p.name)).toEqual(["Hidden", "First", "Second"]);
  });

  it("edits a plan in place, benefits and button included", async () => {
    const saved = await repo.savePricingPlan(plan());
    if (!saved.ok) throw new Error("setup failed");
    await repo.savePricingPlan(plan({ price: "$3,499", ctaLabel: "Talk to us", features: ["A", "B"] }), saved.id);
    const row = await repo.adminGetPricingPlan(saved.id);
    expect(row).toMatchObject({ price: "$3,499", ctaLabel: "Talk to us", features: ["A", "B"] });
    expect(await repo.adminListPricingPlans()).toHaveLength(1);
  });

  it("can hide, show and delete a plan", async () => {
    const saved = await repo.savePricingPlan(plan());
    if (!saved.ok) throw new Error("setup failed");
    expect(await repo.setPricingPlanStatus(saved.id, "draft")).toEqual({ ok: true });
    expect(await repo.listPublishedPricingPlans()).toHaveLength(0);
    expect(await repo.deletePricingPlan(saved.id)).toEqual({ ok: true });
    expect(await repo.adminGetPricingPlan(saved.id)).toBeNull();
    expect((await repo.deletePricingPlan(saved.id)).ok).toBe(false);
  });
});
