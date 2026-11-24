import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseStudyView } from "./CaseStudyView";
import type { CaseStudy } from "@/db/schema";

function study(overrides: Partial<CaseStudy> = {}): CaseStudy {
  return {
    id: "1",
    slug: "acme",
    title: "Acme: Website Redesign",
    subtitle: "A clean website.",
    clientName: "Acme",
    clientLogoUrl: "/images/logos/acme.png",
    category: "websites",
    tags: ["Retail", "Bengaluru"],
    statusLabel: null,
    displayDate: "10 Feb 2025",
    heroImageUrl: "/images/projects/acme-hero.webp",
    cardImageUrl: "/images/projects/acme-card.webp",
    figmaUrl: "https://figma.com/design/abc",
    liveUrl: "https://acme.example",
    about: "Acme sells things.",
    bannerImageUrl: "/images/projects/acme-banner.webp",
    problemIntro: "We found two gaps:",
    problems: [{ lead: "Slow", text: "The site was slow." }],
    solutionIntro: "We fixed it.",
    solutions: [{ lead: "Fast", text: "Now it is fast." }],
    featureImages: ["/images/projects/acme-feature.webp"],
    resultsText: "It went well.",
    stats: [{ value: "42%", label: "More leads" }],
    galleryImages: ["/images/projects/acme-g1.webp"],
    conclusion: "Good outcome.",
    summary: "Summary",
    metaTitle: "",
    metaDescription: "",
    isFeatured: false,
    sortOrder: 0,
    status: "published",
    isPlaceholder: false,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("CaseStudyView", () => {
  it("renders the title, subtitle and each content section with its bold lead-ins", () => {
    render(<CaseStudyView study={study()} related={[]} />);
    expect(screen.getByRole("heading", { level: 1, name: "Acme: Website Redesign" })).toBeInTheDocument();
    expect(screen.getByText("A clean website.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About Acme" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Problem Statement" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Solutions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Results" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Conclusion" })).toBeInTheDocument();
    expect(screen.getByText("Slow:")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("omits sections that have no content instead of leaving empty headings", () => {
    render(
      <CaseStudyView
        study={study({ problems: [], problemIntro: "", solutions: [], solutionIntro: "", stats: [], resultsText: "", conclusion: "" })}
        related={[]}
      />,
    );
    expect(screen.queryByRole("heading", { name: "Problem Statement" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Solutions" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Results" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Conclusion" })).toBeNull();
    expect(screen.queryByText("42%")).toBeNull();
  });

  it("shows two square feature images side by side and a rectangle on its own row", () => {
    render(
      <CaseStudyView
        study={study({
          featureImages: [
            { url: "/images/projects/s1.webp", shape: "square" },
            { url: "/images/projects/s2.webp", shape: "square" },
            { url: "/images/projects/r1.webp", shape: "rectangle" },
          ],
        })}
        related={[]}
      />,
    );
    const pair = screen.getByAltText("Acme: Website Redesign: design detail 1").closest('[data-feature-row="square-pair"]');
    expect(pair).not.toBeNull();
    expect(pair).toContainElement(screen.getByAltText("Acme: Website Redesign: design detail 2"));
    expect(pair).not.toContainElement(screen.getByAltText("Acme: Website Redesign: design detail 3"));
  });

  it("still shows feature images saved the old way, as full-width rectangles", () => {
    render(<CaseStudyView study={study({ featureImages: ["/images/projects/old.webp"] })} related={[]} />);
    const img = screen.getByAltText("Acme: Website Redesign: design detail 1");
    expect(img.closest("[data-feature-row]")).toHaveAttribute("data-feature-row", "rectangle");
  });

  it("links the Figma design and live site when set", () => {
    render(<CaseStudyView study={study()} related={[]} />);
    expect(screen.getByRole("link", { name: "View Figma design" })).toHaveAttribute("href", "https://figma.com/design/abc");
    expect(screen.getByRole("link", { name: "Live website" })).toHaveAttribute("href", "https://acme.example");
  });

  it("shows a disabled 'Live soon' and hides the Figma button when those URLs are empty", () => {
    render(<CaseStudyView study={study({ liveUrl: "", figmaUrl: "" })} related={[]} />);
    expect(screen.queryByRole("link", { name: "View Figma design" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Live website" })).toBeNull();
    expect(screen.getByText("Live soon")).toBeInTheDocument();
  });

  it("lists related case studies under 'More like this' and hides the block when there are none", () => {
    const related = [study({ slug: "other", title: "Other Project" })];
    const { rerender } = render(<CaseStudyView study={study()} related={related} />);
    expect(screen.getByRole("heading", { name: "More like this" })).toBeInTheDocument();
    expect(screen.getByText("Other Project")).toBeInTheDocument();
    rerender(<CaseStudyView study={study()} related={[]} />);
    expect(screen.queryByRole("heading", { name: "More like this" })).toBeNull();
  });

  it("skips blank gallery entries instead of rendering an image with no source", () => {
    render(
      <CaseStudyView study={study({ galleryImages: ["/images/projects/acme-g1.webp", "", "  "] })} related={[]} />,
    );
    expect(screen.getAllByAltText(/gallery image/)).toHaveLength(1);
    expect(screen.getByAltText("Acme: Website Redesign: gallery image 1")).toBeInTheDocument();
  });
});
