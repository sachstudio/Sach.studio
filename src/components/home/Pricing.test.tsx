import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Pricing } from "./Pricing";

describe("Pricing", () => {
  it("shows the four plans with their starting prices", () => {
    render(<Pricing />);
    const plans = screen.getAllByRole("article");
    expect(plans).toHaveLength(4);
    const prices = plans.map((p) => within(p).getByTestId("price").textContent);
    expect(prices).toEqual(["$1,999", "$2,999", "$3,999", "$3,999"]);
  });

  it("names the plans in design order", () => {
    render(<Pricing />);
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(["Logo & Branding", "Websites & Landing Pages", "Mobile App Design", "Web App & Dashboard UI"]);
  });

  it("gives every plan a booking button that jumps to the booking section", () => {
    render(<Pricing />);
    const buttons = screen.getAllByRole("link", { name: "Book a 15min call" });
    expect(buttons).toHaveLength(4);
    for (const b of buttons) expect(b).toHaveAttribute("href", "#book-a-call");
  });

  it("lists the per-screen rates for the mobile app plan", () => {
    render(<Pricing />);
    expect(screen.getByText("Simple Screens: $150/screen")).toBeInTheDocument();
    expect(screen.getByText("Complex Screens: $250/screen")).toBeInTheDocument();
  });
});
