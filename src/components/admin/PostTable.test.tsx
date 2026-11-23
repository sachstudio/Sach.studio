import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { PostTable, type PostRow } from "./PostTable";

const rows: PostRow[] = [
  { id: "p1", title: "Use of AI", slug: "use-of-ai", status: "published", isPlaceholder: true, edited: "20 Nov 2026" },
  { id: "p2", title: "Why design matters", slug: "why-design-matters", status: "draft", isPlaceholder: false, edited: "21 Nov 2026" },
];

describe("PostTable", () => {
  it("shows one row per post with title, status and edit date", () => {
    render(<PostTable rows={rows} />);
    const table = screen.getByRole("table", { name: "Blog posts" });
    for (const name of ["Title", "Status", "Edited"]) {
      expect(within(table).getByRole("columnheader", { name })).toBeInTheDocument();
    }
    expect(within(table).getAllByRole("row")).toHaveLength(1 + rows.length);
    expect(screen.getByText("/blogs/use-of-ai")).toBeInTheDocument();
    expect(screen.getByText("Needs content")).toBeInTheDocument();
    expect(screen.getByText("21 Nov 2026")).toBeInTheDocument();
  });

  it("links each title to its edit page", () => {
    render(<PostTable rows={rows} />);
    expect(screen.getByRole("link", { name: "Use of AI" })).toHaveAttribute("href", "/admin/posts/p1");
  });

  it("explains an empty list", () => {
    render(<PostTable rows={[]} />);
    expect(screen.getByText("No posts yet. Add the first one with New post.")).toBeInTheDocument();
  });
});
