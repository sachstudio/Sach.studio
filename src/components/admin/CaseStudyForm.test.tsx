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
  saveCaseStudyAction: mocks.save,
  publishCaseStudyAction: mocks.publish,
  unpublishCaseStudyAction: mocks.unpublish,
  deleteCaseStudyAction: mocks.del,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh, push: vi.fn() }),
}));
vi.mock("@vercel/blob/client", () => ({ upload: vi.fn() }));

import { CaseStudyForm } from "./CaseStudyForm";
import { emptyCaseStudy } from "@/lib/admin-forms";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("CaseStudyForm", () => {
  it("fills the slug from the title until the slug is edited by hand", async () => {
    render(<CaseStudyForm initial={emptyCaseStudy()} />);
    await userEvent.type(screen.getByLabelText("Title"), "Acme: Website Redesign");
    expect(screen.getByLabelText("URL slug")).toHaveValue("acme-website-redesign");

    await userEvent.clear(screen.getByLabelText("URL slug"));
    await userEvent.type(screen.getByLabelText("URL slug"), "my-own-slug");
    await userEvent.type(screen.getByLabelText("Title"), " 2");
    expect(screen.getByLabelText("URL slug")).toHaveValue("my-own-slug");
  });

  it("shows a slug clash under the slug field and keeps everything the user typed", async () => {
    const message = 'The slug "acme" is already used by "Other". Choose a different slug.';
    mocks.save.mockResolvedValue({ ok: false, error: message, errors: { slug: message } });
    render(<CaseStudyForm initial={emptyCaseStudy()} />);
    await userEvent.type(screen.getByLabelText("Title"), "Acme");
    await userEvent.type(screen.getByLabelText("About the client or project"), "Some long about text");
    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByText(message, { selector: "p" })).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Acme");
    expect(screen.getByLabelText("About the client or project")).toHaveValue("Some long about text");
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("publishes with the whole form and confirms with the word Published", async () => {
    mocks.publish.mockResolvedValue({ ok: true, message: "Published", id: "id-9", slug: "acme" });
    render(<CaseStudyForm initial={{ ...emptyCaseStudy(), title: "Acme", slug: "acme", cardImageUrl: "/a.webp", summary: "S" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(mocks.publish).toHaveBeenCalled());
    expect(mocks.publish.mock.calls[0][0]).toMatchObject({ title: "Acme", slug: "acme", category: "websites" });
    expect(await screen.findByRole("status")).toHaveTextContent("Published");
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/case-studies/id-9"));
  });

  it("asks for confirmation before deleting and keeps the case study on Cancel", async () => {
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), title: "Acme", slug: "acme" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toHaveTextContent(/cannot be undone/i);
    expect(mocks.del).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("deletes after confirmation and returns to the dashboard", async () => {
    mocks.del.mockResolvedValue({ ok: true, message: "Deleted", slug: "acme" });
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), title: "Acme", slug: "acme" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete case study" }));
    await waitFor(() => expect(mocks.del).toHaveBeenCalledWith("id-1"));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin"));
  });

  it("offers Unpublish only for a published case study", () => {
    const draft = render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), status: "draft" }} />);
    expect(screen.queryByRole("button", { name: "Unpublish" })).toBeNull();
    draft.unmount();
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), status: "published" }} />);
    expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument();
  });

  it("limits tags to four", async () => {
    render(<CaseStudyForm initial={emptyCaseStudy()} />);
    await userEvent.type(screen.getByLabelText("Tags"), "a, b, c, d, e");
    expect(screen.getByText("Use at most 4 tags")).toBeInTheDocument();
  });
});
