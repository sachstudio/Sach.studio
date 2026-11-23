import { describe, expect, it } from "vitest";
import { buildDashboard, greetingFor, type DashboardPost, type DashboardStudy } from "./admin-dashboard";

const study = (n: number, over: Partial<DashboardStudy> = {}): DashboardStudy => ({
  id: `s${n}`,
  title: `Study ${n}`,
  category: "websites",
  status: "published",
  updatedAt: new Date(`2026-11-${String(10 + n).padStart(2, "0")}T06:00:00Z`),
  ...over,
});
const post = (n: number, over: Partial<DashboardPost> = {}): DashboardPost => ({
  id: `p${n}`,
  title: `Post ${n}`,
  status: "published",
  updatedAt: new Date(`2026-11-${String(10 + n).padStart(2, "0")}T06:00:00Z`),
  ...over,
});

describe("buildDashboard", () => {
  const studies = [
    study(1),
    study(2, { status: "draft" }),
    study(3, { category: "web-apps-dashboard" }),
    study(4, { status: "draft", category: "web-apps-dashboard" }),
  ];
  const posts = [post(5), post(6, { status: "draft" })];

  it("counts case studies and posts, and how many of each are live", () => {
    const d = buildDashboard(studies, posts);
    expect(d.studies).toMatchObject({ total: 4, published: 2, drafts: 2 });
    expect(d.posts).toEqual({ total: 2, published: 1, drafts: 1 });
  });

  it("gives the share of case studies that are live as a rounded percentage", () => {
    expect(buildDashboard(studies, posts).studies.percentPublished).toBe(50);
    expect(buildDashboard([study(1), study(2, { status: "draft" }), study(3, { status: "draft" })], []).studies.percentPublished).toBe(33);
  });

  it("is 0% rather than NaN when there are no case studies", () => {
    expect(buildDashboard([], []).studies.percentPublished).toBe(0);
  });

  it("counts case studies per category, including empty ones, for the chart", () => {
    expect(buildDashboard(studies, posts).byCategory).toEqual([
      { slug: "websites", label: "Website & Landing Pages", count: 2 },
      { slug: "mobile-apps", label: "Mobile Apps", count: 0 },
      { slug: "web-apps-dashboard", label: "Web Apps & Dashboard", count: 2 },
      { slug: "logo-branding", label: "Logo & Branding", count: 0 },
    ]);
  });

  it("lists the most recently edited case studies and posts together, newest first, with their links", () => {
    const recent = buildDashboard(studies, posts).recent;
    expect(recent.map((r) => r.title)).toEqual(["Post 6", "Post 5", "Study 4", "Study 3", "Study 2", "Study 1"]);
    expect(recent[0]).toMatchObject({ kind: "Blog post", href: "/admin/posts/p6", status: "draft" });
    expect(recent[2]).toMatchObject({ kind: "Case study", href: "/admin/case-studies/s4" });
  });

  it("keeps only the seven most recent", () => {
    const many = Array.from({ length: 12 }, (_, i) => study(i + 1));
    expect(buildDashboard(many, []).recent).toHaveLength(7);
    expect(buildDashboard(many, []).recent[0].title).toBe("Study 12");
  });

  it("points at the latest edit for the update banner, and at nothing when the site is empty", () => {
    expect(buildDashboard(studies, posts).latest?.title).toBe("Post 6");
    expect(buildDashboard([], []).latest).toBeNull();
  });

  it("does not change the lists it was given", () => {
    const copy = [...studies];
    buildDashboard(studies, posts);
    expect(studies).toEqual(copy);
  });
});

describe("greetingFor", () => {
  it("greets by the time of day in Indian time", () => {
    expect(greetingFor(new Date("2026-11-24T02:00:00Z"))).toBe("Good morning"); // 07:30 in Bangalore
    expect(greetingFor(new Date("2026-11-24T08:00:00Z"))).toBe("Good afternoon"); // 13:30
    expect(greetingFor(new Date("2026-11-24T13:00:00Z"))).toBe("Good evening"); // 18:30
    expect(greetingFor(new Date("2026-11-24T18:00:00Z"))).toBe("Good night"); // 23:30
    expect(greetingFor(new Date("2026-11-24T21:30:00Z"))).toBe("Good night"); // 03:00
  });
});
