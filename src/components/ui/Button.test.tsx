import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link when href is given", () => {
    render(<Button variant="primary" href="/contact">Book a 15min call</Button>);
    expect(screen.getByRole("link", { name: "Book a 15min call" })).toHaveAttribute("href", "/contact");
  });

  it("renders a type=button button without href", () => {
    render(<Button variant="outline">View our work</Button>);
    expect(screen.getByRole("button", { name: "View our work" })).toHaveAttribute("type", "button");
  });
});
