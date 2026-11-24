import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { seedPricingPlans } from "@/db/seed-data";
import { Pricing } from "./Pricing";

const plans = seedPricingPlans.map((p, i) => ({ ...p, id: `plan-${i}` }));

describe("Pricing", () => {
  it("shows a card for every package it is given, with the starting price", () => {
    render(<Pricing plans={plans} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(4);
    const prices = cards.map((p) => within(p).getByTestId("price").textContent);
    expect(prices).toEqual(["$1,999", "$2,999", "$3,999", "$3,999"]);
    expect(screen.getAllByText("Starting from")).toHaveLength(4);
  });

  it("names the packages in the order given", () => {
    render(<Pricing plans={plans} />);
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(["Logo & Branding", "Websites & Landing Pages", "Mobile App Design", "Web App & Dashboard UI"]);
  });

  it("gives every package its own button, text and link", () => {
    render(
      <Pricing
        plans={[
          { ...plans[0], ctaLabel: "Talk to us", ctaHref: "/contact" },
          { ...plans[1], ctaLabel: "Get a quote", ctaHref: "https://cal.com/sach/30min" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Talk to us" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "Get a quote" })).toHaveAttribute("href", "https://cal.com/sach/30min");
  });

  it("uses the price words and benefits the admin set", () => {
    render(<Pricing plans={[{ ...plans[2], priceLabel: "From", features: ["Simple Screens: $150/screen", "Complex Screens: $250/screen"] }]} />);
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("Simple Screens: $150/screen")).toBeInTheDocument();
    expect(screen.getByText("Complex Screens: $250/screen")).toBeInTheDocument();
  });

  it("keeps the section heading but shows no cards when every package is hidden", () => {
    render(<Pricing plans={[]} />);
    expect(screen.getByRole("heading", { name: "Flexible Pricing Plan" })).toBeInTheDocument();
    expect(screen.queryByRole("article")).toBeNull();
  });

  it("lets phones swipe through the packages, one card per slide, and keeps the grid from lg", () => {
    render(<Pricing plans={plans} />);
    const row = screen.getByRole("region", { name: "Pricing packages, swipe to see more" });
    expect(within(row).getAllByRole("article")).toHaveLength(4);
    expect(within(row).getAllByRole("article")[0].className).toContain("snap-start");
    expect(screen.getAllByRole("button", { name: /^Go to slide [0-9] of 4$/ })).toHaveLength(4);
    expect(screen.getAllByRole("article")[0].parentElement!.className).toContain("lg:grid-cols-2");
  });

  it("only applies the description minimum height from lg", () => {
    render(<Pricing plans={plans} />);
    const description = screen.getByText(plans[0].description);
    expect(description.className).toContain("lg:min-h-[3.5rem]");
    expect(description.className).not.toMatch(/(^| )min-h-/);
  });
});
