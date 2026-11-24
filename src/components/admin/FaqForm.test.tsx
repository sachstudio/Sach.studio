import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({ save: vi.fn(), publish: vi.fn(), unpublish: vi.fn(), del: vi.fn(), replace: vi.fn(), refresh: vi.fn() }));

vi.mock("@/app/admin/actions", () => ({
  saveFaqAction: mocks.save,
  publishFaqAction: mocks.publish,
  unpublishFaqAction: mocks.unpublish,
  deleteFaqAction: mocks.del,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh, push: vi.fn() }),
  usePathname: () => "/admin/faqs/new",
}));

import { FaqForm } from "./FaqForm";
import { emptyFaq } from "@/lib/admin-forms";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("FaqForm", () => {
  it("starts a new FAQ on the home page", () => {
    render(<FaqForm initial={emptyFaq()} />);
    expect(screen.getByRole("checkbox", { name: "Home page" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Contact page" })).not.toBeChecked();
  });

  it("saves the question, the answer and every page it should show on", async () => {
    mocks.save.mockResolvedValue({ ok: true, message: "Saved", id: "faq-9" });
    render(<FaqForm initial={emptyFaq()} />);
    await userEvent.type(screen.getByLabelText(/^Question/), "Do you work with startups?");
    await userEvent.type(screen.getByLabelText(/^Answer/), "Yes, many of our clients are startups.");
    await userEvent.click(screen.getByRole("checkbox", { name: "Contact page" }));
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(mocks.save).toHaveBeenCalled());
    expect(mocks.save.mock.calls[0][0]).toMatchObject({
      question: "Do you work with startups?",
      answer: "Yes, many of our clients are startups.",
      pages: ["home", "contact"],
    });
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/faqs/faq-9"));
  });

  it("shows a field error from the server under that field", async () => {
    mocks.save.mockResolvedValue({ ok: false, error: "fix", errors: { answer: "Add the answer" } });
    render(<FaqForm initial={emptyFaq()} />);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Add the answer")).toBeInTheDocument();
  });

  it("deletes after confirmation and goes back to the list", async () => {
    mocks.del.mockResolvedValue({ ok: true, message: "Deleted" });
    render(<FaqForm id="f1" initial={{ ...emptyFaq(), question: "Old question", answer: "Old answer" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete FAQ" }));
    await waitFor(() => expect(mocks.del).toHaveBeenCalledWith("f1"));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/faqs"));
  });
});
