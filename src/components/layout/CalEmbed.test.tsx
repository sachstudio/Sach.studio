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

  it("falls back to the environment link", () => {
    vi.stubEnv("NEXT_PUBLIC_CAL_LINK", "studio/15min");
    render(<CalEmbed />);
    expect(screen.getByTitle("Book a 15-minute call")).toHaveAttribute(
      "src",
      expect.stringContaining("cal.com/studio/15min"),
    );
  });
});
