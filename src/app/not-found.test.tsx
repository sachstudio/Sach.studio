import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("explains the page is missing and offers a way back", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "This page could not be found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "See our works" })).toHaveAttribute("href", "/works");
  });
});
