import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({ save: vi.fn(), publish: vi.fn(), unpublish: vi.fn(), del: vi.fn(), replace: vi.fn(), refresh: vi.fn() }));

vi.mock("@/app/admin/actions", () => ({
  saveTestimonialAction: mocks.save,
  publishTestimonialAction: mocks.publish,
  unpublishTestimonialAction: mocks.unpublish,
  deleteTestimonialAction: mocks.del,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh, push: vi.fn() }),
  usePathname: () => "/admin/testimonials/new",
}));

import { TestimonialForm } from "./TestimonialForm";
import { emptyTestimonial } from "@/lib/admin-forms";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("TestimonialForm", () => {
  it("saves the client, the label and the quote", async () => {
    mocks.save.mockResolvedValue({ ok: true, message: "Saved", id: "t-9" });
    render(<TestimonialForm initial={emptyTestimonial()} />);
    await userEvent.type(screen.getByLabelText(/^Client name/), "Priya Shah");
    await userEvent.type(screen.getByLabelText("Role and company"), "Founder, Fintech");
    await userEvent.type(screen.getByLabelText("Label on the card"), "Web App & Dashboard UI/UX");
    await userEvent.type(screen.getByLabelText(/^Quote/), "Brilliant to work with.");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(mocks.save).toHaveBeenCalled());
    expect(mocks.save.mock.calls[0][0]).toMatchObject({
      name: "Priya Shah",
      role: "Founder, Fintech",
      tag: "Web App & Dashboard UI/UX",
      quote: "Brilliant to work with.",
    });
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/testimonials/t-9"));
  });

  it("explains that an empty photo shows initials", () => {
    render(<TestimonialForm initial={emptyTestimonial()} />);
    expect(screen.getByText(/shows their initials/i)).toBeInTheDocument();
  });

  it("shows a field error from the server under that field", async () => {
    mocks.save.mockResolvedValue({ ok: false, error: "fix", errors: { quote: "Add what the client said" } });
    render(<TestimonialForm initial={emptyTestimonial()} />);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Add what the client said")).toBeInTheDocument();
  });

  it("deletes after confirmation and goes back to the list", async () => {
    mocks.del.mockResolvedValue({ ok: true, message: "Deleted" });
    render(<TestimonialForm id="t1" initial={{ ...emptyTestimonial(), name: "Priya Shah", quote: "Great." }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete testimonial" }));
    await waitFor(() => expect(mocks.del).toHaveBeenCalledWith("t1"));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/testimonials"));
  });
});
