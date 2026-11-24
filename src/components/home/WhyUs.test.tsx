import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { home } from "@/content/home";
import { WhyUs } from "./WhyUs";

describe("WhyUs", () => {
  it("puts all five cards in one swipe row on phones", () => {
    render(<WhyUs />);
    const row = screen.getByRole("region", { name: "Why work with us, swipe to see more reasons" });
    const titles = within(row).getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    const { conversion, integrations, team, standOut, tools } = home.whyUs.cards;
    expect(titles).toEqual([conversion.title, integrations.title, team.title, standOut.title, tools.title]);
    expect(screen.getAllByRole("button", { name: /^Go to slide [0-9] of 5$/ })).toHaveLength(5);
  });

  it("keeps the old two rows from md: 3+3, then 2+2 with the last card full width, or 2+2+2 from lg", () => {
    render(<WhyUs />);
    const cards = screen.getAllByRole("article");
    expect(cards[0].parentElement!.className).toContain("md:grid-cols-6");
    expect(cards.map((c) => c.className.split(" ").filter((k) => /^(md|lg):col-span/.test(k)).join(" "))).toEqual([
      "md:col-span-3",
      "md:col-span-3",
      "md:col-span-3 lg:col-span-2",
      "md:col-span-3 lg:col-span-2",
      "md:col-span-6 lg:col-span-2",
    ]);
  });
});
