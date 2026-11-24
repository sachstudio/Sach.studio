import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stats } from "./Stats";
import { home } from "@/content/home";

describe("Stats", () => {
  it("shows every figure with its label", () => {
    render(<Stats />);
    for (const s of home.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });

  it("keeps the three figures in one row on phones too, divided by thin vertical lines", () => {
    render(<Stats />);
    const list = screen.getByText(home.stats[0].label).closest("dl")!;
    expect(list).toHaveClass("grid-cols-3", "divide-x");
    // No stacked rows on any width.
    expect(list.className).not.toMatch(/grid-cols-1|divide-y/);
  });

  it("puts each number above its label, centred, with the label wrapping inside its column", () => {
    render(<Stats />);
    const item = screen.getByText(home.stats[0].label).parentElement!;
    expect(item).toHaveClass("flex-col-reverse", "items-center", "text-center");
    expect(item.className).not.toMatch(/flex-row-reverse/);
  });

  it("never sets a label below 14px, and scales the numbers down only on phones", () => {
    render(<Stats />);
    const label = screen.getByText(home.stats[0].label);
    expect(label.className).not.toMatch(/text-xs|text-\[1[0-3]px\]/);
    expect(screen.getByText(home.stats[0].value)).toHaveClass("text-4xl", "sm:text-[56px]");
  });
});
