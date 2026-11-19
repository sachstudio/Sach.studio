import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogList, type PostCardData } from "./BlogList";

const post = (n: number): PostCardData => ({
  slug: `post-${n}`,
  title: `Post ${n}`,
  coverImageUrl: `/images/blogs/${n}.webp`,
  displayDate: "5 Mar 2026",
});

describe("BlogList", () => {
  it("explains when there are no posts yet", () => {
    render(<BlogList posts={[]} />);
    expect(screen.getByText("No posts published yet")).toBeInTheDocument();
  });

  it("links each card to its post with a Read more link", () => {
    render(<BlogList posts={[post(1)]} />);
    expect(screen.getByRole("link", { name: "Read more: Post 1" })).toHaveAttribute("href", "/blogs/post-1");
  });

  it("shows four posts first, then reveals the rest with Load more", async () => {
    render(<BlogList posts={Array.from({ length: 6 }, (_, i) => post(i + 1))} />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    await userEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });
});
