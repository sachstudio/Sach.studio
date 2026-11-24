import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/admin/case-studies" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { PageHeader } from "./PageHeader";

function renderHeader(pathname: string) {
  nav.pathname = pathname;
  return render(<PageHeader title="Case studies" />);
}

describe("PageHeader", () => {
  it("shows the page title as a heading", () => {
    renderHeader("/admin/case-studies");
    expect(screen.getByRole("heading", { level: 1, name: "Case studies" })).toBeInTheDocument();
  });

  it("shows a Home / Section trail on a list page, with the current page as plain text", () => {
    renderHeader("/admin/case-studies");
    const trail = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/admin/case-studies");
    expect(within(trail).getByText("Case studies")).toHaveAttribute("aria-current", "page");
    expect(within(trail).getAllByRole("link")).toHaveLength(1);
  });

  it("links back to the list from an edit page", () => {
    renderHeader("/admin/posts/p-1");
    const trail = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(within(trail).getByRole("link", { name: "Blog posts" })).toHaveAttribute("href", "/admin/posts");
    expect(within(trail).getByText("Edit post")).toHaveAttribute("aria-current", "page");
  });

  it("has no back button on a list page", () => {
    renderHeader("/admin/case-studies");
    expect(screen.queryByRole("link", { name: /^Back/ })).toBeNull();
  });

  it("puts a back button before the title on an inner page, going to the list", () => {
    renderHeader("/admin/pricing/new");
    const back = screen.getByRole("link", { name: "Back to Packages" });
    expect(back).toHaveAttribute("href", "/admin/pricing");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(back.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("goes back one step at a time: preview returns to the edit page", () => {
    renderHeader("/admin/case-studies/3f2a/preview");
    expect(screen.getByRole("link", { name: "Back to Edit case study" })).toHaveAttribute("href", "/admin/case-studies/3f2a");
  });

  it("shows the Preview step with a link back to the edit page", () => {
    renderHeader("/admin/case-studies/3f2a/preview");
    const trail = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Edit case study" })).toHaveAttribute("href", "/admin/case-studies/3f2a");
    expect(within(trail).getByText("Preview")).toHaveAttribute("aria-current", "page");
  });
});
