import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentOverview } from "./ContentOverview";

const byCategory = [
  { slug: "websites" as const, label: "Website & Landing Pages", count: 8 },
  { slug: "mobile-apps" as const, label: "Mobile Apps", count: 0 },
  { slug: "web-apps-dashboard" as const, label: "Web Apps & Dashboard", count: 2 },
  { slug: "logo-branding" as const, label: "Logo & Branding", count: 0 },
];

describe("ContentOverview", () => {
  it("shows the card title, the total and what it covers", () => {
    render(<ContentOverview total={10} byCategory={byCategory} />);
    expect(screen.getByRole("heading", { level: 2, name: "Content overview" })).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("across the four categories")).toBeInTheDocument();
  });

  it("describes the chart in words for people who cannot see it", () => {
    render(<ContentOverview total={10} byCategory={byCategory} />);
    expect(
      screen.getByRole("img", {
        name: "Case studies by category: Website & Landing Pages 8, Mobile Apps 0, Web Apps & Dashboard 2, Logo & Branding 0",
      }),
    ).toBeInTheDocument();
  });

  it("labels each bar with its count and a short category name, keeping the full name in a tooltip", () => {
    render(<ContentOverview total={10} byCategory={byCategory} />);
    expect(screen.getByText("Websites")).toHaveAttribute("title", "Website & Landing Pages");
    expect(screen.getByText("Web apps")).toHaveAttribute("title", "Web Apps & Dashboard");
    expect(screen.getByText("Mobile apps")).toBeInTheDocument();
    expect(screen.getByText("Branding")).toBeInTheDocument();
    expect(screen.getByTestId("bar-count-websites")).toHaveTextContent("8");
    expect(screen.getByTestId("bar-count-web-apps-dashboard")).toHaveTextContent("2");
  });

  it("draws each bar as a share of the axis, so the tallest bar sits at the top gridline", () => {
    render(<ContentOverview total={10} byCategory={byCategory} />);
    // The tallest bar is 8, so the axis tops out at 8.
    expect(screen.getByTestId("bar-websites")).toHaveStyle({ height: "100%" });
    expect(screen.getByTestId("bar-web-apps-dashboard")).toHaveStyle({ height: "25%" });
    expect(screen.getByTestId("bar-mobile-apps")).toHaveStyle({ height: "0%" });
  });

  it("labels the gridlines from 0 to the top of the axis", () => {
    render(<ContentOverview total={10} byCategory={byCategory} />);
    const ticks = screen.getAllByTestId("axis-tick").map((t) => t.textContent);
    expect(ticks).toEqual(["8", "6", "4", "2", "0"]);
  });

  it("still draws the chart frame when there is nothing yet", () => {
    render(<ContentOverview total={0} byCategory={byCategory.map((c) => ({ ...c, count: 0 }))} />);
    expect(screen.getAllByTestId("axis-tick").map((t) => t.textContent)).toEqual(["4", "3", "2", "1", "0"]);
    expect(screen.getByTestId("bar-websites")).toHaveStyle({ height: "0%" });
  });
});
