import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TotalContent } from "./TotalContent";

describe("TotalContent", () => {
  const studies = { total: 10, published: 7, drafts: 3 };
  const posts = { total: 4, published: 3, drafts: 1 };

  it("has a titled card", () => {
    render(<TotalContent studies={studies} posts={posts} />);
    expect(screen.getByRole("heading", { level: 2, name: "Total content" })).toBeInTheDocument();
  });

  it("shows four tiles: case studies, blog posts, published and drafts", () => {
    render(<TotalContent studies={studies} posts={posts} />);
    const tile = (label: string) => screen.getByText(label).closest("[data-tile]") as HTMLElement;
    expect(within(tile("Case studies")).getByText("10")).toBeInTheDocument();
    expect(within(tile("Blog posts")).getByText("4")).toBeInTheDocument();
    expect(within(tile("Published")).getByText("10")).toBeInTheDocument(); // 7 + 3 live across both
    expect(within(tile("Drafts")).getByText("4")).toBeInTheDocument(); // 3 + 1 waiting
  });

  it("shows zeros on an empty site", () => {
    render(<TotalContent studies={{ total: 0, published: 0, drafts: 0 }} posts={{ total: 0, published: 0, drafts: 0 }} />);
    expect(screen.getAllByText("0")).toHaveLength(4);
  });
});
