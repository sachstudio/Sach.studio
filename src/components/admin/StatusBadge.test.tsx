import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("says Published in the palette's green", () => {
    render(<StatusBadge status="published" />);
    const pill = screen.getByText("Published");
    expect(pill).toHaveClass("bg-chart-2/10", "text-chart-2", "rounded-full");
  });

  it("says Draft in muted grey", () => {
    render(<StatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toHaveClass("bg-muted-foreground/10", "text-muted-foreground", "rounded-full");
  });

  it("adds an amber Needs content pill only when asked", () => {
    const { rerender } = render(<StatusBadge status="published" />);
    expect(screen.queryByText("Needs content")).not.toBeInTheDocument();
    rerender(<StatusBadge status="published" needsContent />);
    expect(screen.getByText("Needs content")).toHaveClass("bg-chart-5/10", "text-chart-5");
  });
});
