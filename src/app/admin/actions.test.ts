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
  },
}));

vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/revalidate", () => ({ revalidateContent: mocks.revalidateContent }));
vi.mock("@/db", () => ({ getRepo: async () => mocks.repo }));

import {
  deleteCaseStudyAction,
  deletePostAction,
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
