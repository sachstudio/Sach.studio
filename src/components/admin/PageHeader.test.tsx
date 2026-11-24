import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/admin/case-studies" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { PageHeader } from "./PageHeader";

function renderHeader(pathname: string, subtitle?: string) {
  nav.pathname = pathname;
  return render(<PageHeader title="Edit post" subtitle={subtitle} />);
}

describe("PageHeader (inner pages)", () => {
  it("uses the same heading as the list pages: title with a line of help under it, no card or trail", () => {
    renderHeader("/admin/posts/p-1", "An article on your blog");
    expect(screen.getByRole("heading", { level: 1, name: "Edit post" })).toBeInTheDocument();
    expect(screen.getByText("An article on your blog")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "breadcrumb" })).toBeNull();
  });

  it("puts a back button before the title that goes to the list", () => {
    renderHeader("/admin/pricing/new");
    const back = screen.getByRole("link", { name: "Back to Packages" });
    expect(back).toHaveAttribute("href", "/admin/pricing");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(back.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("goes back from an edit page to its list", () => {
    renderHeader("/admin/posts/p-1");
    expect(screen.getByRole("link", { name: "Back to Blog posts" })).toHaveAttribute("href", "/admin/posts");
  });

  it("goes back one step at a time: preview returns to the edit page", () => {
    renderHeader("/admin/case-studies/3f2a/preview");
    expect(screen.getByRole("link", { name: "Back to Edit case study" })).toHaveAttribute("href", "/admin/case-studies/3f2a");
  });
});
