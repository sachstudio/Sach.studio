import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { StatCards } from "./StatCards";

const studies = { total: 10, published: 7, drafts: 3, percentPublished: 70 };
const posts = { total: 4, published: 3, drafts: 1 };

describe("StatCards", () => {
  it("shows how many case studies are live, with the share of the total", () => {
    render(<StatCards studies={studies} posts={posts} />);
    const card = screen.getByText("Published case studies").closest("[data-stat]") as HTMLElement;
    expect(within(card).getByText("7")).toBeInTheDocument();
    expect(within(card).getByText("70%")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /See case studies/ })).toHaveAttribute("href", "/admin/case-studies");
  });

  it("shows the drafts that still need review", () => {
    render(<StatCards studies={studies} posts={posts} />);
    const card = screen.getByText("Case study drafts").closest("[data-stat]") as HTMLElement;
    expect(within(card).getByText("3")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /Review drafts/ })).toHaveAttribute("href", "/admin/case-studies");
  });

  it("shows the blog posts and how many of them are live", () => {
    render(<StatCards studies={studies} posts={posts} />);
    const card = screen.getByText("Blog posts").closest("[data-stat]") as HTMLElement;
    expect(within(card).getByText("4")).toBeInTheDocument();
    expect(within(card).getByText("3 live")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /See posts/ })).toHaveAttribute("href", "/admin/posts");
  });

  it("copes with an empty site", () => {
    render(<StatCards studies={{ total: 0, published: 0, drafts: 0, percentPublished: 0 }} posts={{ total: 0, published: 0, drafts: 0 }} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("0 live")).toBeInTheDocument();
  });
});
