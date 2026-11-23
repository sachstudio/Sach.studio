import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { RecentItem } from "@/lib/admin-dashboard";
import { RecentTable } from "./RecentTable";

const items: RecentItem[] = [
  { kind: "Blog post", id: "p6", title: "Use of AI", href: "/admin/posts/p6", status: "draft", updatedAt: new Date("2026-11-24T06:00:00Z") },
  { kind: "Case study", id: "s4", title: "Gulf CV Writers", href: "/admin/case-studies/s4", status: "published", updatedAt: new Date("2026-11-20T06:00:00Z") },
];

describe("RecentTable", () => {
  it("is a titled card holding a labelled table", () => {
    render(<RecentTable items={items} />);
    expect(screen.getByRole("heading", { level: 2, name: "Recently edited" })).toBeInTheDocument();
    const table = screen.getByRole("table", { name: "Recently edited" });
    for (const name of ["Title", "Status", "Edited"]) {
      expect(within(table).getByRole("columnheader", { name })).toBeInTheDocument();
    }
    expect(within(table).getAllByRole("row")).toHaveLength(1 + items.length);
  });

  it("shows each item's title and what kind it is, linked to its edit page", () => {
    render(<RecentTable items={items} />);
    expect(screen.getByRole("link", { name: "Use of AI" })).toHaveAttribute("href", "/admin/posts/p6");
    expect(screen.getByRole("link", { name: "Gulf CV Writers" })).toHaveAttribute("href", "/admin/case-studies/s4");
    expect(screen.getByText("Blog post")).toBeInTheDocument();
    expect(screen.getByText("Case study")).toBeInTheDocument();
  });

  it("shows the status and the edit date", () => {
    render(<RecentTable items={items} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("24 Nov 2026")).toBeInTheDocument();
    expect(screen.getByText("20 Nov 2026")).toBeInTheDocument();
  });

  it("explains an empty list inside the table frame", () => {
    render(<RecentTable items={[]} />);
    expect(screen.getByText("Nothing has been edited yet.")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Recently edited" })).toBeInTheDocument();
  });
});
