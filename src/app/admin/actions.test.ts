// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidateContent: vi.fn(),
  repo: {
    saveCaseStudy: vi.fn(),
    setCaseStudyStatus: vi.fn(),
    deleteCaseStudy: vi.fn(),
    savePost: vi.fn(),
    setPostStatus: vi.fn(),
    deletePost: vi.fn(),
    savePricingPlan: vi.fn(),
    setPricingPlanStatus: vi.fn(),
    deletePricingPlan: vi.fn(),
    saveFaq: vi.fn(),
    setFaqStatus: vi.fn(),
    deleteFaq: vi.fn(),
    saveTestimonial: vi.fn(),
    setTestimonialStatus: vi.fn(),
    deleteTestimonial: vi.fn(),
  },
}));

vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/revalidate", () => ({ revalidateContent: mocks.revalidateContent }));
vi.mock("@/db", () => ({ getRepo: async () => mocks.repo }));

import {
  deleteCaseStudyAction,
  deletePostAction,
  deleteFaqAction,
  deletePricingPlanAction,
  deleteTestimonialAction,
  publishFaqAction,
  publishTestimonialAction,
  saveFaqAction,
  saveTestimonialAction,
  unpublishFaqAction,
  unpublishTestimonialAction,
  publishPricingPlanAction,
  savePricingPlanAction,
  unpublishPricingPlanAction,
  publishCaseStudyAction,
  publishPostAction,
  saveCaseStudyAction,
  unpublishCaseStudyAction,
} from "./actions";

const validStudy = {
  slug: "acme",
  title: "Acme",
  category: "websites",
  cardImageUrl: "/images/projects/acme.webp",
  summary: "Summary",
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.requireAdmin.mockResolvedValue({ userId: "u", email: "owner@sach.studio" });
});

describe("admin actions: authorisation", () => {
  it("refuse a non-admin without touching the database or the cache", async () => {
    mocks.requireAdmin.mockRejectedValue(
      Object.assign(new Error("Not authorised"), { name: "AdminAuthError", kind: "forbidden" }),
    );
    const results = await Promise.all([
      saveCaseStudyAction(validStudy),
      publishCaseStudyAction(validStudy),
      unpublishCaseStudyAction("id-1"),
      deleteCaseStudyAction("id-1"),
      publishPostAction({ slug: "p", title: "P", body: "x", coverImageUrl: "/a.webp" }),
      deletePostAction("id-2"),
      savePricingPlanAction({ name: "A", price: "$1" }),
      publishPricingPlanAction({ name: "A", price: "$1" }),
      unpublishPricingPlanAction("id-3"),
      deletePricingPlanAction("id-3"),
      saveFaqAction({ question: "Q", answer: "A" }),
      publishFaqAction({ question: "Q", answer: "A" }),
      unpublishFaqAction("id-4"),
      deleteFaqAction("id-4"),
      saveTestimonialAction({ name: "N", quote: "Q" }),
      publishTestimonialAction({ name: "N", quote: "Q" }),
      unpublishTestimonialAction("id-5"),
      deleteTestimonialAction("id-5"),
    ]);
    for (const r of results) expect(r).toEqual({ ok: false, error: "Not authorised" });
    for (const fn of Object.values(mocks.repo)) expect(fn).not.toHaveBeenCalled();
    expect(mocks.revalidateContent).not.toHaveBeenCalled();
  });
});

describe("admin actions: case studies", () => {
  it("returns field errors for invalid input without saving", async () => {
    const result = await saveCaseStudyAction({ ...validStudy, slug: "Bad Slug" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors?.slug).toMatch(/lowercase/i);
    expect(mocks.repo.saveCaseStudy).not.toHaveBeenCalled();
  });

  it("saves, says Saved and refreshes the list, item and old slug tags", async () => {
    mocks.repo.saveCaseStudy.mockResolvedValue({ ok: true, id: "id-1", slug: "acme", previousSlug: "old-acme" });
    const result = await saveCaseStudyAction(validStudy, "id-1");
    expect(result).toEqual({ ok: true, message: "Saved", id: "id-1", slug: "acme" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["case-studies", "case-study:acme", "case-study:old-acme"]);
  });

  it("publishes as one step: validates as published, saves, says Published", async () => {
    mocks.repo.saveCaseStudy.mockResolvedValue({ ok: true, id: "id-1", slug: "acme" });
    const result = await publishCaseStudyAction(validStudy, "id-1");
    expect(result).toEqual({ ok: true, message: "Published", id: "id-1", slug: "acme" });
    expect(mocks.repo.saveCaseStudy.mock.calls[0][0].status).toBe("published");
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["case-studies", "case-study:acme"]);
  });

  it("refuses to publish without a card image and explains why", async () => {
    const result = await publishCaseStudyAction({ ...validStudy, cardImageUrl: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors?.cardImageUrl).toMatch(/before you publish/i);
    expect(mocks.repo.saveCaseStudy).not.toHaveBeenCalled();
  });

  it("passes a slug clash back to the form with the slug field marked", async () => {
    const message = 'The slug "acme" is already used by "Other". Choose a different slug.';
    mocks.repo.saveCaseStudy.mockResolvedValue({ ok: false, error: message, field: "slug" });
    const result = await saveCaseStudyAction(validStudy);
    expect(result).toEqual({ ok: false, error: message, errors: { slug: message } });
    expect(mocks.revalidateContent).not.toHaveBeenCalled();
  });

  it("unpublishes and refreshes the public pages", async () => {
    mocks.repo.setCaseStudyStatus.mockResolvedValue({ ok: true, slug: "acme" });
    const result = await unpublishCaseStudyAction("id-1");
    expect(result).toEqual({ ok: true, message: "Unpublished", slug: "acme" });
    expect(mocks.repo.setCaseStudyStatus).toHaveBeenCalledWith("id-1", "draft");
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["case-studies", "case-study:acme"]);
  });

  it("deletes and refreshes the public pages", async () => {
    mocks.repo.deleteCaseStudy.mockResolvedValue({ ok: true, slug: "acme" });
    const result = await deleteCaseStudyAction("id-1");
    expect(result).toEqual({ ok: true, message: "Deleted", slug: "acme" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["case-studies", "case-study:acme"]);
  });

  it("reports a repository failure without refreshing anything", async () => {
    mocks.repo.deleteCaseStudy.mockResolvedValue({ ok: false, error: "This case study no longer exists." });
    const result = await deleteCaseStudyAction("gone");
    expect(result).toEqual({ ok: false, error: "This case study no longer exists." });
    expect(mocks.revalidateContent).not.toHaveBeenCalled();
  });

  it("turns an unexpected error into a readable message instead of throwing", async () => {
    mocks.repo.saveCaseStudy.mockRejectedValue(new Error("connection reset"));
    const result = await saveCaseStudyAction(validStudy);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/could not save/i);
  });
});

describe("admin actions: posts", () => {
  const post = { slug: "why-design", title: "Why Design", body: "Text", coverImageUrl: "/images/blogs/a.webp" };

  it("publishes a post and refreshes the posts tags", async () => {
    mocks.repo.savePost.mockResolvedValue({ ok: true, id: "p1", slug: "why-design" });
    const result = await publishPostAction(post);
    expect(result).toEqual({ ok: true, message: "Published", id: "p1", slug: "why-design" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["posts", "post:why-design"]);
  });

  it("deletes a post", async () => {
    mocks.repo.deletePost.mockResolvedValue({ ok: true, slug: "why-design" });
    const result = await deletePostAction("p1");
    expect(result).toEqual({ ok: true, message: "Deleted", slug: "why-design" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["posts", "post:why-design"]);
  });
});

describe("admin actions: pricing packages", () => {
  it("rejects a package without a price and shows the error on that field", async () => {
    const result = await savePricingPlanAction({ name: "Websites", price: "" });
    expect(result).toMatchObject({ ok: false, errors: { price: expect.any(String) } });
    expect(mocks.repo.savePricingPlan).not.toHaveBeenCalled();
  });

  it("saves a package and refreshes the pricing section of the website", async () => {
    mocks.repo.savePricingPlan.mockResolvedValue({ ok: true, id: "plan-1", slug: "Websites" });
    const result = await savePricingPlanAction({ name: "Websites", price: "$2,999" });
    expect(result).toEqual({ ok: true, message: "Saved", id: "plan-1" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["pricing"]);
  });

  it("publishing shows the package on the website", async () => {
    mocks.repo.savePricingPlan.mockResolvedValue({ ok: true, id: "plan-1", slug: "Websites" });
    await publishPricingPlanAction({ name: "Websites", price: "$2,999", status: "draft" }, "plan-1");
    expect(mocks.repo.savePricingPlan.mock.calls[0][0]).toMatchObject({ status: "published" });
  });

  it("hides and deletes a package, refreshing the website each time", async () => {
    mocks.repo.setPricingPlanStatus.mockResolvedValue({ ok: true });
    mocks.repo.deletePricingPlan.mockResolvedValue({ ok: true });
    expect(await unpublishPricingPlanAction("plan-1")).toEqual({ ok: true, message: "Unpublished" });
    expect(await deletePricingPlanAction("plan-1")).toEqual({ ok: true, message: "Deleted" });
    expect(mocks.revalidateContent).toHaveBeenCalledTimes(2);
  });
});

describe("admin actions: FAQs", () => {
  it("rejects a FAQ with no answer or no page, and shows the error on that field", async () => {
    expect(await saveFaqAction({ question: "Q", answer: "" })).toMatchObject({ ok: false, errors: { answer: expect.any(String) } });
    expect(await saveFaqAction({ question: "Q", answer: "A", pages: [] })).toMatchObject({ ok: false, errors: { pages: expect.any(String) } });
    expect(mocks.repo.saveFaq).not.toHaveBeenCalled();
  });

  it("saves a FAQ and refreshes the FAQ lists of the website", async () => {
    mocks.repo.saveFaq.mockResolvedValue({ ok: true, id: "faq-1", slug: "Q" });
    expect(await saveFaqAction({ question: "Q", answer: "A" })).toEqual({ ok: true, message: "Saved", id: "faq-1" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["faqs"]);
  });

  it("publishing shows the FAQ on the website", async () => {
    mocks.repo.saveFaq.mockResolvedValue({ ok: true, id: "faq-1", slug: "Q" });
    await publishFaqAction({ question: "Q", answer: "A", status: "draft" }, "faq-1");
    expect(mocks.repo.saveFaq.mock.calls[0][0]).toMatchObject({ status: "published" });
  });

  it("hides and deletes a FAQ, refreshing the website each time", async () => {
    mocks.repo.setFaqStatus.mockResolvedValue({ ok: true });
    mocks.repo.deleteFaq.mockResolvedValue({ ok: true });
    expect(await unpublishFaqAction("faq-1")).toEqual({ ok: true, message: "Unpublished" });
    expect(await deleteFaqAction("faq-1")).toEqual({ ok: true, message: "Deleted" });
    expect(mocks.revalidateContent).toHaveBeenCalledTimes(2);
  });
});

describe("admin actions: testimonials", () => {
  it("rejects a testimonial without a quote and shows the error on that field", async () => {
    expect(await saveTestimonialAction({ name: "Emily", quote: "" })).toMatchObject({ ok: false, errors: { quote: expect.any(String) } });
    expect(mocks.repo.saveTestimonial).not.toHaveBeenCalled();
  });

  it("saves a testimonial and refreshes the testimonials section of the website", async () => {
    mocks.repo.saveTestimonial.mockResolvedValue({ ok: true, id: "t-1", slug: "Emily" });
    expect(await saveTestimonialAction({ name: "Emily", quote: "Great." })).toEqual({ ok: true, message: "Saved", id: "t-1" });
    expect(mocks.revalidateContent).toHaveBeenCalledWith(["testimonials"]);
  });

  it("publishing shows the testimonial on the website", async () => {
    mocks.repo.saveTestimonial.mockResolvedValue({ ok: true, id: "t-1", slug: "Emily" });
    await publishTestimonialAction({ name: "Emily", quote: "Great.", status: "draft" }, "t-1");
    expect(mocks.repo.saveTestimonial.mock.calls[0][0]).toMatchObject({ status: "published" });
  });

  it("hides and deletes a testimonial, refreshing the website each time", async () => {
    mocks.repo.setTestimonialStatus.mockResolvedValue({ ok: true });
    mocks.repo.deleteTestimonial.mockResolvedValue({ ok: true });
    expect(await unpublishTestimonialAction("t-1")).toEqual({ ok: true, message: "Unpublished" });
    expect(await deleteTestimonialAction("t-1")).toEqual({ ok: true, message: "Deleted" });
    expect(mocks.revalidateContent).toHaveBeenCalledTimes(2);
  });
});
