import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
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
  usePathname: () => "/admin/case-studies/new",
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

  it("names the case study in the delete question and focuses Cancel first", async () => {
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), title: "Acme", slug: "acme" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog", { name: "Delete case study “Acme”?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("deletes after confirmation and returns to the case studies list", async () => {
    mocks.del.mockResolvedValue({ ok: true, message: "Deleted", slug: "acme" });
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), title: "Acme", slug: "acme" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete case study" }));
    await waitFor(() => expect(mocks.del).toHaveBeenCalledWith("id-1"));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/case-studies"));
  });

  it("offers Unpublish only for a published case study", () => {
    const draft = render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), status: "draft" }} />);
    expect(screen.queryByRole("button", { name: "Unpublish" })).toBeNull();
    draft.unmount();
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), status: "published" }} />);
    expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument();
  });

  it("adds a feature image as a square and lets you switch it to a rectangle", async () => {
    mocks.save.mockResolvedValue({ ok: true, message: "Saved", id: "id-1", slug: "acme" });
    render(<CaseStudyForm id="id-1" initial={{ ...emptyCaseStudy(), title: "Acme", slug: "acme" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Add feature image" }));

    const group = screen.getByRole("radiogroup", { name: "Feature images 1 shape" });
    expect(within(group).getByRole("radio", { name: "Square" })).toBeChecked();
    expect(within(group).getByRole("radio", { name: "Rectangle" })).not.toBeChecked();

    await userEvent.type(screen.getByLabelText("Feature images 1"), "/images/a.webp");
    await userEvent.click(within(group).getByRole("radio", { name: "Rectangle" }));
    expect(within(group).getByRole("radio", { name: "Rectangle" })).toBeChecked();

    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
    await waitFor(() => expect(mocks.save).toHaveBeenCalled());
    expect(mocks.save.mock.calls[0][0].featureImages).toEqual([{ url: "/images/a.webp", shape: "rectangle" }]);
  });

  it("limits tags to four", async () => {
    render(<CaseStudyForm initial={emptyCaseStudy()} />);
    await userEvent.type(screen.getByLabelText("Tags"), "a, b, c, d, e");
    expect(screen.getByText("Use at most 4 tags")).toBeInTheDocument();
  });
});
