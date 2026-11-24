import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { home } from "@/content/home";
import { Process } from "./Process";

describe("Process", () => {
  it("lists every step in order inside a labelled swipe row for phones", () => {
    render(<Process />);
    const row = screen.getByRole("region", { name: "Our process, swipe to see more steps" });
    const steps = within(row).getAllByRole("listitem");
    expect(steps).toHaveLength(home.process.steps.length);
    expect(steps.map((li) => within(li).getByRole("heading", { level: 3 }).textContent)).toEqual(home.process.steps.map((s) => s.title));
    expect(screen.getAllByRole("button", { name: /^Go to slide [0-9]+ of [0-9]+$/ })).toHaveLength(home.process.steps.length);
  });

  it("keeps three columns from lg", () => {
    render(<Process />);
    expect(screen.getByRole("list").className).toContain("lg:grid-cols-3");
  });
});
