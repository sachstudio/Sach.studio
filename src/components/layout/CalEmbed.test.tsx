import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalEmbed } from "./CalEmbed";

afterEach(() => vi.unstubAllEnvs());

describe("CalEmbed", () => {
  it("explains the missing setting when no link is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_CAL_LINK", "");
    render(<CalEmbed />);
    expect(screen.getByText(/NEXT_PUBLIC_CAL_LINK/)).toBeInTheDocument();
    expect(screen.queryByTitle("Book a 15-minute call")).toBeNull();
  });

  it("embeds the Cal.com booking page for a given link", () => {
    render(<CalEmbed calLink="sach/15min" />);
    const frame = screen.getByTitle("Book a 15-minute call");
    expect(frame).toHaveAttribute("src", expect.stringContaining("https://cal.com/sach/15min"));
  });

  it("spans the full width of its section so the calendar can use its wide layout", () => {
    render(<CalEmbed calLink="sach/15min" />);
    const frame = screen.getByTitle("Book a 15-minute call");
    expect(frame).toHaveClass("w-full");
    // Inside a flex column an auto-margin box shrinks to its content unless it asks for the full width.
    expect(frame.parentElement).toHaveClass("w-full");
  });

  it("is tall enough on phones and tablets for Cal.com's one-column layout, and shorter once it goes three-column", () => {
    render(<CalEmbed calLink="sach/15min" />);
    const frame = screen.getByTitle("Book a 15-minute call");
    // Narrow: the stacked calendar and time slots need about 1100px, so the page scrolls instead of the frame.
    expect(frame).toHaveClass("h-[1100px]");
    // From 816px wide the frame is at least 768px wide and Cal.com lays out three columns.
    expect(frame).toHaveClass("min-[816px]:h-[680px]");
  });

  it("has no frame of its own around the Cal.com calendar", () => {
    render(<CalEmbed calLink="sach/15min" />);
    const wrapper = screen.getByTitle("Book a 15-minute call").parentElement!;
    expect(wrapper.className).not.toMatch(/border|shadow|bg-|rounded|p-\d/);
  });

  it("falls back to the environment link", () => {
    vi.stubEnv("NEXT_PUBLIC_CAL_LINK", "studio/15min");
    render(<CalEmbed />);
    expect(screen.getByTitle("Book a 15-minute call")).toHaveAttribute(
      "src",
      expect.stringContaining("cal.com/studio/15min"),
    );
  });
});
