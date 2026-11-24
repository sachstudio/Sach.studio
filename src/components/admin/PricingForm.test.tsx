import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({ save: vi.fn(), publish: vi.fn(), unpublish: vi.fn(), del: vi.fn(), replace: vi.fn(), refresh: vi.fn() }));

vi.mock("@/app/admin/actions", () => ({
  savePricingPlanAction: mocks.save,
  publishPricingPlanAction: mocks.publish,
  unpublishPricingPlanAction: mocks.unpublish,
  deletePricingPlanAction: mocks.del,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh, push: vi.fn() }),
  usePathname: () => "/admin/pricing/new",
}));

import { PricingForm } from "./PricingForm";
import { emptyPricingPlan } from "@/lib/admin-forms";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("PricingForm", () => {
  it("starts a new package with the wording the website already uses", () => {
    render(<PricingForm initial={emptyPricingPlan()} />);
    expect(screen.getByLabelText("Words before the price")).toHaveValue("Starting from");
    expect(screen.getByLabelText("Button text")).toHaveValue("Book a 15min call");
    expect(screen.getByLabelText("Button link")).toHaveValue("#book-a-call");
  });

  it("saves everything shown on the card: name, price, button and benefits", async () => {
    mocks.save.mockResolvedValue({ ok: true, message: "Saved", id: "plan-9" });
    render(<PricingForm initial={emptyPricingPlan()} />);
    await userEvent.type(screen.getByLabelText(/Package name/), "SEO Sprint");
    await userEvent.type(screen.getByLabelText(/^Price/), "$1,499");
    await userEvent.clear(screen.getByLabelText("Button text"));
    await userEvent.type(screen.getByLabelText("Button text"), "Talk to us");
    await userEvent.click(screen.getByRole("button", { name: "Add benefit" }));
    await userEvent.type(screen.getByLabelText("Benefits 1"), "Timeline: 2 Weeks");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(mocks.save).toHaveBeenCalled());
    expect(mocks.save.mock.calls[0][0]).toMatchObject({
      name: "SEO Sprint",
      price: "$1,499",
      ctaLabel: "Talk to us",
      features: ["Timeline: 2 Weeks"],
    });
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/pricing/plan-9"));
  });

  it("adds, reorders and removes benefits", async () => {
    render(<PricingForm id="p1" initial={{ ...emptyPricingPlan(), name: "A", price: "$1", features: ["One", "Two"] }} />);
    await userEvent.click(screen.getByRole("button", { name: "Move Benefits 2 up" }));
    expect(screen.getByLabelText("Benefits 1")).toHaveValue("Two");
    await userEvent.click(screen.getByRole("button", { name: "Remove Benefits 1" }));
    expect(screen.getByLabelText("Benefits 1")).toHaveValue("One");
    expect(screen.queryByLabelText("Benefits 2")).toBeNull();
  });

  it("shows a field error from the server under that field", async () => {
    mocks.save.mockResolvedValue({ ok: false, error: "fix", errors: { price: "Add the price, for example $1,999" } });
    render(<PricingForm initial={emptyPricingPlan()} />);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Add the price, for example $1,999")).toBeInTheDocument();
  });

  it("deletes after confirmation and goes back to the list", async () => {
    mocks.del.mockResolvedValue({ ok: true, message: "Deleted" });
    render(<PricingForm id="p1" initial={{ ...emptyPricingPlan(), name: "SEO Sprint", price: "$1" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete package" }));
    await waitFor(() => expect(mocks.del).toHaveBeenCalledWith("p1"));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/admin/pricing"));
  });
});
