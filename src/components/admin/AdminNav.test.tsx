import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/admin/case-studies" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { AdminNav } from "./AdminNav";

describe("AdminNav", () => {
  it("links to the two admin sections and the public site", () => {
    nav.pathname = "/admin/case-studies";
    render(<AdminNav />);
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute("href", "/admin/case-studies");
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("href", "/admin/posts");
    expect(screen.getByRole("link", { name: "View website" })).toHaveAttribute("href", "/");
  });

  it("marks Case studies as the current page on its list and on its edit pages", () => {
    nav.pathname = "/admin/case-studies/abc-123";
    render(<AdminNav />);
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Blog posts" })).not.toHaveAttribute("aria-current");
  });

  it("marks Blog posts as the current page inside the blog section", () => {
    nav.pathname = "/admin/posts/new";
    render(<AdminNav />);
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Case studies" })).not.toHaveAttribute("aria-current");
  });
});
