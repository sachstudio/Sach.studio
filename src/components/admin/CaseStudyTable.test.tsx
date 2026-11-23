import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CaseStudyTable, type CaseStudyRow } from "./CaseStudyTable";

const rows: CaseStudyRow[] = [
  { id: "a1", title: "Gulf CV Writers", slug: "gulf-cv", category: "websites", status: "published", isPlaceholder: false, edited: "23 Nov 2026" },
  { id: "b2", title: "Smiles by Sethna", slug: "smiles", category: "websites", status: "draft", isPlaceholder: false, edited: "24 Nov 2026" },
  { id: "c3", title: "MediSmart", slug: "medismart", category: "web-apps-dashboard", status: "published", isPlaceholder: true, edited: "20 Nov 2026" },
];

describe("CaseStudyTable", () => {
  it("shows one table row per case study with the columns an admin scans", () => {
    render(<CaseStudyTable rows={rows} />);
    const table = screen.getByRole("table", { name: "Case studies" });
    for (const name of ["Title", "Category", "Status", "Edited"]) {
      expect(within(table).getByRole("columnheader", { name })).toBeInTheDocument();
    }
    expect(within(table).getAllByRole("row")).toHaveLength(1 + rows.length); // header + data rows
    expect(screen.getByText("/works/gulf-cv")).toBeInTheDocument();
    expect(screen.getByText("Needs content")).toBeInTheDocument();
    expect(screen.getAllByText("Draft")).toHaveLength(1);
  });

  it("links each title to its edit page", () => {
    render(<CaseStudyTable rows={rows} />);
    expect(screen.getByRole("link", { name: "Smiles by Sethna" })).toHaveAttribute("href", "/admin/case-studies/b2");
  });

  it("offers an All filter and one per category, each with its count", () => {
    render(<CaseStudyTable rows={rows} />);
    expect(screen.getByRole("button", { name: "All 3" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Website & Landing Pages 2" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Web Apps & Dashboard 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mobile Apps 0" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logo & Branding 0" })).toBeInTheDocument();
  });

  it("narrows the table to the chosen category and back to All", async () => {
    render(<CaseStudyTable rows={rows} />);
    await userEvent.click(screen.getByRole("button", { name: "Web Apps & Dashboard 1" }));
    expect(screen.getByRole("link", { name: "MediSmart" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Gulf CV Writers" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Web Apps & Dashboard 1" })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "All 3" }));
    expect(screen.getByRole("link", { name: "Gulf CV Writers" })).toBeInTheDocument();
  });

  it("explains an empty category instead of showing a bare table", async () => {
    render(<CaseStudyTable rows={rows} />);
    await userEvent.click(screen.getByRole("button", { name: "Mobile Apps 0" }));
    expect(screen.getByText("No case studies in Mobile Apps yet.")).toBeInTheDocument();
  });

  it("explains an empty list", () => {
    render(<CaseStudyTable rows={[]} />);
    expect(screen.getByText("No case studies yet. Add the first one with New case study.")).toBeInTheDocument();
  });
});
