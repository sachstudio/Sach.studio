import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/admin/case-studies" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { SidebarProvider } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

function renderSidebar(pathname: string, props: { published?: number; total?: number } = {}) {
  nav.pathname = pathname;
  return render(
    <SidebarProvider>
      <AppSidebar published={props.published ?? 0} total={props.total ?? 0} />
    </SidebarProvider>,
  );
}

describe("AppSidebar", () => {
  it("puts the dashboard first, under its own Dashboard label", () => {
    renderSidebar("/admin");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/admin");
    const links = screen.getAllByRole("link").map((a) => a.textContent);
    expect(links.indexOf("Overview")).toBeLessThan(links.indexOf("Case studies"));
  });

  it("marks Overview as current on the admin home only", () => {
    renderSidebar("/admin");
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Case studies" })).not.toHaveAttribute("aria-current");
  });

  it("does not mark Overview as current inside a section", () => {
    renderSidebar("/admin/posts");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
  });

  it("groups the two admin sections under a Content label", () => {
    renderSidebar("/admin/case-studies");
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute("href", "/admin/case-studies");
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("href", "/admin/posts");
  });

  it("links out to the public site in a new tab", () => {
    renderSidebar("/admin/case-studies");
    const site = screen.getByRole("link", { name: /View website/ });
    expect(site).toHaveAttribute("href", "/");
    expect(site).toHaveAttribute("target", "_blank");
  });

  it("marks the current section, including on its edit pages", () => {
    renderSidebar("/admin/case-studies/abc-123");
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Blog posts" })).not.toHaveAttribute("aria-current");
  });

  it("marks Blog posts inside the blog section", () => {
    renderSidebar("/admin/posts/new");
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Case studies" })).not.toHaveAttribute("aria-current");
  });

  it("shows the studio logo as the way home, with an Admin tag", () => {
    renderSidebar("/admin/posts");
    expect(screen.getByRole("link", { name: "Sach Studio admin home" })).toHaveAttribute("href", "/admin/case-studies");
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  describe("published card", () => {
    it("shows how much of the content is live, as a percentage and a count", () => {
      renderSidebar("/admin/case-studies", { published: 7, total: 10 });
      expect(screen.getByText("70%")).toBeInTheDocument();
      expect(screen.getByText("7 of 10 case studies are live")).toBeInTheDocument();
      expect(screen.getByRole("progressbar", { name: "Case studies published" })).toHaveAttribute("aria-valuenow", "70");
    });

    it("rounds the percentage", () => {
      renderSidebar("/admin/case-studies", { published: 1, total: 3 });
      expect(screen.getByText("33%")).toBeInTheDocument();
    });

    it("shows 0% instead of dividing by zero when there are no case studies", () => {
      renderSidebar("/admin/case-studies", { published: 0, total: 0 });
      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("0 of 0 case studies are live")).toBeInTheDocument();
    });

    it("offers a way to add the next case study", () => {
      renderSidebar("/admin/case-studies", { published: 1, total: 2 });
      expect(screen.getByRole("link", { name: "New case study" })).toHaveAttribute("href", "/admin/case-studies/new");
    });
  });
});
