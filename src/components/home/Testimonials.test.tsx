import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Testimonials } from "./Testimonials";
import { seedTestimonials } from "@/db/seed-data";

const items = seedTestimonials.map((t, i) => ({ ...t, id: `t-${i}` }));

/** Every card is in the page (phones swipe through all of them); from md up only the current pair is shown. */
const onThisPage = (name: string) => !screen.getByText(name).closest("article")!.className.split(" ").includes("md:hidden");

describe("Testimonials", () => {
  it("shows the first pair and disables the previous button", () => {
    render(<Testimonials items={items} />);
    expect(onThisPage("Emily Carter")).toBe(true);
    expect(onThisPage("Daniel Brooks")).toBe(true);
    expect(onThisPage("Sophia Martinez")).toBe(false);
    expect(screen.getByRole("button", { name: "Previous testimonials" })).toBeDisabled();
  });

  it("advances to the next pair and enables previous", async () => {
    render(<Testimonials items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Next testimonials" }));
    expect(onThisPage("Sophia Martinez")).toBe(true);
    expect(onThisPage("Emily Carter")).toBe(false);
    expect(screen.getByRole("button", { name: "Previous testimonials" })).toBeEnabled();
  });

  it("disables next on the last pair", async () => {
    render(<Testimonials items={items} />);
    const next = screen.getByRole("button", { name: "Next testimonials" });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(onThisPage("Arjun Patel")).toBe(true);
    expect(next).toBeDisabled();
  });

  it("shows whatever the admin has switched on: one client, a photo or initials, and no empty label", () => {
    render(<Testimonials items={[{ id: "x", name: "Priya Shah", role: "", tag: "", quote: "Brilliant.", avatarUrl: "" }]} />);
    expect(screen.getByText("Priya Shah")).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next testimonials" })).toBeDisabled();
  });

  it("puts every testimonial in a swipe row for phones, with the arrows hidden there", () => {
    render(<Testimonials items={items} />);
    const row = screen.getByRole("region", { name: "Client testimonials, swipe to see more" });
    expect(within(row).getAllByRole("article")).toHaveLength(items.length);
    expect(within(row).getByText("Arjun Patel")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Go to slide [0-9]+ of [0-9]+$/ })).toHaveLength(items.length);
    expect(screen.getByRole("button", { name: "Next testimonials" }).parentElement!.className).toMatch(/(^| )hidden( .*)? md:flex/);
  });

  it("shows no section at all when there are none", () => {
    const { container } = render(<Testimonials items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
