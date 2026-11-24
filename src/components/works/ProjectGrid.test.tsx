import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectGrid } from "./ProjectGrid";
import type { ProjectCardData } from "@/lib/projects";

function project(n: number, category: ProjectCardData["category"] = "websites"): ProjectCardData {
  return {
    slug: `project-${n}`,
    title: `Project ${n}`,
    summary: `Summary ${n}`,
    category,
    cardImageUrl: `/images/projects/p${n}.webp`,
    statusLabel: null,
    displayDate: "10 Feb 2025",
    figmaUrl: "",
    hasDetail: true,
  };
}

describe("ProjectGrid", () => {
  it("shows the four category tabs with the first category selected by default", () => {
    render(<ProjectGrid projects={[project(1)]} />);
    const tabs = screen.getAllByRole("tab").map((t) => t.textContent);
    expect(tabs).toEqual(["Website & Landing Pages", "Mobile Apps", "Web Apps & Dashboard", "Logo & Branding"]);
    expect(screen.getByRole("tab", { name: "Website & Landing Pages" })).toHaveAttribute("aria-selected", "true");
  });

  it("filters to the clicked category", async () => {
    const projects = [project(1, "websites"), project(2, "web-apps-dashboard")];
    render(<ProjectGrid projects={projects} />);
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.queryByText("Project 2")).toBeNull();
    await userEvent.click(screen.getByRole("tab", { name: "Web Apps & Dashboard" }));
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.queryByText("Project 1")).toBeNull();
  });

  it("starts on the requested category", () => {
    render(<ProjectGrid projects={[project(1, "websites"), project(2, "mobile-apps")]} initialCategory="mobile-apps" />);
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.queryByText("Project 1")).toBeNull();
  });

  it("explains an empty category instead of showing a blank grid", async () => {
    render(<ProjectGrid projects={[project(1, "websites")]} />);
    await userEvent.click(screen.getByRole("tab", { name: "Logo & Branding" }));
    expect(screen.getByText("No projects in this category yet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("explains an empty site when nothing is published at all", () => {
    render(<ProjectGrid projects={[]} />);
    expect(screen.getByText("No projects in this category yet")).toBeInTheDocument();
  });

  it("reveals more projects with Load more, then hides the button", async () => {
    const projects = Array.from({ length: 6 }, (_, i) => project(i + 1));
    render(<ProjectGrid projects={projects} pageSize={4} />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    await userEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("resets the visible count when the category changes", async () => {
    const projects = [...Array.from({ length: 6 }, (_, i) => project(i + 1)), project(7, "mobile-apps")];
    render(<ProjectGrid projects={projects} pageSize={4} />);
    await userEvent.click(screen.getByRole("button", { name: "Load more" }));
    await userEvent.click(screen.getByRole("tab", { name: "Mobile Apps" }));
    await userEvent.click(screen.getByRole("tab", { name: "Website & Landing Pages" }));
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("links to the case study only when the project has one, and to Figma only when it has a URL", () => {
    const withDetail = { ...project(1), figmaUrl: "https://figma.com/design/x" };
    const without = { ...project(2), hasDetail: false };
    render(<ProjectGrid projects={[withDetail, without]} />);
    const [first, second] = screen.getAllByRole("article");
    expect(within(first).getByRole("link", { name: "Case study" })).toHaveAttribute("href", "/works/project-1");
    expect(within(first).getByRole("link", { name: "Explore project" })).toHaveAttribute("href", "https://figma.com/design/x");
    expect(within(second).queryByRole("link", { name: "Case study" })).toBeNull();
    expect(within(second).queryByRole("link", { name: "Explore project" })).toBeNull();
  });

  it("keeps the category tabs scrollable on a narrow screen with tap-sized buttons", () => {
    render(<ProjectGrid projects={[project(1)]} />);
    const list = screen.getByRole("tablist", { name: "Project categories" });
    expect(list.className).toContain("overflow-x-auto");
    expect(list.className).toContain("max-md:[&>button]:min-h-11");
  });
});
