import { describe, expect, it } from "vitest";
import { ADMIN_SECTIONS, breadcrumbsFor, DASHBOARD_HREF, isCurrentSection, isDashboard } from "./admin-nav";

describe("isDashboard", () => {
  it("is only the admin home, not the sections under it", () => {
    expect(DASHBOARD_HREF).toBe("/admin");
    expect(isDashboard("/admin")).toBe(true);
    expect(isDashboard("/admin/")).toBe(true);
    expect(isDashboard("/admin/case-studies")).toBe(false);
    expect(isDashboard("/admin/posts/new")).toBe(false);
  });
});

describe("ADMIN_SECTIONS", () => {
  it("lists the two admin sections with their addresses", () => {
    expect(ADMIN_SECTIONS.map((s) => [s.label, s.href])).toEqual([
      ["Case studies", "/admin/case-studies"],
      ["Blog posts", "/admin/posts"],
    ]);
  });
});

describe("isCurrentSection", () => {
  it("matches the section's list and everything under it", () => {
    expect(isCurrentSection("/admin/case-studies", "/admin/case-studies")).toBe(true);
    expect(isCurrentSection("/admin/case-studies/new", "/admin/case-studies")).toBe(true);
    expect(isCurrentSection("/admin/case-studies/abc/preview", "/admin/case-studies")).toBe(true);
  });

  it("does not match a different section or a lookalike prefix", () => {
    expect(isCurrentSection("/admin/posts", "/admin/case-studies")).toBe(false);
    expect(isCurrentSection("/admin/case-studies-archive", "/admin/case-studies")).toBe(false);
  });
});

describe("breadcrumbsFor", () => {
  it("shows just the section on its list page", () => {
    expect(breadcrumbsFor("/admin/case-studies")).toEqual([{ label: "Case studies" }]);
    expect(breadcrumbsFor("/admin/posts")).toEqual([{ label: "Blog posts" }]);
  });

  it("links back to the section from the new and edit pages", () => {
    expect(breadcrumbsFor("/admin/case-studies/new")).toEqual([
      { label: "Case studies", href: "/admin/case-studies" },
      { label: "New case study" },
    ]);
    expect(breadcrumbsFor("/admin/case-studies/3f2a")).toEqual([
      { label: "Case studies", href: "/admin/case-studies" },
      { label: "Edit case study" },
    ]);
    expect(breadcrumbsFor("/admin/posts/new")).toEqual([
      { label: "Blog posts", href: "/admin/posts" },
      { label: "New post" },
    ]);
    expect(breadcrumbsFor("/admin/posts/9c1b")).toEqual([
      { label: "Blog posts", href: "/admin/posts" },
      { label: "Edit post" },
    ]);
  });

  it("adds a Preview step that links back to the edit page", () => {
    expect(breadcrumbsFor("/admin/case-studies/3f2a/preview")).toEqual([
      { label: "Case studies", href: "/admin/case-studies" },
      { label: "Edit case study", href: "/admin/case-studies/3f2a" },
      { label: "Preview" },
    ]);
  });

  it("has nothing to show outside the two sections", () => {
    expect(breadcrumbsFor("/admin")).toEqual([]);
    expect(breadcrumbsFor("/somewhere-else")).toEqual([]);
  });
});
