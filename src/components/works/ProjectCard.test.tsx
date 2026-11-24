import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectRowCard, ProjectTileCard } from "./ProjectCard";
import type { ProjectCardData } from "@/lib/projects";

const project: ProjectCardData = {
  slug: "acme-site",
  title: "Acme Website",
  summary: "A faster, clearer website for Acme.",
  category: "websites",
  cardImageUrl: "/images/projects/acme-card.webp",
  statusLabel: "LIVE",
  displayDate: "Mar 2026",
  figmaUrl: "https://figma.com/design/acme",
  hasDetail: true,
} as ProjectCardData;

describe("ProjectTileCard", () => {
  it("by default stays the light tile: no summary, the title below the picture", () => {
    render(<ProjectTileCard project={project} />);
    expect(screen.queryByText(project.summary)).toBeNull();
    expect(screen.getByRole("heading", { name: "Acme Website" })).toBeInTheDocument();
  });

  it("can look like the lead card on phones: summary and label inside one bordered card, tile again from tablet up", () => {
    const { container } = render(<ProjectTileCard project={project} likeLeadOnPhones />);
    const article = container.querySelector("article")!;
    // One bordered card on phones, exactly like the wide lead card ...
    expect(article).toHaveClass("rounded-3xl", "border", "bg-white", "shadow-card");
    // ... that drops its frame again from tablet width, where the tiles sit in a row of three.
    expect(article).toHaveClass("md:border-0", "md:bg-transparent", "md:shadow-none");
    // The phone-only extras the lead card shows.
    expect(screen.getByText(project.summary)).toHaveClass("md:hidden");
    expect(screen.getByText("LIVE", { exact: false })).toHaveClass("md:hidden");
  });

  it("keeps the same links as before", () => {
    render(<ProjectTileCard project={project} likeLeadOnPhones />);
    expect(screen.getByRole("link", { name: "Case study" })).toHaveAttribute("href", "/works/acme-site");
    expect(screen.getByRole("link", { name: /Explore project/ })).toHaveAttribute("href", "https://figma.com/design/acme");
  });
});

describe("ProjectRowCard", () => {
  it("shows the label, title, summary and links, as the lead card", () => {
    render(<ProjectRowCard project={project} />);
    expect(screen.getByRole("heading", { name: "Acme Website" })).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
  });
});
