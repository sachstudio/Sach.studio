import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  save: vi.fn(),
  publish: vi.fn(),
  unpublish: vi.fn(),
  del: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/app/admin/actions", () => ({
  savePostAction: mocks.save,
  publishPostAction: mocks.publish,
  unpublishPostAction: mocks.unpublish,
  deletePostAction: mocks.del,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh, push: vi.fn() }),
  usePathname: () => "/admin/posts/new",
}));
vi.mock("@vercel/blob/client", () => ({ upload: vi.fn() }));

import { PostForm } from "./PostForm";
import { emptyPost } from "@/lib/admin-forms";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("PostForm", () => {
  it("fills the slug from the title until it is edited by hand", async () => {
    render(<PostForm initial={emptyPost()} />);
    await userEvent.type(screen.getByLabelText("Title"), "Why Design Matters");
    expect(screen.getByLabelText("URL slug")).toHaveValue("why-design-matters");
  });

  it("shows the reason publishing was refused next to the body and keeps the typed text", async () => {
    mocks.publish.mockResolvedValue({
      ok: false,
      error: "Some fields need attention.",
      errors: { body: "Add the post text before you publish" },
    });
    render(<PostForm initial={emptyPost()} />);
    await userEvent.type(screen.getByLabelText("Title"), "Draft idea");
    await userEvent.click(screen.getByRole("button", { name: "Publish" }));
    expect(await screen.findByText("Add the post text before you publish")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Draft idea");
  });

  it("previews the Markdown as formatted text", async () => {
    render(<PostForm initial={emptyPost()} />);
    await userEvent.type(screen.getByLabelText("Post text (Markdown)"), "## A heading");
    await userEvent.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByRole("heading", { level: 2, name: "A heading" })).toBeInTheDocument();
  });

  it("publishes a complete post and moves to its edit page", async () => {
    mocks.publish.mockResolvedValue({ ok: true, message: "Published", id: "p-1", slug: "why" });
    render(<PostForm initial={{ ...emptyPost(), title: "Why", slug: "why", body: "Text", coverImageUrl: "/a.webp" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Publish" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Published");
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/posts/p-1"));
  });

  it("deletes after confirmation and returns to the blog posts list", async () => {
    mocks.del.mockResolvedValue({ ok: true, message: "Deleted", slug: "why" });
    render(<PostForm id="p-1" initial={{ ...emptyPost(), title: "Why", slug: "why" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete post" }));
    await waitFor(() => expect(mocks.del).toHaveBeenCalledWith("p-1"));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/posts"));
  });
});
