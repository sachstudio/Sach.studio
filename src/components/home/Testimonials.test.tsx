import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Testimonials } from "./Testimonials";
import { seedTestimonials } from "@/db/seed-data";

const items = seedTestimonials.map((t, i) => ({ ...t, id: `t-${i}` }));

describe("Testimonials", () => {
  it("shows the first pair and disables the previous button", () => {
    render(<Testimonials items={items} />);
    expect(screen.getByText("Emily Carter")).toBeInTheDocument();
    expect(screen.getByText("Daniel Brooks")).toBeInTheDocument();
    expect(screen.queryByText("Sophia Martinez")).toBeNull();
    expect(screen.getByRole("button", { name: "Previous testimonials" })).toBeDisabled();
  });

  it("advances to the next pair and enables previous", async () => {
    render(<Testimonials items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Next testimonials" }));
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
    expect(screen.queryByText("Emily Carter")).toBeNull();
    expect(screen.getByRole("button", { name: "Previous testimonials" })).toBeEnabled();
  });

  it("disables next on the last pair", async () => {
    render(<Testimonials items={items} />);
    const next = screen.getByRole("button", { name: "Next testimonials" });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(screen.getByText("Arjun Patel")).toBeInTheDocument();
    expect(next).toBeDisabled();
  });

  it("shows whatever the admin has switched on: one client, a photo or initials, and no empty label", () => {
    render(<Testimonials items={[{ id: "x", name: "Priya Shah", role: "", tag: "", quote: "Brilliant.", avatarUrl: "" }]} />);
    expect(screen.getByText("Priya Shah")).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next testimonials" })).toBeDisabled();
  });

  it("shows no section at all when there are none", () => {
    const { container } = render(<Testimonials items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
