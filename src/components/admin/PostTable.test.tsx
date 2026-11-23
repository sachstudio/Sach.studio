import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const nav = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: nav.refresh }) }));

import { PostTable, type PostRow } from "./PostTable";

const row = (n: number, over: Partial<PostRow> = {}): PostRow => ({
  id: `p${n}`,
  title: `Post ${n}`,
  slug: `post-${n}`,
  status: "published",
  isPlaceholder: false,
  coverImageUrl: "",
  edited: "20 Nov 2026",
  editedAt: "2026-11-20T06:00:00.000Z",
  ...over,
});

const rows: PostRow[] = [
  row(1, { title: "Use of AI", slug: "use-of-ai", isPlaceholder: true, coverImageUrl: "/images/blogs/ai.webp" }),
  row(2, { title: "Why design matters", slug: "why-design-matters", status: "draft", edited: "21 Nov 2026", editedAt: "2026-11-21T06:00:00.000Z" }),
];

beforeEach(() => nav.refresh.mockClear());

describe("PostTable", () => {
  describe("page heading", () => {
    it("is titled Blog posts, with a line saying what the page is", () => {
      render(<PostTable rows={rows} />);
      expect(screen.getByRole("heading", { level: 1, name: "Blog posts" })).toBeInTheDocument();
      expect(screen.getByText("The articles shown on your Blogs page")).toBeInTheDocument();
    });

    it("has a New post button in the heading", () => {
      render(<PostTable rows={rows} />);
      expect(screen.getByRole("link", { name: "New post" })).toHaveAttribute("href", "/admin/posts/new");
    });

    it("has a Refresh button that reloads the list", async () => {
      render(<PostTable rows={rows} />);
      await userEvent.click(screen.getByRole("button", { name: "Refresh" }));
      expect(nav.refresh).toHaveBeenCalledTimes(1);
    });
  });

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

  it("shows the cover image as a thumbnail, and a quiet placeholder when there is none", () => {
    render(<PostTable rows={rows} />);
    expect(screen.getByRole("img", { name: "Use of AI cover image" })).toBeInTheDocument();
    expect(screen.getAllByText("No image")).toHaveLength(1);
  });

  it("links each title to its edit page", () => {
    render(<PostTable rows={rows} />);
    expect(screen.getByRole("link", { name: "Use of AI" })).toHaveAttribute("href", "/admin/posts/p1");
  });

  describe("status filter", () => {
    const filter = () => screen.getByRole("combobox", { name: "Filter by status" });

    it("offers All statuses, Published and Draft, each with its count", () => {
      render(<PostTable rows={rows} />);
      expect(within(filter()).getAllByRole("option").map((o) => o.textContent)).toEqual(["All statuses (2)", "Published (1)", "Draft (1)"]);
      expect(filter()).toHaveValue("all");
    });

    it("narrows the table to drafts, or to published posts, and back", async () => {
      render(<PostTable rows={rows} />);
      await userEvent.selectOptions(filter(), "draft");
      expect(screen.getByRole("link", { name: "Why design matters" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Use of AI" })).not.toBeInTheDocument();

      await userEvent.selectOptions(filter(), "published");
      expect(screen.getByRole("link", { name: "Use of AI" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Why design matters" })).not.toBeInTheDocument();

      await userEvent.selectOptions(filter(), "all");
      expect(screen.getByRole("link", { name: "Why design matters" })).toBeInTheDocument();
    });

    it("explains an empty status inside the table frame", async () => {
      render(<PostTable rows={[row(1)]} />);
      await userEvent.selectOptions(filter(), "draft");
      expect(screen.getByText("No draft posts yet.")).toBeInTheDocument();
      expect(screen.getByRole("table", { name: "Blog posts" })).toBeInTheDocument();
    });
  });

  it("starts with the search you made from the top bar", () => {
    render(<PostTable rows={rows} initialQuery="design" />);
    expect(screen.getByRole("searchbox", { name: "Search blog posts" })).toHaveValue("design");
    expect(screen.queryByRole("link", { name: "Use of AI" })).not.toBeInTheDocument();
  });

  it("sorts by title, then reverses on a second click", async () => {
    render(<PostTable rows={rows} />);
    await userEvent.click(screen.getByRole("button", { name: "Title" }));
    expect(screen.getAllByRole("link", { name: /Use of AI|Why design/ }).map((a) => a.textContent)).toEqual(["Use of AI", "Why design matters"]);
    expect(screen.getByRole("columnheader", { name: /Title/ })).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(screen.getByRole("button", { name: "Title" }));
    expect(screen.getAllByRole("link", { name: /Use of AI|Why design/ }).map((a) => a.textContent)).toEqual(["Why design matters", "Use of AI"]);
  });

  it("filters by title or address as you type, and says so when nothing matches", async () => {
    render(<PostTable rows={rows} />);
    const search = screen.getByRole("searchbox", { name: "Search blog posts" });
    await userEvent.type(search, "design");
    expect(screen.getByRole("link", { name: "Why design matters" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Use of AI" })).not.toBeInTheDocument();
    await userEvent.clear(search);
    await userEvent.type(search, "zzz");
    expect(screen.getByText("No posts match “zzz”.")).toBeInTheDocument();
  });

  it("pages through long lists ten at a time", async () => {
    render(<PostTable rows={Array.from({ length: 12 }, (_, i) => row(i + 1))} />);
    expect(screen.getByText("1-10 of 12")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("11-12 of 12")).toBeInTheDocument();
  });

  it("offers Edit for every post and the live page only for published ones", async () => {
    render(<PostTable rows={rows} />);
    await userEvent.click(screen.getByRole("button", { name: "Actions for Use of AI" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute("href", "/admin/posts/p1");
    expect(screen.getByRole("menuitem", { name: "View live page" })).toHaveAttribute("href", "/blogs/use-of-ai");
  });

  it("has no live page link for a draft", async () => {
    render(<PostTable rows={rows} />);
    await userEvent.click(screen.getByRole("button", { name: "Actions for Why design matters" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "View live page" })).not.toBeInTheDocument();
  });

  it("explains an empty list inside the table frame", () => {
    render(<PostTable rows={[]} />);
    expect(screen.getByText("No posts yet. Add the first one with New post.")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Blog posts" })).toBeInTheDocument();
  });
});
