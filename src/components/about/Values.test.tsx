import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { about } from "@/content/about";
import { Values } from "./Values";

describe("Values", () => {
  it("shows every value in a labelled swipe row on phones and a grid from md", () => {
    render(<Values />);
    const row = screen.getByRole("region", { name: "What drives Sach Studio, swipe to see more values" });
    const items = within(row).getAllByRole("listitem");
    expect(items.map((li) => within(li).getByRole("heading", { level: 3 }).textContent)).toEqual(about.values.items.map((v) => v.title));
    expect(screen.getAllByRole("button", { name: /^Go to slide [0-9]+ of [0-9]+$/ })).toHaveLength(about.values.items.length);
    expect(screen.getByRole("list").className).toContain("xl:grid-cols-4");
  });
});
