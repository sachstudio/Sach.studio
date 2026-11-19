import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

const items = [
  { id: "one", question: "First question?", answer: "First answer." },
  { id: "two", question: "Second question?", answer: "Second answer." },
];

describe("Accordion", () => {
  it("opens the first item by default", () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("First answer.")).toBeVisible();
  });

  it("closes the open item when another is opened", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Second question?" }));
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute("aria-expanded", "false");
  });

  it("closes an open item when its own trigger is clicked", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "First question?" }));
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute("aria-expanded", "false");
  });
});
